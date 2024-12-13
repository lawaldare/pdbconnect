import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ComplexStoreState } from './complex-store.model';
import { COMPLEX_STORE_STATE_KEY } from './complex.reducer';

const complexStoreState = createFeatureSelector<ComplexStoreState>(COMPLEX_STORE_STATE_KEY);

export const ComplexSelectors = {
  state: complexStoreState,
  complexId: createSelector(complexStoreState, (state: ComplexStoreState) => state.complexId),
  complexData: createSelector(complexStoreState, (state: ComplexStoreState) => state.complexData),
  navItems: createSelector(complexStoreState, (state: ComplexStoreState) => state.navItems),
  loadingState: createSelector(complexStoreState, (state: ComplexStoreState) => state.loadingState),
  complexLigands: createSelector(complexStoreState, (state: ComplexStoreState) => state.complexLigands),
};
