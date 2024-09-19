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
                  const processDescriptionData = aggregatedApiService.processDescriptionData(ligandId, descriptionData);
                  // const processDownloadData = aggregatedApiService.processDownloadData(ligandId, downloadData);
                  patchState(store, {
                    description: processDescriptionData,
                    supercomponents,
                    downloadOptions: [
                      // { name: 'CIF file', url: processDownloadData.cif, downloadable: true },
                      // { name: 'Ideal SDF', url: processDownloadData.idealSDF, downloadable: true },
                      // { name: 'Model SDF', url: processDownloadData.modelSDF, downloadable: true },
                      // { name: 'Model CML', url: processDownloadData.modelCML, downloadable: true },
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
