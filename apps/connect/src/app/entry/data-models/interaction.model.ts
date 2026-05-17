export interface InteractionFromAPI {
  ligand: {
    author_residue_number: number;
    chain_id: string;
    chem_comp_id: string;
    author_insertion_code: string;
  };
  interactions: Interaction[];
}
export interface Interaction {
  ligand_atoms: string[];
  end: {
    author_residue_number: number;
    chain_id: string;
    chem_comp_id: string;
    atom_names: string[];
    author_insertion_code: string;
  };
  interaction_type: string;
  interaction_details: string[];
  distance: number;
}
