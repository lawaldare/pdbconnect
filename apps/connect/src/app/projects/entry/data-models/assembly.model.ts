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
