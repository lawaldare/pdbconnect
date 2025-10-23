/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';
import { ComplexPageExternalLinkRendererComponent } from '../../../shared/complex-page-external-link.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB and complex',
    field: 'pdb_id',
    cellRenderer: ComplexPageExternalLinkRendererComponent,
    cellRendererParams: {
      tab: 'structures',
    },
    width: 140,
    sortable: true,
  },
  {
    headerName: 'Title',
    field: 'title',
    cellRenderer: TitleRendererComponent,
    width: 270,
  },
  { headerName: 'Method', field: 'experimental_method', width: 170 },
  {
    headerName: 'Res. (Å)',
    field: 'resolution',
    width: 120,
  },
];

export const initialState: GridState = {
  rowSelection: ['0'],
};

export const rowSelection: any = {
  mode: 'singleRow',
  headerCheckbox: false,
  checkboxes: false,
  enableClickSelection: true,
};
