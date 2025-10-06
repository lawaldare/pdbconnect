/* eslint-disable @typescript-eslint/no-explicit-any */

import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { CustomHeaderComponent } from '../../cell renderers/custom-header.component';
import { pisaTableTooltip } from '../../../complex.constant';
import { ComplexPageExternalLinkRendererComponent } from '../../../shared/complex-page-external-link.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    flex: 1,
    filter: true,
    sortable: true,
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB',
    field: 'pdb_id',
    cellRenderer: ComplexPageExternalLinkRendererComponent,
    flex: 0.6,
    filter: true,
  },
  {
    headerName: 'ID',
    field: 'assembly_id',
    flex: 0.4,
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, tooltipText: 'Assembly identifier' },
    sortable: false,
  },
  {
    headerName: 'Acc. SA (Å²)',
    field: 'accessible_surface_area',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, enableSorting: true, tooltipText: pisaTableTooltip.ASA },
  },
  {
    headerName: 'Bur. SA (Å²)',
    field: 'buried_surface_area',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, enableSorting: true, tooltipText: pisaTableTooltip.BSA },
  },
  {
    headerName: 'Solv. ΔG (kcal/mol)',
    field: 'solvation_energy_gain',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, enableSorting: true, tooltipText: pisaTableTooltip.SEA },
  },
  {
    headerName: 'Diss. ΔG (kcal/mol)',
    field: 'dissociation_energy',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, enableSorting: true, tooltipText: pisaTableTooltip.DEG },
  },
  {
    headerName: 'Diss. TΔS (kcal/mol)',
    field: 'dissociation_entropy',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, enableSorting: true, tooltipText: pisaTableTooltip.DEP },
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
