/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { dashboardStatLinks } from '../../entry-constant';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { MaterialModule, UtilService } from '@pdbc/core';
import { MacromoleculesFacade } from './macromolecules.facade';
import { getMacromoleculeChainDropdownOptions } from '../../helpers/processed-data-to-controls';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryPgProtvistaComponent } from '../shared/entry-pv-nightingale/entry-pv-nightingale.component';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { ComponentType } from '@angular/cdk/overlay';
import { EcNumbersComponent } from '../shared/ec-numbers/ec-numbers.component';
import { GoTermsComponent } from '../shared/go-terms/go-terms.component';
import { MatDialog } from '@angular/material/dialog';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { DetailsDashboardFacade } from '../shared/details-dashboard.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { MolstarStateService } from '../../services/molstar-state.service';
import { ActionQueueService } from '../../services/action-queue.service';
import { ECMapping, GOMapping, UniProtMappingObj } from '../../data-models/uniprot-mapping.model';
import { SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { convertOutliersToSmartSequenceAnnotation } from '../../helpers/quality-annotations-from-seq';
import { debounceTime, distinctUntilChanged } from 'rxjs';

// necessary to render the topology viewer
declare let PdbTopologyViewerPlugin: any;

export interface SequenceDetail {
  title: string;
  fullSequence: string;
  segments: {
    sequence: string;
    color?: string;
  }[];
}

export interface MappedResidue {
  range: string[];
  coverage: string;
  chainId: string;
  uniprot: string;
  open: boolean;
}

@Component({
  selector: 'pdbc-macromolecules-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntryDropdownComponent,
    MaterialModule,
    ReactiveFormsModule,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    EntryPgProtvistaComponent,
    SmartSeqViewerComponent,
  ],
  templateUrl: './macromolecules-tab.component.html',
  styleUrl: './macromolecules-tab.component.scss',
})
export class MacromoleculesTabComponent {
  public readonly macromoleculesFacade = inject(MacromoleculesFacade);
  public readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly dialog = inject(MatDialog);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly actionQueue = inject(ActionQueueService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());
  public readonly molstarState = inject(MolstarStateService);

  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  public dashboardStatLinks = dashboardStatLinks;
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public readonly residueWiseOutliers = toSignal(this.globalStore.select(EntrySelectors.residueWiseOutliers));

  public selectionStats: { [key: string]: any } | undefined;
  // public goMappings = computed(() => Object.keys(this.goMapping() ?? {}));

