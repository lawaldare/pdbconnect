export interface SameScaffold {
  chem_comp_id: string;
  name: string;
  substructure_match: string[];
}

export interface SimilarLigand {
  chem_comp_id: string;
  name: string;
  similarity_score: number;
  substructure_match: string[];
}

export interface StereoIsomer {
  chem_comp_id: string;
  name: string;
}

export interface RelatedLigand {
  stereoisomers: StereoIsomer[];
  same_scaffold: SameScaffold[];
  similar_ligands: SimilarLigand[];
}

export interface PDBRelatedLigands {
  [key: string]: RelatedLigand[];
}

export interface BoundEntries {
  [key: string]: string[];
}
