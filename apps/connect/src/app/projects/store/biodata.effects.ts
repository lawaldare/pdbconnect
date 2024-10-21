import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AggregatedApiService } from '../ligands/services/aggregated-api.service';
import { Store } from '@ngrx/store';
import { BiodataState } from './biodata.model';
import { BiodataActions } from './biodata.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { BiodataSelectors } from './biodata.selectors';

@Injectable()
export class BiodataEffects {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<BiodataState>);

  getStructures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BiodataActions.getStructures),
      switchMap(() => this.store.select(BiodataSelectors.ligandId)),
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
      switchMap(() => this.store.select(BiodataSelectors.ligandId)),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandSummary(id).pipe(
          map((summary) => BiodataActions.getSummarySuccess({ summary })),
          catchError(() => of(BiodataActions.getSummaryFailure()))
        )
      ),
      tap((summary: any) => {
        const description = this.aggregatedApiService.processDescriptionData(summary['summary']);
        this.store.dispatch(BiodataActions.setDescription({ description }));
      })
    )
  );
}
