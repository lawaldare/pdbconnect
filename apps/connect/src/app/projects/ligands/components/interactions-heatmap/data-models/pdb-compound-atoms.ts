export type AtomDetail = {
  atom_name: string;
  pdb_name: string;
  element: string;
  leaving_atom: boolean;
  charge: number;
  stereo: boolean | string;
  aromatic: boolean;
  ideal_x: number;
  ideal_y: number;
  ideal_z: number;
};

export type PDBCompoundAtoms = {
  [key: string]: Array<AtomDetail>;
};
