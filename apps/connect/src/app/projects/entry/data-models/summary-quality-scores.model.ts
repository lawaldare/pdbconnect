export interface SummaryQualityScores {
  geometry_quality: number | null;
  data_quality: number | null;
  overall_quality: number | null;
  experiment_data_available: boolean | 'unknown';
}

export interface PdbRedoQualityScores {
  pdbid: string;
  ddatafit: {
    zdfree: number;
    'range-lower': number;
    'range-upper': number;
  };
  geometry: {
    dzscore: number;
    'range-lower': number;
    'range-upper': number;
  };
  'base-pairs'?: {
    drmsz: number;
    'range-lower': number;
    'range-upper': number;
  };
}

export interface ProcessedQualityScores {
  geometry: number | undefined;
  modelfit: number | undefined;
  basepairs?: number | undefined;
}
