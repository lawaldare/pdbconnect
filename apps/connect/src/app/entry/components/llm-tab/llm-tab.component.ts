/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ComponentType } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
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
import { EntryPageTabsCommonMolstarParams } from '../../helpers/molstar-helpers';
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
  CommonDropdownOptionData,
  getCleanMoleculeName,
  getCleanSelectionName,
  getMacromoleculeSequenceDetails,
  makeMacromoleculeChainDropdownOptions,
  makeSymmetryDropdownOptions,
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

  public dropdown = new Dropdown<CommonDropdownOptionData>({
    autoOptions: () => makeMacromoleculeChainDropdownOptions(this.currentMacromoleculeDatum()),
  });

  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
    autoOptions: () => makeSymmetryDropdownOptions(this.dropdown.selectedOption()?.data.symmOperators),
  });

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);

  public inPrefAssembly = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return true;
    return macromolecule.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  });

  public inPrefAssemblyForChain = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No chain selected -> true (no warning to display)

  public dashboardStatLinks = dashboardStatLinks;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly processedMacromoleculesForLLM = toSignal(this.globalStore.select(EntrySelectors.processedMacromoleculesForLLM));

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly residueWiseOutliersObservable = this.globalStore.select(EntrySelectors.residueWiseOutliers);
  private readonly residueListing = toSignal(this.globalStore.select(EntrySelectors.residueListing));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

  public readonly entryMacromoleculeTooltips = entryMacromoleculeTooltips;
  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public selectionStats: { [key: string]: any } | undefined;

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

  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  private readonly destroyRef = inject(DestroyRef);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;

  /** List of all annotations (for all chains and all entities) */
  public readonly allAnnotations = toSignal(this.globalStore.select(EntrySelectors.llmAnnotations));

  /**  List of annotations from primary citation (for all chains and all entities) */
  private readonly primaryAnnotations = computed<LLMAnnotation[] | undefined>(() => this.allAnnotations()?.filter((a) => a.primaryCitation === 'Y'));

  /** Annotations from primary citation, grouped by chain */
  private readonly primaryAnnotationsByChain = computed<{ [labelAsymId: string]: LLMAnnotation[] }>(() => {
    return groupBy(this.primaryAnnotations() ?? [], (annot) => annot.pdbChain);
  });

  /** Annotations from primary citation in the current selected chain */
  private readonly primaryAnnotationsInCurrentChain = computed<LLMAnnotation[]>(() => {
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return [];
    return this.primaryAnnotationsByChain()[chainId] ?? []; // TODO: this must be indexed by labelAsymId !!!
  });

  /** Annotations from primary citation in the current selected chain, filtered by the currently selected residue (if any) */
  public readonly filteredAnnotations = computed<LLMAnnotation[]>(() => {
    const annotationsInChain = this.primaryAnnotationsInCurrentChain();
    const residueFilter = this.annotationResidueFilter();
    if (residueFilter === undefined) {
      return annotationsInChain;
    } else {
      const filtered = annotationsInChain.filter((a) => a.pdbResidue === residueFilter);
      return removeDuplicatesByKey(filtered, 'sentence');
    }
  });

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

  public macromoleculeSequence = computed(() => {
    return this.sequenceDetails()?.sequenceForViewer;
  });

  public indexWithMultipleResidues = computed(() => {
    return this.sequenceDetails()?.indexWithMultipleResidues;
  });

  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);
  public llmAnnotationForSeq = signal<SmartSequenceAnnotation | undefined>(undefined);

  /** undefined means residueListing hasn't been retrieved yet, [] means it has been retrieved and is empty  */
  public readonly altSequences = computed<AlternativeNumbering[] | undefined>(() => {
    const residueListing = this.residueListing();
    if (!residueListing || residueListing.chain_id !== this.currentSelectionChainId()) return undefined;
    if (residueListing.residues.length === 0) return [];
    const authNumbering = createAuthAlternateNumbering(residueListing.residues);
    return [authNumbering];
  });

  public readonly nonObserved = computed<number[] | undefined>(() => {
    const residueListing = this.residueListing();
    if (!residueListing || residueListing.chain_id !== this.currentSelectionChainId()) return undefined;
    return getNonObserved(residueListing.residues);
  });

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

  /** Number of unique annotated residues (residues with the same number in different chains count as only one residue if they belong to the same entity) */
  public numberOfAnnotatedResids = computed(() => {
    const primaryAnnotations = this.primaryAnnotations();
    const macromolecules = this.processedMacromoleculesForLLM();
    if (!primaryAnnotations || !macromolecules) return undefined;

    const labelAsymIdToEntityId: { [labelAsymId: string]: number } = {};
    for (const macro of macromolecules) {
      for (const labelAsymId of macro.additionalData.molecule.in_struct_asyms) {
        labelAsymIdToEntityId[labelAsymId] = macro.additionalData.molecule.entity_id;
      }
    }

    const uniqueAnnotResidues = new Set(primaryAnnotations.map((a) => `${labelAsymIdToEntityId[a.pdbChain]}/${a.pdbResidue}`));
    return uniqueAnnotResidues.size;
  });

  private readonly preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForChain() ? this.preferredAssemblyId() : undefined));

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

  /** For filtering annotations in the table by pdbResidue (label_seq_id) */
  private annotationResidueFilter = signal<number | undefined>(undefined);

  @HostListener('document:llm-reset-list')
  public resetAnnotationFilter() {
    this.annotationResidueFilter.set(undefined);
  }

  @HostListener('document:llm-filter-list', ['$event'])
  public filterAnnotationList(event: Event) {
    const eventData = (event as any).detail.eventData;
    const residueNumber = eventData.residueNumber;
    this.annotationResidueFilter.set(residueNumber);
  }

  constructor() {
    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });

    // Update visualizations (sequence viewer, table) when entity changes
    effect(async () => {
      const macromolecule = this.currentMacromoleculeDatum();
      if (!macromolecule) return;
      await this.triggerMacromoleculeUpdateSideEffects(macromolecule);
    });
  }

  ngOnInit(): void {
    this.compCommunication.llmSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe(async (idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.currentMacromoleculeDatum.set(datum);
      }
    });

    // every time NMR model Id updates, data for smart seq viewer is refreshed
    this.currentModelId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (newModelId) => {
      await this.updateBackgroundAnnotation();
    });
  }

  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);

  public sequenceDetails = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return undefined;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return undefined;
    return getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, chainId);
  });

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  async triggerMacromoleculeUpdateSideEffects(macromolecule: ProcessedMacromolecule) {
    this.resetAnnotationFilter();

    await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
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
    this.backgroundAnnotation.set(annotation); // TODO: to computed?

    const groupedLLMAnnotations: LLMAnnotation[] = this.primaryAnnotationsByChain()[chainId];
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
    this.resetAnnotationFilter();

    // all possible rendering functions are called for a dashboard
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;

    await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
    this.resetAnnotationFilter();

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

    const llmAnnotations = this.allAnnotations(); // TODO: only take annotation for the current chain
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

// TODO: fix label-auth-asym-id mess
// 7p19:
// - Entity 1: A [auth A], C [auth B]
// - Entity 2: B [auth E], D [auth C]
// 6qb:
// - Entity 1: A [auth A], C [auth B]
// - Entity 2: B [auth X]
