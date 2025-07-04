import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community';
import { InteractionTypeRendererComponent } from './interaction-type.component';

const isSmallScreen = window.innerWidth <= 1340;

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    filter: false,
    flex: 1,
    sortable: false,
    autoHeight: true,
    resizable: false,
    suppressMovable: true,
  },
  paginationPageSize: isSmallScreen ? 3 : 5,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Ligand\natoms',
    field: 'ligand_atoms',
    valueGetter: (params) => params.data.ligand_atoms.join(', '),
    flex: 1,
    minWidth: 85,
  },
  {
    headerName: 'Residue',
    // valueGetter: (params) => params.data.end.chem_comp_id + '<br>' + params.data.end.author_residue_number,
    cellRenderer: (params: ICellRendererParams) => `${params.data.end.chem_comp_id}<br>${params.data.end.author_residue_number}`,
    flex: 1,
    minWidth: 95,
  },
  {
    headerName: 'Atoms',
    valueGetter: (params) => params.data.end.atom_names.join(', '),
    flex: 1,
    minWidth: 85,
  },
  {
    headerName: 'Interaction\ntype',
    field: 'interaction_details',
    cellRenderer: InteractionTypeRendererComponent,
    flex: 1.5,
    minWidth: 150,
  },
  {
    headerName: 'Distance\n(Å)',
    field: 'distance',
    flex: 1,
    minWidth: 100,
  },
];
