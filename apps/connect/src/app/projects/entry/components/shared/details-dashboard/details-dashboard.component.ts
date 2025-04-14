/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, computed, DestroyRef, effect, ElementRef, inject, input, linkedSignal, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AG_Grid_Theme_Class, DownloadFileTypeService, MaterialModule, UtilService } from '@pdbc/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsDashboardFacade } from './details-dashboard.facade';
import { firstValueFrom, map, timer } from 'rxjs';
import {
  AssembliesRowData,
  DomainsBoundaries,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesRowData,
  TableRow,
} from '../interactive-tables/data-models-and-definitions/row-and-table.model';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { assemblyTooltip, dashboardStatLinks, resourceUrls } from '../../../entry-constant';
import { MolstarSelectionObj } from '../../../helpers/molstar/molstar-helpers';
import { MolstarVisualisationsForTabs } from '../../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { TableNames } from '../../../pages/main/main.component';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { EntryDropdownComponent } from '../../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { gridOptions, colDefs, defaultColDef } from './ag-grid';
import { AgGridAngular } from 'ag-grid-angular';
import { SelectionChangedEvent } from 'ag-grid-community';
import { INTX_NAME_STANDARDIZER } from './interaction-type.component';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { EcNumbersComponent } from '../ec-numbers/ec-numbers.component';
import { GoTermsComponent } from '../go-terms/go-terms.component';

import { EntryPgProtvistaComponent } from '../entry-pv-nightingale/entry-pv-nightingale.component';

// necessary to render the topology viewer
declare let PdbTopologyViewerPlugin: any;

// these types are used by this file and the facade and related to sequence rendering
export type BoundsByEntityId = {
  [key: number]: DomainsBoundaries[];
};

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
  selector: 'pdbc-details-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, EntryDropdownComponent, MaterialModule, AgGridAngular, ReactiveFormsModule, EntryPgProtvistaComponent],
  templateUrl: './details-dashboard.component.html',
  styleUrl: './details-dashboard.component.scss',
})
export class DetailsDashboardComponent implements OnInit {
  public readonly signals = inject(ComponentCommunicationService);
  private readonly utilService = inject(UtilService);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  public readonly molstarVisualisations = inject(MolstarVisualisationsForTabs);
  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  private readonly dialog = inject(MatDialog);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public goMappings = computed(() => Object.keys(this.goMapping() ?? {}));
  public ecMappings = computed(() => Object.keys(this.ecMapping() ?? {}));

  public readonly tabName = input.required<TableNames>();
  public readonly molstarViewerEl = input.required<HTMLElement>(); // Molstar global instance div
  public readonly molstarParent = input.required<HTMLElement>(); // Parent to send back the molstar global instance
  private isMolstarRetrieved = false;

  public readonly resourceUrls = resourceUrls;

  // injected services, data processing facade, molstar helpers

  // variables rendered in template
  public currentRowDatum?: any;
  public selectionTitle = 'This is a 3D view area';
  public selectionIdentifier = 'None';
  public selectionStats: { [key: string]: any } | undefined;
  public selectionTypeText?: string;
  public selectionButtonText?: string;
  public selectionSearchText?: string;
  public hasDropdown = false;
  public selectedChains?: string;
  public dropdownTitle = '';
  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  public sequenceDetails: SequenceDetail[] = [];
  public assemblyTooltip = assemblyTooltip;

  public dashboardStatLinks = dashboardStatLinks;

  // currently selected row of interactive table
  private currentState?: number | string;

  // data visualisation components rendering and state variables
  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  public hasProtvista = false;
  @ViewChild('protvistaContainer') protvistaContainer!: ElementRef;
  private protvistaInstance: any;
  private protvistaIsLoaded = false;
  public currentProtvistaEntity = signal<string | undefined>(undefined);
  public currentProtvistaChain = signal<string | undefined>(undefined);

