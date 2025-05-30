import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    flex: 1,
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB ID',
    field: 'pdb_id',
    sort: 'asc',
    flex: 0.6,
  },
  {
    headerName: 'Assembly ID',
    field: 'assembly_id',
    flex: 0.8,
  },
  {
    headerName: 'Accessible Surface Area',
    field: 'accessible_surface_area',
  },
  {
    headerName: 'Buried Surface Area',
    field: 'buried_surface_area',
  },
  {
    headerName: 'Solvation Energy Gain',
    field: 'solvation_energy_gain',
  },
  {
    headerName: 'Dissociation Energy',
    field: 'dissociation_area',
  },
  {
    headerName: 'Dissociation Entropy',
    field: 'dissociation_entropy',
  },
];

// export const components: {
//   [p: string]: any;
// } = {
//   agColumnHeader: CustomHeaderComponent,
// };

export const initialState: GridState = {
  rowSelection: ['0'],
};

export const rowSelection: any = {
  mode: 'singleRow',
  headerCheckbox: false,
  checkboxes: false,
  enableClickSelection: true,
};

// export const selectionColumnDef = {
//   sortable: false,
//   width: 80,
//   maxWidth: 80,
//   suppressHeaderMenuButton: false,
//   headerName: 'Show',
// };
