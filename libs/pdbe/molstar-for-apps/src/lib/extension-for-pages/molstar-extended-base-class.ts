import { ElementRef } from '@angular/core';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { chainEntityResidSelection, MolstarResidueInfo, MolstarSelectionObj } from './utils/molstar-core-manipulation.util';
import { Column } from 'molstar/lib/mol-data/db';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { StructureQuery } from 'molstar/lib/mol-model/structure/query/query';
import { EmptyLoci, Loci } from 'molstar/lib/mol-model/loci';
import { Structure, StructureSelection } from 'molstar/lib/mol-model/structure';

/**
 * This file contains a base class with helper functions for manipulating Molstar
 *
 * Ideally these will be eventually migrated into Molstar
 */

declare let PDBeMolstarPlugin: any;

/**
 * This configuration object corresponds to configs used in:
 * https://github.com/molstar/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin#plugin-parameters-options
 */
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
  validationAnnotation?: boolean;
  symmetryAnnotation?: boolean;
}

/**
 * Helper function useful for parsing Molstar instance residues
 */
function getValue<T>(column: Column<T>, iRow: number): T | null {
  if (column.valueKind(iRow) === Column.ValueKind.Present) {
    return column.value(iRow);
  } else {
    return null;
  }
}

export class MolstarBaseClass {
  public molstarViewInstance = signal<any>(undefined);
  public galleryManager = signal<any>(undefined);
  public residues = signal<MolstarResidueInfo[]>([]);
  public cameraDuration = 1200; // in ms (1200 = 1.2 sec)

  /**
   * Function triggers PDBe Molstar visualisation initialization and saves this instance to
   * molstarViewInstance signal
   * @param molstarConfigObject
   * @param molstarContainer
   * @param molstarViewer
   */
  public async initMolstar(molstarConfigObject: MolstarConfigObject, molstarContainer?: ElementRef, molstarViewer?: HTMLElement) {
    if (this.molstarViewInstance()) {
      console.error('MOLSTAR INSTANCE EXISTS');
    }
    this.molstarViewInstance.set(new PDBeMolstarPlugin());
    const container = molstarViewer ? molstarViewer : molstarContainer?.nativeElement;
    this.molstarViewInstance().render(container, molstarConfigObject);
    await firstValueFrom(this.molstarViewInstance().events.loadComplete);
  }

  /**
   * Function triggers PDBe Molstar visualisation update without the need of
   * destroying and creating a new Molstar instance
   * @param molstarConfigObject
   */
  public async updateMolstar(molstarConfigObject: MolstarConfigObject) {
    this.molstarViewInstance().visual.update(molstarConfigObject, true);
    await firstValueFrom(this.molstarViewInstance().events.loadComplete);
  }

  public async initOrUpdateMolstar(molstarConfigObject: MolstarConfigObject, molstarContainer?: ElementRef, molstarViewer?: HTMLElement) {
    if (this.molstarViewInstance()) {
      this.updateMolstar(molstarConfigObject);
    } else {
      this.initMolstar(molstarConfigObject, molstarContainer, molstarViewer);
    }
  }

  /**
   * Function allows manually hiding PDBe Molstar buttons that are usually displayed
   * NOTE:
   * Should soon be unnecessary in future PDBe Molstar updates
   */
  public buttonsShowHide() {
    const btnToContent = {
      animation: 'Select Animation',
      screenshot: 'Screenshot / State Snapshot',
      controlToggle: 'Toggle Controls Panel',
      selection: 'Toggle Selection Mode',
      controlInfo: 'Settings / Controls Info',
    };
    for (const [_currentBtn, contentKey] of Object.entries(btnToContent)) {
      const currentBtnEle = <HTMLInputElement>document.querySelector(`button[title="${contentKey}"]`);
      if (!currentBtnEle) continue;
      currentBtnEle.style.display = 'none';
    }
  }

  /**
   * Function initializes MolstarImageGallery for loading images
   * NOTE:
   * Usage of MolstarImageGallery should eventually be replaced by MolViewSpec
   * @param entryId: PDB entry identifier
   */
  public async initImageGallery(entryId: string) {
    const galleryManager = await PDBeMolstarPlugin.extensions.StateGallery.StateGalleryManager.create(this.molstarViewInstance().plugin, entryId);
    this.galleryManager.set(galleryManager);
  }

  /**
   * Function loads image from MolstarImageGallery using image name
   * @param imgName
   */
  public async loadImage(imgName: string) {
    if (imgName) {
      await this.galleryManager().load(imgName);
    }
  }

