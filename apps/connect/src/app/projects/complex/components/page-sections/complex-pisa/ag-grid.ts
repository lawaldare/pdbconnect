import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { CustomHeaderComponent } from '../../cell renderers/custom-header.component';
import { pisaTableTooltip } from '../../../complex.constant';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    flex: 1,
    filter: true,
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB ID',
    field: 'pdb_id',
    // sort: 'asc',
    flex: 0.6,
    filter: true,
    sortable: true,
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
    headerName: 'Accessible Surface Area',
    field: 'accessible_surface_area',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, tooltipText: pisaTableTooltip.ASA },
  },
  {
    headerName: 'Buried Surface Area',
    field: 'buried_surface_area',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, tooltipText: pisaTableTooltip.BSA },
  },
  {
    headerName: 'Solvation Energy Gain',
    field: 'solvation_energy_gain',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, tooltipText: pisaTableTooltip.SEA },
  },
  {
    headerName: 'Dissociation Energy',
    field: 'dissociation_area',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, tooltipText: pisaTableTooltip.DEG },
  },
  {
    headerName: 'Dissociation Entropy',
    field: 'dissociation_entropy',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: { showHelpIcon: true, enableFilterButton: false, tooltipText: pisaTableTooltip.DEP },
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
