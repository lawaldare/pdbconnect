/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ComponentType } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { AgGridAngular } from 'ag-grid-angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, interval, map, of, take, timeout } from 'rxjs';
import { LLMAnnotation } from '../../data-models/llm-model';
import { CitationDetail } from '../../data-models/publication.model';
import { dashboardStatLinks, entryMacromoleculeTooltips, symmOperatorTooltip, TEXT_ANNOTATION_HIGHLIGHT_COLOR } from '../../entry-constant';
import { Dropdown, groupBy, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams, QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import {
  convertOutliersToSmartSequenceAnnotation,
  createAuthAlternateNumbering,
  getCircleAnnotationsForSeqViewer,
  getNonObserved,
  removeDuplicatesByKey,
} from '../../helpers/procesing-for-smart-seq-viewer';
import {
  getCleanMoleculeName,
  getCleanSelectionName,
  getMacromoleculeChainDropdownOptions,
  getMacromoleculeSequenceDetails,
} from '../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { getUniProtMappingsForMacromolecule } from '../../store/data-processing/macromolecule-processing';
import { ProcessedMacromolecule } from '../../store/data-processing/models/processed-entities.model';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { UnpMappingListComponent } from '../shared/unp-mapping-list/unp-mapping-list.component';
import { colDefs, gridOptions } from './ag-grid';

@Component({
  selector: 'pdbc-llm-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntryDropdownComponent,
    MaterialModule,
    ReactiveFormsModule,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    AgGridAngular,
    SmartSeqViewerComponent,
    MolstarComponent,
    HelpIconWithTooltipComponent,
  ],
  templateUrl: './llm-tab.component.html',
  styleUrl: './llm-tab.component.scss',
})
export class LLMTabComponent implements OnInit {
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly dialog = inject(MatDialog);

  public readonly isSidebarDisplayed = signal<boolean>(true);

