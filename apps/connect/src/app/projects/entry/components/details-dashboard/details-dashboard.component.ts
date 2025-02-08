/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, effect, ElementRef, inject, input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule, UtilService } from '@pdbc/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MolstarSelectionObj } from '../../helpers/molstar/molstar-helpers';
import { VisualisationsDataProcessing } from './data-processing.facade';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { firstValueFrom, timer } from 'rxjs';
import {
  AssembliesRowData,
  DomainsBoundaries,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesRowData,
  TableRow,
} from '../interactive-tables/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { TableNames } from '../../pages/main/main.component';
import { Molecule } from '../../data-models/molecule.model';
import { assemblyTooltip, dashboardStatLinks } from '../../entry-constant';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { EntryDropdownComponent } from '../entry-dropdown/entry-dropdown.component';
import { ProteinSummaryStats } from '../../data-models/protein-summary-stats.model';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../store/entry.selectors';

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

@Component({
  selector: 'pdbc-details-dashboard',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, FormsModule, EntryDropdownComponent, MaterialModule],
  templateUrl: './details-dashboard.component.html',
  styleUrl: './details-dashboard.component.scss',
})
export class DetailsDashboardComponent implements OnDestroy {
  public readonly signals = inject(ComponentCommunicationService);
  private readonly utilService = inject(UtilService);
  public readonly dataProcessing = inject(VisualisationsDataProcessing);
  public readonly molstarVisualisations = inject(MolstarVisualisationsForTabs);
  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  // private molstarVisualisation = inject(MolstarVisualisationsForTabs);

