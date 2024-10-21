import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AggregatedApiService } from '../ligands/services/aggregated-api.service';
import { Store } from '@ngrx/store';
import { BiodataState } from './biodata.model';
import { BiodataActions } from './biodata.actions';
import { catchError, map, mergeMap, of, switchMap, take } from 'rxjs';
import { BiodataSelectors } from './biodata.selectors';
import { RelatedLigand } from '../ligands/data-models/related-ligands.model';
import { Substructure } from '../ligands/data-models/structure.model';

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
      switchMap(() => this.store.select(BiodataSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandSummary(id).pipe(
          mergeMap((summary) => [
            BiodataActions.getSummarySuccess({ summary }),
            BiodataActions.setDescription({
              description: this.aggregatedApiService.processDescriptionData(summary),
            }),
          ]),
          catchError(() => of(BiodataActions.getSummaryFailure()))
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

  getSubstructures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiodataActions.getSubstructures),
      switchMap(() => this.store.select(BiodataSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.fetchSubstructures(id).pipe(
          map((substructures: Substructure) => {
            return BiodataActions.getSubstructuresSuccess({ substructures });
          }),
          catchError(() => of(BiodataActions.getSubstructuresFailure()))
        )
      )
    )
  );
}
