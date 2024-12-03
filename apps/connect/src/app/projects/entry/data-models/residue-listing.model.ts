export interface ResidueOfListing {
  residue_number: number;
  residue_name: string;
  author_residue_number: number;
  author_insertion_code: string;
  observed_ratio: number;
}

export interface ResidueListing {
  molecules: {
    entity_id: number;
    chains: {
      struct_asym_id: string;
      residues: ResidueOfListing[];
      chain_id: string;
    }[];
  }[];
}
