import { detect } from 'detect-browser';

import { GetContextMenuItemsParams, GridOptions, MenuItemDef } from 'ag-grid-community';

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
    flex: 1,
    resizable: true,
    sortable: true,
    autoHeaderHeight: true,
    wrapHeaderText: true,
    wrapText: true,
  },
  // headerHeight: 36,
  ...agGridRowDefault,
  rowBuffer: 20,
  rowSelection: 'multiple',
  pagination: true,
  paginationPageSize: 20,
  suppressRowClickSelection: true,
  suppressRowDeselection: true,
  suppressCopyRowsToClipboard: true,
  alwaysShowHorizontalScroll: true,
  alwaysShowVerticalScroll: false,
  scrollbarWidth,
  sortingOrder: ['asc', 'desc'],
  suppressColumnVirtualisation: false,
  singleClickEdit: true,
  tooltipShowDelay: 0,
};
