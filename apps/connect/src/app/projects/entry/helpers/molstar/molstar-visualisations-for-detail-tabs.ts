import { inject, Injectable } from '@angular/core';
import {
  MolstarSelectionObj,
  removeComponent,
  createComponent,
  addRepresentationToComponent,
  changeComponentVisibility,
  changeRepresentationVisibility,
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
import { MolstarBaseClass, MolstarConfigObject } from './molstar-base-class';

@Injectable({
  providedIn: 'root',
})
export class MolstarVisualisationsForTabs extends MolstarBaseClass {
  /**
   * Component extends MolstarBaseClass and contains functions for
   * manipulating Molstar views specific to the detail tabs (page bottom)
   */
  private isMolstarRendered = false;
  public isFirstViewRender = true;
  public readonly signals = inject(ComponentCommunicationService);

  /**
   * Function responsible for initial render of molstar instance
   * @param entryId identifier for an entry
   * @param molstarContainer molstar container HTMLElement
   */
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
      console.error('MOLSTAR INSTANCE UPDATE ERROR');
      // await this.updateMolstar(molstarConfigObject);
    }
    this.parseInstanceResidues();
    const data = this.residues();
    this.signals.molstarResidueInfo.set(data);
    this.signals.molstarResidueInfoLoaded.set(true);
  }

  /**
   * Function responsible for manipulating a Molstar instance to render Exp & Validation
   * @param entryId identifier for an entry
   * @param molstarContainer molstar container HTMLElement, currently not used
   * @param reloadConfigObj true or false for whether configuration object should be reloaded
   */
  public async renderMolstarValidation(entryId: string, molstarContainer: HTMLElement, reloadConfigObj: boolean) {
    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      loadMaps: false,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      validationAnnotation: true,
      granularity: 'residue',
    };
    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        console.error('MOLSTAR INSTANCE DOUBLE INIT');
        // await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }
    // currently validationAnnotation: true is unfortunately not yet working with updateMolstar
    // this means we have to use the image gallery to display validation annotations
    await this.initImageGallery(entryId); // so we load it
    let validationImg: string | undefined;
    const imageList = this.galleryManager().images;
    for (const img of imageList) {
      // and iterate the image list looking for validation image
      if (img.filename.includes('_validation')) {
        validationImg = img.filename;
      }
    }
    // if we find it, we load it
    if (validationImg) await this.loadImage(validationImg);
  }

  /**
   * Function responsible for manipulating a Molstar instance to render Assemblies
   * @param entryId identifier for an entry
   * @param molstarContainer molstar container HTMLElement, currently not used
   * @param datum row data corresponding to the selected assembly
   * @param reloadConfigObj true or false for whether configuration object should be reloaded
   */
  public async renderMolstarAssemblies(entryId: string, molstarContainer: HTMLElement, datum: AssembliesRowData, reloadConfigObj: boolean) {
    // we close the Ligands & Envs tab molstar modal if it exists
    this.closeVolumeInfo();

    // we retrieve assembly identifier for the configuration object
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
      validationAnnotation: false,
      granularity: 'residue',
    };
    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        console.error('MOLSTAR INSTANCE DOUBLE INIT');
        // await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }
  }

  /**
   * Function responsible for manipulating a Molstar instance to render Domains
   * @param entryId identifier for an entry
   * @param molstarContainer molstar container HTMLElement, currently not used
   * @param datum row data corresponding to the selected domain
   * @param reloadConfigObj true or false for whether configuration object should be reloaded
   */
  public async renderMolstarDomains(entryId: string, molstarContainer: HTMLElement, datum: DomainsRowData, reloadConfigObj: boolean) {
    // we close the Ligands & Envs tab molstar modal if it exists
    this.closeVolumeInfo();

    // domain selection is retrieved from row data
    const molstarSelection = datum.additionalData.selections[0];

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      loadMaps: false,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      validationAnnotation: false,
      granularity: 'residue',
    };

    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        console.error('MOLSTAR INSTANCE DOUBLE INIT');
        // await this.initMolstar(molstarContainer, molstarConfigObject);
        // await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }

    // view customization functions called on first rendering
    if (this.isFirstViewRender === true) {
      // set representations of anything other than selected macromolecule to non selection
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-polymer', REPR_NONSELECTION_POLYMER, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-ligand', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-non-standard', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-branched', REPR_NONSELECTION_BRANCHED, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-branched', REPR_NONSELECTION_LIGAND, false);
      this.isFirstViewRender = false;
    } else {
      // remove current macromolecule view if previously rendered
      await removeComponent(this.molstarViewInstance(), `structure-component-static-domains`);
    }
    // finally create domain component with selected representation
    await createComponent(this.molstarViewInstance(), `structure-component-static-domains`, molstarSelection, PROTEIN_REPR_SELECTION);
    // focus camera on domain
    await this.focusLoci(molstarSelection);
  }

  /**
   * Function responsible for manipulating a Molstar instance to render Ligands & Environments
   * @param entryId identifier for an entry
   * @param molstarContainer molstar container HTMLElement, currently not used
   * @param datum row data corresponding to the selected ligand
   * @param molstarSelection selection corresponding to ligand
   * @param reloadConfigObj true or false for whether configuration object should be reloaded
   */
  public async renderMolstarLigands(
    entryId: string,
    molstarContainer: HTMLElement,
    datum: LigandsRowData,
    molstarSelection: MolstarSelectionObj,
    reloadConfigObj: boolean
  ) {
    // retrieve necessary data for composing ligands and environments URL
    const entityId = molstarSelection.entityId!;
    const chainId = molstarSelection.authChainId!;

    // create URL according to whether a modification or a ligand is selected
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
      validationAnnotation: false,
    };

    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        console.error('MOLSTAR INSTANCE DOUBLE INIT');
        // await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }

    // to be added?
    // await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-ligand', reprNonSelectionLigand, true);
    // await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-non-standard', reprNonSelectionLigand, true);

    // because specific data URL is used for ligands and environments no need to control reloading so just set representation and
    // components according to desired view

    // set representations of anything other than selected ligand to non selection
    await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-polymer', reprNonSelectionPolymer, true);
    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-ligand', true);
    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-non-standard', true);
    await changeComponentVisibility(this.molstarViewInstance(), 'structure-component-static-branched', true);
    // finally create ligand component with selected representation
    await createComponent(this.molstarViewInstance(), `structure-component-static-${datum.type}`, molstarSelection, LIGANDS_REPR_SELECTION);
    await createComponent(this.molstarViewInstance(), `structure-component-static-${datum.type}-selected`, molstarSelection, LIGANDS_REPR_HIGHLIGHT);
    // focus camera on ligand
    await this.focusLoci(molstarSelection);
  }

  /**
   * Function responsible for manipulating a Molstar instance to render Macromolecules
   * @param entryId identifier for an entry
   * @param molstarContainer molstar container HTMLElement, currently not used
   * @param datum row data corresponding to the selected macrmomolecule
   * @param molstarSelection selection corresponding to macromolecule
   * @param reloadConfigObj true or false for whether configuration object should be reloaded
   */
  public async renderMolstarMacromolecules(
    entryId: string,
    molstarContainer: HTMLElement,
    datum: MacromoleculesRowData,
    molstarSelection: MolstarSelectionObj,
    reloadConfigObj: boolean
  ) {
    // we close the Ligands & Envs tab molstar modal if it exists
    this.closeVolumeInfo();

    // molecule type is retrieved from row data for view customization
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
      validationAnnotation: false,
    };
    if (reloadConfigObj) {
      if (this.isMolstarRendered === false) {
        console.error('MOLSTAR INSTANCE DOUBLE INIT');
        // await this.initMolstar(molstarConfigObject, undefined, molstarContainer);
        this.isMolstarRendered = true;
      } else {
        await this.updateMolstar(molstarConfigObject);
      }
    }
    // view customization functions called on first rendering
    if (this.isFirstViewRender === true) {
      // set representations of anything other than selected macromolecule to non selection
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-polymer', REPR_NONSELECTION_POLYMER, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-ligand', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-non-standard', REPR_NONSELECTION_LIGAND, true);
      await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-branched', REPR_NONSELECTION_BRANCHED, true);
      // await addRepresentationToComponent(this.molstarViewInstance, 'structure-component-static-branched', REPR_NONSELECTION_LIGAND, false);

      // if carbohydrate change the visibility of the first representation to be shown
      if (moleculeType.includes('carbohydrate')) {
        await changeRepresentationVisibility(this.molstarViewInstance(), 'structure-component-static-branched', false, 0);
      }
      this.isFirstViewRender = false;
    } else {
      // remove current macromolecule view if previously rendered
      await removeComponent(this.molstarViewInstance(), `structure-component-static-macromolecule`);
    }
    // finally create macromolecule component with selected representation according to carbohydrate or others
    const reprSelection = moleculeType.includes('carbohydrate') ? MACROMOLECULES_REPR_SELECTION_CARB : PROTEIN_REPR_SELECTION;
    await createComponent(this.molstarViewInstance(), `structure-component-static-macromolecule`, molstarSelection, reprSelection);
    // focus camera on macromolecule
    await this.focusLoci(molstarSelection);
  }

  /**
   * Function closes Molstar modal that says:
   * "Streaming enabled, click on a residue or an atom to view the data."
   * when Ligands and Environments are open with Volume Streaming enabled
   */
  public closeVolumeInfo() {
    const volumeInfoSelector =
      '#detail-tabs > section > section.right-side > pdbc-details-dashboard > div.top-vis > section.molstar-details-container > div > div > div > div > div.msp-layout-hide-top.msp-layout-hide-left.msp-layout-hide-right.msp-layout-hide-bottom > div > div > div.msp-highlight-toast-wrapper > div > div > div.msp-toast-hide > button';
    const volumeInfoEl = document.querySelector(volumeInfoSelector);
    if (volumeInfoEl) {
      (<HTMLElement>volumeInfoEl).click();
    }
  }
}
