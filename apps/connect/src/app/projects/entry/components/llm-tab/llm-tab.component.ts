/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { dashboardStatLinks } from '../../entry-constant';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { MacromoleculesFacade } from './llm.facade';
import { getMacromoleculeChainDropdownOptions } from '../../helpers/processed-data-to-controls';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { DetailsDashboardFacade } from '../shared/details-dashboard.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { MolstarStateService } from '../../services/molstar-state.service';
import { ActionQueueService } from '../../services/action-queue.service';
import { CitationDetail } from '../../data-models/publication.model';
import { combineLatest, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { LLMAnnotation } from '../../data-models/llm-model';
import { colDefs, gridOptions } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { convertOutliersToSmartSequenceAnnotation } from '../../helpers/quality-annotations-from-seq';

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
  ],
  templateUrl: './llm-tab.component.html',
  styleUrl: './llm-tab.component.scss',
})
export class LLMTabComponent implements OnInit {
  public readonly macromoleculesFacade = inject(MacromoleculesFacade);
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly actionQueue = inject(ActionQueueService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());
  public readonly molstarState = inject(MolstarStateService);

  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  public dashboardStatLinks = dashboardStatLinks;

  public backgroundAnnotation: SmartSequenceAnnotation | undefined = undefined;

  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));
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

  constructor() {
    this.compCommunication.llmSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe((idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.currentMacromoleculeDatum.set(datum);
        this.triggerMacromoleculeUpdateSideEffects(datum);
      }
    });

    document.addEventListener('smartSeqViewerClick', (event) => this.smartSeqViewerClick(event));
  }

  private smartSeqViewerClick(event: any) {
    const residueName = event.detail.title;
    const temp = this.groupedAnnotations();
    const filteredAgain = temp.filter((a: any) => a.exact.toLocaleLowerCase() === residueName.toLocaleLowerCase().replace(' ', ''));
    this.filteredLLMAnnotations.update(() => this.removeDuplicatesByKey(filteredAgain, 'sentence'));
  }

  private removeDuplicatesByKey(array: any[], key: string): any[] {
    const seen = new Set();
    return array.filter((item) => {
      const keyValue = item[key];
      if (seen.has(keyValue)) {
        return false;
      }
      seen.add(keyValue);
      return true;
    });
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

  public currentProtvistaEntity = signal<string | undefined>(undefined);
  public currentProtvistaChain = signal<string | undefined>(undefined);

  public sequenceDetails: SequenceDetail[] = [];

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  public onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
    console.log('Selection changed', data);
  }

  async triggerMacromoleculeUpdateSideEffects(macromolecule: MacromoleculesRowData) {
    this.updateDropdownOptions(macromolecule);
    this.sequenceDetails = this.macromoleculesFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
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

    this.sequenceDetails = this.macromoleculesFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.updateBackgroundAnnotation();
  }

  private updateBackgroundAnnotation() {
    const macromolecule = this.currentMacromoleculeDatum();

    const sequence = this.sequenceDetails[0]?.fullSequence;
    if (!sequence) return;

    const entityId = macromolecule?.additionalData.molecule.entity_id ?? 1;
    const chainId = this.dropdownSelected.split('Chain ')[1];
    this.backgroundAnnotation = convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, this.residueWiseOutliers());
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
    this.sequenceDetails = this.macromoleculesFacade.getMacromoleculeSequenceDetails(
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
    await this.initOrRefreshProtvista(macromolecule);
    // await this.initOrRefreshTopologyViewer(macromolecule);
  }

  private async initOrRefreshProtvista(macromolecule: MacromoleculesRowData) {
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];

    this.currentProtvistaEntity.set(`${entityId}`);
    this.currentProtvistaChain.set(chainId);
  }

  private async renderInMolstar(macromolecule: MacromoleculesRowData) {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const shouldSkip = !this.molstarFirstRenderFinished();
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;

    this.actionQueue.addAction(
      `renderMolstarForMacromolecules-${macromolecule.name.molecule}-${entityId}-${chainId}`,
      async () => {
        await this.molstarState.renderMolstarForMacromolecules(macromolecule, molstarSelection);
      },
      shouldSkip // skippable
    );
  }
}
