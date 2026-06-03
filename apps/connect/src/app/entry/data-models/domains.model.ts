interface ResidueIds {
  author_insertion_code: string;
  author_residue_number: number;
  residue_number: number;
}

export interface DomainMapping {
  entity_id: number;
  chain_id: string;
  struct_asym_id: string;
  start: ResidueIds;
  end: ResidueIds;
  segment_id?: number;
  scop_id?: string;
  domain?: string;
}

export interface CathMappings {
  [key: string]: {
    class: string;
    architecture: string;
    topology: string;
    homology: string;
    identifier: string;
    mappings: DomainMapping[];
    name: string;
  };
}

export interface ScopMappings {
  [key: string]: {
    class: string;
    description: string;
    fold: string;
    identifier: string;
    mappings: DomainMapping[];
    sccs: string;
    superfamily: {
      description: string;
      sunid: number;
    };
  };
}

export interface PfamMappings {
  [key: string]: {
    description: string;
    identifier: string;
    mappings: DomainMapping[];
    name: string;
  };
}

export interface InterProMappings {
  [key: string]: {
    name: string;
    mappings: DomainMapping[];
    identifier: string;
  };
}

export interface RfamMappings {
  [key: string]: {
    identifier: string;
    family: string;
    mappings: DomainMapping[];
    clan: string;
    clan_identifier: string;
    clan_description: string;
  };
}
