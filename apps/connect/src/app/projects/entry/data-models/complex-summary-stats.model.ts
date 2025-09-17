export interface ComplexSummaryStats {
  [key: string]: ComplexStats;
}

export interface ComplexStats {
  pdb_complex_id: string | undefined;
  preferred_assembly: boolean;
  pdbs: number;
  ligands: number;
  subcomplexes: number;
  supercomplexes: number;
}
