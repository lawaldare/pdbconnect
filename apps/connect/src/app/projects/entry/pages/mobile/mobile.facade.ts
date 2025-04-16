/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ElementRef, inject, Injectable, signal, Type } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MolstarConfigObject } from '../../helpers/molstar/molstar-base-class';
import { firstValueFrom } from 'rxjs';
import {
  AssembliesRowData,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesRowData,
} from '../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import {
  addRepresentationToComponent,
  chainEntityResidSelection,
  changeComponentVisibility,
  changeRepresentationVisibility,
  createComponent,
  MolstarSelectionObj,
} from '../../helpers/molstar/molstar-helpers';
import {
  LIGANDS_REPR_HIGHLIGHT,
  LIGANDS_REPR_NONSELECTION_POLYMER,
  LIGANDS_REPR_SELECTION,
  MACROMOLECULES_REPR_SELECTION_CARB,
  PROTEIN_REPR_SELECTION,
  REPR_NONSELECTION_BRANCHED,
  REPR_NONSELECTION_LIGAND,
  REPR_NONSELECTION_POLYMER,
} from '../../helpers/molstar/molstar-repr-objects';
import { EmptyLoci, Loci } from 'molstar/lib/mol-model/loci';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { StructureQuery, StructureSelection } from 'molstar/lib/mol-model/structure';

declare let PDBeMolstarPlugin: any;
@Injectable({
  providedIn: 'root',
})
export class MobileFacade {
  public readonly signals = inject(ComponentCommunicationService);

  private _selectedTabName = signal<string>('');
  public selectedTabName = this._selectedTabName.asReadonly();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  private _macromoleculeTitle = signal<string>('Macromolecule');
  public macromoleculeTitle = this._macromoleculeTitle.asReadonly();

  private _ligandTitle = signal<string>('Ligands');
  public ligandTitle = this._ligandTitle.asReadonly();

  private _domainTitle = signal<string>('Ligands');
  public domainTitle = this._domainTitle.asReadonly();

  public molstarViewInstance = signal<any>(undefined);

  public updateSelectedTabName(tabName: string) {
    this._selectedTabName.set(tabName);
  }

