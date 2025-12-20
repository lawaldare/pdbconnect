/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';
import { PisaActions } from './pisa.actions';
import { catchError, EMPTY, forkJoin, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { PisaApiService } from '../services/pisa-api.service';
import { Router } from '@angular/router';
import { PisaSelectors } from './pisa.selectors';
import { ASSEMBLY_RESPONSE, SINGLE_INTERFACE_RESPONSE } from '../services/dummy-data';
import { UploadPageFacade } from '../components/upload-page/uploade-page.facade';
import { PisaUtilService } from '../services/pisa-util.service';

@Injectable()
export class PisaEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<PisaStoreState>);
  private readonly pisaAPIService = inject(PisaApiService);
  private readonly router = inject(Router);
  private facade = inject(UploadPageFacade);
  private pisaUtilService = inject(PisaUtilService);

  submitJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.submitPISAJob),
      mergeMap((action) => {
        return this.pisaAPIService.submitJob(action.payload).pipe(
          map((response) => {
            const jobId = response.job_id;
            // PisaActions.submitPISAJobSuccess({ jobId });
            // this.router.navigate(['/tables']);
            return PisaActions.submitPISAJobSuccess({ jobId });
          }),
          catchError(() => {
            // this.facade.showError('Failed to submit PISA analysis. Please try again.');
            // this.pisaUtilService.setPageView('ERROR');

            this.store.dispatch(PisaActions.submitPISAJobSuccess({ jobId: '60462b075dfef88f8334dfad33b24684' }));
            // this.router.navigate(['/tables']);
            return of(PisaActions.submitPISAJobFailure());
          })
        );
      })
    )
  );

  navigateOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PisaActions.submitPISAJobSuccess),
        tap(() => this.router.navigate(['/tables'], { queryParamsHandling: 'preserve' }))
      ),
    { dispatch: false }
  );

  getAssemblyResults$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.submitPISAJobSuccess),
      switchMap(() => this.store.select(PisaSelectors.jobId).pipe(take(1))),
      mergeMap((jobId: string) =>
        this.pisaAPIService.getAssemblyResults(jobId).pipe(
          map((assemblyResults) => PisaActions.getAssemblyResultForJobIdSuccess({ assemblyResults })),
          catchError(() => {
            // this.store.dispatch(PisaActions.getAssemblyResultForJobIdSuccess({ assemblyResults: ASSEMBLY_RESPONSE }));
            return of(PisaActions.getAssemblyResultForJobIdFailure());
          })
        )
      )
    )
  );

  getInterfaceResultForInterfaceId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PisaActions.getInterfaceResultForInterfaceId),
      switchMap((action: { interfaceId: string }) => forkJoin([of(action), this.store.select(PisaSelectors.jobId).pipe(take(1))])),
      mergeMap(([action, jobId]) =>
        forkJoin([
          this.pisaAPIService.getInterfaceResultForInterfaceId(jobId, action.interfaceId),
          this.pisaAPIService.getExtendedInterfaceResultForInterfaceId(jobId, action.interfaceId),
        ]).pipe(
          map(([interfaceResult, extended]) => {
            // console.log('Extended interface result:', extended);
            // console.log('Interface molecules:', interfaceResult.interface.molecules);
            const results = interfaceResult.interface.molecules.map((molecule: any) => {
              const extendedData = extended.components.find((ext: any) => ext.mol_id === molecule.mol_id);
              return { ...molecule, extendedData };
            });
            interfaceResult.interface.molecules = results;
            return PisaActions.getInterfaceResultForInterfaceIdSuccess({ interfaceResultForInterfaceId: interfaceResult });
          }),
          catchError(() => {
            // this.store.dispatch(PisaActions.getInterfaceResultForInterfaceIdSuccess({ interfaceResultForInterfaceId: SINGLE_INTERFACE_RESPONSE }));
            return of(PisaActions.getAssemblyResultForJobIdFailure());
          })
        )
      )
    )
  );
}
