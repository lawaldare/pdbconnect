import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AggregatedApiService } from '../ligands/services/aggregated-api.service';
import { Store } from '@ngrx/store';
import { BiodataState } from './biodata.model';
import { BiodataActions } from './biodata.actions';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { BiodataSelectors } from './biodata.selectors';
import { RelatedLigand } from '../ligands/data-models/related-ligands.model';
import { LoadingState } from '../ligands/enums/loading-state.enum';
import { LigandReleasedStatus } from '../ligands/enums/ligand-release.enum';

@Injectable()
export class BiodataEffects {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<BiodataState>);

  getStructures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiodataActions.getStructures),
      switchMap(() => this.store.select(BiodataSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandStructures(id).pipe(
          map((structures) => BiodataActions.getStructuresSuccess({ structures })),
          catchError(() => of(BiodataActions.getStructuresFailure()))
        )
      )
    )
  );

  getSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiodataActions.getSummary),
      tap(() => this.store.dispatch(BiodataActions.toggleLoader({ status: LoadingState.LOADING }))),
      switchMap(() => this.store.select(BiodataSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandSummary(id).pipe(
          mergeMap((summary) => {
            this.store.dispatch(BiodataActions.getSummarySuccess({ summary }));
            this.store.dispatch(
              BiodataActions.setDescription({
                description: { ...this.aggregatedApiService.processDescriptionData(summary), ligandId: id },
              })
            );
            if (summary.release_status.toUpperCase() !== LigandReleasedStatus.HOLD) {
              return of(BiodataActions.toggleLoader({ status: LoadingState.SUCCESS }));
            } else {
              return of(BiodataActions.toggleLoader({ status: LoadingState.FAILURE }));
            }
          }),
          catchError(() => {
            this.store.dispatch(BiodataActions.toggleLoader({ status: LoadingState.FAILURE }));
            const text = `Error occurred while fetching data for ${id}. Please check the ligand ID and try again.`;
            this.store.dispatch(BiodataActions.setEmptyPageText({ text }));
            return of(BiodataActions.getSummaryFailure());
          })
        )
      )
    )
  );

  getRelatedLigands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiodataActions.getRelatedLigands),
      switchMap(() => this.store.select(BiodataSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getRelatedLigands(id).pipe(
          map((relatedLigands: RelatedLigand) => {
            return BiodataActions.getRelatedLigandsSuccess({ relatedLigands });
          }),
          catchError(() => of(BiodataActions.getRelatedLigandsFailure()))
        )
      )
    )
  );

  getSupercomponents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiodataActions.getSupercomponents),
      switchMap(() => this.store.select(BiodataSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.fetchSupercomponents(id).pipe(
          map((supercomponents: string[]) => {
            return BiodataActions.getSupercomponentsSuccess({ supercomponents });
          }),
          catchError(() => of(BiodataActions.getSupercomponentsFailure()))
        )
      )
    )
  );
}