  public goMappingsForMacromolecule = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    const goMapping = this.goMapping();
    if (!macromolecule || !goMapping) return {};
    const entityId = (macromolecule as MacromoleculesRowData).additionalData.molecule.entity_id;
    const filteredGoMapping = this.filterMappingByEntityId(goMapping, entityId) as GOMapping;
    return filteredGoMapping;
  });

  public ecMappingsForMacromolecule = computed(() => {
    const macromolecule = this.currentMacromoleculeDatum();
    const ecMapping = this.ecMapping();
    if (!macromolecule || !ecMapping) return {};
    const entityId = (macromolecule as MacromoleculesRowData).additionalData.molecule.entity_id;
    const filteredEcMapping = this.filterMappingByEntityId(ecMapping, entityId) as ECMapping;
    return filteredEcMapping;
  });

  private filterMappingByEntityId(mapping: GOMapping | ECMapping, entityId: number): GOMapping | ECMapping {
    const filtered: GOMapping | ECMapping = {};

    for (const [id, item] of Object.entries(mapping)) {
      const relevantMappings = item.mappings.filter((eachMapping: UniProtMappingObj) => eachMapping.entity_id === entityId);

      if (relevantMappings.length > 0) {
        filtered[id] = {
          ...item,
          mappings: relevantMappings, // optional: keep only matching mappings
        };
      }
    }

    return filtered;
  }

  public isThereGoMappings = computed(() => Object.keys(this.goMappingsForMacromolecule() ?? {}));
  public goMappings = linkedSignal({
    source: this.goMappingsForMacromolecule,
    computation: () => {
      const mappedData = this.getMappedGOMapping.reduce((acc: any[], curr: any) => {
        if (acc[curr.category]) {
          acc[curr.category].push(curr);
        } else {
          acc[curr.category] = [curr];
        }
        return acc;
      }, {});
      return mappedData;
    },
  });

  public readonly isCategoryMoreThanOne = computed(() => {
    return (
      this.goMappings()?.['Biological_process']?.length > 1 ||
      this.goMappings()?.['Molecular_function']?.length > 1 ||
      this.goMappings()?.['Cellular_component']?.length > 1
    );
  });

  public ecMappings = computed(() => Object.keys(this.ecMappingsForMacromolecule() ?? {}));
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

  private readonly allThereVisuals = ['polypeptide(L)', 'polypeptide(D)'];
  private readonly onlyTwoVisuals = ['polyribonucleotide', 'polydeoxyribonucleotide'];
  private readonly onlyMolstarVisuals = ['carbohydrate polymer'];

  public hasProtvista = false;
  public currentProtvistaEntity = signal<string | undefined>(undefined);
  public currentProtvistaChain = signal<string | undefined>(undefined);

  public hasTopologyViewer = false;
  @ViewChild('topologyViewerContainer') topologyViewerContainer!: ElementRef;
  private topologyViewerInstance: any;

  public sequenceDetails: SequenceDetail[] = [];

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  public readonly selectedMacromoleculeIdx = toSignal(this.compCommunication.macromoleculeSelection$.pipe(debounceTime(50), distinctUntilChanged()));

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
      return mappedDatum;
    }
    return [];
  });

  public currentMacromoleculeDatum = signal<MacromoleculesRowData | undefined>(undefined);

  constructor() {
    this.compCommunication.macromoleculeSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe((idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.macromoleculeTableRows()[idx];
      if (datum) {
        this.currentMacromoleculeDatum.set(datum);
        this.triggerMacromoleculeUpdateSideEffects(datum);
      }
    });
  }

  triggerMacromoleculeUpdateSideEffects(macromolecule: MacromoleculesRowData) {
    // refreshes dropdown options on new macromolecule
    this.updateDropdownOptions(macromolecule);

    // updates shown sequence on new macromolecule
    this.sequenceDetails = this.macromoleculesFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);

    // updates layout display details on new macromolecule
    this.updateVisualsDisplayed(macromolecule);

    // renders necessary visualisations according to display options and data
    this.renderVisualisations(macromolecule);

    // updates smart sequence viewer annotations
    this.updateBackgroundAnnotation();
  }

  updateDropdownOptions(macromolecule: MacromoleculesRowData) {
    this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(macromolecule);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];

    this.sequenceDetails = this.macromoleculesFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.updateBackgroundAnnotation();
  }

  private updateBackgroundAnnotation() {
    const macromolecule = this.currentMacromoleculeDatum();
    if (!macromolecule) return;
    const sequence = macromolecule.additionalData.molecule.sequence;
    if (!sequence) return;

    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];
    const annotation = convertOutliersToSmartSequenceAnnotation(sequence, entityId, chainId, this.residueWiseOutliers());
    this.backgroundAnnotation.set(annotation);
  }

  updateVisualsDisplayed(macromolecule: MacromoleculesRowData) {
    this.hasTopologyViewer = false;
    this.selectionIdentifier = 'None';
    if (this.allThereVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.selectionTypeText = 'protein';
      // if protein is not chimeric (single uniprotAccession), set this as selectionIdentifier
      if (macromolecule.additionalData.uniprotAccessions.length === 1) {
        this.selectionIdentifier = macromolecule.additionalData.uniprotAccessions[0];
        if (this.proteinsStats()) {
          this.selectionStats = this.proteinsStats();
        }
      }
      this.hasTopologyViewer = true;
      this.hasProtvista = true;
    }

    if (this.onlyTwoVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.hasProtvista = true;
      this.hasTopologyViewer = false;
    }

    if (this.onlyMolstarVisuals.includes(macromolecule.additionalData.molecule.molecule_type)) {
      this.hasProtvista = false;
      this.hasTopologyViewer = false;
    }
  }

  get getMappedGOMapping() {
    return Object.entries(this.goMappingsForMacromolecule() ?? {}).reduce((acc: any[], [id, item]) => {
      acc.push({ ...item, id });
      return acc;
    }, []);
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

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

  public openDialog(type: string) {
    const macromolecule = this.currentMacromoleculeDatum() as MacromoleculesRowData;
    const component: ComponentType<any> = type === 'ec' ? EcNumbersComponent : GoTermsComponent;
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
      data: { entityId: macromolecule.additionalData.molecule.entity_id },
    });
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
    await this.initOrRefreshTopologyViewer(macromolecule);
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

  private async initOrRefreshProtvista(macromolecule: MacromoleculesRowData) {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasProtvista) return;
    // const datum = this.currentMacromoleculeDatum();
    const entityId = macromolecule.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];

    this.currentProtvistaEntity.set(`${entityId}`);
    this.currentProtvistaChain.set(chainId);
  }

  private async initOrRefreshTopologyViewer(macromolecule: MacromoleculesRowData) {
    const topologyContainer = this.topologyViewerContainer.nativeElement;

    // stop if this dashboard does not have topology viewer (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasTopologyViewer && topologyContainer) {
      topologyContainer.innerHTML = '';
      return;
    }

    // topology viewer is only currently shown for macromolecules
    // const datum = this.currentMacromoleculeDatum();
    const entityId = (macromolecule as MacromoleculesRowData).additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected?.split('Chain ')[1];

    // topology viewer load or reload in page is simple
    this.topologyViewerInstance = new PdbTopologyViewerPlugin();

    const options = {
      entryId: this.entryId(),
      entityId: `${entityId}`,
      chainId: chainId,
      subscribeEvents: true,
    };

    //Call render method to display the 2D view
    this.topologyViewerInstance.render(topologyContainer, options);
  }

  getLengthType(macromolecule: MacromoleculesRowData) {
    let lengthType = 'residue';
    if (macromolecule.additionalData.molecule.molecule_type.includes('polypeptide')) {
      lengthType = 'amino acid';
    } else if (macromolecule.additionalData.molecule.molecule_type.includes('nucleotide')) {
      lengthType = 'nucleotide';
    } else if (macromolecule.additionalData.molecule.molecule_type.includes('carbohydrate')) {
      lengthType = 'monosaccharide';
    }
    if (macromolecule.length > 1) {
      return `${lengthType}s`;
    }
    return lengthType;
  }

  public getRoundedWeight(): number | undefined {
    const weight = this.currentMacromoleculeDatum()?.additionalData.molecule.weight;
    return weight !== undefined ? Math.round(weight) : undefined;
  }
}
