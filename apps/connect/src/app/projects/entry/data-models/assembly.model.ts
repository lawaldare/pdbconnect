export interface AssemblyEntity {
  entity_id: number;
  in_chains: string[];
  molecule_type: string;
  number_of_copies: number;
  molecule_name: string[];
}

export interface AssemblyData {
  entities: AssemblyEntity[];
  assembly_id: string;
  assembly_composition: string;
  molecular_weight: number;
  polymeric_count: number;
  details: string;
}

export interface RotationAxis {
  order: number;
  start: number[];
  end: number[];
}

export interface Symmetry {
  assembly_id: string;
  symbol: string;
  type: string;
  oligometric_state: string;
  stoichiometry: string;
  rotation_axes: RotationAxis[];
}
