import { TableFilter, TableRow } from '../data-models-and-definitions/row-and-table.model';
import { WritableSignal } from '@angular/core';

export abstract class DataToTable {
  /**
   * All classes in this folder inherit from this
   * (have to implement abstract methods and attributes)
   */

  // Abstract attributes
  abstract molstarHardResetOnSelect: boolean;
  abstract protvistaForSelection: boolean;
  abstract topolViewerForSelection: boolean;
  abstract ligandEnvViewerForSelection: boolean;
  abstract displayFilters: boolean;

  // Abstract attributes (angular signals)
  abstract tableRows: WritableSignal<TableRow[]>;
  abstract tableFilters: WritableSignal<TableFilter[]>;

  // Abstract methods
  abstract generateTableData(pageInformation: any): TableRow[];
  abstract generateTableFilters(pageInformation: any): TableFilter[];
}
