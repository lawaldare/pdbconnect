import { agGridOptionsBase } from '@pdbc/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { SentenceRendererComponent } from './sentence.component';
import { CustomHeaderComponent } from './custom-header.component';

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
  enableCellTextSelection: true,
  paginationPageSize: isSmallScreen ? 3 : 5,
  suppressDragLeaveHidesColumns: true,
};

export const colDefs: ColDef[] = [
  {
    headerName: 'Sentence',
    field: 'sentence',
    cellRenderer: SentenceRendererComponent,
    flex: 4,
    wrapText: true,
  },
  {
    headerName: 'AI Score',
    field: 'aiScore',
    headerComponent: CustomHeaderComponent,
    headerComponentParams: {
      showHelpIcon: true,
      enableFilterButton: false,
      tooltipText:
        'This score ranges from 0 to 1 and reflects the model’s confidence in the annotation with higher values indicating higher probability. This does not represent a ground truth.',
    },
    valueGetter: (params) => Math.floor(params.data.aiScore * 100) / 100,
    flex: 1,
  },
];
