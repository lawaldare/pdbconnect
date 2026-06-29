import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LigandStoreState } from './ligand-store.model';
import { LIGAND_STORE_STATE_KEY } from './ligand.reducer';

const selectLigandStoreState = createFeatureSelector<LigandStoreState>(LIGAND_STORE_STATE_KEY);

export const LigandSelectors = {
  state: selectLigandStoreState,
  ligandId: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.ligandId),
  structures: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.structures),
  summary: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.summary),
  description: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.description),
  downloadOptions: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.downloadOptions),
  relatedLigands: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.relatedLigands),
  supercomponents: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.supercomponents),
  loadingState: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.loadingState),
  emptyPageText: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.emptyPageText),
  fragments: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.fragments),
  navItems: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.navItems),
  polymers: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.polymers),
  numberOfLigandInstances: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.numberOfLigandInstances),
  numberOfPDBStructures: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.numberOfPDBStructures),
  numberOfProteins: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.numberOfProteins),
  mdpositInchikeys: createSelector(selectLigandStoreState, (state: LigandStoreState) => state.mdpositInchikeys),
};
