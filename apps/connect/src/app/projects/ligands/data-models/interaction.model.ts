export interface AtomResidueintx {
  [key: string]: IntxType;
}

export interface IntxType {
  [key: string]: Array<[atom: string, residue: string, count: number]>;
}
