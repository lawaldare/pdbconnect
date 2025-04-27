import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { LigandsRowData, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
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
import { DetailsDashboardFacade } from '../shared/details-dashboard/details-dashboard.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';

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
  ],
  templateUrl: './macromolecules-tab.component.html',
  styleUrl: './macromolecules-tab.component.scss',
})
export class MacromoleculesTabComponent {
  public readonly macromoleculesFacade = inject(MacromoleculesFacade);
  private readonly utilService = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly dialog = inject(MatDialog);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public molstarFirstRenderFinished = computed(() => this.compCommunication.molstarFirstRenderFinished());

  public molstarVisualisation = inject(MolstarOverviewForTopPage);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  public dashboardStatLinks = dashboardStatLinks;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));

  public selectionStats: { [key: string]: any } | undefined;
  public goMappings = computed(() => Object.keys(this.goMapping() ?? {}));
  public ecMappings = computed(() => Object.keys(this.ecMapping() ?? {}));
  public bestResidues = computed(() => {
    const isoformsMappingKeys = Object.keys(this.isoformsMapping() ?? {});
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

  public readonly macromoleculeTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();

    if (isLoaded) {
      const tabData = this.compCommunication.getTabData('Macromolecules');
      const datum = tabData.tableRows() as any[];
      const mappedDatum = datum.map((data) => {
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

  public currentMacromoleculeDatum = computed(() => {
    let selectedIdx = this.compCommunication.tabState()['Macromolecules'] ?? 0;
    if (selectedIdx === 'Main') selectedIdx = 0;
    return this.macromoleculeTableRows()[selectedIdx as number];
  });

  constructor() {
    effect(async () => {
      const molstarFirstRenderFinished = this.molstarFirstRenderFinished();

      const hasMacromoleculesData = Object.keys(this.compCommunication.tabTableData()).indexOf('Macromolecules') > -1;
      const hasLigandsData = Object.keys(this.compCommunication.tabTableData()).indexOf('Ligands') > -1;

      // do not render dashboard until molstar first page render is finished
      if (!molstarFirstRenderFinished) return;

      // do not render dashboard until data necessary to check molstar state not loaded
      if (!hasMacromoleculesData) return;
      if (!hasLigandsData) return;
      if (!this.currentMacromoleculeDatum()) return;

      const datum = this.currentMacromoleculeDatum();

      this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(datum);
      this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
        return {
          name: eachString,
          url: `macro-${idx + 1}`,
          downloadable: false,
        };
      });
      this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];

      this.sequenceDetails = this.macromoleculesFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', datum, this.dropdownSelected);

      // finally we displayed topology viewer only for protein molecules
      this.hasTopologyViewer = false;
      if (this.allThereVisuals.includes(datum.additionalData.molecule.molecule_type)) {
        this.selectionTypeText = 'protein';
        // if protein is not chimeric (single uniprotAccession), set this as selectionIdentifier
        if (datum.additionalData.uniprotAccessions.length === 1) {
          this.selectionIdentifier = datum.additionalData.uniprotAccessions[0];
          if (this.proteinsStats()) {
            this.selectionStats = this.proteinsStats();
          }
        }
        this.hasTopologyViewer = true;
        this.hasProtvista = true;
      }

      if (this.onlyTwoVisuals.includes(datum.additionalData.molecule.molecule_type)) {
        this.hasProtvista = true;
        this.hasTopologyViewer = false;
      }

      if (this.onlyMolstarVisuals.includes(datum.additionalData.molecule.molecule_type)) {
        this.hasProtvista = false;
        this.hasTopologyViewer = false;
      }
      console.log('molstarFirstRenderFinished', molstarFirstRenderFinished);
      await this.renderVisualisations();
    });
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // all possible rendering functions are called for a dashboard
    await this.renderVisualisations();
  }

  public openDialog(type: string) {
    const component: ComponentType<any> = type === 'ec' ? EcNumbersComponent : GoTermsComponent;
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
    });
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private async renderVisualisations() {
    await this.renderInMolstar();
    this.initOrRefreshProtvista();
    await this.initOrRefreshTopologyViewer();
  }

  private async renderInMolstar() {
    const datum = this.currentMacromoleculeDatum();

    const macromoleculesData = this.compCommunication.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
    const ligandsRawData = this.compCommunication.getTabData('Ligands').tableRows() as LigandsRowData[];
    const ligandsData = ligandsRawData.filter((lig) => lig.type === 'ligand');
    const modificationsData = ligandsRawData.filter((lig) => lig.type === 'modification');

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    // if Macromolecules config not loaded, load it
    if (!this.molstarVisualisation.currentViewName.includes('Tab-Macromolecules')) {
      await this.molstarVisualisation.checkMacromoleculesReady();
      await this.molstarVisualisation.checkAndCreateComponents(macromoleculesData, ligandsData, modificationsData);
    }
    this.molstarVisualisation.currentViewName = `Tab-Macromolecules/${datum.name}`;
    await this.molstarVisualisation.renderTabsMacromolecules(datum, molstarSelection);
  }

  private initOrRefreshProtvista() {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasProtvista) return;
    const datum = this.currentMacromoleculeDatum();
    const entityId = datum.additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected.split('Chain ')[1];

    this.currentProtvistaEntity.set(`${entityId}`);
    this.currentProtvistaChain.set(chainId);
  }

  private async initOrRefreshTopologyViewer() {
    // stop if this dashboard does not have topology viewer (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasTopologyViewer) return;

    // topology viewer is only currently shown for macromolecules
    const datum = this.currentMacromoleculeDatum();
    const entityId = (datum as MacromoleculesRowData).additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected?.split('Chain ')[1];

    // topology viewer load or reload in page is simple
    this.topologyViewerInstance = new PdbTopologyViewerPlugin();
    const container = this.topologyViewerContainer.nativeElement;

    const options = {
      entryId: this.entryId(),
      entityId: `${entityId}`,
      chainId: chainId,
      subscribeEvents: true,
    };

    //Call render method to display the 2D view
    this.topologyViewerInstance.render(container, options);
  }
}
