import { createReducer, on } from '@ngrx/store';
import { SearchAppStoreState } from './search-store.model';
import { SearchAppActions } from './search.actions';

export const SEARCH_APP_STORE_STATE_KEY = 'searchApp';

const initialState: SearchAppStoreState = {
  moleculesResponse: null,
  pdbIds: '',
};

export const searchAppReducer = createReducer(
  initialState,
  on(SearchAppActions.setCurrentPdbIds, (state, action) => ({
    ...state,
    pdbIds: action.pdbIds,
  })),
  on(SearchAppActions.getMoleculesSuccess, (state, action) => ({
    ...state,
    moleculesResponse: action.moleculesResponse,
  }))
);
