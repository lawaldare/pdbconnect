export interface BoundMolecule {
  bm_id: string;
  composition: {
    ligands: LigandComposition[];
    connections: string[][];
  };
}

interface LigandComposition {
  chain_id: string;
  author_residue_number: number;
  chem_comp_id: string;
  author_insertion_code: string;
  entity: number;
  molecule_type: string;
}