  public dropdown = new Dropdown<{ authAsymId: string; molstarSelection: QueryParamForHelpers[]; inPrefAssembly: boolean; symmOperators: string[] }>();
  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>();

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);

  public inPrefAssembly = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return true;
    return macromolecule.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  });

  public inPrefAssemblyForInstance = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No ligand selected -> true (no warning to display)

  public dashboardStatLinks = dashboardStatLinks;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly processedMacromoleculesForLLM = toSignal(this.globalStore.select(EntrySelectors.processedMacromoleculesForLLM));

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly residueWiseOutliersObservable = this.globalStore.select(EntrySelectors.residueWiseOutliers);
  public readonly residueListingObservable = this.globalStore.select(EntrySelectors.residueListing);
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

  public readonly entryMacromoleculeTooltips = entryMacromoleculeTooltips;
  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public selectionStats: { [key: string]: any } | undefined;

  public filteredLLMAnnotations = signal<LLMAnnotation[]>([]);
  public groupedAnnotations = signal<LLMAnnotation[]>([]);
  private mappedAnnotations = signal<LLMAnnotation[]>([]);

  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  public uniprotMappedData = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const uniprotMappings = this.uniprotMappings();
    const polymerCoverage = this.polymerCoverage();

    if (!currentMacromoleculeDatum) return undefined;
    if (!uniprotMappings) return undefined;
    if (!polymerCoverage) return undefined;

    const mol = currentMacromoleculeDatum.additionalData.molecule;
    const mappedUnpsRows = getUniProtMappingsForMacromolecule(mol, uniprotMappings, polymerCoverage);

    return mappedUnpsRows;
  });

  public uniprotsAllowed = computed(() => this.uniprotMappedData()?.uniprotAccsForMacromolecule);

  public bestResidues = computed(() => {
    const uniprotsAllowed = this.uniprotsAllowed();
    if (!uniprotsAllowed) return [];

    let isoformsMappingKeys = Object.keys(this.isoformsMapping() ?? {});
    isoformsMappingKeys = isoformsMappingKeys.filter((isoform) => {
      const hasAllowed = uniprotsAllowed.some((uniprot) => isoform.includes(uniprot));
      return hasAllowed;
    });

    const filteredIsoformsMapping: any[] = [];

    isoformsMappingKeys.forEach((uniprot: string) => {
      if (uniprot.indexOf('-') !== -1) {
        filteredIsoformsMapping.push({ ...this.isoformsMapping()?.[uniprot], uniprot });
      }
    });

    return filteredIsoformsMapping;
  });

  public readonly primaryPublication = signal({} as CitationDetail | null);
  private readonly destroyRef = inject(DestroyRef);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;

  public readonly llmAnnotations = toSignal(this.globalStore.select(EntrySelectors.llmAnnotations));

  public readonly tabDataLoaded = computed(() => this.processedMacromoleculesForLLM() !== undefined);
  public readonly macromoleculeTableRows = computed(() => this.processedMacromoleculesForLLM() ?? []);

  public currentMacromoleculeDatum = signal<ProcessedMacromolecule | undefined>(undefined);

  public uniqueOrganismsWithStrains = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (macromolecule === undefined) return [];

    const seen = new Set<string>();
    return (macromolecule.additionalData.molecule['source'] ?? [])
      .filter((s) => s.organism_scientific_name)
      .filter((s) => {
        const key = `${s.organism_scientific_name}|${s.strain ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((s) => ({
        name: s.organism_scientific_name,
        strain: s.strain,
      }));
  });

  public isUniprotMappingsClosed = true;
  public isUniprotMappingsBig = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.currentSelectionChainId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return false;
    if (!mappedUnps) return false;
    if (!currentChain) return false;

    const mappingsForChains = mappedUnps.labelUniProtMappings.filter((mapped) => mapped.chainIds.indexOf(currentChain) > -1);

    if (mappingsForChains.length > 1 || mappingsForChains[0].uniprotSegments.length > 2) {
      return true;
    }
    return false;
  });

  public uniprotProcessedMappings = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.currentSelectionChainId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return undefined;
    if (!mappedUnps) return undefined;
    if (!currentChain) return undefined;

    const mappingsForChains = mappedUnps.labelUniProtMappings;
    return mappingsForChains.filter((mapped) => mapped.chainIds.indexOf(currentChain) > -1);
  });

  public macromoleculeSequence = computed(() => this.sequenceDetails()?.fullSequence);
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);
  public llmAnnotationForSeq = signal<SmartSequenceAnnotation | undefined>(undefined);
  public altSequences = signal<AlternativeNumbering[] | undefined>(undefined);
  public nonObserved = signal<number[] | undefined>(undefined);

  public getCleanSelectionName = getCleanSelectionName;

  public seqViewerReady = computed(() => {
    const hasSequence = this.macromoleculeSequence() !== undefined;
    const hasAltSequences = this.altSequences() !== undefined;
    const hasNonObserved = this.nonObserved() !== undefined;
    const hasBgAnnotations = this.backgroundAnnotation() !== undefined;
    const hasLlmAnnotationForSeq = this.llmAnnotationForSeq() !== undefined;
    const hasCurrentSelectionEntityId = this.currentSelectionEntityId() !== undefined;
    const hasCurrentSelectionChainId = this.currentSelectionChainId() !== undefined;
    return (
      hasSequence && hasAltSequences && hasNonObserved && hasBgAnnotations && hasLlmAnnotationForSeq && hasCurrentSelectionEntityId && hasCurrentSelectionChainId
    );
  });

  public numberOfAnnotatedResids = computed(() => {
    return this.llmAnnotations()?.filter((annotation, index, self) => index === self.findIndex((a) => a.pdbResidue === annotation.pdbResidue)).length;
  });

  private readonly preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForInstance() ? this.preferredAssemblyId() : undefined));

  public readonly configForMolstar = computed(() => EntryPageTabsCommonMolstarParams);

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.visInteractivity.currentMolstarComponent = this._molstarComponent;
      this.molstarReady.set(true);
    }
  }
  private molstarFirstRenderFinished = computed(() => this.molstarReady() && this._molstarComponent!.firstLoadFinished());

  public currentModelId$ = new BehaviorSubject<string>('1');

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public getCleanMoleculeName = getCleanMoleculeName;

  public readonly fastNetworkOrForceLoad = computed(() => {
    const isSlow = this.slowNetwork();
    const forceLoad = this.compCommunication.forceLoad();
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public readonly visInteractivity = inject(VisualisationInteractivityService);

  private resetAnnotationListByCurrentChain(resetGroupedList: boolean) {
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    const groupedAnnotations = chainId !== undefined ? this.groupedFilteredLLMAnnotations()[chainId] : [];
    this.filteredLLMAnnotations.set(groupedAnnotations);
    if (resetGroupedList) this.groupedAnnotations.set(groupedAnnotations);
  }

  @HostListener('document:llm-reset-list', ['$event'])
  public resetAnnotationList(event: Event) {
    this.resetAnnotationListByCurrentChain(false);
  }

  @HostListener('document:llm-filter-list', ['$event'])
  public filterAnnotationList(event: Event) {
    const eventData = (event as any).detail.eventData;
    const residueNumber = eventData.residueNumber;
    const allAnnotations = this.groupedAnnotations();
    const filteredByResidue = allAnnotations.filter((a: LLMAnnotation) => a.pdbResidue === residueNumber);
    this.filteredLLMAnnotations.set(removeDuplicatesByKey(filteredByResidue, 'sentence'));
  }

  constructor() {
    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });
  }

  ngOnInit(): void {
    this.compCommunication.llmSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe(async (idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.currentMacromoleculeDatum.set(datum);
        await this.triggerMacromoleculeUpdateSideEffects(datum);
      }
    });

    // every time NMR model Id updates, data for smart seq viewer is refreshed
    this.currentModelId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (newModelId) => {
      await this.updateBackgroundAnnotation();
    });

    combineLatest([this.globalStore.select(EntrySelectors.llmAnnotations), this.globalStore.select(EntrySelectors.primaryPublication)])
      .pipe(
        filter(([llmAnnotations, primaryPublication]) => {
          return llmAnnotations !== undefined;
        }),
        map(([llmAnnotations, primaryPublication]) => {
          this.primaryPublication.set(primaryPublication ?? ({} as CitationDetail));
          const annotations = llmAnnotations?.filter((a: any) => a.primaryCitation === 'Y');
          this.filteredLLMAnnotations.set(annotations ?? []);
          this.mappedAnnotations.set(annotations ?? []);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({});

    this.residueListingObservable
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged(),
        filter((resList) => resList !== undefined)
      )
      .subscribe((residueListing) => {
        if (residueListing.length > 0) {
          const authNumbering = createAuthAlternateNumbering(residueListing);
          const nonObservedResidues = getNonObserved(residueListing);
          this.altSequences.set([authNumbering]);
          this.nonObserved.set(nonObservedResidues);
        } else {
          this.altSequences.set([]);
          this.nonObserved.set([]);
        }
      });
  }

  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  private groupedFilteredLLMAnnotations = computed<{ [labelAsymId: string]: LLMAnnotation[] }>(() => {
    return groupBy(this.mappedAnnotations(), (annot) => annot.pdbChain);
  });

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);

  // public sequenceDetails = signal<{ title: string; fullSequence: string } | undefined>(undefined);
  public sequenceDetails = computed<{ title: string; fullSequence: string } | undefined>(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return undefined;
    return getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, chainId);
  });

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  async triggerMacromoleculeUpdateSideEffects(macromolecule: ProcessedMacromolecule) {
    this.updateDropdownOptions(macromolecule);
    this.updateSymmetryDropdownOptions();
    this.resetAnnotationListByCurrentChain(true);

    await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
  }

  private updateDropdownOptions(macromolecule: ProcessedMacromolecule) {
    const options = getMacromoleculeChainDropdownOptions(macromolecule);
    console.log('options:', options);
    this.dropdown.updateOptions(
      Object.keys(options).map((name, idx) => {
        const authAsymId = macromolecule.additionalData.selections[idx][0].auth_asym_id;
        if (authAsymId === undefined) throw new Error('authAsymId is undefined');
        return {
          name: name,
          url: `macro-${idx + 1}`,
          downloadable: false,
          data: {
            authAsymId: authAsymId,
            molstarSelection: options[name],
            inPrefAssembly: macromolecule.additionalData.selectionsInPrefAssembly[idx],
            symmOperators: macromolecule.chainSymmOperators[authAsymId] ?? [],
          },
        };
      })
    );
  }

  /** TODO: @adam Repeats in many tabs, factor out? */
  private updateSymmetryDropdownOptions() {
    const symmOperators = this.dropdown.selectedOption()?.data.symmOperators;
    if (symmOperators) {
      this.symmetryDropdown.updateOptions(
        symmOperators.map((op, idx) => ({
          name: op,
          url: `macro-0-symop-${idx + 1}`,
          downloadable: false,
          data: { instanceId: op !== 'All' ? op : undefined },
        })) ?? []
      );
    } else {
      this.symmetryDropdown.updateOptions([]);
    }
  }

  private async updateBackgroundAnnotation() {
    this.backgroundAnnotation.set(undefined);

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;
    const sequence = macromolecule.additionalData.molecule.sequence;
    if (!sequence) return;

    // wait max 10s for residueWiseOutliers to populate
    let outliers = this.residueWiseOutliers();
    if (outliers === undefined) {
      outliers = await firstValueFrom(
        interval(200).pipe(
          map(() => this.residueWiseOutliers()),
          filter((o) => o !== undefined), // stop when defined
          take(1), // only take the first defined
          timeout({ first: 10000, with: () => of([]) }) // fallback if still undefined
        )
      );
    }

    const entityId = macromolecule?.additionalData.molecule.entity_id ?? 1;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return;

    const modelId = this.currentModelId$.value || '1';
    const annotation = convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, modelId, outliers);
    this.backgroundAnnotation.set(annotation);

    const groupedLLMAnnotations: LLMAnnotation[] = this.groupedFilteredLLMAnnotations()[chainId];
    this.llmAnnotationForSeq.set(getCircleAnnotationsForSeqViewer(groupedLLMAnnotations));

    this.globalStore.dispatch(
      EntryActions.getResidueListing({
        chainId: chainId,
      })
    );
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdown.select(event);
    this.updateSymmetryDropdownOptions();

    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId !== undefined) {
      const groupedAnnotations = this.groupedFilteredLLMAnnotations()[chainId];
      this.filteredLLMAnnotations.set(groupedAnnotations);
    }

    // all possible rendering functions are called for a dashboard
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;

    await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;
    await this.renderVisualisations(macromolecule);
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetails?: { title: string; fullSequence: string }) {
    if (!sequenceDetails) return;
    const text = `${sequenceDetails.title}\r\n${sequenceDetails.fullSequence}`;
    this.utilService.copy(text);
  }

  private async renderVisualisations(macromolecule: ProcessedMacromolecule) {
    await this.setCurrentSelectionData(macromolecule);
  }

  private async setCurrentSelectionData(macromolecule: ProcessedMacromolecule) {
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;

    this.currentSelectionEntityId.set(`${entityId}`);
    this.currentSelectionChainId.set(chainId);
    this.visInteractivity.currentSelectionEntityId.set(`${entityId}`);
    this.visInteractivity.currentSelectionChainId.set(chainId);
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;

    const llmAnnotations = this.llmAnnotations();
    const assemblyId = this.displayedAssemblyId();
    const instanceId = this.selectedInstanceId();

    const dropdownSelected = this.dropdown.selectedOption();
    if (!dropdownSelected) return undefined;
    const { molstarSelection } = dropdownSelected.data;
    const labelAsymId = molstarSelection[0].auth_asym_id; //  TODO: USE LABEL_ASYM_ID!!! here, fix chain ID handling in annotation processing, see 6qb3 chain B[auth X], 7p19
    if (!labelAsymId) return undefined;

    // TODO: Decide coloring -> Chain colored by validation (or gray), non-selected chains white with lower opacity?
    // TODO: Store PDBe design colors as constants https://www.figma.com/design/oT5W7Ff1I2kj6tbsgs3iS6/PDBe-Design-System---Component-library?node-id=1-234&p=f&t=1yRGegyEwICmLdo5-0

    return {
      name: 'Text annotations',
      kind: 'pdbconnect_text_annotation',
      params: {
        entry: entryId,
        assemblyId: assemblyId,
        labelAsymId: labelAsymId,
        annotations: llmAnnotations ?? [],
        chainColor: macromolecule.molstarColorHex,
        annotationMarkerColor: TEXT_ANNOTATION_HIGHLIGHT_COLOR,
        instanceId: instanceId,
        focus: true,
        volumeStreaming: true,
      },
    };
  });
  private readonly mvsSnapshotSpec$ = toObservable(this.mvsSnapshotSpec);

  public openDialog(type: string) {
    const macromolecule = this.currentMacromoleculeDatum() as ProcessedMacromolecule;
    const component: ComponentType<UnpMappingListComponent> = UnpMappingListComponent;
    const dialogData = this.uniprotMappedData();
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
      data: dialogData,
    });
  }
}
