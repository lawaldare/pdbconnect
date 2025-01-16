export interface UniProtMapping {
  [key: string]: {
    identifier: string;
    mappings: UniProtMappingObj[];
    name: string;
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
}

export interface UniProtResidMapping {
  author_insertion_code: string;
  author_residue_number: number;
  residue_number: number;
}
