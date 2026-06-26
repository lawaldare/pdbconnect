export interface LLMAnnotation {
  pubmedId: number;
  pmcId: string;
  doi: string;
  primaryCitation: string;
  openAccess: string;
  pdbResidue: number;
  authorResidueNumber: number;
  pdbChain: string;
  uniprotAccession: string;
  uniprotResidue: number;
  sentence: string;
  section: string;
  exact: string;
  entityType: string;
  annotator: string;
  aiScore: number;
}
