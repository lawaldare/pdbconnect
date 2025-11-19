import { APIConservationData } from './pv-api-conservation-track-data.model';
import { APIVariationData } from './pv-api-variation-track-data.model';
import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';

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
export interface FixedSelectionInput {
  trackName: string;
  trackSegments: string; // e.g. "10-20,25-25,50-51"
  trackTooltip: string;
}
