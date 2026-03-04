import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchAppStoreState } from './search-store.model';
import { SEARCH_APP_STORE_STATE_KEY } from './search.reducer';

const SearchAppStoreState = createFeatureSelector<SearchAppStoreState>(SEARCH_APP_STORE_STATE_KEY);

export const SearchAppSelectors = {
  state: SearchAppStoreState,
  molecules: createSelector(SearchAppStoreState, (state: SearchAppStoreState) => state.moleculesResponse),
  pdbIds: createSelector(SearchAppStoreState, (state: SearchAppStoreState) => state.pdbIds),
};
