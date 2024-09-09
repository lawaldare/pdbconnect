import { LigIntHeatmapData } from "./lig-int-heatmap-data";

export interface ViewerData {
  atomNames: string[];
  length: number;
  averages: any;
  xDomain: number[];
  yDomain: string[];
  heatmap: any;
  originalHeatmap: any;
  sortType: string;
  freqType: string;
  validFilters: string[];
  filters: string[];
  toFilter: {
    atomName: string;
    interactionType: string;
    aminoAcid: string;
    aminoAcidNumber: number;
  }[];
  dataKeyToIdx: { [key: string]: number };
  totalInteractions: number;
  maxFreq: number;
}
