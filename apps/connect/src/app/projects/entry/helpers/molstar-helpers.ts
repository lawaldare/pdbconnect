import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import type { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';
import type { AnyColor, InitParams } from 'pdbe-molstar/lib/spec';

// Check InitParams and DefaultParams at:
// https://github.com/molstar/pdbe-molstar/blob/v3.7.2/src/app/spec.ts

export type QueryParamForHelpers = QueryParam & { color?: AnyColor; sideChain?: boolean; representation?: string; representationColor?: any; focus?: boolean };

export const Molstar370DefaultParams: InitParams = {
  moleculeId: undefined,
  customData: undefined,
  assemblyId: undefined,
  modelId: undefined,
  defaultPreset: 'default',
  ligandView: undefined,
  alphafoldView: false,
  superposition: false,
  superpositionParams: undefined,
  selection: undefined,
  galleryView: false,

  visualStyle: undefined,
  hideStructure: [],
  loadMaps: false,
  mapSettings: undefined,
  bgColor: 'black',
  highlightColor: undefined,
  selectColor: undefined,
  lighting: undefined,

  validationAnnotation: false,
  domainAnnotation: false,
  symmetryAnnotation: false,
  pdbeUrl: 'https://www.ebi.ac.uk/pdbe/',
  encoding: 'bcif',
  lowPrecisionCoords: false,
  selectInteraction: true,
  selectBindings: undefined,
  focusBindings: undefined,
  granularity: undefined,
  subscribeEvents: false,

  hideControls: false,
  hideCanvasControls: [],
  sequencePanel: false,
  leftPanel: true,
  rightPanel: true,
  logPanel: false,
  pdbeLink: true,
  loadingOverlay: false,
  expanded: false,
  landscape: false,
  reactive: false,
  tabs: 'pdbe',
};

/** PDBe Molstar initialization params shared across all Entry Page tabs */
export const EntryPageTabsCommonMolstarParams: InitParams = {
  ...Molstar370DefaultParams,
  granularity: 'residue',
  subscribeEvents: true,
  hideCanvasControls: ['snapshotControls', 'snapshotDescription'],
  sequencePanel: true,
  pdbeLink: false,
  loadingOverlay: true,
};

export async function drawSelectionInMolstar(
  instance?: PDBeMolstarPlugin,
  selectionsToDraw?: QueryParamForHelpers[],
  nonSelectionColor?: string | number,
  keepRepresentations?: boolean
) {
  if (!instance || !selectionsToDraw) return;
  const toDrawData = {
    data: selectionsToDraw,
    nonSelectedColor: nonSelectionColor ? nonSelectionColor : undefined,
    keepRepresentations: keepRepresentations ? keepRepresentations : undefined,
  };
  await instance.visual.select(toDrawData);
}

export async function clearSelectionInMolstar(instance?: PDBeMolstarPlugin, durationMs?: number) {
  if (!instance) return;
  await instance.visual.clearSelection();
  await zoomOutStructureInMolstar(instance, durationMs);
}

export async function zoomOutStructureInMolstar(instance?: PDBeMolstarPlugin, durationMs?: number) {
  if (!instance) return;
  const plugin = instance.plugin ?? null;
  if (!plugin) return;

  await clearInteractivityFocusInMolstar(instance);
  plugin.managers.camera.reset(undefined, durationMs);
}

export async function showInteractivityFocusInMolstar(instance?: PDBeMolstarPlugin, selectionsToDraw?: QueryParamForHelpers[]) {
  if (!instance || !selectionsToDraw) return;
  await instance.visual.interactivityFocus({ data: selectionsToDraw });
}

export async function clearInteractivityFocusInMolstar(instance?: PDBeMolstarPlugin) {
  if (!instance) return;
  const plugin = instance?.plugin ?? null;
  if (!plugin) return;
  plugin.managers.structure.focus.clear();
}

export async function cameraResetInMolstar(instance?: PDBeMolstarPlugin) {
  if (!instance) return;
  const plugin = instance?.plugin ?? null;
  if (!plugin) return;
  plugin.managers.camera.reset(undefined, 100);
}

export async function componentExistsInMolstar(instance?: PDBeMolstarPlugin, query?: string) {
  if (!instance || !query) return;
  const plugin = instance?.plugin ?? null;
  if (!plugin) return;
  const structureData = [plugin.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    for (const comp of s.components) {
      if (comp.key!.includes(query)) {
        return true;
      }
    }
  }
  return false;
}

export async function removeComponent(instance?: PDBeMolstarPlugin, query?: string) {
  if (!instance || !query) return;
  const plugin = instance?.plugin ?? null;
  if (!plugin) return;

  let hasRemoved = false;
  const structureData = [plugin.managers.structure.hierarchy.current.structures[0]];
  for await (const s of structureData) {
    if (s === undefined) continue;
    for (const comp of s.components) {
      if (comp.key!.includes(query)) {
        const builder = plugin.state.data.build();
        builder.delete(comp.cell.transform.ref);
        await builder.commit({ canUndo: false });
        hasRemoved = true;
      }
    }
  }
  return hasRemoved;
}
