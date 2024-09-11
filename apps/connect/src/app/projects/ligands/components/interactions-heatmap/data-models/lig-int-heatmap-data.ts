export type HotmapLigDatum = {
  score: number;
  start: number;
  residue?: string;
  atomName: string;
  [key: string]: unknown;
};
export type LigIntHeatmapData = Array<HotmapLigDatum>;
