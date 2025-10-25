import { createReducer, on } from '@ngrx/store';
import { ComplexStoreState } from './complex-store.model';
import { ComplexActions } from './complex.actions';
import { LoadingState } from '../../ligands/enums/loading-state.enum';

export const COMPLEX_STORE_STATE_KEY = 'complex';

const initialState: ComplexStoreState = {
  complexId: '',
  complexData: null,
  pisa: [],
  loadingState: LoadingState.SUCCESS,
  complexLigands: [],
  subComplexInteractions: [],
  superComplexInteractions: [],
  history: null,
};

export const complexReducer = createReducer(
  initialState,
  on(ComplexActions.setCurrentComplexId, (state, action) => ({
    ...state,
    complexId: action.complexId,
  })),
  on(ComplexActions.getComplexDataSuccess, (state, action) => ({
    ...state,
    complexData: action.complexData,
  })),
  on(ComplexActions.getPISAAssembliesParamsSuccess, (state, action) => ({
    ...state,
    pisa: action.pisa,
  })),
  on(ComplexActions.getComplexInteractionsSuccess, (state, action) => ({
    ...state,
    subComplexInteractions: action.subComplexInteractions,
    superComplexInteractions: action.superComplexInteractions,
  })),
  on(ComplexActions.getLigandsForComplexesSuccess, (state, action) => ({
    ...state,
    complexLigands: action.complexLigands,
  })),
  on(ComplexActions.toggleLoader, (state, action) => ({
    ...state,
    loadingState: action.status,
  })),
  on(ComplexActions.getComplexIdHistorySuccess, (state, action) => ({
    ...state,
    history: action.history,
  }))
);
