import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { PDBIntxData } from '../../../data-models/interaction.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { ElementRef, inject, Renderer2 } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { forkJoin, mergeMap, pipe, switchMap } from 'rxjs';
import { Depiction } from '../../../data-models/structure.model';

type MainState = {
  ligandId: string;
  interaction: PDBIntxData;
  ligandInstances: number;
  pdbstructures: number;
  pdbchains: number;
  imageContainer: ElementRef | null;
  ligandEv: any;
  renderer: Renderer2 | null;
};

const initialState: MainState = {
  ligandId: '',
  interaction: {},
  ligandInstances: 0,
  pdbstructures: 0,
  pdbchains: 0,
  imageContainer: null,
  ligandEv: null,
  renderer: null,
};

export const InteractionComponentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const aggregatedApiService = inject(AggregatedApiService);

    return {
      init: rxMethod<string>(
        pipe(
          switchMap((ligandId) => {
            patchState(store, { ligandId });
            return aggregatedApiService.fetchDepiction(ligandId).pipe(
              mergeMap((depiction: Depiction) => {
                // createLigandEnvironment(depiction);
                return forkJoin([aggregatedApiService.fetchIntxData(store.ligandId()), aggregatedApiService.fetchLigandStructures(store.ligandId())]);
              })
            );
          })
        )
      ),
      fetchImageContainer(imageContainer: ElementRef, renderer: Renderer2): void {
        patchState(store, { imageContainer, renderer });
      },
      createLigandEnvironment(prop: Depiction): void {
        const ligand = store.renderer()?.createElement('pdb-ligand-env');
        store.renderer()?.appendChild(store.imageContainer(), ligand);
        store.renderer()?.setProperty(ligand, 'depiction', prop);
        patchState(store, { ligandEv: ligand });
      },
    };
  })
);
