import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions } from 'ag-grid-community';

const isSmallScreen = window.innerWidth <= 1340;

export const gridOptions: GridOptions = {
  ...agGridOptionsBase,
  defaultColDef: {
    filter: false,
    sortable: false,
    autoHeight: true,
    resizable: false,
    suppressMovable: true,
  },
  paginationPageSize: isSmallScreen ? 3 : 5,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Sentence',
    field: 'sentence',
    flex: 4,
    wrapText: true,
  },
  {
    headerName: 'AI Score',
    field: 'aiScore',
    valueGetter: (params) => params.data.aiScore.toFixed(2),
    flex: 1,
  },
];
