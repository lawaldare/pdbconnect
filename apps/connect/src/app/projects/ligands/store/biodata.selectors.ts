import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LigandStoreState } from './biodata.model';
import { LIGAND_STORE_STATE_KEY } from './biodata.reducer';

const LigandStoreState = createFeatureSelector<LigandStoreState>(LIGAND_STORE_STATE_KEY);

export const LigandSelectors = {
  state: LigandStoreState,
  ligandId: createSelector(LigandStoreState, (state: LigandStoreState) => state.ligandId),
  structures: createSelector(LigandStoreState, (state: LigandStoreState) => state.structures),
  summary: createSelector(LigandStoreState, (state: LigandStoreState) => state.summary),
  description: createSelector(LigandStoreState, (state: LigandStoreState) => state.description),
  downloadOptions: createSelector(LigandStoreState, (state: LigandStoreState) => state.downloadOptions),
  relatedLigands: createSelector(LigandStoreState, (state: LigandStoreState) => state.relatedLigands),
  supercomponents: createSelector(LigandStoreState, (state: LigandStoreState) => state.supercomponents),
  loadingState: createSelector(LigandStoreState, (state: LigandStoreState) => state.loadingState),
  emptyPageText: createSelector(LigandStoreState, (state: LigandStoreState) => state.emptyPageText),
};
