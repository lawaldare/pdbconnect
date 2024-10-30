import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AggregatedApiService } from '../services/aggregated-api.service';
import { Store } from '@ngrx/store';
import { LigandStoreState } from './ligand.model';
import { LigandActions } from './ligand.actions';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { LigandSelectors } from './ligand.selectors';
import { RelatedLigand } from '../data-models/related-ligands.model';
import { LoadingState } from '../enums/loading-state.enum';
import { LigandReleasedStatus } from '../enums/ligand-release.enum';

@Injectable()
export class LigandEffects {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<LigandStoreState>);

  getStructures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LigandActions.getStructures),
      switchMap(() => this.store.select(LigandSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandStructures(id).pipe(
          map((structures) => LigandActions.getStructuresSuccess({ structures })),
          catchError(() => of(LigandActions.getStructuresFailure()))
        )
      )
    )
  );

  getSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LigandActions.getSummary),
      tap(() => this.store.dispatch(LigandActions.toggleLoader({ status: LoadingState.LOADING }))),
      switchMap(() => this.store.select(LigandSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandSummary(id).pipe(
          mergeMap((summary) => {
            this.store.dispatch(LigandActions.getSummarySuccess({ summary }));
            this.store.dispatch(
              LigandActions.setDescription({
                description: { ...this.aggregatedApiService.processDescriptionData(summary), ligandId: id },
              })
            );
            if (summary.release_status.toUpperCase() !== LigandReleasedStatus.HOLD) {
              return of(LigandActions.toggleLoader({ status: LoadingState.SUCCESS }));
            } else {
              return of(LigandActions.toggleLoader({ status: LoadingState.FAILURE }));
            }
          }),
          catchError(() => {
            this.store.dispatch(LigandActions.toggleLoader({ status: LoadingState.FAILURE }));
            const text = `Error occurred while fetching data for ${id}. Please check the ligand ID and try again.`;
            this.store.dispatch(LigandActions.setEmptyPageText({ text }));
            return of(LigandActions.getSummaryFailure());
          })
        )
      )
    )
  );

  getRelatedLigands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LigandActions.getRelatedLigands),
      switchMap(() => this.store.select(LigandSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getRelatedLigands(id).pipe(
          map((relatedLigands: RelatedLigand) => {
            return LigandActions.getRelatedLigandsSuccess({ relatedLigands });
          }),
          catchError(() => of(LigandActions.getRelatedLigandsFailure()))
        )
      )
    )
  );

  getSupercomponents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LigandActions.getSupercomponents),
      switchMap(() => this.store.select(LigandSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.fetchSupercomponents(id).pipe(
          map((supercomponents: string[]) => {
            return LigandActions.getSupercomponentsSuccess({ supercomponents });
          }),
          catchError(() => of(LigandActions.getSupercomponentsFailure()))
        )
      )
    )
  );
}
