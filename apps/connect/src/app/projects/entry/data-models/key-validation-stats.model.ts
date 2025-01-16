export interface KeyValidationStats {
  bonds: ValidationStat;
  angles: ValidationStat;
  rna_suite: ValidationStat;
  rna_pucker: ValidationStat;
  protein_ramachandran: ValidationStat;
  protein_sidechains: ValidationStat;
  RSRZ: ValidationStat;
}

export interface ValidationStat {
  rmsz?: number;
  num_checked: number;
  num_outliers: number;
  percent_outliers: string | null | undefined;
}
