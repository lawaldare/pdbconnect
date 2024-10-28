export interface Substructure {
  fragments: Fragment[];
  scaffolds: Fragment[];
}

export interface Fragment {
  name: string;
  atoms: string[][];
  descriptors: Descriptor;
}

export interface Descriptor {
  inchi: string;
  inchikey: string;
  smiles: string;
}

export interface LigandStructuresAPIResponse {
  [key: string]: LigandStructure[];
}

export interface LigandStructure {
  uniprot_id: string;
  name: string;
  ec_numbers: string[];
  interacting_chains: Chain[];
  annotations: string[];
  pdb_id?: string;
  num_ligand_instances: number;
}

export interface Chain {
  pdb_id: string;
  auth_asym_id: string;
  struct_asym_id: string;
  organisms: Organism[];
  entity_name: string;
}

export interface Organism {
  common_name: string;
  scientific_name: string;
}

export interface Resolution {
  x: number;
  y: number;
}

export interface SVGPath {
  d: string;
  fill: string;
}

export interface AtomDepiction {
  labels: SVGPath[];
  name: string;
  x: number;
  y: number;
}

export interface BondDepiction {
  bgn: string;
  coords: string;
  end: string;
  style: string;
}

export interface Depiction {
  atoms: AtomDepiction[];
  bonds: BondDepiction[];
  ccd_id: string;
  resolution: Resolution;
}
