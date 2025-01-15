import { detect } from 'detect-browser';

import { GridOptions, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy } from 'ag-grid-community';

function isWebkitScrollbarSupported() {
  // https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar
  return browser && (['chrome', 'safari', 'edge-chromium', 'opera'].includes(browser.name) || (browser.name === 'edge' && parseFloat(browser.version) >= 79));
}

const browser = detect();
export const browserSupport = {
  webkitScrollbar: isWebkitScrollbarSupported(),
};

export const scrollbarWidth = browserSupport.webkitScrollbar ? 8 : undefined; // also change `$scrollbar-width`

const agGridRowDefault: GridOptions = {
  rowHeight: 45,
  rowStyle: { 'line-height': '28px' },
};

export const AG_Grid_Theme_Class = 'ag-theme-quartz';

// https://www.ag-grid.com/javascript-grid-properties/
export const agGridOptionsBase: GridOptions = {
  defaultColDef: {
    filter: true,
    // flex: 1,
    resizable: true,
    sortable: true,
    autoHeaderHeight: true,
    wrapHeaderText: true,
    wrapText: true,
    autoHeight: true,
  },
  rowSelection: {
    mode: 'multiRow',
    enableClickSelection: false,
    copySelectedRows: false,
  },
  ...agGridRowDefault,
  rowBuffer: 20,
  pagination: true,
  paginationPageSize: 20,
  alwaysShowHorizontalScroll: true,
  alwaysShowVerticalScroll: false,
  scrollbarWidth,
  sortingOrder: ['asc', 'desc'],
  suppressColumnVirtualisation: false,
  singleClickEdit: true,
  tooltipShowDelay: 0,
};

export const autoSizeStrategy: SizeColumnsToFitGridStrategy | SizeColumnsToFitProvidedWidthStrategy | SizeColumnsToContentStrategy = {
  type: 'fitGridWidth',
  defaultMinWidth: 100,
};
