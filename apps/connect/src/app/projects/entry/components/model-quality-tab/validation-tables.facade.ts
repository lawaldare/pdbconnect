import { Injectable } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community'; // Column Definition Type Interface
import {
  VALIDATION_COLUMN_DEFS,
  XRAY_DATASET_REFINEMENT_COLUMN_DEFS,
  NMR_SAMPLE_COLUMN_DEFS,
  EM_SPECIMEN_PREP_COLUMN_DEFS,
  EM_VITRIFICATION_COLUMN_DEFS,
  EM_REFINEMENT_STATS_COLUMN_DEFS,
  EXP_RAW_ACCESSIONS_COLUMN_DEFS,
  TIMELINE_COLUMN_DEFS,
  EXPERIMENTAL_INFO_COLUMN_DEFS,
  EXPERIMENTAL_INFO_DATA_QUALITY_COLUMN_DEFS,
} from './data-models-and-definitions/column-definition-objects';

export interface ValidationXRayRow {
  metric: string;
  value: string[];
  source: string;
}

export interface ValidationSamplesRow {
  sample: string;
  contents: string[];
  recorded_spectra: string;
}

@Injectable({
  providedIn: 'root',
})
export class ValidationTablesFacade {
  // column definitions for all experiments and validation tables
  public validationColumnDefinitions = VALIDATION_COLUMN_DEFS;
  public xRayDatasetColumnDefinitions = XRAY_DATASET_REFINEMENT_COLUMN_DEFS;
  public xRayRefinementColumnDefinitions = XRAY_DATASET_REFINEMENT_COLUMN_DEFS;
  public nmrSampleColumnDefinitions = NMR_SAMPLE_COLUMN_DEFS;
  public emSpecimenPrepColumnDefinitions = EM_SPECIMEN_PREP_COLUMN_DEFS;
  public emVitrificationColumnDefinitions = EM_VITRIFICATION_COLUMN_DEFS;
  public emRefinementStatsColumnDefinitions = EM_REFINEMENT_STATS_COLUMN_DEFS;
  public expRawAccessionsColumnDefinitions = EXP_RAW_ACCESSIONS_COLUMN_DEFS;
  public timelineColumnDefinitions = TIMELINE_COLUMN_DEFS;

  public experimentalInfoColumnDefinitions = EXPERIMENTAL_INFO_COLUMN_DEFS;
  public experimentalInfoDataQualityColumnDefinitions = EXPERIMENTAL_INFO_DATA_QUALITY_COLUMN_DEFS;

  public defaultColumnDefinitions: ColDef = {
    filter: false,
    sortable: false,
  };

  // grid options used for most tables (except expRawAccessionsColumnDefinitions, see below)
  public gridOptions: GridOptions = {
    suppressHorizontalScroll: true,
    domLayout: 'autoHeight',
    paginationPageSizeSelector: false,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
  };

  /**
   * Function for dynamically creating gridOptions with a header based on data
   * (See headerValueGetter in expRawAccessionsColumnDefinitions)
   */
  getGridOptionsExpRaw(name: string): GridOptions {
    // returns gridOptions with a dynamic header
    return {
      context: {
        firstHeader: `${name} accession`,
      },
      suppressHorizontalScroll: true,
      domLayout: 'autoHeight',
      paginationPageSizeSelector: false,
      enableCellTextSelection: true,
      suppressRowClickSelection: true,
    };
  }
}
