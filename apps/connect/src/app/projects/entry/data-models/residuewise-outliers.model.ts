export interface ResidueWiseOutliersMolecule {
  entity_id: number;
  chains: ResidueWiseOutliersChain[];
}

export interface ResidueWiseOutliersChain {
  struct_asym_id: string;
  chain_id: string;
  models: ResidueWiseOutliersModel[];
}

export interface ResidueWiseOutliersModel {
  model_id: number;
  residues: OutlierResidues[];
}

export interface OutlierResidues {
  residue_number: number;
  author_residue_number: number;
  author_insertion_code: string | null;
  alt_code: string;
  outlier_types: string[];
}
