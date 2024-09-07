import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AggregatedApiService, DescriptionData } from '../../../services/aggregated-api.service';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { LigandUtilService } from '../../../ligand-util.service';
import { tapResponse } from '@ngrx/operators';

type MainState = {
  ligandId: string;
  description: DescriptionData;
  downloadOptions: DownloadOption[];
  supercomponents: string[];
};

const initialState: MainState = {
  ligandId: '',
  description: {} as DescriptionData,
  downloadOptions: [],
  supercomponents: [],
};

export const MainComponentStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const aggregatedApiService = inject(AggregatedApiService);
    const dialog = inject(MatDialog);
    const ligandUtilService = inject(LigandUtilService);

    return {
      init: rxMethod<string>(
        pipe(
          switchMap((ligandId) => {
            patchState(store, { ligandId });
            return forkJoin([
              aggregatedApiService.fetchDescription(ligandId),
              aggregatedApiService.fetchDownload(ligandId).pipe(catchError(() => of({}))),
              aggregatedApiService.fetchSupercomponents(ligandId).pipe(catchError(() => of([]))),
              of(ligandId),
            ]).pipe(
              tapResponse(
                ([descriptionData, downloadData, supercomponents, ligandId]) => {
                  const processDescriptionData = aggregatedApiService.processDescriptionData(ligandId, descriptionData);
                  const processDownloadData = aggregatedApiService.processDownloadData(ligandId, downloadData);
                  patchState(store, {
                    description: processDescriptionData,
                    supercomponents,
                    downloadOptions: [
                      { name: 'CIF file', url: processDownloadData.cif, downloadable: true },
                      { name: 'Ideal SDF', url: processDownloadData.idealSDF, downloadable: true },
                      { name: 'Model SDF', url: processDownloadData.modelSDF, downloadable: true },
                      { name: 'Model CML', url: processDownloadData.modelCML, downloadable: true },
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
            fragments: ligandUtilService.fragments,
          },
        });
      },
    };
  })
);
