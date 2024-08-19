export interface Molecule {
  ca_p_only: boolean;
  entity: number;
  chem_comp_ids: string[];
  gene_name: string[];
  in_chains: string[];
  in_struct_asyms: string[];
  length: number;
  molecule_name: string[];
  molecule_type: string;
  mutation_flag: string;
  number_of_copies: number;
  pdb_sequence: string;
  pdb_sequence_indices_with_multiple_residues: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  sample_preparation: string;
  sequence: string;
  source: MoleculeSource[];
  synonym: string;
  weight: number;
}

export interface MoleculeSource {
  expression_host_scientific_name: string;
  expression_host_tax_id: string;
  mappings: MoleculeSourceMapping[];
  organism_scientific_name: string;
  tax_id: number;
}

export interface MoleculeSourceMapping {
  end: { residue_number: number };
  start: { residue_number: number };
}