  /**
   * Function parses which residues are currently present in a Molstar instance
   * and saves this data in the residues signal
   * @returns
   */
  public parseInstanceResidues() {
    // first we get structure object
    const assemblyRef = this.molstarViewInstance().plugin?.managers?.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
    const structure = (this.molstarViewInstance().plugin?.state?.data?.select(assemblyRef)[0]?.obj as PluginStateObject.Molecule.Structure)?.data;
    if (structure === undefined) return;
    const result: MolstarResidueInfo[] = [];
    // we then iterate over elements of this object and retrieve residue data
    for (const unit of structure.units ?? []) {
      const h = unit.model.atomicHierarchy;
      let lastIRes = -1;
      for (let i = 0; i < unit.elements.length; i++) {
        const iAtom = unit.elements[i];
        const iChain = h.chainAtomSegments.index[iAtom];
        const iRes = h.residueAtomSegments.index[iAtom];
        if (iRes === lastIRes) continue;
        lastIRes = iRes;
        result.push({
          label_entity_id: getValue(h.chains.label_entity_id, iChain),
          label_asym_id: getValue(h.chains.label_asym_id, iChain),
          auth_asym_id: getValue(h.chains.auth_asym_id, iChain),
          label_seq_id: getValue(h.residues.label_seq_id, iRes),
          auth_seq_id: getValue(h.residues.auth_seq_id, iRes),
          pdbx_PDB_ins_code: getValue(h.residues.pdbx_PDB_ins_code, iRes),
          label_comp_id: getValue(h.atoms.label_comp_id, iAtom),
          auth_comp_id: getValue(h.atoms.auth_comp_id, iAtom),
        });
      }
    }
    this.residues.set(result);
  }

  /**
   * Function triggers Molstar focus on specific selection
   * @param molstarSelection: MolstarSelectionObj (helpful interface for selecting in Molstar)
   */
  public async focusLoci(molstarSelection: MolstarSelectionObj) {
    const queryLoci = await this.getViewerLoci(molstarSelection);
    await this.molstarViewInstance()?.plugin?.managers?.camera?.focusLoci(queryLoci, { durationMs: this.cameraDuration });
  }
  /**
   * Function triggers Molstar focus on whole current structure
   */
  public async focusStructure() {
    const assemblyRef = this.molstarViewInstance().plugin?.managers?.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
    const structure = (this.molstarViewInstance().plugin?.state?.data?.select(assemblyRef)[0]?.obj as PluginStateObject.Molecule.Structure)?.data;
    const structureLoci = Structure.toStructureElementLoci(structure);
    await this.molstarViewInstance()?.plugin?.managers?.camera?.focusLoci(structureLoci, { durationMs: this.cameraDuration });
  }

  /**
   * Function triggers clearing of Molstar focus (resets camera position)
   */
  public async unfocusLoci() {
    await this.molstarViewInstance().visual.reset({ camera: true });
  }

  /**
   * Function triggers Molstar highlight (hovering over selection)
   * @param molstarSelection: MolstarSelectionObj (helpful interface for selecting in Molstar)
   * @returns
   */
  public async highlightLoci(molstarSelection: MolstarSelectionObj) {
    const queryLoci = await this.getViewerLoci(molstarSelection);
    if (Loci.isEmpty(queryLoci)) return;
    this.molstarViewInstance().plugin.managers.interactivity.lociHighlights.highlightOnly({ loci: queryLoci });
  }

  /**
   * Function triggers clearing of Molstar highlight (hovering over selection)
   */
  public async clearHighlightLoci() {
    await this.molstarViewInstance().visual.clearHighlight();
  }

  /**
   * Function allows retrieving a Loci object from a MolstarSelection Obj
   * This is needed for focusLoci and highlightLoci
   * @param molstarSelection: MolstarSelectionObj (helpful interface for selecting in Molstar)
   * @returns Loci object
   */
  private async getViewerLoci(molstarSelection: MolstarSelectionObj) {
    const residueData = chainEntityResidSelection(molstarSelection);
    const residueQueryLoci = residueData.queryLoci;

    let queryLoci: Loci = EmptyLoci;
    const assemblyRef = this.molstarViewInstance().plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
    if (assemblyRef !== '') {
      const data = (this.molstarViewInstance().plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
      if (data) {
        const sel = StructureQuery.run(residueQueryLoci, data);
        queryLoci = StructureSelection.toLociWithSourceUnits(sel);
      }
    }
    return queryLoci;
  }
}
