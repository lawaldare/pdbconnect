import { createReducer, on } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';
import { PisaActions } from './pisa.actions';

export const PISA_STORE_STATE_KEY = 'pisa';

const initialState: PisaStoreState = {
  jobId: '',
  assemblyResults: null,
  interfaceResults: null,
  interfaceResultForInterfaceIdComplexesTab: null,
  interfaceResultForInterfaceIdInterfacesTab: null,
  selectedComplexData: null,
  interfaceTypeData: null,
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
  on(PisaActions.getInterfaceResultForJobIdSuccess, (state, action) => ({
    ...state,
    interfaceResults: action.interfaceResults,
  })),
  on(PisaActions.getInterfaceResultForInterfaceIdForComplexesTabSuccess, (state, action) => ({
    ...state,
    interfaceResultForInterfaceIdComplexesTab: action.interfaceResultForInterfaceIdComplexesTab,
  })),
  on(PisaActions.getInterfaceResultForInterfaceIdForInterfacesTabSuccess, (state, action) => ({
    ...state,
    interfaceResultForInterfaceIdInterfacesTab: action.interfaceResultForInterfaceIdInterfacesTab,
  })),
  on(PisaActions.setInterfaceTypeDataForSelectedInterface, (state, action) => ({
    ...state,
    interfaceTypeData: action.interfaceTypeData,
  }))
);
