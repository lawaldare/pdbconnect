export interface CarbohydrateResidue {
  author_residue_number: number;
  author_insertion_code: string;
  chem_comp_id: string;
  alternate_conformers: number;
  residue_number: number;
  chem_comp_name: string;
}

export interface CarbohydrateMolecule {
  entity_id: number;
  weight: number;
  molecule_name: string;
  in_chains: string[];
  in_struct_asyms: string[];
  chem_comp_list: {
    chem_comp_id: string;
    chem_comp_name: string;
    count: number;
  }[];
  chains: {
    struct_asym_id: string;
    residues: CarbohydrateResidue[];
    chain_id: string;
  }[];
}
