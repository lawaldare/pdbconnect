import { Structure } from 'molstar/lib/mol-model/structure/structure/structure';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';

export async function drawSelectionInMolstar(instance?: PDBeMolstarPlugin, selectionsToDraw?: QueryParam[], nonSelectionColor?: string | number) {
  if (!instance || !selectionsToDraw) return;
  const toDrawData = {
    data: selectionsToDraw,
    nonSelectedColor: nonSelectionColor ? nonSelectionColor : undefined,
  };
  await instance.visual.select(toDrawData);
}

export async function clearSelectionInMolstar(instance?: PDBeMolstarPlugin, durationMs?: number) {
  if (!instance) return;
  await instance.visual.clearSelection();
  // await this.onZoomOut(this.zoomOutDuration);
  await zoomOutStructureInMolstar(instance, durationMs);
}

export async function zoomOutStructureInMolstar(instance?: PDBeMolstarPlugin, durationMs?: number) {
  if (!instance) return;
  const plugin = instance.plugin ?? null;
  if (!plugin) return;

  await clearInteractivityFocusInMolstar(instance);

  const assemblyRef = plugin.managers.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
  const structure = plugin.state.data?.select(assemblyRef)[0]?.obj?.data;
  const structureLoci = structure ? Structure.toStructureElementLoci(structure) : null;

  structureLoci && plugin.managers.camera?.focusLoci(structureLoci, { durationMs });
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

// DONE: Migrate these functions below
// DONE: HostListeners as directives
// SKIP: Refactor tabs to use helpers with a global mutex on compCommunication
// DONE: On Mobile replace current code for helpers
// DONE: Remove molstar-state and visualisation on lib-
// DONE: interactions as QueryParam directly

// TODO: refactor MolSelectionObj functions for QueryParam
// TODO: Remove temp-mol-sel-obj-to-queryparam
// TODO: Clean up CompCommunication
// TODO: API handling desktop vs mobile
// TODO: Fix Protvista bugs
// TODO: Protvista refactoring
