export interface Molecule {
  ca_p_only: boolean;
  entity_id: number;
  chem_comp_ids: string[];
  gene_name?: string[];
  in_chains: string[];
  in_struct_asyms: string[];
  length?: number;
  molecule_name: string[];
  molecule_type: string;
  mutation_flag: string | null;
  number_of_copies: number;
  sequence?: string;
  pdb_sequence: string;
  pdb_sequence_indices_with_multiple_residues: {
    [key: string]: {
      three_letter_code: string;
      one_letter_code: string;
      parent_chem_comp_ids: string[];
    };
  };
  sample_preparation: string;
  source?: MoleculeSource[];
  synonym?: string;
  weight: number;
  /** Molecule formula and list of molecule name synonyms - available for bound molecules only */
  bound_details?: {
    /** E.g. "HEM" */
    chem_comp_id: string;
    /** E.g. "C34 H32 Fe N4 O4" */
    formula: string;
    synonyms: {
      /** E.g. "wwPDB", "DrugBank" */
      origin: string;
      /** E.g. "HEME", "PROTOHEME IX" */
      value: string;
    }[];
  }[];
  // augmented data from processing not in API
  in_struct_asyms_in_pref_assembly?: boolean[];
  in_chains_in_pref_assembly?: boolean[];
}

export interface MoleculeSource {
  expression_host_scientific_name: string;
  expression_host_tax_id: string;
  mappings: MoleculeSourceMapping[];
  organism_scientific_name: string;
  tax_id: number;
  strain?: string;
}

export interface MoleculeSourceMapping {
  end: { residue_number: number };
  start: { residue_number: number };
}
