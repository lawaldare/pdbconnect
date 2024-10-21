import { Action, createReducer, on } from '@ngrx/store';
import { BiodataState } from './biodata.model';
import { BiodataActions } from './biodata.actions';
import { LigandSummary } from '../ligands/data-models/description.model';
import { DescriptionData } from '../ligands/services/aggregated-api.service';
import { RelatedLigand } from '../ligands/data-models/related-ligands.model';
import { Substructure } from '../ligands/data-models/structure.model';

export const BIODATA_STATE_KEY = 'biodata';

const initialState: BiodataState = {
  ligandId: '',
  structures: [],
  summary: {} as LigandSummary,
  description: {} as DescriptionData,
  downloadOptions: [],
  relatedLigands: {} as RelatedLigand,
  supercomponents: [],
  substructures: {} as Substructure,
};

export const biodataReducer = createReducer(
  initialState,
  on(BiodataActions.setCurrentLigandId, (state, action) => ({
    ...state,
    ligandId: action.ligandId,
  })),
  on(BiodataActions.getStructuresSuccess, (state, action) => ({
    ...state,
    structures: action.structures,
  })),
  on(BiodataActions.getRelatedLigandsSuccess, (state, action) => ({
    ...state,
    relatedLigands: action.relatedLigands,
  })),
  on(BiodataActions.getSummarySuccess, (state, action) => ({
    ...state,
    summary: action.summary,
  })),
  on(BiodataActions.setDescription, (state, action) => ({
    ...state,
    description: action.description,
  })),
  on(BiodataActions.getSupercomponentsSuccess, (state, action) => ({
    ...state,
    supercomponents: action.supercomponents,
  })),
  on(BiodataActions.getSubstructuresSuccess, (state, action) => ({
    ...state,
    substructures: action.substructures,
  })),
  on(BiodataActions.setDownloadOptions, (state, action) => ({
    ...state,
    downloadOptions: [
      { name: 'CIF file', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}.cif`, downloadable: true },
      { name: 'Ideal SDF', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}_ideal.sdf`, downloadable: true },
      { name: 'Model SDF', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}_model.sdf`, downloadable: true },
      { name: 'Model CML', url: `https://wwwdev.ebi.ac.uk/pdbe/static/files/pdbechem_v2/${state.ligandId}_model.cml`, downloadable: true },
    ],
  }))
);
