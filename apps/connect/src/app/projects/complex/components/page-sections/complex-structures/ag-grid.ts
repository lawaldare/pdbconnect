import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions, GridState } from 'ag-grid-community';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';
import { EntryPageExternalLinkRendererComponent } from './entry-page-link.component';
import { CustomHeaderComponent } from '../../cell renderers/custom-header.component';

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    ...agGridOptionsBase.defaultColDef,
    // sortable: false,
    // headerComponentParams: { showHelpIcon: false, tooltipText: '' },
  },
  // rowSelection: {
  //   mode: 'singleRow',
  // },
};

export const colDefs: ColDef[] = [
  {
    headerName: 'PDB',
    field: 'pdb_id',
    cellRenderer: EntryPageExternalLinkRendererComponent,
    width: 90,
    // headerComponentParams: { tooltipText: 'Composite index consisting of PDB identifier and assembly identifier.' },
    sortable: false,
  },
  {
    headerName: 'ID',
    field: 'assembly_id',
    // valueGetter: (params) => `${params.data.pdb_id}_${params.data.assembly_id}`,
    width: 60,
    headerComponentParams: { showHelpIcon: true, tooltipText: 'Composite index consisting of PDB identifier and assembly identifier.' },
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
    // suppressHeaderFilterButton: true,
    width: 120,
    // headerComponentParams: {
    //   showHelpIcon: true,
    //   tooltipText: 'Indicates the level of detail present in the 3D structure. Smaller value means finer details of the structure and higher quality.',
    // },
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

export const rowSelection: any = {
  mode: 'singleRow',
  headerCheckbox: false,
  checkboxes: false,
  enableClickSelection: true,
};

// export const selectionColumnDef = {
//   sortable: false,
//   width: 80,
//   maxWidth: 80,
//   suppressHeaderMenuButton: false,
//   headerName: 'Show',
// };
