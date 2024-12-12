import { ElementRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  MolstarSelectionObj,
  removeComponent,
  createComponent,
  addRepresentationToComponent,
  focusLoci,
  changeComponentVisibility,
  changeRepresentationVisibility,
  getResidues,
} from './molstar-helpers';
import {
  LIGANDS_REPR_HIGHLIGHT,
  LIGANDS_REPR_NONSELECTION_POLYMER,
  LIGANDS_REPR_SELECTION,
  MACROMOLECULES_REPR_SELECTION_CARB,
  PROTEIN_REPR_SELECTION,
  REPR_NONSELECTION_BRANCHED,
  REPR_NONSELECTION_LIGAND,
  REPR_NONSELECTION_POLYMER,
} from './molstar-repr-objects';
import {
  AssembliesRowData,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesRowData,
} from '../../components/interactive-tables/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../services/component-comm.service';

declare let PDBeMolstarPlugin: any;

export interface MolstarConfigObject {
  moleculeId?: string;
  customData?: {
    url: string;
    format: string;
    binary: boolean;
  };
  assemblyId?: string;
  loadMaps?: boolean;
  bgColor: { r: number; g: number; b: number };
  hideControls: boolean;
  hideCanvasControls?: string[];
  landscape: boolean;
  subscribeEvents: boolean;
  granularity?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MolstarVisualisationsForTabs {
  // public molstarViewInstance: WritableSignal<any> = signal(undefined);
  public molstarViewInstance: any;
  private isMolstarRendered = false;
  public isFirstViewRender = true;
  public readonly signals = inject(ComponentCommunicationService);

  public resetAttributesForRendering() {
    this.molstarViewInstance = undefined;
    this.isMolstarRendered = false;
  }

  private async initMolstar(molstarConfigObject: MolstarConfigObject, molstarContainer?: ElementRef, molstarViewer?: HTMLElement) {
    if (this.molstarViewInstance) {
      console.error('MOLSTAR INSTANCE EXISTS');
    }
    // this.molstarViewInstance().set(new PDBeMolstarPlugin());
    this.molstarViewInstance = new PDBeMolstarPlugin();
    const container = molstarViewer ? molstarViewer : molstarContainer!.nativeElement;
    this.molstarViewInstance.render(container, molstarConfigObject);
    await firstValueFrom(this.molstarViewInstance.events.loadComplete);
  }

  private async updateMolstar(molstarConfigObject: MolstarConfigObject) {
    this.molstarViewInstance.visual.update(molstarConfigObject, true);
    await firstValueFrom(this.molstarViewInstance.events.loadComplete);
  }

  public async renderMolstarInitial(entryId: string, molstarContainer: HTMLElement) {
    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      loadMaps: false,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
    };
    if (this.isMolstarRendered === false) {
      await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
      this.isMolstarRendered = true;
    } else {
      await this.updateMolstar(molstarConfigObject);
    }
    const data = await getResidues(this.molstarViewInstance);
    this.signals.molstarResidueInfo.set(data);
    this.signals.molstarResidueInfoLoaded.set(true);
  }

