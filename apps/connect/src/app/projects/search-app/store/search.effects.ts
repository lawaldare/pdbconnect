import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SearchAppStoreState } from './search-store.model';
import { SearchAppActions } from './search.actions';
import { catchError, filter, map, mergeMap, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { SearchAppSelectors } from './search.selectors';
import { SearchService } from '../common/search.service';

@Injectable()
export class SearchAppEffects {
  private readonly searchService = inject(SearchService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<SearchAppStoreState>);

  getMolecules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchAppActions.getMolecules),
      switchMap(() => this.store.select(SearchAppSelectors.pdbIds).pipe(filter(Boolean), take(1))),
      mergeMap((pdbIds: string) =>
        this.searchService.getLigandEntities(pdbIds).pipe(
          map((moleculesResponse) => {
            return SearchAppActions.getMoleculesSuccess({ moleculesResponse });
          }),
          catchError(() => of(SearchAppActions.getMoleculesFailure()))
        )
      )
    )
  );
}
