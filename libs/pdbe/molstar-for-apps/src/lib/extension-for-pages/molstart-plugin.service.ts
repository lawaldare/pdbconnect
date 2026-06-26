import { inject, Injectable } from '@angular/core';
import { ScriptLoaderService } from '@pdbc/core';
import type { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';

export type { PDBeMolstarPlugin } from 'pdbe-molstar/lib/viewer';
export type PDBeMolstarPluginClass = typeof PDBeMolstarPlugin;
export type { InitParams } from 'pdbe-molstar/lib/spec';

@Injectable({ providedIn: 'root' })
export class MolstarPluginService {
  private readonly scriptLoader = inject(ScriptLoaderService);
  private PDBeMolstarPluginClass: PDBeMolstarPluginClass | undefined;
  public readonly molstarVersion = '3.12.0'; // TODO: Should be Env var (but CSS version should also be synchronized with JS version)

  async loadPlugin(): Promise<void> {
    if (!this.PDBeMolstarPluginClass) {
      this.PDBeMolstarPluginClass = await this.scriptLoader.loadGlobal(
        `https://cdn.jsdelivr.net/npm/pdbe-molstar@${this.molstarVersion}/build/pdbe-molstar-plugin.js`,
        'PDBeMolstarPlugin'
      );
    }
  }

  createInstance(): PDBeMolstarPlugin {
    if (!this.PDBeMolstarPluginClass) {
      throw new Error('Mol* plugin not loaded yet, await `.loadPlugin()` first.');
    }
    return new this.PDBeMolstarPluginClass();
  }

  getClass(): PDBeMolstarPluginClass {
    if (!this.PDBeMolstarPluginClass) {
      throw new Error('Mol* plugin not loaded yet, await `.loadPlugin()` first.');
    }
    return this.PDBeMolstarPluginClass;
  }
}
