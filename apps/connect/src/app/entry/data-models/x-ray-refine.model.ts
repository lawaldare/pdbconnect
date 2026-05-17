export interface XRayRefine {
  EDS_resolution_low: SourceValue;
  EDS_resolution: SourceValue;
  DCC_R: SourceValue;
  DCC_Rfree: SourceValue;
  EDS_R: SourceValue;
  DataCompleteness: SourceValue;
  WilsonBestimate: SourceValue;
  TwinL: SourceValue;
  TwinL2: SourceValue;
  TransNCS: SourceValue;
  IoverSigma?: SourceValueStr;
  DCC_refinement_program: SourceValueStr;
  Fo_Fc_correlation: SourceValue;
  bulk_solvent_b: SourceValue;
  bulk_solvent_k: SourceValue;
  centric_outliers: SourceValue;
  acentric_outliers: SourceValue;
  numMillerIndices: SourceValue;
  'percent-free-reflections': SourceValue;
  'num-free-reflections': SourceValue;
}

interface SourceValue {
  source: string;
  value: number | undefined | null;
}
interface SourceValueStr {
  source: string;
  value: string | undefined | null;
}
