import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AggregatedApiService } from '../services/aggregated-api.service';
import { Store } from '@ngrx/store';
import { LigandStoreState } from './ligand-store.model';
import { LigandActions } from './ligand.actions';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { LigandSelectors } from './ligand.selectors';
import { RelatedLigand } from '../data-models/related-ligands.model';
import { LoadingState } from '../enums/loading-state.enum';
import { LigandReleasedStatus } from '../enums/ligand-release.enum';
import { LigandStructure, Polymer } from '../data-models/structure.model';

@Injectable()
export class LigandEffects {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<LigandStoreState>);

  private generateStructureStatistics(structures: LigandStructure[]): void {
    const uniquePDBIds = structures.reduce((acc: string[], curr: LigandStructure) => {
      if (curr.interacting_chains === null || curr.interacting_chains.length === 0) {
        acc = [];
        return acc;
      }

      const mappedValues = curr.interacting_chains.map((val) => val.pdb_id);
      const uniqueMappedValues = [...new Set(mappedValues)];
      acc.push(...uniqueMappedValues);
      return [...new Set(acc)];
    }, []);
    const numberOfPDBStructures = uniquePDBIds.length;
    const numberOfLigandInstances = structures.reduce((acc: number, curr: LigandStructure) => acc + curr.num_ligand_instances, 0);
    const numberOfProteins = structures.reduce((acc: number, curr: LigandStructure) => {
      if (curr.uniprot_id) {
        acc++;
      }
      return acc;
    }, 0);

    this.store.dispatch(LigandActions.saveNumberOfDistinctProteins({ numberOfProteins }));
    this.store.dispatch(LigandActions.saveNumberOfDistinctPDBStructures({ numberOfPDBStructures }));
    this.store.dispatch(LigandActions.saveNumberOfLigandInstances({ numberOfLigandInstances }));
  }

  getStructures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LigandActions.getStructures),
      switchMap(() => this.store.select(LigandSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.getLigandStructures(id).pipe(
          map((structures) => {
            this.generateStructureStatistics(structures);
            return LigandActions.getStructuresSuccess({ structures });
          }),
          catchError(() => of(LigandActions.getStructuresFailure()))
        )
      )
    )
  );

  getPolymers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LigandActions.getPolymers),
      switchMap(() => this.store.select(LigandSelectors.ligandId).pipe(take(1))),
      mergeMap((id: string) =>
        this.aggregatedApiService.fetchBoundEntries(id).pipe(
          map((polymers) => {
            const polymerWithTypeP = polymers[id].filter((p: Polymer) => p.ligand_type.toLocaleLowerCase() === 'p');
            return LigandActions.getPolymersSuccess({ polymers: polymerWithTypeP });
          }),
          catchError(() => of(LigandActions.getPolymersFailure()))
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
            const text = `
              <h1>Error: 404</h1>
              <h3>We're sorry - we can't find the page or file you requested</h3>
              <p>We're sorry - we can't find the page or file you requested</p>
              <p>It may have been removed, had its name changed, or be temporarily unavailable.</p>
              <p>You might try searching for it again later</p>
            `;
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
