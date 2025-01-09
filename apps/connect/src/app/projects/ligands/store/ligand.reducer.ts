/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReducer, on } from '@ngrx/store';
import { LigandStoreState } from './ligand-store.model';
import { LigandActions } from './ligand.actions';
import { LigandSummary } from '../data-models/description.model';
import { DescriptionData } from '../services/aggregated-api.service';
import { RelatedLigand } from '../data-models/related-ligands.model';
import { LoadingState } from '../enums/loading-state.enum';
import { environment } from '../../../../environments/environment';

export const LIGAND_STORE_STATE_KEY = 'ligand';

const downloadBaseUrl = `${environment.pdbeBaseUrl}static/files/pdbechem_v2/`;

const initialState: LigandStoreState = {
  ligandId: '',
  structures: [],
  summary: {} as LigandSummary,
  description: {} as DescriptionData,
  downloadOptions: [],
  relatedLigands: {} as RelatedLigand,
  supercomponents: [],
  loadingState: LoadingState.SUCCESS,
  emptyPageText: '',
  fragments: [],
  navItems: [],
  polymers: [],
};

export const ligandReducer = createReducer(
  initialState,
  on(LigandActions.setCurrentLigandId, (state, action) => ({
    ...state,
    ligandId: action.ligandId,
  })),
  on(LigandActions.getStructuresSuccess, (state, action) => ({
    ...state,
    structures: action.structures,
  })),
  on(LigandActions.getPolymersSuccess, (state, action) => ({
    ...state,
    polymers: action.polymers,
  })),
  on(LigandActions.getRelatedLigandsSuccess, (state, action) => ({
    ...state,
    relatedLigands: action.relatedLigands,
  })),
  on(LigandActions.getSummarySuccess, (state, action) => ({
    ...state,
    summary: action.summary,
  })),
  on(LigandActions.setDescription, (state, action) => ({
    ...state,
    description: action.description,
  })),
  on(LigandActions.getSupercomponentsSuccess, (state, action) => ({
    ...state,
    supercomponents: action.supercomponents,
  })),
  on(LigandActions.getSupercomponentsFailure, (state, action) => ({
    ...state,
    supercomponents: [],
  })),
  on(LigandActions.setEmptyPageText, (state, action) => ({
    ...state,
    emptyPageText: action.text,
  })),
  on(LigandActions.toggleLoader, (state, action) => ({
    ...state,
    loadingState: action.status,
  })),
  on(LigandActions.setDownloadOptions, (state, action) => ({
    ...state,
    downloadOptions: [
      { name: 'CIF file', url: `${downloadBaseUrl}${state.ligandId}.cif`, downloadable: true },
      { name: 'Ideal SDF', url: `${downloadBaseUrl}${state.ligandId}_ideal.sdf`, downloadable: true },
      { name: 'Model SDF', url: `${downloadBaseUrl}${state.ligandId}_model.sdf`, downloadable: true },
      { name: 'Model CML', url: `${downloadBaseUrl}${state.ligandId}_model.cml`, downloadable: true },
    ],
  })),
  on(LigandActions.setFragments, (state, action) => ({
    ...state,
    fragments: action.fragments,
  })),
  on(LigandActions.setNavItems, (state, action) => ({
    ...state,
    navItems: action.navItems,
  }))
);
