import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { InteractionTypeRendererComponent } from './interaction-type.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  paginationPageSize: 8,
};

export const defaultColDef: ColDef = {
  filter: false,
  flex: 1,
  sortable: false,
  wrapText: true,
  autoHeight: true,
  resizable: false,
  suppressMovable: true,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Ligand\natoms',
    field: 'ligand_atoms',
    valueGetter: (params) => params.data.ligand_atoms.join(', '),
    minWidth: 85,
  },
  {
    headerName: 'Residue',
    // valueGetter: (params) => params.data.end.chem_comp_id + '<br>' + params.data.end.author_residue_number,
    cellRenderer: (params: ICellRendererParams) => `${params.data.end.chem_comp_id}<br>${params.data.end.author_residue_number}`,
    minWidth: 95,
  },
  {
    headerName: 'Atoms',
    valueGetter: (params) => params.data.end.atom_names.join(', '),
    minWidth: 85,
  },
  {
    headerName: 'Interaction\ntype',
    field: 'interaction_details',
    cellRenderer: InteractionTypeRendererComponent,
    flex: 3,
    minWidth: 150,
  },
  {
    headerName: 'Distance\n(Å)',
    field: 'distance',
    minWidth: 100,
  },
];
