import { createReducer, on } from '@ngrx/store';
import { LigandStoreState } from './ligand-store.model';
import { LigandActions } from './ligand.actions';
import { LigandSummary } from '../data-models/description.model';
import { DescriptionData } from '../services/aggregated-api.service';
import { RelatedLigand } from '../data-models/related-ligands.model';
import { LoadingState } from '../enums/loading-state.enum';

export const LIGAND_STORE_STATE_KEY = 'ligand';

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
      { name: 'CIF file', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}.cif`, downloadable: true },
      { name: 'Ideal SDF', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}_ideal.sdf`, downloadable: true },
      { name: 'Model SDF', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}_model.sdf`, downloadable: true },
      { name: 'Model CML', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}_model.cml`, downloadable: true },
    ],
  })),
  on(LigandActions.setFragments, (state, action) => ({
    ...state,
    fragments: action.fragments,
  }))
);
