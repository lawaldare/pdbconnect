/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import {
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  GridOptions,
  GridReadyEvent,
  GridState,
  ICellRendererParams,
  IsFullWidthRowParams,
  RowHeightParams,
} from 'ag-grid-community';
import { InterfaceTabelActionCellRenderer } from '../cell-renderers/interface-table-action-cell-render';
import { SubscriptHeaderComponent } from '../cell-renderers/subscript-header';

const isGroupRow = (p: any) => !!p.data?.groupHeader;
const sub = (base: string, sub: string) => `${base}<sub>${sub}</sub>`;

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    sortable: false,
    filter: false,
    resizable: false, // optional: prevents user causing scroll by resize
    flex: 1, // ✅ makes columns share available width
    wrapHeaderText: true, // ✅ header wraps instead of forcing width
    autoHeaderHeight: true,
    wrapText: true, //
  },
  pagination: false,
  components: {
    subscriptHeader: SubscriptHeaderComponent,
  },

  // ✅ make { groupHeader: "Interface type X" } rows span the whole grid
  isFullWidthRow: (p: any) => !!p.data?.groupHeader,

  fullWidthCellRenderer: (p: ICellRendererParams) => {
    const label = p.data?.groupHeader ?? '';
    return `<div class="iface-type-row">${label}</div>`;
  },

  // ✅ nicer spacing like Figma
  getRowHeight: (p: RowHeightParams) => (p.data?.groupHeader ? 44 : 40),

  // ✅ styling hooks
  getRowClass: (p) => (p.data?.groupHeader ? 'row-iface-type' : ''),

  onCellClicked: (params) => {
    if (params.data?.groupHeader) {
      params?.event?.stopPropagation();
      return;
    }
  },

  onFirstDataRendered: (e: FirstDataRenderedEvent) => {
    requestAnimationFrame(() => e.api.sizeColumnsToFit());
  },
  onGridSizeChanged: (e) => e.api.sizeColumnsToFit(),
};

export const colDefs: (ColDef | ColGroupDef)[] = [
  {
    headerName: 'Interfc.\nkey',
    field: 'interfaceKey',
    flex: 0.6, // ✅ smaller share
    headerClass: 'h-plain',
    // ✅ Make "Interface type X" row span across all columns
    colSpan: (p) => (isGroupRow(p) ? 100 : 1),

    // ✅ Render group header label in the spanning cell
    cellRenderer: (p: ICellRendererParams) => {
      if (isGroupRow(p)) return `<div class="iface-type-row">${p.data.groupHeader}</div>`;
      return p.value ?? '';
    },

    cellClass: (p) => (isGroupRow(p) ? 'iface-type-cell' : ''),
  },

  {
    headerName: 'Structure 1',
    headerClass: 'hg-structure-one',
    children: [
      { headerName: 'Chain', field: 'structureOneChain', flex: 0.6, headerClass: 'h-structure-one', cellClass: 'c-structure-one' },
      {
        headerName: 'N_atoms',
        headerComponent: 'subscriptHeader',
        headerComponentParams: { html: 'N<sub>atoms</sub>' },
        field: 'structureOneNAtoms',
        flex: 0.9,
        headerClass: 'h-structure-one',
        cellClass: 'c-structure-one',
      },
      {
        headerName: 'N_residues',
        headerComponent: 'subscriptHeader',
        headerComponentParams: { html: 'N<sub>residues</sub>' },
        field: 'structureOneNResidues',
        flex: 1,
        headerClass: 'h-structure-one',
        cellClass: 'c-structure-one',
      },
    ],
  },

  {
    headerName: 'Structure 2',
    headerClass: 'hg-structure-two',
    children: [
      { headerName: 'Chain', field: 'structureTwoChain', flex: 0.6, headerClass: 'h-structure-two', cellClass: 'c-structure-two' },
      {
        headerName: 'N_atoms',
        headerComponent: 'subscriptHeader',
        headerComponentParams: { html: 'N<sub>atoms</sub>' },
        field: 'structureTwoNAtoms',
        flex: 0.9,
        headerClass: 'h-structure-two',
        cellClass: 'c-structure-two',
      },
      {
        headerName: 'N_residues',
        headerComponent: 'subscriptHeader',
        headerComponentParams: { html: 'N<sub>residues</sub>' },
        field: 'structureTwoNResidues',
        flex: 1,
        headerClass: 'h-structure-two',
        cellClass: 'c-structure-two',
      },
    ],
  },

  { headerName: 'Interfc.\narea, Å²', field: 'interfaceArea', flex: 1, headerClass: 'h-plain' },
  {
    headerName: 'ΔGkcal/mol',
    headerComponent: 'subscriptHeader',
    headerComponentParams: { html: 'Δ<sup>i</sup>G<br>kcal/mol' },
    field: 'interfaceEnergy',
    flex: 1,
    headerClass: 'h-plain',
  },
  {
    headerName: 'ΔGP-value',
    headerComponent: 'subscriptHeader',
    headerComponentParams: { html: 'Δ<sup>i</sup>G<br>P-value' },
    field: 'pValue',
    flex: 1,
    headerClass: 'h-plain',
  },
  { headerName: 'CSS', field: 'css', flex: 0.7, headerClass: 'h-plain' },

  // this is the one that usually causes horizontal scroll
  // {
  //   headerName: 'Found in\ncomplex',
  //   field: 'complexes',
  //   headerClass: 'h-plain',
  //   wrapText: true,
  //   autoHeight: true, // ✅ row grows instead of grid scrolling
  // },

  {
    headerName: 'Actions',
    colId: 'actions',
    headerClass: 'h-plain',
    cellRenderer: InterfaceTabelActionCellRenderer,
  },
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
