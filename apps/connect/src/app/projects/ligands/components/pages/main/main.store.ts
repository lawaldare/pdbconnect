import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AggregatedApiService, DescriptionData } from '../../../services/aggregated-api.service';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, Observable, of, pipe, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { LigandUtilService } from '../../../ligand-util.service';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';

type MainState = {
  ligandId: string;
  description: DescriptionData;
  downloadOptions: DownloadOption[];
  supercomponents: string[];
  redirectText: string;
  count: number;
};

const initialState: MainState = {
  ligandId: '',
  description: {} as DescriptionData,
  downloadOptions: [],
  supercomponents: [],
  redirectText: '',
  count: 0,
};

export const MainComponentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const aggregatedApiService = inject(AggregatedApiService);
    const dialog = inject(MatDialog);
    const ligandUtilService = inject(LigandUtilService);
    const router = inject(Router);

    return {
      init: rxMethod<string>(
        pipe(
          switchMap((ligandId) => {
            patchState(store, { ligandId });
            let observables: Observable<any>[];
            if (ligandId.startsWith('PRD') || ligandId.startsWith('CLC')) {
              observables = [aggregatedApiService.fetchDescription(ligandId), of(ligandId), of([])];
            } else {
              observables = [
                aggregatedApiService.fetchDescription(ligandId),
                of(ligandId),
                aggregatedApiService.fetchSupercomponents(ligandId).pipe(catchError(() => of([]))),
              ];
            }

            return forkJoin(observables).pipe(
              tapResponse(
                ([descriptionData, ligandId, supercomponents]) => {
                  patchState(store, { count: store.count() + 1 }); // increment count after successful fetch!
                  const processDescriptionData = aggregatedApiService.processDescriptionData(ligandId, descriptionData);

                  if (!processDescriptionData.released && processDescriptionData.superseded_by) {
                    patchState(store, {
                      redirectText: `The chemical component you are trying to view (${ligandId}) has been obsoleted. You have been redirected to the component which superceded it.`,
                    });
                    router.navigate(['/ligands', processDescriptionData.superseded_by]);
                    return;
                  }

                  if (!processDescriptionData.released && processDescriptionData.superseded_by === null) {
                    router.navigate(['/ligands', store.ligandId(), 'unreleased']);
                    patchState(store, { ligandId, description: {} as DescriptionData, downloadOptions: [], supercomponents: [] });
                    return;
                  }

                  //this is to clear the redirect text after navigating away from the redirected page!
                  if (store.count() > 2) {
                    patchState(store, { redirectText: '' });
                  }
                  patchState(store, {
                    description: processDescriptionData,
                    supercomponents,
                    downloadOptions: [
                      { name: 'CIF file', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${ligandId}.cif`, downloadable: true },
                      { name: 'Ideal SDF', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${ligandId}_ideal.sdf`, downloadable: true },
                      { name: 'Model SDF', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${ligandId}_model.sdf`, downloadable: true },
                      { name: 'Model CML', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${ligandId}_model.cml`, downloadable: true },
                    ],
                  });
                },
                (error) => console.error(error)
              )
            );
          })
        )
      ),
      openMolstarDialog() {
        dialog.open(MolstarDialogComponent, {
          disableClose: false,
          panelClass: 'molstarDialog',
          data: {
            moleculeId: store.ligandId(),
            fragments: ligandUtilService.currentFragments,
          },
        });
      },
    };
  })
);
