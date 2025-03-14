import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
};

export const defaultColDef: ColDef = {
  filter: true,
  flex: 1,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Residue name 1',
    field: 'pdb_id',
  },
  {
    headerName: 'Atom name 1',
    field: 'assembly_id',
  },
  {
    headerName: 'Interaction type',
    field: 'title',
  },
  { headerName: 'Distance (Å)', field: 'experimental_method' },
  {
    headerName: 'ligand atom',
    field: 'resolution',
  },
];

export const initialState: GridState = {
  rowSelection: ['0'],
};