  // required inputs
  // public readonly entryId = input.required<string>();
  public readonly tabName = input.required<TableNames>();
  // public readonly macromolecules = input.required<Molecule[]>();
  // public readonly proteinsStats = input.required<{ [key: string]: ProteinSummaryStats }>();

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly proteinsStats = toSignal(this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds));

  public molstarViewerEl = input.required<HTMLElement>(); // Molstar global instance div
  public molstarParent = input.required<HTMLElement>(); // Parent to send back the molstar global instance
  private isMolstarRetrieved = false;

  // injected services, data processing facade, molstar helpers

  // variables rendered in template
  public currentRowDatum?: TableRow;
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
  private currentProtvistaEntity = -1;

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

  constructor() {
    effect(async () => {
      // when a row is selected and updated on the comp comm service we update the dashboard
      const tabState = this.signals.tabState();
      if (this.currentState !== tabState[this.tabName()]) {
        this.currentState = tabState[this.tabName()];

        // await this.molstarVisualisations.renderMolstarInitial(this.entryId() ?? '', this.molstarContainer.nativeElement);

        // sending and retrieving global molstar instance just to reset some variables currently
        await this.sendMolstarViewerToParent();
        await this.getMolstarViewerFromParent();

        // call row selection function to set variables and trigger visualisation conditional rendering
        await this.onTableRowSelection(tabState[this.tabName()]);
      }
    });
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

  async ngOnDestroy() {
    // when dashboard is destroyed we send the molstar singleton instance back to global template
    await this.sendMolstarViewerToParent();

    // Remove ligand environment if it exists
    await this.destroyLigandEnv();
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
        this.selectionTitle = `${datum.domain} (Accession: ${datum.additionalData.accession})`;
        this.selectionTypeText = 'domain';
        this.selectionButtonText = 'Compare this domain in other entries';
        // data processing facade is used to get selectedChains (displayed as text in template)
        this.selectedChains = this.dataProcessing.getDomainChains(datum);
        // ...and sequence annotated with domain positions
        this.sequenceDetails = this.dataProcessing.getDomainSequenceDetails(this.entryId() ?? '', this.macromolecules() ?? [], datum);
        this.hasProtvista = true;
      } else if (this.tabName() === 'Ligands') {
        datum = datum as LigandsRowData;
        this.selectionTitle = datum.codeAndName.name;
        this.selectionTypeText = 'ligand';
        this.selectionButtonText = 'Compare this ligand in other entries';
        this.hasDropdown = true;

        // data processing facade is used to get dropdown related information for ligand resid selection
        const dropdownResults = this.dataProcessing.getLigandsDropdownOptions(datum);
        this.dropdownTitle = dropdownResults.dropdownTitle;
        this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;
        this.dropdownOptions = dropdownResults.dropdownOptions.map((eachString, idx) => {
          return {
            name: eachString,
            url: `lig-${idx + 1}`,
            downloadable: false,
          };
        });
        this.dropdownSelected = dropdownResults.dropdownSelected;

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
        this.selectionTitle = datum.additionalData.molecule.molecule_name[0];
        this.hasDropdown = true;

        // data processing facade is used to get dropdown related information for macromolecule chain selection
        const dropdownResults = this.dataProcessing.getMacromoleculeDropdownOptions(datum);
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
        this.sequenceDetails = this.dataProcessing.getMacromoleculeSequenceDetails(this.entryId() ?? '', datum, this.dropdownSelected);

        // finally we displayed topology viewer only for protein molecules
        this.hasTopologyViewer = false;
        if (datum.additionalData.molecule.molecule_type.includes('polypeptide')) {
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
        }
        this.hasProtvista = true;
      }
    }
    if (datum) {
      this.currentRowDatum = datum;
      // before rendering molstar we get the singleton molstar tab instance from the template (this avoids memory leaks)
      await this.getMolstarViewerFromParent();
      // we render molstar with reloading config obj as true
      await this.renderInMolstar(true);
      // we call functions for other visualisation components to handle their conditional rendering
      await this.initOrRefreshProtvista();
      await this.initOrRefreshTopologyViewer();
      await this.initOrRefreshLigandEnvViewer();
    } else {
      await this.sendMolstarViewerToParent();
    }
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // for ligands when selcetion is switched in the dropdown, we reload molstar config obj
    let reloadConfigObj = false;
    if (this.tabName() === 'Ligands') reloadConfigObj = true;

    // all possible rendering functions are called for a dashboard
    await this.renderInMolstar(reloadConfigObj);
    await this.initOrRefreshProtvista();
    await this.initOrRefreshTopologyViewer();
    await this.initOrRefreshLigandEnvViewer();
  }

  public getAdditionalData(name: string) {
    // this function is used to get specific data shown in Assembly dashboard view
    type AssembliesAddDataKeys = 'accessibleSurfaceArea' | 'buriedSurfaceArea' | 'dissociationArea' | 'dissociationEnergy' | 'dissociationEntropy' | 'symmetryNumber';
    const datum = this.currentRowDatum! as AssembliesRowData;
    return datum.additionalData[name as AssembliesAddDataKeys];
  }

  private async renderInMolstar(reloadConfigObj: boolean) {
    // let datum = this.currentRowDatum!;
    // Different molstar rendering functions are called according to the dashboard type
    // if (this.tabName() === 'Assemblies') {
    //   datum = datum as AssembliesRowData;
    //   await this.molstarVisualisations.renderMolstarAssemblies(this.entryId() ?? '', this.molstarViewerEl(), datum, reloadConfigObj);
    // } else if (this.tabName() === 'Domains') {
    //   datum = datum as DomainsRowData;
    //   await this.molstarVisualisations.renderMolstarDomains(this.entryId() ?? '', this.molstarViewerEl(), datum, reloadConfigObj);
    // } else if (this.tabName() === 'Ligands') {
    //   datum = datum as LigandsRowData;
    //   const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
    //   await this.molstarVisualisations.renderMolstarLigands(this.entryId() ?? '', this.molstarViewerEl(), datum, molstarSelection, reloadConfigObj);
    // } else if (this.tabName() === 'Macromolecules') {
    //   datum = datum as MacromoleculesRowData;
    //   const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
    //   await this.molstarVisualisations.renderMolstarMacromolecules(this.entryId() ?? '', this.molstarViewerEl(), datum, molstarSelection, reloadConfigObj);
    // }
  }

  private async initOrRefreshProtvista() {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasProtvista) return;
    const datum = this.currentRowDatum!;
    let entityId = -1;

    // entityId is retrieved from data passed from the interactive table to this component
    if (this.tabName() === 'Macromolecules') {
      entityId = (datum as MacromoleculesRowData).additionalData.molecule.entity_id;
    } else if (this.tabName() === 'Domains') {
      entityId = (datum as DomainsRowData).additionalData.boundaries[0].entity;
    }

    // stop if no data can be successfully retrieved or no need for update (same entity as before)
    if (entityId === -1 || entityId === this.currentProtvistaEntity) return;

    if (this.protvistaIsLoaded === false) {
      // if this is the first render from protvista, create the element and set all parameters
      this.protvistaInstance = this.renderer.createElement('protvista-pdb');
      this.renderer.setAttribute(this.protvistaInstance, 'entry-id', this.entryId() ?? ''.toLowerCase());
      this.renderer.setAttribute(this.protvistaInstance, 'entity-id', `${entityId}`);
      this.renderer.setAttribute(this.protvistaInstance, 'page-section', '1');
      this.renderer.setAttribute(this.protvistaInstance, 'legends', 'false');
      this.renderer.setAttribute(this.protvistaInstance, 'env', '');

      const container = this.protvistaContainer.nativeElement;
      this.renderer.appendChild(container, this.protvistaInstance);
      this.currentProtvistaEntity = entityId;
      // we set isLoaded as true to indicate this has been rendered once
      this.protvistaIsLoaded = true;
    } else {
      // if this is NOT the first render from protvista, we just set some parameters and call connectedCallback
      this.renderer.setAttribute(this.protvistaInstance, 'entry-id', this.entryId() ?? ''.toLowerCase());
      this.renderer.setAttribute(this.protvistaInstance, 'entity-id', `${entityId}`);
      this.currentProtvistaEntity = entityId;
      this.protvistaInstance.connectedCallback();
    }
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
}
