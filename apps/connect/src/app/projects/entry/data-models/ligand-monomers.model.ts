export interface LigandMonomerAnnotation {
  type: string;
  interacting_entity: {
    entity_id: number;
    struct_asym_id: string;
    auth_asym_id: string;
    best_unp_accession: string;
    ec_number: number;
  };
}

export interface LigandMonomer {
  chain_id: string;
  author_residue_number: number;
  author_insertion_code: string;
  chem_comp_id: string;
  alternate_conformers: number;
  entity_id: number;
  struct_asym_id: string;
  residue_number: number;
  chem_comp_name: string;
  weight: number;
  carbohydrate_polymer: boolean;
  branch_name: string;
  bm_id: string;
  annotations: LigandMonomerAnnotation[];
  // augmented data from processing not in API
  in_pref_assembly?: boolean;
}
