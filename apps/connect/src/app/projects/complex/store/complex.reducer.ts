import { createReducer, on } from '@ngrx/store';
import { ComplexStoreState } from './complex-store.model';
import { ComplexData } from '../models/complex-structure.model';
import { ComplexActions } from './complex.actions';
import { LoadingState } from '../../ligands/enums/loading-state.enum';

export const COMPLEX_STORE_STATE_KEY = 'complex';

const initialState: ComplexStoreState = {
  complexId: '',
  complexData: {} as ComplexData,
  navItems: [],
  loadingState: LoadingState.SUCCESS,
  complexLigands: [],
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
  on(ComplexActions.getLigandsForComplexesSuccess, (state, action) => ({
    ...state,
    complexLigands: action.complexLigands,
  })),
  on(ComplexActions.setNavItems, (state, action) => ({
    ...state,
    navItems: action.navItems,
  })),
  on(ComplexActions.toggleLoader, (state, action) => ({
    ...state,
    loadingState: action.status,
  }))
);
