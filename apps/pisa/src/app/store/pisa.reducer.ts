import { createReducer, on } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';
import { PisaActions } from './pisa.actions';

export const PISA_STORE_STATE_KEY = 'pisa';

const initialState: PisaStoreState = {
  jobId: '',
  assemblyResults: null,
  interfaceResultForInterfaceId: null,
  selectedComplexData: null,
};

export const pisaReducer = createReducer(
  initialState,
  on(PisaActions.setJobID, (state, action) => ({
    ...state,
    jobId: action.jobId,
  })),
  on(PisaActions.setSelectedComplexDataOnComplexesTab, (state, action) => ({
    ...state,
    selectedComplexData: action.selectedComplexData,
  })),
  on(PisaActions.submitPISAJobSuccess, (state, action) => ({
    ...state,
    jobId: action.jobId,
  })),
  on(PisaActions.getAssemblyResultForJobIdSuccess, (state, action) => ({
    ...state,
    assemblyResults: action.assemblyResults,
  })),
  on(PisaActions.getInterfaceResultForInterfaceIdSuccess, (state, action) => ({
    ...state,
    interfaceResultForInterfaceId: action.interfaceResultForInterfaceId,
  }))
);
