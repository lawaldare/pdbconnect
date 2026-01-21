import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';
import { PISA_STORE_STATE_KEY } from './pisa.reducer';

const pisaStoreState = createFeatureSelector<PisaStoreState>(PISA_STORE_STATE_KEY);

export const PisaSelectors = {
  state: pisaStoreState,
  jobId: createSelector(pisaStoreState, (state: PisaStoreState) => state.jobId),
  assemblyResults: createSelector(pisaStoreState, (state: PisaStoreState) => state.assemblyResults),
  interfaceResults: createSelector(pisaStoreState, (state: PisaStoreState) => state.interfaceResults),
  interfaceResultForInterfaceId: createSelector(pisaStoreState, (state: PisaStoreState) => state.interfaceResultForInterfaceId),
  selectedComplexData: createSelector(pisaStoreState, (state: PisaStoreState) => state.selectedComplexData),
};