  public hasTopologyViewer = false;
  @ViewChild('topologyViewerContainer') topologyViewerContainer!: ElementRef;
  private topologyViewerInstance: any;
  private topologyViewerIsLoaded = false;

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

  private readonly allThereVisuals = ['polypeptide(L)', 'polypeptide(D)'];
  private readonly onlyTwoVisuals = ['polyribonucleotide', 'polydeoxyribonucleotide'];
  private readonly onlyMolstarVisuals = ['carbohydrate polymer'];
  public residues = signal<MappedResidue[]>([]);
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

  public searchTerm = new FormControl('');

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly defaultColDef = defaultColDef;
  public rowData = linkedSignal({
    source: this.interactions,
    computation: () => this.interactions(),
  });
  public paginationPageSizeSelector = signal<number[]>([10, 20]);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(async () => {
      // when a row is selected and updated on the comp comm service we update the dashboard
      const tabState = this.signals.tabState();
      if (this.currentState !== tabState[this.tabName()]) {
        this.currentState = tabState[this.tabName()];

        // sending and retrieving global molstar instance just to reset some variables currently
        await this.sendMolstarViewerToParent();
        await this.getMolstarViewerFromParent();

        // call row selection function to set variables and trigger visualisation conditional rendering
        await this.onTableRowSelection(tabState[this.tabName()]);
      }
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
        this.rowData.update(() => data);
      });
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.utilService.generateQueryURL(term, 'q_organism_name');
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

  async getMolstarViewerFromParent() {
    if (this.isMolstarRetrieved === false) {
      // Move the molstar WebGL container into the child component
      this.renderer.appendChild(this.molstarContainer.nativeElement, this.molstarViewerEl());
      // Add a delay to ensure synchronicity
      this.isMolstarRetrieved = true;
    }
    await firstValueFrom(timer(50)); // 100ms delay, adjust as needed
  }

