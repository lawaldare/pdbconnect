export interface UniProtMapping {
  [key: string]: {
    identifier: string;
    mappings: UniProtMappingObj[];
    name: string;
  };
}

export interface GOMapping {
  [key: string]: {
    identifier: string;
    mappings: UniProtMappingObj[];
    name: string;
    category: string;
    definition: string;
  };
}

export interface ECMapping {
  [key: string]: {
    reaction: string;
    systematic_name: string;
    accepted_name: string;
    synonyms: string[];
    mappings: UniProtMappingObj[];
    identifier: string;
  };
}

export interface UniProtMappingObj {
  chain_id: string;
  end: UniProtResidMapping;
  entity_id: number;
  start: UniProtResidMapping;
  struct_asym_id: string;
  unp_end: number;
  unp_start: number;
  identity: number;
  coverage: number;
}

export interface UniProtResidMapping {
  author_insertion_code: string;
  author_residue_number: number;
  residue_number: number;
}

export interface SummaryStats {
  pdbs: number;
  ligands: number;
  interaction_partners: number;
  annotations: number;
  similar_proteins: number;
}
