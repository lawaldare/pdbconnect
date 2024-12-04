import { AfterViewInit, Component, effect, ElementRef, inject, input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '@pdbc/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MolstarSelectionObj } from '../../helpers/molstar-helpers';
import { VisualisationsDataProcessing } from './data-processing.facade';
import { MolstarVisualisationsForTabs } from './molstar-visualisations';
// import { TableNames } from '../../pages/entry-v4/entry-v4.component';
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

declare let PdbTopologyViewerPlugin: any;

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

// 4aqd carbs
// 6hr1 fusion
// 7v08 large em
// 3irj only carb
// 3l3t 4 assemblies
// 1trn interesting domains, modifications

@Component({
  selector: 'pdbc-details-dashboard',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatOptionModule, MatFormFieldModule, MatLabel, FormsModule],
  templateUrl: './details-dashboard.component.html',
  styleUrl: './details-dashboard.component.scss',
})
export class DetailsDashboardComponent implements OnDestroy {
  public readonly entryId = input.required<string>();
  public readonly tabName = input.required<TableNames>();
  // public readonly tabName = input.required<string>();
  public readonly pageInformation = input.required<any>();

  public readonly signals = inject(ComponentCommunicationService);
  private readonly utilService = inject(UtilService);
  public readonly dataProcessing = inject(VisualisationsDataProcessing);
  public readonly molstarVisualisations = inject(MolstarVisualisationsForTabs);
  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);

  public currentRowDatum?: TableRow;
  public selectionTitle = 'This is a 3D view area';
  public selectionButtonText?: string;
  public selectionSearchText?: string;
  public hasDropdown = false;
  public selectedChains?: string;
  public dropdownTitle = '';
  public dropdownSelected?: string;
  public dropdownOptions?: string[];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
  public sequenceDetails: SequenceDetail[] = [];

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  // private molstarViewInstance: any;
  // private isMolstarRendered = false;

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

  private currentState?: number | string;

  constructor() {
    effect(async () => {
      const tabState = this.signals.tabState(); // Access the current state
      if (this.currentState !== tabState[this.tabName()]) {
        this.currentState = tabState[this.tabName()];
        await this.onTableRowSelection(tabState[this.tabName()]);
      }
    });
  }

  async ngOnDestroy() {
    if (this.molstarVisualisations.molstarViewInstance) {
      // safe disposal of molstar instances
      this.molstarVisualisations.molstarViewInstance.plugin.dispose();
      this.renderer.removeChild(this.elementRef.nativeElement, this.molstarVisualisations.molstarViewInstance);
      this.molstarVisualisations.resetAttributesForRendering();
    }
    // Remove ligand environment if it exists
    await this.destroyLigandEnv();
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private async onTableRowSelection(tabState: string | number) {
    const tabData = this.signals.getTabData(this.tabName());

    this.selectionTitle = `No ${this.tabName().toLowerCase()} data for this entry`;
    let datum: TableRow | undefined = undefined;
    if (tabData.length > 0 && tabState !== 'Main') {
      datum = tabData[tabState as number];
      if (this.tabName() === 'Assemblies') {
        datum = datum as AssembliesRowData;
        this.selectionTitle = datum.assemblyName;
        this.selectionButtonText = 'Compare this assembly in other entries';
      } else if (this.tabName() === 'Domains') {
        datum = datum as DomainsRowData;
        this.selectionTitle = `${datum.domain} (Accession: ${datum.additionalData.accession})`;
        this.selectionButtonText = 'Compare this domain in other entries';
        this.selectedChains = this.dataProcessing.getDomainChains(datum);
        this.sequenceDetails = this.dataProcessing.getDomainSequenceDetails(this.pageInformation(), datum);
        this.hasProtvista = true;
      } else if (this.tabName() === 'Ligands') {
        datum = datum as LigandsRowData;
        this.selectionTitle = datum.codeAndName.name;
        this.selectionButtonText = 'Compare this ligand in other entries';
        this.hasDropdown = true;
        const dropdownResults = this.dataProcessing.getLigandsDropdownOptions(datum);
        this.dropdownTitle = dropdownResults.dropdownTitle;
        this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;
        this.dropdownOptions = dropdownResults.dropdownOptions;
        this.dropdownSelected = dropdownResults.dropdownSelected;
        // this.hasLigandEnv = true;
        if (datum.type.includes('modification') === false) {
          this.hasLigandEnv = true;
        } else {
          await this.destroyLigandEnv(); // hasLigandEnv = false must happen after destroying ligand env
        }
      } else if (this.tabName() === 'Macromolecules') {
        datum = datum as MacromoleculesRowData;
        this.selectionTitle = datum.additionalData.molecule.molecule_name[0];
        this.hasDropdown = true;
        const dropdownResults = this.dataProcessing.getMacromoleculeDropdownOptions(datum);
        this.dropdownTitle = dropdownResults.dropdownTitle;
        this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;
        this.dropdownOptions = dropdownResults.dropdownOptions;
        this.dropdownSelected = dropdownResults.dropdownSelected;
        this.sequenceDetails = this.dataProcessing.getMacromoleculeSequenceDetails(datum, this.dropdownSelected);
        this.hasTopologyViewer = false;
        if (datum.additionalData.molecule.molecule_type.includes('polypeptide')) {
          this.selectionButtonText = 'Compare this protein in other entries';
          this.hasTopologyViewer = true;
        }
        this.hasProtvista = true;
      }
    }
    if (datum) {
      this.currentRowDatum = datum;
      await this.initOrRefreshMolstar();
      await this.initOrRefreshProtvista();
      await this.initOrRefreshTopologyViewer();
      await this.initOrRefreshLigandEnvViewer();
    }
  }

  public async onDropdownSelect(event: MatSelectChange) {
    this.dropdownSelected = event.value;
    await this.initOrRefreshMolstar();
    await this.initOrRefreshProtvista();
    await this.initOrRefreshTopologyViewer();
    await this.initOrRefreshLigandEnvViewer();
  }

  public getAdditionalData(name: string) {
    type AssembliesAddDataKeys = 'accessibleSurfaceArea' | 'buriedSurfaceArea' | 'dissociationArea' | 'dissociationEnergy' | 'dissociationEntropy' | 'symmetryNumber';
    const datum = this.currentRowDatum! as AssembliesRowData;
    return datum.additionalData[name as AssembliesAddDataKeys];
  }

  private async initOrRefreshMolstar() {
    let datum = this.currentRowDatum!;
    if (this.tabName() === 'Assemblies') {
      datum = datum as AssembliesRowData;
      await this.molstarVisualisations.renderMolstarAssemblies(this.entryId(), this.molstarContainer, datum);
    } else if (this.tabName() === 'Domains') {
      datum = datum as DomainsRowData;
      await this.molstarVisualisations.renderMolstarDomains(this.entryId(), this.molstarContainer, datum);
    } else if (this.tabName() === 'Ligands') {
      datum = datum as LigandsRowData;
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
      await this.molstarVisualisations.renderMolstarLigands(this.entryId(), this.molstarContainer, datum, molstarSelection);
    } else if (this.tabName() === 'Macromolecules') {
      datum = datum as MacromoleculesRowData;
      const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
      await this.molstarVisualisations.renderMolstarMacromolecules(this.entryId(), this.molstarContainer, datum, molstarSelection);
    }
  }

  private async initOrRefreshProtvista() {
    if (!this.hasProtvista) return;
    const datum = this.currentRowDatum!;
    let entityId = -1;
    if (this.tabName() === 'Macromolecules') {
      entityId = (datum as MacromoleculesRowData).additionalData.molecule.entity_id;
    } else if (this.tabName() === 'Domains') {
      entityId = (datum as DomainsRowData).additionalData.boundaries[0].entity;
    }
    if (entityId === -1 || entityId === this.currentProtvistaEntity) return;
    if (this.protvistaIsLoaded === false) {
      this.protvistaInstance = this.renderer.createElement('protvista-pdb');
      this.renderer.setAttribute(this.protvistaInstance, 'entry-id', this.entryId().toLowerCase());
      this.renderer.setAttribute(this.protvistaInstance, 'entity-id', `${entityId}`);
      this.renderer.setAttribute(this.protvistaInstance, 'page-section', '1');
      this.renderer.setAttribute(this.protvistaInstance, 'legends', 'false');
      const container = this.protvistaContainer.nativeElement;
      this.renderer.appendChild(container, this.protvistaInstance);
      this.currentProtvistaEntity = entityId;
      this.protvistaIsLoaded = true;
    } else {
      this.renderer.setAttribute(this.protvistaInstance, 'entry-id', this.entryId().toLowerCase());
      this.renderer.setAttribute(this.protvistaInstance, 'entity-id', `${entityId}`);
      this.currentProtvistaEntity = entityId;
      this.protvistaInstance.connectedCallback();
    }
  }

  private async initOrRefreshTopologyViewer() {
    if (!this.hasTopologyViewer) return;
    const datum = this.currentRowDatum! as MacromoleculesRowData;
    const entityId = (datum as MacromoleculesRowData).additionalData.molecule.entity_id;
    const chainId = this.dropdownSelected?.split('Chain ')[1];

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
    if (!this.hasLigandEnv) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected!];
    const resId = molstarSelection.residues[0].authBegin;
    const chainId = molstarSelection.authChainId!;
    if (this.ligandEnvSelection.resId === resId && this.ligandEnvSelection.chainId === chainId) {
      return;
    }
    if (this.ligandEnvLoaded === false) {
      this.ligandEnvInstance = this.renderer.createElement('pdb-ligand-env');
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-id', this.entryId().toLowerCase());
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-res-id', `${resId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-chain-id', `${chainId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'environment', `development`);
      const container = this.ligandEnvContainer.nativeElement;
      this.renderer.appendChild(container, this.ligandEnvInstance);
      this.ligandEnvLoaded = true;
    } else {
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
    // unfortunately needed so selection happens syncronously
    await firstValueFrom(timer(100));
  }
}
