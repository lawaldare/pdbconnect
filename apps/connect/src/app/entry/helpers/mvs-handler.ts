import { SingleAsyncQueue } from '@pdbc/core';
import type { MolstarComponent, PDBeMolstarPlugin } from '@pdbe-lib/molstar-for-apps';
import { environment } from '../../../environments/environment';
import { MVSSnapshotProvider } from './mvs-views/mvs-snapshot-provider';
import type { SnapshotSpec } from './mvs-views/mvs-snapshot-types';

const MVS_TRANSITION_DURATION_MS = 600;

/** Helper for creating MVS snapshots and loading them to MolstarComponent. Can only be created after MolstarComponent has been initialized (getPDBeMolstarPluginClass and getInstance are ready). */
export type MVSHandler = ReturnType<typeof MVSHandler>;
export function MVSHandler(molstarComponent: MolstarComponent | undefined) {
  if (!molstarComponent) throw new Error('AssertionError: molstarComponent is undefined.');
  const PDBeMolstarPlugin = molstarComponent.getPDBeMolstarPluginClass();
  const instance = molstarComponent.getInstance();
  if (!instance) throw new Error('AssertionError: molstarComponent.getInstance not initialized yet.');

  const mvsQueue = new SingleAsyncQueue();
  const mvsSnapshotProvider = createMVSSnapshotProvider(PDBeMolstarPlugin);

  return {
    loadMVSSnapshotSpec(mvsSnapshotSpec: SnapshotSpec | undefined) {
      if (!mvsSnapshotSpec) return;
      mvsQueue.enqueue(async () => {
        const mvs = mvsSnapshotProvider.getSnapshot(mvsSnapshotSpec, { transitionDurationMs: MVS_TRANSITION_DURATION_MS });
        await molstarComponent.mutex.run(() => PDBeMolstarPlugin.extensions.MVS.loadMVS(instance.plugin, mvs, { keepCameraOrientation: true }));
      });
    },
  };
}

function createMVSSnapshotProvider(PDBeMolstarPlugin_: typeof PDBeMolstarPlugin) {
  const baseUrl = environment.baseUrl;
  return new MVSSnapshotProvider(PDBeMolstarPlugin_.extensions.MVS.MVSData, {
    PdbStructureFormat: 'bcif',
    PdbStructureUrlTemplate: `${baseUrl}pdbe/entry-files/download/{pdb}.bcif`, // Ensure this is the same as PDBe Molstar's default (to avoid downloading the same file from different URLs and bypassing browser cache)
  });
}
