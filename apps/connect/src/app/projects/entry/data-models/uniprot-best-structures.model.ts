export interface BestStructureDict {
  [key: string]: BestStructureMapping[];
}

export interface BestStructureMapping {
  pdb_id: string;
  chain_id: string;
  experimental_method: string;
  tax_id: number;
  coverage: number;
  resolution: number;
  start: number;
  end: number;
  unp_start: number;
  unp_end: number;
}
