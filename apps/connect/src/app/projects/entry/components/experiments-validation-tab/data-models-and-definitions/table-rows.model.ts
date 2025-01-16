export interface ValidationInfoRow {
  metric: string;
  description: string;
}
export interface XRayStatsRow {
  metric: string;
  value: string[];
  source: string;
}
export interface NMRSampleRow {
  sample: string;
  contents: string[];
  recordedSpectra: string;
}
export interface EMSpecimenPrepRow {
  bufferName: string;
  ph: string;
  details: string;
}
export interface EMVitrificationRow {
  cryogen: string;
  temperature: string;
  instrument: string;
  humidity: string;
  details: string;
}
export interface EMRefinementStatsRow {
  solutionMethod: string;
  resolution: string;
}

export interface ExperimentRawRow {
  resource: string;
  accession: string;
  datasets: string;
  totalSize: string;
  link?: string;
  // imgName: string | undefined;
}
