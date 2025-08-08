/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarComponent, MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { dashboardStatLinks } from '../../entry-constant';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { LLMAnnotationsFacade } from './llm.facade';
import { getMacromoleculeChainDropdownOptions } from '../../helpers/processed-data-to-controls';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { DetailsDashboardFacade } from '../shared/details-dashboard.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
// import { MolstarStateService } from '../../services/molstar-state.service';
// import { ActionQueueService } from '../../services/action-queue.service';
import { CitationDetail } from '../../data-models/publication.model';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, take, timer } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { LLMAnnotation } from '../../data-models/llm-model';
import { colDefs, gridOptions } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { convertOutliersToSmartSequenceAnnotation, createAuthAlternateNumbering } from '../../helpers/procesing-for-smart-seq-viewer';
import { EntryActions } from '../../store/entry.actions';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { Color } from 'molstar/lib/mol-util/color';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Structure } from 'molstar/lib/mol-model/structure';
import { MolstarEventData, PDBMolstarEvent } from '../shared/entry-pv-nightingale/event-models/pdbe-molstar-events.model';
import { initializeModelIdTracking } from '../../helpers/nmr-model-tracking';

export interface SequenceDetail {
  title: string;
  fullSequence: string;
  segments: {
    sequence: string;
    color?: string;
  }[];
}
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
  public readonly llmAnnotationsFacade = inject(LLMAnnotationsFacade);
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  // private readonly actionQueue = inject(ActionQueueService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());
  // public readonly molstarState = inject(MolstarStateService);

  // public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  public dashboardStatLinks = dashboardStatLinks;

  public backgroundAnnotation: SmartSequenceAnnotation | undefined = undefined;
  public llmAnnotationForSeq: SmartSequenceAnnotation | undefined = undefined;

  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
  public readonly residueListing = toSignal(this.globalStore.select(EntrySelectors.residueListing));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));

  private entityId = 0;

  public selectionStats: { [key: string]: any } | undefined;

  public filteredLLMAnnotations = signal<LLMAnnotation[]>([]);
  public groupedAnnotations = signal<LLMAnnotation[]>([]);
  private mappedAnnotations = signal<LLMAnnotation[]>([]);

  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  public bestResidues = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return [];

    const uniprotsAllowed = macromolecule.additionalData.uniprotAccessions;

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

  public readonly macromoleculeTableRows = computed(() => {
    const isLoaded = this.compCommunication.hasProcessedMacromolecules();

    if (isLoaded) {
      const rows = this.compCommunication.processedMacromolecules;
      const mappedDatum = rows.map((data) => {
        return {
          ...data,
          mappedResidues: this.detailsDashboardFacade.transformCoverageData(data.residues),
          organisms: [...new Set(data['organisms'])],
        };
      });

      const primaryCitationYes = this.llmAnnotations()?.filter((a: any) => a.primaryCitation === 'Y');
      const llmUniProtIds = [...new Set(primaryCitationYes?.map((a: any) => a.uniprotAccession))];
      const chainIds = [...new Set(primaryCitationYes?.map((a: any) => a.pdbChain))];
      return mappedDatum.filter(
        (a: any) => llmUniProtIds.includes(a.additionalData.uniprotAccessions[0]) && chainIds.includes(a.additionalData.molecule.in_chains[0])
      );
    }
    return [];
  });

  public currentMacromoleculeDatum = signal<MacromoleculesRowData | undefined>(undefined);

  public altSequences = computed(() => {
    const residueListing = this.residueListing();
    if (!residueListing || residueListing.length === 0) return [];
    const authNumbering = createAuthAlternateNumbering(residueListing);
    return [authNumbering];
  });

  public numberOfAnnotatedResids = computed(() => {
    return this.llmAnnotations()?.filter((annotation, index, self) => index === self.findIndex((a) => a.pdbResidue === annotation.pdbResidue)).length;
  });

  public readonly configForMolstar = computed<InitParams | undefined>(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar: InitParams = {
      ...DefaultParams,
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
          colorParams: { value: Color(0xfefefe) },
        },
      },
    };

    return configForMolstar;
  });

  private molstarReady = signal(false);
  private _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
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

  constructor() {
    this.compCommunication.llmSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe((idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.currentMacromoleculeDatum.set(datum);
        this.triggerMacromoleculeUpdateSideEffects(datum);
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
      this.updateBackgroundAnnotation();
    });

    // document.addEventListener('smartSeqViewerSelect', (event) => this.smartSeqViewerSelectChange(event));
    // document.addEventListener('smartSeqViewerUnselect', (event) => this.smartSeqViewerSelectChange(event));
  }

  @HostListener('document:smartSeqViewerSelect', ['$event'])
  @HostListener('document:smartSeqViewerUnselect', ['$event'])
  private smartSeqViewerSelectChange(event: any) {
    if (event.detail === null) {
      this.resetAnnotationList();

      const macromolecule = this.currentMacromoleculeDatum();
      if (!macromolecule) return;
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

      const entityId = molstarSelection.entityId;
      const chainId = molstarSelection.authChainId;
      const entityColor = macromolecule.molstarColorHex;

      const selectionData = [
        {
          entity_id: `${entityId}`,
          auth_asym_id: `${chainId}`,
          color: entityColor,
          focus: true,
        },
      ];
      this.lastClickedResidue = undefined;
      this.zoomInAndSelect(selectionData);
      return;
    }
    const residueNumber = event.detail.eventData.residueNumber;

    this.filterAnnotationList(residueNumber);
    const clickData = {
      entity_id: event.detail.eventData.entityId,
      auth_asym_id: event.detail.eventData.chainId,
      residue_number: event.detail.eventData.residueNumber,
    };
    const doNotPropagateEvt = true;
    this.handleSelectionOnMolstarResClick(clickData, doNotPropagateEvt);
  }

  private resetAnnotationList() {
    const letter = this.dropdownSelected.split(' ')[1];
    const groupedAnnotations = this.groupedFilteredLLMAnnotations()[letter];
    this.filteredLLMAnnotations.update(() => groupedAnnotations);
  }

  private filterAnnotationList(residueNumber: number) {
    const allAnnotations = this.groupedAnnotations();
    const filteredByResidue = allAnnotations.filter((a: LLMAnnotation) => a.pdbResidue === residueNumber);
    this.filteredLLMAnnotations.update(() => this.llmAnnotationsFacade.removeDuplicatesByKey(filteredByResidue, 'sentence'));
  }

  ngOnInit(): void {
    combineLatest([this.globalStore.select(EntrySelectors.llmAnnotations), this.globalStore.select(EntrySelectors.primaryPublication)])
      .pipe(
        map(([llmAnnotations, primaryPublication]) => {
          this.primaryPublication.set(primaryPublication ?? ({} as CitationDetail));
          const annotations = llmAnnotations.filter((a: any) => a.primaryCitation === 'Y');
          this.filteredLLMAnnotations.set(annotations ?? []);
          this.mappedAnnotations.set(annotations ?? []);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({});
  }

  private groupedFilteredLLMAnnotations = computed(() => {
    const annotations = this.mappedAnnotations();
    return this.detailsDashboardFacade.groupByPdbChain(annotations);
  });

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);

  public sequenceDetails: SequenceDetail[] = [];

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  public onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
    // console.log('Selection changed', data);
  }

  async triggerMacromoleculeUpdateSideEffects(macromolecule: MacromoleculesRowData) {
    this.updateDropdownOptions(macromolecule);
    this.sequenceDetails = this.llmAnnotationsFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    await this.renderVisualisations(macromolecule);
    this.updateBackgroundAnnotation();
  }

  private updateDropdownOptions(macromolecule: MacromoleculesRowData) {
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

    this.sequenceDetails = this.llmAnnotationsFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.updateBackgroundAnnotation();
  }

  private updateBackgroundAnnotation() {
    const macromolecule = this.currentMacromoleculeDatum();

    const sequence = this.sequenceDetails[0]?.fullSequence;
    if (!sequence) return;

    const entityId = macromolecule?.additionalData.molecule.entity_id ?? 1;
    const chainId = this.dropdownSelected.split('Chain ')[1];
    const modelId = this.currentModelId$.value || '1';
    this.backgroundAnnotation = convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, modelId, this.residueWiseOutliers());

    const groupedLLMAnnotations: LLMAnnotation[] = this.groupedFilteredLLMAnnotations()[chainId];
    this.llmAnnotationForSeq = this.llmAnnotationsFacade.getCircleAnnotationsForSeqViewer(groupedLLMAnnotations);

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
    this.sequenceDetails = this.llmAnnotationsFacade.getMacromoleculeSequenceDetails(
      this.entryId() ?? '',
      macromolecule as MacromoleculesRowData,
      this.dropdownSelected
    );
    if (macromolecule) await this.renderVisualisations(macromolecule);
    this.updateBackgroundAnnotation();
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private async renderVisualisations(macromolecule: MacromoleculesRowData) {
    await this.renderInMolstar(macromolecule);
    await this.setCurrentSelectionData(macromolecule);
    // await this.initOrRefreshTopologyViewer(macromolecule);
  }

  private async setCurrentSelectionData(macromolecule: MacromoleculesRowData) {
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];

    this.currentSelectionEntityId.set(`${entityId}`);
    this.currentSelectionChainId.set(chainId);
  }

  private zoomOutStructure(durationMs: number) {
    const plugin = this._molstarComponent?.getInstance()?.plugin ?? null;
    if (!plugin) return;

    const assemblyRef = plugin.managers.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
    const structure = plugin.state.data?.select(assemblyRef)[0]?.obj?.data;
    const structureLoci = structure ? Structure.toStructureElementLoci(structure) : null;

    structureLoci && plugin.managers.camera?.focusLoci(structureLoci, { durationMs });
  }

  private lastClickedResidue?: {
    entity_id: string;
    auth_asym_id: string;
    residue_number: number;
  } = undefined;

  @HostListener('document:to-molstar-click', ['$event'])
  private handleTableResidueSelection(event: Event) {
    const eventData = (event as any).detail.eventData;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    if (!entityId || !chainId) return;
    const clickData = {
      entity_id: entityId,
      auth_asym_id: chainId,
      residue_number: eventData.residueNumber,
    };
    const doNotPropagateEvt = true;
    const doNotCheckOrUpdState = true;
    this.handleSelectionOnMolstarResClick(clickData, doNotPropagateEvt, doNotCheckOrUpdState);
    this.filterAnnotationList(clickData.residue_number);
  }

  @HostListener('document:PDB.molstar.click', ['$event'])
  private keepSelectionOnMolstarResClick(event: Event) {
    const eventData = (event as PDBMolstarEvent).eventData;
    const clickData = {
      entity_id: eventData.entity_id,
      auth_asym_id: eventData.auth_asym_id,
      residue_number: eventData.residueNumber,
    };
    this.handleSelectionOnMolstarResClick(clickData);
  }

  /**
   * Overrides Molstar residue click selection behaviour to allow:
   * 1 - deselection
   * 2 - communication with SmartSeqViewer
   * 3 - communication with this tab
   * @param clickData
   */
  private handleSelectionOnMolstarResClick(
    clickData: { entity_id: string; auth_asym_id: string; residue_number: number },
    doNotPropagate?: boolean,
    doNotCheckOrUpdState?: boolean
  ) {
    let currentResidue:
      | undefined
      | {
          entity_id: string;
          auth_asym_id: string;
          residue_number: number;
        } = clickData;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;

    if (
      !doNotCheckOrUpdState &&
      this.lastClickedResidue &&
      this.lastClickedResidue.entity_id === currentResidue.entity_id &&
      this.lastClickedResidue.auth_asym_id === currentResidue.auth_asym_id &&
      this.lastClickedResidue.residue_number === currentResidue.residue_number
    ) {
      currentResidue = undefined;
    }

    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;

    const entityColor = macromolecule.molstarColorHex;
    const selectionData: QueryParam[] = [
      {
        entity_id: `${entityId}`,
        auth_asym_id: `${chainId}`,
        color: entityColor,
        focus: currentResidue ? false : true,
      },
    ];
    if (currentResidue) selectionData.push({ ...currentResidue, focus: true });

    if (!doNotCheckOrUpdState) this.lastClickedResidue = currentResidue;
    this.zoomInAndSelect(selectionData);

    if (clickData.entity_id !== entityId || clickData.auth_asym_id !== chainId) return;
    if (!doNotPropagate) {
      const eventObj = new CustomEvent('to-seq-viewer-click', {
        detail: {
          eventData: {
            residueNumber: clickData.residue_number,
            entityId: 'ignore',
            chainId: 'ignore',
            unselect: currentResidue ? 'ignore' : true,
          },
        },
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(eventObj);
      if (!currentResidue) this.resetAnnotationList();
      else this.filterAnnotationList(clickData.residue_number);
    }
  }

  private zoomInAndSelect(selectionData: QueryParam[]) {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    instance.visual.select({ data: selectionData });
  }

  private async renderInMolstar(macromolecule: MacromoleculesRowData) {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    // const shouldSkip = !this.molstarFirstRenderFinished();
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;

    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    // Access Molstar instance
    const entityColor = macromolecule.molstarColorHex;
    const selectionData = [
      {
        entity_id: `${entityId}`,
        auth_asym_id: `${chainId}`,
        color: entityColor,
        focus: true,
      },
    ];

    const durationMs = this._molstarComponent ? 1200 : 0;
    this.zoomOutStructure(durationMs);

    timer(durationMs + 100).subscribe(() => {
      this.zoomInAndSelect(selectionData);
    });

    // this.actionQueue.addAction(
    //   `renderMolstarForLLM-${macromolecule.name.molecule}-${entityId}-${chainId}`,
    //   async () => {
    //     await this.molstarState.renderMolstarForLLM(macromolecule, molstarSelection);
    //   },
    //   shouldSkip // skippable
    // );
  }
}
