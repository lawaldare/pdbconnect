import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { ScriptLoaderService } from '@pdbc/core';
import { ComplexStoreState } from '../store/complex-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ComplexSelectors } from '../store/complex.selectors';
import { ComplexAPIService } from './complex-api.service';

declare let PDBeMolstarPlugin: any;

@Injectable({
  providedIn: 'root',
})
export class SuperpositionService {
  private readonly scriptLoaderService = inject(ScriptLoaderService);
  private readonly globalStore = inject(Store<ComplexStoreState>);
  private complexAPIService = inject(ComplexAPIService);
  private readonly destroyRef = inject(DestroyRef);

  public complexData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
  public complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));

  public viewerInstance: any;
  public baseComponents!: string[];
  public baseRfamMappings = {};
  public rfamMappings: any = {};

  public selectedComplexData = signal<string>(this.complexData() ?? ({} as any));
  public selectedComplexId = signal<string>(this.complexId() ?? '');
  private currentComplexData = signal<any>(null);

  public isLoading = signal(false);

  private fetchComplexData(id: string) {
    this.complexAPIService.getSummaryForComplexData(id).subscribe((data) => {
      this.currentComplexData.set(data);
    });
  }

  async loadInitialComplexView(container: HTMLElement): Promise<void> {
    this.isLoading.set(true);
    await this.scriptLoaderService.loadScript('https://molstar.org/pdbe-molstar/build/pdbe-molstar-plugin.js');
    const complexData = this.complexData();
    if (complexData) {
      const { pdb_id, assembly_id } = complexData.representative_structure;
      this.baseComponents = complexData.participants.map((p: any) => p.accession);
      this.baseRfamMappings = await this.getRfamMappings(pdb_id);

      this.viewerInstance = new PDBeMolstarPlugin();

      const defaultOptions = {
        bgColor: 'white',
        sequencePanel: false,
        hideStructure: ['water'],
        hideControls: true,
        hideCanvasControls: ['expand', 'animation', 'controlToggle', 'controlInfo', 'selection', 'trajectory'],
        landscape: true,
      };
      const options = {
        ...defaultOptions,
        moleculeId: pdb_id,
        assemblyId: assembly_id,
        customData: undefined,
      };
      await this.viewerInstance.render(container, options);
      await this.viewerInstance.events.loadComplete.subscribe(() => {
        this.isLoading.set(false);
      });
    }
  }

  private async getRfamMappings(pdbId: string) {
    const url = `https://www.ebi.ac.uk/pdbe/api/nucleic_mappings/${pdbId}`;
    const response = await fetch(url);
    if (!response.ok && response.status !== 404) throw new Error(`API call failed with code ${response.status} (${url})`);
    const js = response.status === 404 ? {} : await response.json();
    const rfamData = js[pdbId]?.Rfam ?? {};

    const result: any = {};
    for (const family of Object.keys(rfamData).sort()) {
      result[family] = rfamData[family].mappings.map((chunk: any) => ({
        entity_id: String(chunk.entity_id),
        struct_asym_id: chunk.struct_asym_id,
        start_residue_number: chunk.start.residue_number,
        end_residue_number: chunk.end.residue_number,
      }));
    }
    return result;
  }

  public async loadComplex(id: string, kind: string) {
    this.fetchComplexData(id);
    this.complexAPIService
      .getSummaryForComplexData(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (data: any) => {
        const { pdb_id, assembly_id } = data.representative_structure;
        const otherComponents = data.participants.map((p: any) => p.accession);
        this.rfamMappings[pdb_id] ??= await this.getRfamMappings(pdb_id);
        const result = await PDBeMolstarPlugin.extensions.Complexes.loadComplexSuperposition(this.viewerInstance, {
          id,
          pdbId: pdb_id,
          assemblyId: assembly_id,
          baseComponents: this.baseComponents,
          otherComponents,
          coloring: kind,
          baseMappings: this.baseRfamMappings,
          otherMappings: this.rfamMappings[pdb_id],
          animationDuration: 500, // optionals
        });
        if (result.superposition) {
          console.log(`Superposed complexes with RMSD ${result.superposition.rmsd} on ${result.superposition.nAlignedElements} residues`, result.superposition);
        } else {
          console.warn(`Failed to superpose complexes`);
        }
      });
  }

  public async deleteComplex(id: string) {
    await this.viewerInstance.deleteStructure(id);
    await this.viewerInstance.visual.reset({ camera: true });
  }
}
