/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { dashboardStatLinks } from '../../entry-constant';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { getMacromoleculeChainDropdownOptions, getMacromoleculeSequenceDetails } from '../../helpers/processed-data-to-controls';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { CitationDetail } from '../../data-models/publication.model';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, interval, map, of, take, timeout, timer } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { LLMAnnotation } from '../../data-models/llm-model';
import { colDefs, gridOptions } from './ag-grid';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import {
  convertOutliersToSmartSequenceAnnotation,
  createAuthAlternateNumbering,
  getCircleAnnotationsForSeqViewer,
  getNonObserved,
  removeDuplicatesByKey,
} from '../../helpers/procesing-for-smart-seq-viewer';
import { EntryActions } from '../../store/entry.actions';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { initializeModelIdTracking } from '../../helpers/molstar-nmr-model-tracking';
import { drawSelectionInMolstar, Molstar370DefaultParams, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';
import { SequenceDetail } from '../../store/data-processing/models/other-models';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { ProcessedMacromolecule } from '../../store/data-processing/models/processed-entities.model';
import { getUniProtsDataForMacromolecule } from '../../store/data-processing/macromolecule-processing';

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
  ],
  templateUrl: './llm-tab.component.html',
  styleUrl: './llm-tab.component.scss',
})
export class LLMTabComponent implements OnInit {
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);

  public readonly isSidebarDisplayed = signal<boolean>(true);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};
  public dashboardStatLinks = dashboardStatLinks;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly processedMacromolsLLM = toSignal(this.globalStore.select(EntrySelectors.processedMacromoleculesForLLM));

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly residueWiseOutliersObservable = this.globalStore.select(EntrySelectors.residueWiseOutliers);
  public readonly residueListingObservable = this.globalStore.select(EntrySelectors.residueListing);
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));

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
    const mappedUnps = getUniProtsDataForMacromolecule(mol, uniprotMappings, polymerCoverage);
    return mappedUnps;
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

  public readonly tabDataLoaded = computed(() => this.processedMacromolsLLM() !== undefined);
  public readonly macromoleculeTableRows = computed(() => {
    const rows = this.processedMacromolsLLM();
    if (rows === undefined) return [];
    return rows;
  });

  public currentMacromoleculeDatum = signal<ProcessedMacromolecule | undefined>(undefined);

  public uniqueOrganisms = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (macromolecule === undefined) return [];
    return [...new Set(macromolecule['organisms'].filter((organism) => organism !== null))];
  });

  public mappedResidues = computed(() => {
    const currentMacromoleculeDatum = this.currentMacromoleculeDatum();
    const currentChain = this.currentSelectionChainId();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return undefined;
    if (!mappedUnps) return undefined;
    if (!currentChain) return undefined;

    const mappingsForChains = mappedUnps.uniprotRangesByChainId;
    return mappingsForChains[currentChain];
  });

  public macromoleculeSequence = computed(() => this.sequenceDetails()?.fullSequence);
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);
  public llmAnnotationForSeq = signal<SmartSequenceAnnotation | undefined>(undefined);
  public altSequences = signal<AlternativeNumbering[] | undefined>(undefined);
  public nonObserved = signal<number[] | undefined>(undefined);

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

  public readonly configForMolstar = computed(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: preferredAssemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
      hideControls: true,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'uniform',
          colorParams: { value: 0xfefefe },
        },
      },
      loadMaps: true,
      mapSettings: { defaultView: 'selection-box' },
    };

    return configForMolstar;
  });

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.visInteractivity.currentMolstarComponent = this._molstarComponent;
      this.molstarReady.set(true);
    }
  }

  public currentModelId$ = new BehaviorSubject<string>('1');
  private modelIdObserver?: MutationObserver;

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public readonly fastNetworkOrForceLoad = computed(() => {
    const isSlow = this.slowNetwork();
    const forceLoad = this.compCommunication.forceLoad();
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public selectionData?: QueryParam[];

  public readonly visInteractivity = inject(VisualisationInteractivityService);

  @HostListener('document:llm-reset-list', ['$event'])
  public resetAnnotationList() {
    const letter = this.dropdownSelected.split(' ')[1];
    const groupedAnnotations = this.groupedFilteredLLMAnnotations()[letter];
    this.filteredLLMAnnotations.update(() => groupedAnnotations);
  }

  @HostListener('document:llm-filter-list', ['$event'])
  public filterAnnotationList(event: Event) {
    const eventData = (event as any).detail.eventData;
    const residueNumber = eventData.residueNumber;
    const allAnnotations = this.groupedAnnotations();
    const filteredByResidue = allAnnotations.filter((a: LLMAnnotation) => a.pdbResidue === residueNumber);
    this.filteredLLMAnnotations.update(() => removeDuplicatesByKey(filteredByResidue, 'sentence'));
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

    // once molstar has rendered, initializes mutation observer for NMR model Id
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (finished) => {
      if (finished) {
        this.modelIdObserver = await initializeModelIdTracking(this.currentModelId$, this._molstarComponent?.getContainer());
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

  private groupAnnotationsByPdbChain(data: any) {
    return data.reduce((acc: any, item: any) => {
      const chain = item.pdbChain;
      if (!acc[chain]) {
        acc[chain] = [];
      }
      acc[chain].push(item);
      return acc;
    }, {});
  }

  private groupedFilteredLLMAnnotations = computed(() => {
    const annotations = this.mappedAnnotations();
    return this.groupAnnotationsByPdbChain(annotations);
  });

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);

  public sequenceDetails = signal<
    | {
        title: string;
        fullSequence: string;
      }
    | undefined
  >(undefined);

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  async triggerMacromoleculeUpdateSideEffects(macromolecule: ProcessedMacromolecule) {
    await this.updateDropdownOptions(macromolecule);
    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.sequenceDetails.set(sequenceDetails);
    await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
  }

  private async updateDropdownOptions(macromolecule: ProcessedMacromolecule) {
    this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(macromolecule);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];

    const letter = this.dropdownSelected.split(' ')[1];
    const groupedAnnotations = this.groupedFilteredLLMAnnotations()[letter];
    this.filteredLLMAnnotations.update(() => groupedAnnotations);
    this.groupedAnnotations.update(() => groupedAnnotations);

    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.sequenceDetails.set(sequenceDetails);
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
    const chainId = this.dropdownSelected.split('Chain ')[1];
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
    this.dropdownSelected = event;

    const letter = event.split(' ')[1];
    const groupedAnnotations = this.groupedFilteredLLMAnnotations()[letter];
    this.filteredLLMAnnotations.update(() => groupedAnnotations);

    // all possible rendering functions are called for a dashboard
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;

    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.sequenceDetails.set(sequenceDetails);

    if (macromolecule) await this.renderVisualisations(macromolecule);
    await this.updateBackgroundAnnotation();
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
    this.renderInMolstar(macromolecule);
    await this.setCurrentSelectionData(macromolecule);
  }

  private async setCurrentSelectionData(macromolecule: ProcessedMacromolecule) {
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];

    this.currentSelectionEntityId.set(`${entityId}`);
    this.currentSelectionChainId.set(chainId);
    this.visInteractivity.currentSelectionEntityId.set(`${entityId}`);
    this.visInteractivity.currentSelectionChainId.set(chainId);
  }

  private async renderInMolstar(macromolecule: ProcessedMacromolecule) {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    // Access Molstar instance
    const entityColor = macromolecule.molstarColorHex;

    // because we don't loop over molstarSelections we assume no
    // annotations map to carbohydrates in this tab (proteins only atm)
    this.selectionData = [
      {
        ...molstarSelection[0],
        color: entityColor,
        focus: true,
      },
    ];
    this.visInteractivity.currentSelectionData.set(this.selectionData);

    const durationMs = this._molstarComponent ? 1200 : 0;
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
  }
}
