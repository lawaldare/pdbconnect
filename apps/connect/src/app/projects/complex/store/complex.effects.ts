import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';

import { ComplexAPIService } from '../services/complex-api.service';
import { ComplexStoreState } from './complex-store.model';
import { ComplexActions } from './complex.actions';
import { ComplexSelectors } from './complex.selectors';
import { LoadingState } from '../../ligands/enums/loading-state.enum';
import { ComplexLigand } from '../components/page-sections/complex-ligands/complex-ligands.component';
import { ComplexInteraction } from '../models/complex-structure.model';
import { PISAAssemblyParam } from '../components/page-sections/complex-pisa/complex-pisa.component';

@Injectable()
export class ComplexEffects {
  private readonly complexAPIService = inject(ComplexAPIService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<ComplexStoreState>);

  private sortWithAnnotationsFirst(data: ComplexLigand[]) {
    return data.sort((a, b) => {
      const aHasAnnotations = a.annotations && a.annotations.length > 0;
      const bHasAnnotations = b.annotations && b.annotations.length > 0;

      if (aHasAnnotations && !bHasAnnotations) return -1;

      if (!aHasAnnotations && bHasAnnotations) return 1;

      if (aHasAnnotations && bHasAnnotations) return b.num_pdb_entries - a.num_pdb_entries;

      return 0;
    });
  }

  getComplexData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplexActions.getComplexData),
      tap(() => this.store.dispatch(ComplexActions.toggleLoader({ status: LoadingState.LOADING }))),
      switchMap(() => this.store.select(ComplexSelectors.complexId).pipe(take(1))),
      mergeMap((id: string) =>
        this.complexAPIService.getSummaryForComplexData(id).pipe(
          mergeMap((complexData) => {
            this.store.dispatch(ComplexActions.getComplexDataSuccess({ complexData }));
            return of(ComplexActions.toggleLoader({ status: LoadingState.SUCCESS }));
          }),
          catchError(() => {
            this.store.dispatch(ComplexActions.toggleLoader({ status: LoadingState.FAILURE }));
            return of(ComplexActions.getComplexDataFailure());
          })
        )
      )
    )
  );

  getComplexInteractions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplexActions.getComplexInteractions),
      // tap(() => this.store.dispatch(ComplexActions.toggleLoader({ status: LoadingState.LOADING }))),
      switchMap(() => this.store.select(ComplexSelectors.complexId).pipe(take(1))),
      mergeMap((id: string) =>
        this.complexAPIService.getInteractions(id).pipe(
          mergeMap((interactions: ComplexInteraction[]) => {
            // return this.store.dispatch(ComplexActions.getComplexDataSuccess({ complexData }));
            const subComplexInteractions = interactions.filter((interaction) => interaction.relationship_type === 'sub-complex');
            const superComplexInteractions = interactions.filter((interaction) => interaction.relationship_type === 'super-complex');
            return of(ComplexActions.getComplexInteractionsSuccess({ subComplexInteractions, superComplexInteractions }));
          }),
          catchError(() => {
            // this.store.dispatch(ComplexActions.toggleLoader({ status: LoadingState.FAILURE }));
            return of(ComplexActions.getComplexInteractionsFailure());
          })
        )
      )
    )
  );

  getLigandsForComplexes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplexActions.getLigandsForComplexes),
      switchMap(() => this.store.select(ComplexSelectors.complexId).pipe(take(1))),
      mergeMap((id: string) =>
        this.complexAPIService.getLigandsForComplexPages(id).pipe(
          mergeMap((ligands: Record<string, any>) => {
            const complexLigands = Object.entries(ligands).reduce((acc: ComplexLigand[], [key, value]) => {
              const mappedObj = {
                ...value,
                ligandId: key,
              };
              acc.push(mappedObj);
              return this.sortWithAnnotationsFirst(acc);
            }, []);
            return of(ComplexActions.getLigandsForComplexesSuccess({ complexLigands }));
          }),
          catchError(() => of(ComplexActions.getLigandsForComplexesFailure()))
        )
      )
    )
  );

  getPisaAssembliesParams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ComplexActions.getPISAAssembliesParams),
      switchMap(() => this.store.select(ComplexSelectors.complexId).pipe(take(1))),
      mergeMap((id: string) =>
        this.complexAPIService.getPisaAssembliesParams(id).pipe(
          mergeMap((response: Record<string, any>) => {
            const pisa = Object.entries(response['data']).reduce((acc: PISAAssemblyParam[], [key, value]: [string, any]) => {
              const mappedObj = {
                ...value,
                pdb_id: key.split('_')[0],
                assembly_id: key.split('_')[1],
              };
              acc.push(mappedObj);
              return acc;
            }, []);
            const sortedPisa = pisa.sort((a, b) => a.pdb_id.localeCompare(b.pdb_id));
            return of(ComplexActions.getPISAAssembliesParamsSuccess({ pisa: sortedPisa }));
          }),
          catchError(() => of(ComplexActions.getLigandsForComplexesFailure()))
        )
      )
    )
  );
}
