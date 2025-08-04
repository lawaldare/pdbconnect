export interface ResidueListing {
  molecules: Array<{
    entity_id: number;
    chains: Array<{
      struct_asym_id: string;
      residues: ResidueListed[];
      chain_id: string;
    }>;
  }>;
}

export interface ResidueListed {
  residue_number: number;
  residue_name: string;
  author_residue_number: number;
  author_insertion_code: string;
  observed_ratio: number;
}
