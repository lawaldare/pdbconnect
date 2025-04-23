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
}
