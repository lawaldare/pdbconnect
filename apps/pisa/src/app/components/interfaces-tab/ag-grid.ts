/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';

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
    if (d?.groupHeader) return 'row-group-band';
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
    headerName: 'Interface Key',
    field: 'interfaceKey',
    cellRenderer: (params: any) => {
      if (params.data.groupHeader) {
        return `<div class="interface-group-header-cell">${params.data.groupHeader}</div>`;
      }
      return params.value ?? '';
    },
  },
  { headerName: 'Chain', field: 'structureOneChain' },
  { headerName: 'Natoms', field: 'structureOneNAtoms' },
  { headerName: 'Nresidues', field: 'structureOneNResidues' },
  { headerName: 'Chain', field: 'structureTwoChain' },
  { headerName: 'Natoms', field: 'structureTwoNAtoms' },
  { headerName: 'Nresidues', field: 'structureTwoNResidues' },
  { headerName: 'Interfc. area, Å2', field: 'interfaceArea' },
  { headerName: 'ΔGint kcal/mol', field: 'interfaceEnergy' },
  { headerName: 'ΔGint P-value', field: 'pValue' },
  { headerName: 'CSS', field: 'css' },
  { headerName: 'Found in complex', field: 'complexes' },
  { headerName: 'Actions', field: '' },
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
