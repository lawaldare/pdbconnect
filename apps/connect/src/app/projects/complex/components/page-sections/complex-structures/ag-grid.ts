import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';
import { CustomHeaderComponent } from '../../cell renderers/custom-header.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    // sortable: false,
    headerComponentParams: { showHelpIcon: false, tooltipText: '' },
  },
  rowSelection: {
    mode: 'singleRow',
  },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB ID',
    field: 'pdb_id',
    // valueGetter: (params) => `${params.data.pdb_id}_${params.data.assembly_id}`,
    width: 120,
    headerComponentParams: { showHelpIcon: true, tooltipText: 'Composite index consisting of PDB identifier and assembly identifier.' },
  },
  {
    headerName: 'Assembly ID',
    field: 'assembly_id',
    // valueGetter: (params) => `${params.data.pdb_id}_${params.data.assembly_id}`,
    width: 60,
    headerComponentParams: { showHelpIcon: true, tooltipText: 'Composite index consisting of PDB identifier and assembly identifier.' },
  },
  {
    headerName: 'Title',
    field: 'title',
    cellRenderer: TitleRendererComponent,
    width: 160,
  },
  { headerName: 'Exp. method', field: 'experimental_method', width: 170 },
  {
    headerName: 'Res. (Å)',
    field: 'resolution',
    suppressHeaderFilterButton: true,
    width: 140,
    headerComponentParams: {
      showHelpIcon: true,
      tooltipText: 'Indicates the level of detail present in the 3D structure. Smaller value means finer details of the structure and higher quality.',
    },
  },
];

export const components: {
  [p: string]: any;
} = {
  agColumnHeader: CustomHeaderComponent,
};

export const initialState: GridState = {
  rowSelection: ['0'],
};

export const selectionColumnDef = {
  sortable: false,
  width: 80,
  maxWidth: 80,
  suppressHeaderMenuButton: false,
  headerName: 'Show',
};
