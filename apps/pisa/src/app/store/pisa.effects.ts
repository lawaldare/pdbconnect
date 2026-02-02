/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';
import { PisaActions } from './pisa.actions';
import { catchError, filter, forkJoin, from, map, mergeMap, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { PisaApiService } from '../services/pisa-api.service';
import { Router } from '@angular/router';
import { PisaSelectors } from './pisa.selectors';
import { UploadPageFacade } from '../components/upload-page/uploade-page.facade';
import { PisaUtilService } from '../services/pisa-util.service';
import { PisaFileStoreService } from '../services/pisa-file-store.service';

@Injectable()
export class PisaEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<PisaStoreState>);
  private readonly pisaAPIService = inject(PisaApiService);
  private readonly router = inject(Router);
  private facade = inject(UploadPageFacade);
  private pisaUtilService = inject(PisaUtilService);
  private pisaFileStoreService = inject(PisaFileStoreService);

  submitJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.submitPISAJob),
      switchMap((action) =>
        from(this.pisaFileStoreService.get(action.payload.fileKey)).pipe(
          switchMap((file) => {
            if (!file) {
              return of(PisaActions.submitPISAJobFailure());
            }

            return this.pisaAPIService
              .submitJobFile(file, {
                exclude_ligands: action.payload.exclude_ligands,
                ligand_position: action.payload.ligand_position,
                asis: action.payload.asis,
                fileName: action.payload.fileName,
              })
              .pipe(
                map((response) => PisaActions.submitPISAJobSuccess({ jobId: response.job_id })),
                catchError((error) => {
                  // this.pisaUtilService.setPageView('ERROR');
                  console.error('submitJob failed:', error);

                  // this.router.navigate(['/processing'], { queryParamsHandling: 'preserve' });
                  // this.store.dispatch(PisaActions.submitPISAJobSuccess({ jobId: '60462b075dfef88f8334dfad33b24684' }));
                  return of(PisaActions.submitPISAJobFailure());
                })
              );
          })
        )
      )
    )
  );

  getResultsFromJobId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.getResultsFromJobId),
      switchMap(({ jobId }) => {
        return forkJoin({
          assemblyResults: this.pisaAPIService.getAssemblyResults(jobId),
          interfaceResults: this.pisaAPIService.getInterfaceResults(jobId),
        }).pipe(
          switchMap(({ assemblyResults, interfaceResults }) => [
            PisaActions.getInterfaceResultForJobIdSuccess({ interfaceResults }),
            PisaActions.getAssemblyResultForJobIdSuccess({ assemblyResults }),
            PisaActions.assemblyAndInterfaceResultsCollectedForJobId(),
          ]),
          catchError((err) => {
            console.error('getAssemblyResults failed:', err);
            return of(PisaActions.assemblyAndInterfaceResultsCollectedForJobIdFailure());
          })
        );
      })
    )
  );

  getResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.submitPISAJobSuccess),
      switchMap(({ jobId }) => {
        return forkJoin({
          assemblyResults: this.pisaAPIService.getAssemblyResults(jobId),
          interfaceResults: this.pisaAPIService.getInterfaceResults(jobId),
        }).pipe(
          switchMap(({ assemblyResults, interfaceResults }) => [
            PisaActions.getInterfaceResultForJobIdSuccess({ interfaceResults }),
            PisaActions.getAssemblyResultForJobIdSuccess({ assemblyResults }),
            PisaActions.assemblyAndInterfaceResultsCollectedForJobId(),
          ]),
          catchError((err) => {
            console.error('getAssemblyResults failed:', err);
            return of(PisaActions.assemblyAndInterfaceResultsCollectedForJobIdFailure());
          })
        );
      })
    )
  );

  navigateOnResultsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PisaActions.assemblyAndInterfaceResultsCollectedForJobIdFailure),
        tap(() => {
          this.router.navigate(['/processing'], { queryParamsHandling: 'preserve' });
          this.pisaUtilService.setPageView('ERROR');
        })
      ),
    { dispatch: false }
  );

  navigateAfterResultsSaved$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PisaActions.assemblyAndInterfaceResultsCollectedForJobId),
        tap(() => {
          this.router.navigate(['/assemblies'], { queryParamsHandling: 'preserve' });
        })
      ),
    { dispatch: false }
  );

  getInterfaceTypeData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.setInterfaceTypeIDForSelectedInterface),
      withLatestFrom(this.store.select(PisaSelectors.interfaceResults).pipe(filter(Boolean))),
      switchMap(([action, interfaceResults]) => {
        const interfaceTypeData = interfaceResults.interface_types.find((type: any) => type.int_type === action.interfaceTypeId);
        return of(PisaActions.setInterfaceTypeDataForSelectedInterface({ interfaceTypeData }));
      })
    )
  );

  getInterfaceResultForInterfaceIdForComplexesTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.getInterfaceResultForInterfaceIdForComplexesTab),
      switchMap((action: { interfaceId: string }) => forkJoin([of(action), this.store.select(PisaSelectors.jobId).pipe(take(1))])),
      mergeMap(([action, jobId]) =>
        forkJoin([
          this.pisaAPIService.getInterfaceResultForInterfaceId(jobId, action.interfaceId),
          this.pisaAPIService.getExtendedInterfaceResultForInterfaceId(jobId),
        ]).pipe(
          map(([interfaceResult, extended]) => {
            const results = interfaceResult.interface.molecules.map((molecule: any) => {
              const extendedData = extended.components.find((ext: any) => ext.mol_id === molecule.mol_id);
              return { ...molecule, extendedData };
            });
            interfaceResult.interface.molecules = results;
            return PisaActions.getInterfaceResultForInterfaceIdForComplexesTabSuccess({ interfaceResultForInterfaceIdComplexesTab: interfaceResult });
          }),
          catchError(() => {
            return of(PisaActions.getInterfaceResultForInterfaceIdForComplexesTabFailure());
          })
        )
      )
    )
  );

  getInterfaceResultForInterfaceIdForInterfacesTab$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.getInterfaceResultForInterfaceIdForInterfacesTab),
      switchMap((action: { interfaceId: string }) => forkJoin([of(action), this.store.select(PisaSelectors.jobId).pipe(take(1))])),
      mergeMap(([action, jobId]) =>
        forkJoin([
          this.pisaAPIService.getInterfaceResultForInterfaceId(jobId, action.interfaceId),
          this.pisaAPIService.getExtendedInterfaceResultForInterfaceId(jobId),
        ]).pipe(
          map(([interfaceResult, extended]) => {
            const results = interfaceResult.interface.molecules.map((molecule: any) => {
              const extendedData = extended.components.find((ext: any) => ext.mol_id === molecule.mol_id);
              return { ...molecule, extendedData };
            });
            // interfaceResult.interface.molecules = results;
            const enrichedInterfaceResult = {
              ...interfaceResult,
              interface: {
                ...interfaceResult.interface,
                molecules: results,
              },
            };

            return PisaActions.getInterfaceResultForInterfaceIdForInterfacesTabSuccess({ interfaceResultForInterfaceIdInterfacesTab: enrichedInterfaceResult });
          }),
          catchError(() => {
            return of(PisaActions.getInterfaceResultForInterfaceIdForInterfacesTabFailure());
          })
        )
      )
    )
  );
}
