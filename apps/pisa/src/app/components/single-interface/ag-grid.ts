/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { BuriedAreaCellRenderer } from '../cell-renderers/buried-area-cell-render';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    sortable: false,
    filter: false,
    flex: 1,
  },
  pagination: false,

  rowClassRules: {
    'interface-residue': (params) => params.data?.bsa > 0,

    'solvent-residue': (params) => params.data?.bsa === 0 && params.data?.asa > 0,

    'inaccessible-residue': (params) => params.data?.asa === 0 && params.data?.bsa === 0,
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Chain:RES NN',
    field: 'complex_key',
    cellRenderer: (params: any) => {
      return `<p>${params.data.auth_sym_id}:${params.data.auth_comp_id} ${params.data.auth_seq_id}</p>`;
    },
  },
  { headerName: 'HSDC', field: 'bonds' },
  { headerName: 'ASA, Å²', field: 'asa' },
  { headerName: 'BSA, Å²', field: 'bsa' },
  { headerName: 'Buried ar.', field: 'bsa', cellRenderer: BuriedAreaCellRenderer },
  { headerName: ' ΔiGint', field: 'solv_energy' },
];

export const bondsColDefs: ColDef[] = [
  {
    headerName: 'Chain:RES NN [Name]',
    field: 'auth_sym_id',
    cellRenderer: (params: any) => {
      return `<p>${params.data.auth_asym_id_1}:${params.data.auth_comp_id_1} ${params.data.auth_seq_id_1} [${params.data.auth_atom_id_1}]</p>`;
    },
  },
  { headerName: 'Distance', field: 'dist' },
  {
    headerName: 'Chain:RES NN [Name]',
    field: 'auth_sym_id',
    cellRenderer: (params: any) => {
      return `<p>${params.data.auth_asym_id_2}:${params.data.auth_comp_id_2} ${params.data.auth_seq_id_2} [${params.data.auth_atom_id_2}]</p>`;
    },
  },
];
