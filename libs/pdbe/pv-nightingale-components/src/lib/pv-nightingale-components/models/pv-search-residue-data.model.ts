export interface PanelResidueDatum {
  resId: string;
  resName: string;
  uniprotIdx?: string;
  authorIdx?: string;
}
export interface CustomTrackPayload {
  rawText: string;
  numberingScheme: 'residue' | 'author' | 'uniprot';
  selectedUniProtAccession: string | null;
}
