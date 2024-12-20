import { ElementRef } from '@angular/core';
import { signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { chainEntityResidSelection, MolstarResidueInfo, MolstarSelectionObj } from './molstar-helpers';
import { Column } from 'molstar/lib/mol-data/db';
import { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects';
import { StructureQuery } from 'molstar/lib/mol-model/structure/query/query';
import { EmptyLoci, Loci } from 'molstar/lib/mol-model/loci';
import { StructureSelection, StructureProperties, Structure } from 'molstar/lib/mol-model/structure';

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

  public async initMolstar(molstarConfigObject: MolstarConfigObject, molstarContainer?: ElementRef, molstarViewer?: HTMLElement) {
    if (this.molstarViewInstance()) {
      console.error('MOLSTAR INSTANCE EXISTS');
    }
    this.molstarViewInstance.set(new PDBeMolstarPlugin());
    const container = molstarViewer ? molstarViewer : molstarContainer!.nativeElement;
    this.molstarViewInstance().render(container, molstarConfigObject);
    await firstValueFrom(this.molstarViewInstance().events.loadComplete);
  }

  public async updateMolstar(molstarConfigObject: MolstarConfigObject) {
    this.molstarViewInstance().visual.update(molstarConfigObject, true);
    await firstValueFrom(this.molstarViewInstance().events.loadComplete);
  }

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

  public async initImageGallery(entryId: string) {
    const galleryManager = await PDBeMolstarPlugin.extensions.StateGallery.StateGalleryManager.create(this.molstarViewInstance().plugin, entryId);
    this.galleryManager.set(galleryManager);
  }

  public async loadImage(imgName: string) {
    if (imgName) {
      await this.galleryManager().load(imgName);
    }
  }

  public parseInstanceResidues() {
    const assemblyRef = this.molstarViewInstance().plugin!.managers.structure.hierarchy.current.structures[0].cell.transform.ref;
    const structure = (this.molstarViewInstance().plugin!.state.data.select(assemblyRef)[0].obj as PluginStateObject.Molecule.Structure).data;
    if (structure === undefined) return;
    const result: MolstarResidueInfo[] = [];
    for (const unit of structure.units) {
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

  public async focusLoci(molstarSelection: MolstarSelectionObj) {
    const queryLoci = await this.getViewerLoci(molstarSelection);
    await this.molstarViewInstance().plugin!.managers.camera.focusLoci(queryLoci, { durationMs: 300 });
  }

  public async unfocusLoci() {
    await this.molstarViewInstance().visual.reset({ camera: true });
  }

  public async highlightLoci(molstarSelection: MolstarSelectionObj) {
    const queryLoci = await this.getViewerLoci(molstarSelection);
    if (Loci.isEmpty(queryLoci)) return;
    this.molstarViewInstance().plugin.managers.interactivity.lociHighlights.highlightOnly({ loci: queryLoci });
  }

  public async clearHighlightLoci() {
    await this.molstarViewInstance().visual.clearHighlight();
  }

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
