export interface Structure {
  name: string;
  id: string;
  ec_number: string;
  annotation: string;
  count: number;
  rep_structure: string;
}

export interface Substructure {
  fragments: Fragment;
  scaffold: Scaffold;
}

export interface Fragment {
  [key: string]: Array<string[]>;
}

export interface Scaffold {
  [key: string]: string[];
}

export interface PDBSubstructures {
  [key: string]: Substructure[];
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
