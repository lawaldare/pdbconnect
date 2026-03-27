/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState, ICellRendererParams, RowHeightParams } from 'ag-grid-community';
import { InterfacesCellRenderer } from '../cell-renderers/interfaces-cell-render';
import { SubscriptHeaderComponent } from '../cell-renderers/subscript-header';

const isGroupRow = (p: any) => !!p.data?.groupHeader;

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    sortable: false,
    filter: false,
    flex: 1,
  },
  pagination: false,
  components: {
    subscriptHeader: SubscriptHeaderComponent,
  },

  fullWidthCellRenderer: (p: ICellRendererParams) => {
    const label = p.data?.groupHeader ?? '';
    return `<div class="complex-type-row">${label}</div>`;
  },

  // ✅ nicer spacing like Figma
  getRowHeight: (p: RowHeightParams) => (p.data?.groupHeader ? 44 : 40),

  // ✅ styling hooks
  getRowClass: (p) => (p.data?.groupHeader ? 'row-complex-type' : ''),

  onCellClicked: (params) => {
    if (params.data?.groupHeader) {
      params?.event?.stopPropagation();
      return;
    }
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Complex key',
    field: 'complex_key',
    colSpan: (p) => (isGroupRow(p) ? 100 : 1),
    cellRenderer: (params: any) => {
      if (params.data.groupHeader) {
        // return `<div class="group-header-cell">${params.data.groupHeader}</div>`;
        return `<div class="complex-type-row">${params.data.groupHeader}</div>`;
      }
      return params.value ?? '';
    },
  },
  { headerName: 'Formula', field: 'formula' },
  { headerName: 'Composition', field: 'composition', flex: 1.4 },
  { headerName: 'Surface\narea, Å²', field: 'asa' },
  { headerName: 'Buried\narea, Å²', field: 'bsa', flex: 0.8 },
  {
    headerName: 'ΔGint, kcal/mol',
    headerComponent: 'subscriptHeader',
    headerComponentParams: { html: 'ΔG<sup>int</sup>,<br>kcal/mol' },
    field: 'int_energy',
  },
  {
    headerName: 'ΔGdiss, kcal/mol',
    headerComponent: 'subscriptHeader',
    headerComponentParams: { html: 'ΔG<sup>diss</sup>,<br>kcal/mol' },
    field: 'diss_energy',
  },
  // { headerName: 'ΔGᵈⁱˢˢ, kcal/mol', field: 'diss_energy' },
  { headerName: 'Size mm', field: 'mmsize', flex: 0.8 },
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
