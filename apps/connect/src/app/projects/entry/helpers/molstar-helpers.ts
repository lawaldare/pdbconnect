import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';

export async function drawSelectionInMolstar(
  instance?: PDBeMolstarPlugin,
  selectionsToDraw?: QueryParam[],
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

export async function showInteractivityFocusInMolstar(instance?: PDBeMolstarPlugin, selectionsToDraw?: QueryParam[]) {
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

// DONE: Migrate these functions below
// DONE: HostListeners as directives
// SKIP: Refactor tabs to use helpers with a global mutex on compCommunication
// DONE: On Mobile replace current code for helpers
// DONE: Remove molstar-state and visualisation on lib-
// DONE: interactions as QueryParam directly
// DONE: Clean up CompCommunication
// SKIP: API handling desktop vs mobile (too similar)
// DONE: refactor MolSelectionObj functions for QueryParam
// DONE: Remove temp-mol-sel-obj-to-queryparam
// DONE: Fix Protvista bugs (1 done, missing unselect click)
// DONE: Non-observed residues and sequence viewer improvements

// TODO: Protvista refactoring
// TODO: Try angular comp control seq viewer resize