  async sendMolstarViewerToParent() {
    // Move the molstar WebGL container back to the parent component
    if (this.isMolstarRetrieved === true) {
      this.renderer.appendChild(this.molstarParent(), this.molstarViewerEl());
      this.isMolstarRetrieved = false;
      // Set first render for next view equal to true
      this.molstarVisualisations.isFirstViewRender = true;
    }
    // Add a delay to ensure synchronicity
    await firstValueFrom(timer(50)); // 100ms delay, adjust as needed
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private async onTableRowSelection(tabState: string | number) {
    // this function is triggered when a selection happens in the interactive-tables component (if there is a row, there will always be a selection)
    // it sets variables according to what is currently displayed in the dashboard (Assemblies, Domains, Ligands, Macromolecules, etc)

    const tableRows = this.signals.getTabData(this.tabName()).tableRows();
    this.selectionTitle = `Loading ${this.tabName().toLowerCase()} data for this entry...`;
    this.selectionIdentifier = 'None';
    let datum: TableRow | undefined = undefined;
    if (tableRows.length > 0 && tabState !== 'Main') {
      datum = tableRows[tabState as number];
      if (this.tabName() === 'Assemblies') {
        datum = datum as AssembliesRowData;
        this.selectionTitle = datum.assemblyName;
        this.selectionTypeText = 'assembly';
        this.selectionButtonText = 'Compare this assembly in other entries';
      } else if (this.tabName() === 'Domains') {
        datum = datum as DomainsRowData;
        const mappedDatum = datum.additionalData.boundaries.map((b) => b.chain);
        const uniqueChains = [...new Set(mappedDatum)];
        datum.mappedboundaries = uniqueChains;
        this.selectionTitle = `${datum.domain} (Accession: ${datum?.additionalData?.accession})`;
        this.selectionTypeText = 'domain';
        this.selectionButtonText = 'Compare this domain in other entries';
        // data processing facade is used to get selectedChains (displayed as text in template)
        this.selectedChains = this.detailsDashboardFacade.getDomainChains(datum);
        // ...and sequence annotated with domain positions
        this.sequenceDetails = this.detailsDashboardFacade.getDomainSequenceDetails(this.entryId() ?? '', this.macromolecules() ?? [], datum);
        this.hasProtvista = true;
      } else if (this.tabName() === 'Ligands') {
        datum = datum as LigandsRowData;
        this.selectionTitle = datum.codeAndName.name;
        this.selectionTypeText = 'ligand';
        this.selectionButtonText = 'Compare this ligand in other entries';
        this.hasDropdown = true;

        // data processing facade is used to get dropdown related information for ligand resid selection
        const dropdownResults = this.detailsDashboardFacade.getLigandsDropdownOptions(datum);
        this.dropdownTitle = '';
        this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;
        this.dropdownOptions = dropdownResults.dropdownOptions.map((eachString, idx) => {
          return {
            name: eachString,
            url: `lig-${idx + 1}`,
            downloadable: false,
          };
        });
        this.dropdownSelected = dropdownResults.dropdownSelected;

        this.selectionIdentifier = datum.id;

        // modification is a special case for Ligands table in which lig env viewer is not displayed
        if (datum.type.includes('modification') === false) {
          this.hasLigandEnv = true;
        } else {
          // if it is a ligand
          // we await destruction of current ligand env viewer (if there is one) and resetting of loading status vars
          await this.destroyLigandEnv();
        }
      } else if (this.tabName() === 'Macromolecules') {
        datum = datum as MacromoleculesRowData;
        this.selectionTitle = datum?.additionalData?.molecule?.molecule_name[0];
        this.hasDropdown = true;

        // data processing facade is used to get dropdown related information for macromolecule chain selection
        const dropdownResults = this.detailsDashboardFacade.getMacromoleculeDropdownOptions(datum);
        this.dropdownTitle = dropdownResults.dropdownTitle;
        this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;
        this.dropdownOptions = dropdownResults.dropdownOptions.map((eachString, idx) => {
          return {
            name: eachString,
            url: `macro-${idx + 1}`,
            downloadable: false,
          };
        });
        this.dropdownSelected = dropdownResults.dropdownSelected;

        // ... and to get each macromolecule sequence
        this.sequenceDetails = this.detailsDashboardFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', datum, this.dropdownSelected);

        // finally we displayed topology viewer only for protein molecules
        this.hasTopologyViewer = false;
        if (this.allThereVisuals.includes(datum.additionalData.molecule.molecule_type)) {
          this.selectionButtonText = 'Compare this protein in other entries';
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
      }
    }
    if (datum) {
      this.currentRowDatum = datum;

      if (this.tabName() === 'Macromolecules') {
        this.residues.update(() => this.detailsDashboardFacade.transformCoverageData(this.currentRowDatum['residues']));
      }

      // before rendering molstar we get the singleton molstar tab instance from the template (this avoids memory leaks)
      await this.getMolstarViewerFromParent();
      // we render molstar with reloading config obj as true
      await this.renderInMolstar(true);
      // we call functions for other visualisation components to handle their conditional rendering
      this.initOrRefreshProtvista();
      await this.initOrRefreshTopologyViewer();
      await this.initOrRefreshLigandEnvViewer();
    } else {
      await this.sendMolstarViewerToParent();
    }
  }

  public openDialog(type: string) {
    const component: ComponentType<any> = type === 'ec' ? EcNumbersComponent : GoTermsComponent;
    this.dialog.open(component, {
      disableClose: false,
      panelClass: 'entry-Dialog',
    });
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // for ligands when selcetion is switched in the dropdown, we reload molstar config obj
    let reloadConfigObj = false;
    if (this.tabName() === 'Ligands') reloadConfigObj = true;

    // all possible rendering functions are called for a dashboard
    await this.renderInMolstar(reloadConfigObj);
    this.initOrRefreshProtvista();
    await this.initOrRefreshTopologyViewer();
    await this.initOrRefreshLigandEnvViewer();
  }

  public getAdditionalData(name: string) {
    // this function is used to get specific data shown in Assembly dashboard view
    type AssembliesAddDataKeys = 'accessibleSurfaceArea' | 'buriedSurfaceArea' | 'dissociationArea' | 'dissociationEnergy' | 'dissociationEntropy' | 'symmetryNumber';
    const datum = this.currentRowDatum! as AssembliesRowData;
    return datum?.additionalData[name as AssembliesAddDataKeys];
  }

  private async renderInMolstar(reloadConfigObj: boolean) {
    let datum = this.currentRowDatum!;
    //Different molstar rendering functions are called according to the dashboard type
    if (this.tabName() === 'Assemblies') {
      datum = datum as AssembliesRowData;
      await this.molstarVisualisations.renderMolstarAssemblies(this.entryId() ?? '', this.molstarViewerEl(), datum, reloadConfigObj);
    } else if (this.tabName() === 'Domains') {
      datum = datum as DomainsRowData;
      await this.molstarVisualisations.renderMolstarDomains(this.entryId() ?? '', this.molstarViewerEl(), datum, reloadConfigObj);
    } else if (this.tabName() === 'Ligands') {
      datum = datum as LigandsRowData;
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
      await this.molstarVisualisations.renderMolstarLigands(this.entryId() ?? '', this.molstarViewerEl(), datum, molstarSelection, reloadConfigObj);
    } else if (this.tabName() === 'Macromolecules') {
      datum = datum as MacromoleculesRowData;
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
      await this.molstarVisualisations.renderMolstarMacromolecules(this.entryId() ?? '', this.molstarViewerEl(), datum, molstarSelection, reloadConfigObj);
    }
  }

  private initOrRefreshProtvista() {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasProtvista) return;
    const datum = this.currentRowDatum!;
    let entityId = -1;
    let chainId: string | undefined = undefined;

    // entityId is retrieved from data passed from the interactive table to this component
    if (this.tabName() === 'Macromolecules') {
      entityId = (datum as MacromoleculesRowData).additionalData.molecule.entity_id;
      chainId = this.dropdownSelected.split('Chain ')[1];
    } else if (this.tabName() === 'Domains') {
      entityId = (datum as DomainsRowData).additionalData.boundaries[0].entity;

      // if a domain is composed of single chain, we set it for Protvista
      const chains = (datum as DomainsRowData).additionalData.boundaries.map((boundary) => boundary.chain);
      const allSame = chains.every((chain) => chain === chains[0]);
      if (allSame) chainId = chains[0];
    }

    this.currentProtvistaEntity.set(`${entityId}`);
    this.currentProtvistaChain.set(chainId);
  }

  private async initOrRefreshTopologyViewer() {
    // stop if this dashboard does not have topology viewer (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasTopologyViewer) return;

    // topology viewer is only currently shown for macromolecules
    const datum = this.currentRowDatum! as MacromoleculesRowData;
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
    this.topologyViewerIsLoaded = true;
  }

  private async initOrRefreshLigandEnvViewer() {
    // stop if this dashboard does not have ligand env viewer (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasLigandEnv) return;

    // ligand env viewer is only shown for ligands tab. data is retrieved from dropdown
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
    const resId = molstarSelection.residues[0].authBegin;
    const chainId = molstarSelection.authChainId!;

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
      chainId: chainId,
    };
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

  public downloadCSV(): void {
    const mappedData = this.rowData()?.map((row) => {
      return {
        'Residue Name 1': row.end.chem_comp_id + '_' + row.end.author_residue_number,
        'Atom Name 1': row.end.atom_names.join(','),
        'Interaction Type': row.interaction_details.map((type) => INTX_NAME_STANDARDIZER[type as keyof typeof INTX_NAME_STANDARDIZER]).join(', '),
        'Distance (Å)': row.distance,
        'Ligand Atom': row.ligand_atoms.join(', '),
      };
    });
    if (mappedData && mappedData.length) {
      this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
    }
  }
}
