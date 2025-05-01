import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, ElementRef, inject, linkedSignal, Renderer2, signal, ViewChild, OnInit } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { LigandsRowData, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { getLigandsDropdownOptions } from '../../helpers/processed-data-to-controls';
import { dashboardStatLinks } from '../../entry-constant';
import { firstValueFrom, map, timer } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, DownloadFileTypeService, MaterialModule } from '@pdbc/core';
import { SelectionChangedEvent } from 'ag-grid-community';
import { INTX_NAME_STANDARDIZER } from './interaction-type.component';
import { AgGridAngular } from 'ag-grid-angular';
import { colDefs, defaultColDef, gridOptions } from './ag-grid';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { EntryActions } from '../../store/entry.actions';

@Component({
  selector: 'pdbc-ligands-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntryDropdownComponent,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    MaterialModule,
    AgGridAngular,
    ReactiveFormsModule,
  ],
  templateUrl: './ligands-tab.component.html',
  styleUrl: './ligands-tab.component.scss',
})
export class LigandsTabComponent implements OnInit {
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public molstarVisualisation = inject(MolstarOverviewForTopPage);
  public molstarFirstRenderFinished = computed(() => this.compCommunication.molstarFirstRenderFinished());

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};

  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  public dashboardStatLinks = dashboardStatLinks;

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public readonly ligandTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();

    if (isLoaded) {
      const tabData = this.compCommunication.getTabData('Ligands');
      const datum = tabData.tableRows() as any[];
      return datum;
    }
    return [];
  });

  public currentLigandDatum = computed(() => {
    let selectedIdx = this.compCommunication.tabState()['Ligands'] ?? 0;
    if (selectedIdx === 'Main') selectedIdx = 0;
    return this.ligandTableRows()[selectedIdx as number];
  });

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  @ViewChild('ligandEnvContainer') ligandEnvContainer!: ElementRef;
  private ligandEnvInstance: any;
  private ligandEnvLoaded = false;
  public hasLigandEnv = false;
  private ligandEnvSelection: {
    resId: string;
    chainId: string;
  } = {
    resId: '-1',
    chainId: '-1',
  };

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));

  public searchTerm = new FormControl('');

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly defaultColDef = defaultColDef;
  public interactionsRowData = linkedSignal({
    source: this.interactions,
    computation: () => this.interactions(),
  });
  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  public selectionStats: { [key: string]: any } | undefined;

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
      if (!this.currentLigandDatum()) return;

      const datum = this.currentLigandDatum();

      this.dropdownOptionsToMolstar = getLigandsDropdownOptions(datum);
      this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
        return {
          name: eachString,
          url: `lig-${idx + 1}`,
          downloadable: false,
        };
      });
      this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];

      this.selectionIdentifier = datum.id;

      // modification is a special case for Ligands table in which lig env viewer is not displayed
      if (datum.type.includes('modification') === false) {
        this.hasLigandEnv = true;
      } else {
        // if it is a ligand
        // we await destruction of current ligand env viewer (if there is one) and resetting of loading status vars
        await this.destroyLigandEnv();
      }

      await this.renderInMolstar();
      await this.initOrRefreshLigandEnvViewer();
    });
  }

  ngOnInit(): void {
    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.interactions() ?? []);
          } else {
            return this.interactions();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.interactionsRowData.update(() => data);
      });
  }

  private async renderInMolstar() {
    const datum = this.currentLigandDatum();

    const macromoleculesData = this.compCommunication.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
    const ligandsRawData = this.compCommunication.getTabData('Ligands').tableRows() as LigandsRowData[];
    const ligandsData = ligandsRawData.filter((lig) => lig.type === 'ligand');
    const modificationsData = ligandsRawData.filter((lig) => lig.type === 'modification');

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    this.globalStore.dispatch(
      EntryActions.getInteractions({
        chainId: molstarSelection.authChainId ?? '',
        residueId: molstarSelection.residues[0].authBegin,
      })
    );

    let urlToDownload = '';

    if (molstarSelection) {
      // retrieve necessary data for composing ligands and environments URL
      const entityId = molstarSelection.entityId;
      const chainId = molstarSelection.authChainId;

      // create URL according to whether a modification or a ligand is selected
      if (datum.type === 'modification') {
        urlToDownload = `https://www.ebi.ac.uk/pdbe/model-server/v1/${this.entryId()}/atoms?label_entity_id=${entityId}&auth_asym_id=${chainId}&encoding=bcif`;
      } else {
        const authSeqId = molstarSelection.residues[0].authBegin;
        const authInsCode = molstarSelection.residues[0].authBeginIns;
        urlToDownload = `https://www.ebi.ac.uk/pdbe/model-server/v1/${this.entryId()}/residueSurroundings?auth_seq_id=${authSeqId}&pdbx_PDB_ins_code=${authInsCode}&auth_asym_id=${chainId}&radius=10&encoding=bcif`;
      }
    }

    // since URL based force Ligands config reload

    await this.molstarVisualisation.checkLigandsReady(urlToDownload, true);
    await this.molstarVisualisation.checkAndCreateComponents(macromoleculesData, ligandsData, modificationsData);

    this.molstarVisualisation.currentViewName = `Tab-Ligands/${datum.id}`;
    await this.molstarVisualisation.renderTabsLigands(datum, molstarSelection);
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // all possible rendering functions are called for a dashboard
    await this.renderInMolstar();
    await this.initOrRefreshLigandEnvViewer();
  }

  private async initOrRefreshLigandEnvViewer() {
    // stop if this dashboard does not have ligand env viewer (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasLigandEnv) return;

    // ligand env viewer is only shown for ligands tab. data is retrieved from dropdown
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const resId = molstarSelection.residues[0].authBegin;
    const chainId = molstarSelection.authChainId;

    // stop if ligand already loaded
    if (this.ligandEnvSelection.resId === resId && this.ligandEnvSelection.chainId === chainId) {
      return;
    }
    if (this.ligandEnvLoaded === false) {
      // on first rendering, create the element properly and set parameters
      this.ligandEnvInstance = this.renderer.createElement('pdb-ligand-env');
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-id', this.entryId() ?? ''.toLowerCase());
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-res-id', `${resId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-chain-id', `${chainId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'environment', `development`);
      const container = this.ligandEnvContainer.nativeElement;
      this.renderer.appendChild(container, this.ligandEnvInstance);
      this.ligandEnvLoaded = true;
    } else {
      // if rendering NOT for the first time, just set parameters
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-res-id', `${resId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-chain-id', `${chainId}`);
      this.ligandEnvInstance.innerHTML = '';
      this.ligandEnvInstance.connectedCallback();
    }
    this.ligandEnvSelection = {
      resId: resId,
      chainId: chainId ?? '',
    };
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  private async destroyLigandEnv() {
    // to destroy ligand env we use removeChild and reset all variables related to it's loading status
    if (this.ligandEnvInstance) {
      this.renderer.removeChild(this.elementRef.nativeElement, this.ligandEnvInstance);
      // this.ligandEnvContainer.nativeElement.innerHTML = '';
      this.ligandEnvInstance = undefined;
    }
    this.ligandEnvLoaded = false;
    this.hasLigandEnv = false;
    this.ligandEnvSelection = {
      resId: '-1',
      chainId: '-1',
    };
    // unfortunately needed so destruction happens syncronously
    await firstValueFrom(timer(100));
  }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      const residueName = item.end.chem_comp_id.toString() + '_' + item.end.author_residue_number.toString();
      const atomName = item.end.atom_names.join(',');
      const interactionType = item.interaction_details.map((type: keyof typeof INTX_NAME_STANDARDIZER) => INTX_NAME_STANDARDIZER[type]).join(',');
      const distance = item.distance;
      const ligandAtom = item.ligand_atoms.join(',');
      const rowString = residueName + atomName + interactionType + distance + ligandAtom;
      return rowString.toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
  }

  public downloadCSV(): void {
    const mappedData = this.interactionsRowData()?.map((row) => {
      return {
        'Ligand Atom': row.ligand_atoms.join(', '),
        'Residue Name': row.end.chem_comp_id + '_' + row.end.author_residue_number,
        'Atom Name': row.end.atom_names.join(','),
        'Interaction Type': row.interaction_details.map((type) => INTX_NAME_STANDARDIZER[type as keyof typeof INTX_NAME_STANDARDIZER]).join(', '),
        'Distance (Å)': row.distance,
      };
    });
    if (mappedData && mappedData.length) {
      this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
    }
  }
}