  public updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }

  public updateSelectedTitle(title: string) {
    this._macromoleculeTitle.set(title);
  }

  public updateSelectedLigandTitle(title: string) {
    this._ligandTitle.set(title);
  }

  public updateSelectedDomainTitle(title: string) {
    this._domainTitle.set(title);
  }

  public loadSelectionFromTable(tabName: string, rowIdx: number) {
    this.signals.setTabState(tabName, rowIdx);
  }

  public async initializeMolstarViewer(containerRef: ElementRef<any>, entryId: string): Promise<void> {
    const molstarViewInstance = new PDBeMolstarPlugin();

    if (!entryId) return;

    const molstarConfigObject: MolstarConfigObject = {
      moleculeId: entryId,
      loadMaps: false,
      bgColor: { r: 255, g: 255, b: 255 },
      hideControls: true,
      hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
      validationAnnotation: true,
    };

    if (this.molstarViewInstance()) {
      console.error('MOLSTAR INSTANCE EXISTS');
    }

    // Render the Molstar viewer
    this.molstarViewInstance.set(molstarViewInstance);
    const container = containerRef.nativeElement;
    this.molstarViewInstance().render(container, molstarConfigObject);
    await firstValueFrom(this.molstarViewInstance().events.loadComplete);

    // Load validation image if available
    await this.loadValidationImage(this.molstarViewInstance(), entryId);
  }

  private async loadValidationImage(molstarViewInstance: any, entryId: string): Promise<void> {
    const galleryManager = await PDBeMolstarPlugin.extensions.StateGallery.StateGalleryManager.create(molstarViewInstance.plugin, entryId);

    const imageList = galleryManager.images;
    let validationImg: string | undefined;

    for (const img of imageList) {
      if (img.filename.includes('_validation')) {
        validationImg = img.filename;
        break;
      }
    }

    if (validationImg) {
      await galleryManager.load(validationImg);
    } else {
      // this.noImg = true;
    }
  }

  public async updateMolstar(molstarConfigObject: MolstarConfigObject) {
    this.molstarViewInstance().visual.update(molstarConfigObject, true);
    await firstValueFrom(this.molstarViewInstance().events.loadComplete);
  }

  public async renderMolstarAssemblies(entryId: string, datum: AssembliesRowData, reloadConfigObj: boolean) {
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
      await this.updateMolstar(molstarConfigObject);
    }
  }

  public async renderMolstarMQ(entryId: string, reloadConfigObj: boolean) {
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
      await this.updateMolstar(molstarConfigObject);
    }
  }

  public async renderMolstarMacromolecules(entryId: string, datum: MacromoleculesRowData, molstarSelection: MolstarSelectionObj, reloadConfigObj: boolean) {
    // we close the Ligands & Envs tab molstar modal if it exists
    // this.closeVolumeInfo();

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
      await this.updateMolstar(molstarConfigObject);
    }
    // view customization functions called on first rendering
    // if (this.isFirstViewRender === true) {
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
    // this.isFirstViewRender = false;
    // } else {
    // remove current macromolecule view if previously rendered
    // await removeComponent(this.molstarViewInstance(), `structure-component-static-macromolecule`);
    // }
    // finally create macromolecule component with selected representation according to carbohydrate or others
    const reprSelection = moleculeType.includes('carbohydrate') ? MACROMOLECULES_REPR_SELECTION_CARB : PROTEIN_REPR_SELECTION;
    await createComponent(this.molstarViewInstance(), `structure-component-static-macromolecule`, molstarSelection, reprSelection);
    // focus camera on macromolecule
    await this.focusLoci(molstarSelection);
  }

  public async renderMolstarLigands(entryId: string, datum: LigandsRowData, molstarSelection: MolstarSelectionObj, reloadConfigObj: boolean) {
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
      await this.updateMolstar(molstarConfigObject);
    }

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

  public async renderMolstarDomains(entryId: string, datum: DomainsRowData, reloadConfigObj: boolean) {
    // we close the Ligands & Envs tab molstar modal if it exists
    // this.closeVolumeInfo();

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
      await this.updateMolstar(molstarConfigObject);
    }

    // view customization functions called on first rendering
    // set representations of anything other than selected macromolecule to non selection
    await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-polymer', REPR_NONSELECTION_POLYMER, true);
    await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-ligand', REPR_NONSELECTION_LIGAND, true);
    await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-non-standard', REPR_NONSELECTION_LIGAND, true);
    await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-branched', REPR_NONSELECTION_BRANCHED, true);
    await addRepresentationToComponent(this.molstarViewInstance(), 'structure-component-static-branched', REPR_NONSELECTION_LIGAND, false);
    // remove current macromolecule view if previously rendered
    // await removeComponent(this.molstarViewInstance(), `structure-component-static-domains`);
    // finally create domain component with selected representation
    await createComponent(this.molstarViewInstance(), `structure-component-static-domains`, molstarSelection, PROTEIN_REPR_SELECTION);
    // focus camera on domain
    await this.focusLoci(molstarSelection);
  }

  public async focusLoci(molstarSelection: MolstarSelectionObj) {
    const queryLoci = await this.getViewerLoci(molstarSelection);
    await this.molstarViewInstance().plugin!.managers.camera.focusLoci(queryLoci, { durationMs: 300 });
  }

  private async getViewerLoci(molstarSelection: MolstarSelectionObj) {
    const residueData = chainEntityResidSelection(molstarSelection);
    const residueQueryLoci = residueData.queryLoci;

    let queryLoci: Loci = EmptyLoci;
    const assemblyRef = this.molstarViewInstance().plugin?.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
    if (assemblyRef !== '') {
      const data = (this.molstarViewInstance().plugin?.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
      if (data) {
        const sel = StructureQuery.run(residueQueryLoci, data);
        queryLoci = StructureSelection.toLociWithSourceUnits(sel);
      }
    }
    return queryLoci;
  }
}
