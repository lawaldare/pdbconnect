import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { InteractionTypeRendererComponent } from './interaction-type.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  paginationPageSize: 5,
};

export const defaultColDef: ColDef = {
  filter: false,
  flex: 1,
  sortable: false,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Residue name 1',
    valueGetter: (params) => params.data.end.chem_comp_id + '_' + params.data.end.author_residue_number,
  },
  {
    headerName: 'Atom name 1',
    valueGetter: (params) => params.data.end.atom_names.join(', '),
  },
  {
    headerName: 'Interaction type',
    field: 'interaction_details',
    cellRenderer: InteractionTypeRendererComponent,
  },
  { headerName: 'Distance (Å)', field: 'distance' },
  {
    headerName: 'ligand atom',
    field: 'ligand_atoms',
    valueGetter: (params) => params.data.ligand_atoms.join(', '),
  },
];
