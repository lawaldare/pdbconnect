import { createReducer, on } from '@ngrx/store';
import { PisaStoreState } from './pisa-store.model';

export const PISA_STORE_STATE_KEY = 'pisa';

const initialState: PisaStoreState = {};

export const pisaReducer = createReducer(initialState);