  public async renderMolstarAssemblies(entryId: string, molstarContainer: HTMLElement, datum: AssembliesRowData, reloadConfigObj: boolean) {
    const assemblyId = datum.assemblyId;
    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      loadMaps: false,
      assemblyId: assemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
    };
    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }
  }

  public async renderMolstarDomains(entryId: string, molstarContainer: HTMLElement, datum: DomainsRowData, reloadConfigObj: boolean) {
    const molstarSelection = datum.additionalData.selections[0];

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      loadMaps: false,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
    };

    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        // await this.initMolstar(molstarContainer, molstarConfigObject);
        await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }

    if (this.isFirstViewRender === true) {
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-polymer', REPR_NONSELECTION_POLYMER, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-ligand', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-non-standard', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-branched', REPR_NONSELECTION_BRANCHED, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-branched', REPR_NONSELECTION_LIGAND, false);
      this.isFirstViewRender = false;
    } else {
      await removeComponent(this.molstarViewInstance, `structure-component-static-domains`);
    }
    await createComponent(this.molstarViewInstance, `structure-component-static-domains`, molstarSelection, PROTEIN_REPR_SELECTION);
    await focusLoci(this.molstarViewInstance, molstarSelection);
  }

  public async renderMolstarLigands(
    entryId: string,
    molstarContainer: HTMLElement,
    datum: LigandsRowData,
    molstarSelection: MolstarSelectionObj,
    reloadConfigObj: boolean
  ) {
    const entityId = molstarSelection.entityId!;
    const chainId = molstarSelection.authChainId!;

    let urlToDownload = '';
    let reprNonSelectionPolymer: any;
    if (datum.type === 'modification') {
      urlToDownload = `https://www.ebi.ac.uk/pdbe/model-server/v1/${entryId}/atoms?label_entity_id=${entityId}&auth_asym_id=${chainId}&encoding=bcif`;
      reprNonSelectionPolymer = REPR_NONSELECTION_POLYMER;
    } else {
      const authSeqId = molstarSelection.residues[0].authBegin;
      const authInsCode = molstarSelection.residues[0].authBeginIns;
      urlToDownload = `https://www.ebi.ac.uk/pdbe/model-server/v1/${entryId}/residueSurroundings?auth_seq_id=${authSeqId}&pdbx_PDB_ins_code=${authInsCode}&auth_asym_id=${chainId}&radius=10&encoding=bcif`;
      reprNonSelectionPolymer = LIGANDS_REPR_NONSELECTION_POLYMER;
    }

    const molstarConfigObject: MolstarConfigObject = {
      customData: {
        url: urlToDownload,
        format: 'cif',
        binary: true,
      },
      loadMaps: true,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
    };

    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }
    // to be added?
    // await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-ligand', reprNonSelectionLigand, true);
    // await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-non-standard', reprNonSelectionLigand, true);

    await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-polymer', reprNonSelectionPolymer, true);
    await changeComponentVisibility(this.molstarViewInstance, 'structure-component-static-ligand', true);
    await changeComponentVisibility(this.molstarViewInstance, 'structure-component-static-non-standard', true);
    await changeComponentVisibility(this.molstarViewInstance, 'structure-component-static-branched', true);
    await createComponent(this.molstarViewInstance, `structure-component-static-${datum.type}`, molstarSelection, LIGANDS_REPR_SELECTION);
    await createComponent(this.molstarViewInstance, `structure-component-static-${datum.type}-selected`, molstarSelection, LIGANDS_REPR_HIGHLIGHT);
    await focusLoci(this.molstarViewInstance, molstarSelection);
  }

  public async renderMolstarMacromolecules(
    entryId: string,
    molstarContainer: HTMLElement,
    datum: MacromoleculesRowData,
    molstarSelection: MolstarSelectionObj,
    reloadConfigObj: boolean
  ) {
    const moleculeType = datum.additionalData.molecule.molecule_type;

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      bgColor: { r: 255, g: 255, b: 255 },
      loadMaps: false,
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
    };
    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        console.log('isMolstarRendered false');
        await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        console.log('isMolstarRendered true');
        await this.updateMolstar(molstarConfigObject);
      }
    }
    if (this.isFirstViewRender === true) {
      console.log('isFirstViewRender true');
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-polymer', REPR_NONSELECTION_POLYMER, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-ligand', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-non-standard', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-branched', REPR_NONSELECTION_BRANCHED, true);
      // await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-branched', REPR_NONSELECTION_LIGAND, false);
      if (moleculeType.includes('carbohydrate')) {
        await changeRepresentationVisibility(this.molstarViewInstance, 'structure-component-static-branched', false, 0);
      }
      this.isFirstViewRender = false;
    } else {
      console.log('isFirstViewRender false');
      await removeComponent(this.molstarViewInstance, `structure-component-static-macromolecule`);
    }
    const reprSelection = moleculeType.includes('carbohydrate') ? MACROMOLECULES_REPR_SELECTION_CARB : PROTEIN_REPR_SELECTION;
    await createComponent(this.molstarViewInstance, `structure-component-static-macromolecule`, molstarSelection, reprSelection);
    await focusLoci(this.molstarViewInstance, molstarSelection);
  }
}
