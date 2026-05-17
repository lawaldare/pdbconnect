import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { EntryActions } from '../store/entry.actions';
import { EntrySelectors } from '../store/entry.selectors';
import { EntryStatus } from '../data-models/status.model';

export interface EntryPageResolvedData {
  entryId: string;
  status: EntryStatus;
}

export const entryPageResolver: ResolveFn<EntryPageResolvedData> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  const entryId = route.paramMap.get('entryId')!.toLowerCase().replace('pdb_0000', '');

  store.dispatch(EntryActions.setCurrentEntryId({ entryId }));
  store.dispatch(EntryActions.getEntryStatus());

  return store.select(EntrySelectors.entryStatus).pipe(
    filter((status): status is EntryStatus => !!status && status.status_code !== 'INITIAL'),
    take(1),
    switchMap((status) => {
      if (status.status_code !== 'REL') {
        return of({ entryId, status, summaryData: null, primaryPublication: null });
      }

      store.dispatch(EntryActions.getSummaryData());
      store.dispatch(EntryActions.getPrimaryPublication());

      return combineLatest([
        store.select(EntrySelectors.summaryData).pipe(filter(Boolean), take(1)),
        store.select(EntrySelectors.primaryPublication).pipe(filter(Boolean), take(1)),
      ]).pipe(map(([summaryData, primaryPublication]) => ({ entryId, status, summaryData, primaryPublication })));
    })
  );
};
