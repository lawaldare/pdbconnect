/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';
import { CustomHeaderComponent } from '../../cell renderers/custom-header.component';
import { ComplexPageExternalLinkRendererComponent } from '../../../shared/complex-page-external-link.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB',
    field: 'pdb_id',
    cellRenderer: ComplexPageExternalLinkRendererComponent,
    width: 90,
    sortable: false,
  },
  {
    headerName: 'ID',
    field: 'assembly_id',
    width: 80,
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, tooltipText: 'Assembly identifier' },
    sortable: false,
    filter: false,
  },
  {
    headerName: 'Title',
    field: 'title',
    cellRenderer: TitleRendererComponent,
    width: 240,
  },
  { headerName: 'Exp. method', field: 'experimental_method', width: 170 },
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
