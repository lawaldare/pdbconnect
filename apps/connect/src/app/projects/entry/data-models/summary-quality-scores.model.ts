export interface SummaryQualityScores {
  geometry_quality: number | null;
  data_quality: number | null;
  overall_quality: number | null;
  experiment_data_available: boolean | 'unknown';
}

export interface ProcessedQualityScores {
  geometry: number | undefined;
  modelfit: number | undefined;
}
