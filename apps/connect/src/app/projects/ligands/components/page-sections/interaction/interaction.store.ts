import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { PDBIntxData } from '../../../data-models/interaction.model';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

type MainState = {
  ligandId: string;
  interaction: PDBIntxData;
  ligandInstances: number;
  pdbstructures: number;
  pdbchains: number;
};

const initialState: MainState = {
  ligandId: '',
  interaction: {},
  ligandInstances: 0,
  pdbstructures: 0,
  pdbchains: 0,
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
            return aggregatedApiService.fetchDepiction(ligandId).pipe();
          })
        )
      ),
    };
  })
);
