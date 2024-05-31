export interface IntxType {
  atom: string;
  residue: string;
  count: number;
}

export interface IntxData {
  [key: string]: IntxType[];
}

export interface PDBIntxData {
  [key: string]: IntxData;
}

export interface IntxDataUrl {
  IntxUrl: string;
  interactions: PDBIntxData;
}
