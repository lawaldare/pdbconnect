export interface PolymerCoverageMolecule {
  entity_id: number;
  chains: PolymerCoverageChain[];
  in_chains_in_pref_assembly?: boolean[]; // added for processing
}

export interface PolymerCoverageChain {
  struct_asym_id: string;
  chain_id: string;
  observed: ObservedSegments[];
}

export interface ObservedSegments {
  start: ObservedResidue;
  end: ObservedResidue;
}

export interface ObservedResidue {
  residue_number: number;
  author_residue_number: number;
  author_insertion_code: string | null;
  struct_asym_id: string;
}
