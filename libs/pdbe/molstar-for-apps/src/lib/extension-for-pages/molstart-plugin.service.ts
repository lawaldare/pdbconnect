import { inject, Injectable } from '@angular/core';
import { ScriptLoaderService } from '@pdbc/core';

@Injectable({ providedIn: 'root' })
export class MolstarPluginService {
  private readonly scriptLoader = inject(ScriptLoaderService);
  public PDBeMolstarPluginClass: any;
  private molstarVersion = '3.10.1'; // TODO: Should be Env var

  async loadPlugin(): Promise<void> {
    if (!this.PDBeMolstarPluginClass) {
      this.PDBeMolstarPluginClass = await this.scriptLoader.loadGlobal(
        // `https://cdn.jsdelivr.net/npm/pdbe-molstar@${this.molstarVersion}/build/pdbe-molstar-plugin.js`,
        `http://127.0.0.1:8080/tmp/pdbe-molstar-plugin-3.10.1-mvs-volume-streaming.js`, // TODO: revert to above once MVS VolumeStreaming in PDBe Molstar
        'PDBeMolstarPlugin'
      );
    }
  }

  createInstance() {
    if (!this.PDBeMolstarPluginClass) {
      throw new Error('Mol* plugin not loaded yet');
    }
    return new this.PDBeMolstarPluginClass();
  }

  getClass(): any {
    return this.PDBeMolstarPluginClass;
  }
}
