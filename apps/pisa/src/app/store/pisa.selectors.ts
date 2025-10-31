import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';
import { PISA_STORE_STATE_KEY } from './pisa.reducer';

const pisaStoreState = createFeatureSelector<PisaStoreState>(PISA_STORE_STATE_KEY);

export const PisaSelectors = {
  state: pisaStoreState,
};
