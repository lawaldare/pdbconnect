/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ComplexNameRendererComponent } from '../../cell renderers/custom-complex-name.component';
import { CommonComponentsRendererComponent } from '../../cell renderers/common-components.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    filter: false,
    flex: 1,
    sortable: false,
    autoHeight: true,
    resizable: false,
    suppressMovable: true,
    wrapText: true,
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Supercomplex ID and name',
    field: '',
    cellRenderer: ComplexNameRendererComponent,
  },
  {
    headerName: ' Additional components',
    field: '',
    width: 80,
    cellRenderer: CommonComponentsRendererComponent,
  },
];

// export const initialState: GridState = {
//   rowSelection: ['0'],
// };

export const rowSelection: any = {
  mode: 'singleRow',
  headerCheckbox: false,
  checkboxes: false,
  enableClickSelection: true,
};
