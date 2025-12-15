/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { InterfacesCellRenderer } from '../cell-renderers/interfaces-cell-render';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    sortable: false,
    filter: false,
    flex: 1,
  },
  pagination: false,

  // getRowClass: (params) => (params.data?.groupHeader ? 'row-group-band' : params.data?.highlight ? 'highlight-row' : ''),
  getRowClass: (params) => {
    const d = params.data;
    // if (d?.groupHeader) return 'row-group-band';
    if (d?.lastInGroup) return 'last-in-group-row';
    return '';
  },

  onCellClicked: (params) => {
    if (params.data?.groupHeader) {
      params?.event?.stopPropagation();
      return;
    }
    // handle normal row clicks here if you have them
    console.log('Clicked data row:', params.data);
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Complex key',
    field: 'complex_instance_id',
    cellRenderer: (params: any) => {
      if (params.data.groupHeader) {
        return `<div class="group-header-cell">${params.data.groupHeader}</div>`;
      }
      return params.value ?? '';
    },
  },
  { headerName: 'Formula', field: 'formula' },
  { headerName: 'Composition', field: 'composition' },
  { headerName: 'Surface area, sq. Å', field: 'asa' },
  { headerName: 'Buried area, sq. Å', field: 'bsa' },
  { headerName: 'ΔGint, kcal/mol', field: 'int_energy' },
  { headerName: 'ΔGdiss, kcal/mol', field: 'diss_energy' },
  { headerName: 'Size mm', field: 'mmsize' },
  { headerName: 'Contains interfaces', field: 'interfaces', cellRenderer: InterfacesCellRenderer },
];

export const initialState: GridState = {
  rowSelection: ['1'],
};

export const rowSelection: any = {
  mode: 'singleRow',
  headerCheckbox: false,
  checkboxes: false,
  enableClickSelection: true,
  isRowSelectable: (params: any) => !params.data?.groupHeader, // 👈 disables header rows
};
