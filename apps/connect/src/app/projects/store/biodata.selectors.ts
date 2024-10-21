import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BiodataState } from './biodata.model';
import { BIODATA_STATE_KEY } from './biodata.reducer';

const biodataState = createFeatureSelector<BiodataState>(BIODATA_STATE_KEY);

export const BiodataSelectors = {
  state: biodataState,
  ligandId: createSelector(biodataState, (state: BiodataState) => state.ligandId),
  structures: createSelector(biodataState, (state: BiodataState) => state.structures),
  summary: createSelector(biodataState, (state: BiodataState) => state.summary),
  description: createSelector(biodataState, (state: BiodataState) => state.description),
};
