export type LigIntAPIKeys =
  | 'AMIDEAMIDE'
  | 'AMIDERING'
  | 'CARBONPI'
  | 'CATIONPI'
  | 'DONORPI'
  | 'METSULPHURPI'
  | 'aromatic'
  | 'carbonyl'
  | 'hbond'
  | 'hydrophobic'
  | 'plane_plane'
  | 'polar'
  | 'vdw'
  | 'vdw_clash';

interface AtomCountsObj {
  atom: string;
  residue: string;
  count: number;
}

export interface LigIntCountsDictionary {
  clash?: AtomCountsObj[];
  covalent?: AtomCountsObj[];
  vdw_clash?: AtomCountsObj[];
  vdw?: AtomCountsObj[];
  hbond?: AtomCountsObj[];
  xbond?: AtomCountsObj[];
  ionic?: AtomCountsObj[];
  metal_complex?: AtomCountsObj[];
  aromatic?: AtomCountsObj[];
  hydrophobic?: AtomCountsObj[];
  carbonyl?: AtomCountsObj[];
  polar?: AtomCountsObj[];
  CARBONPI?: AtomCountsObj[];
  CATIONPI?: AtomCountsObj[];
  DONORPI?: AtomCountsObj[];
  HALOGENPI?: AtomCountsObj[];
  METSULPHURPI?: AtomCountsObj[];
  plane_plane?: AtomCountsObj[];
  AMIDEAMIDE?: AtomCountsObj[];
  AMIDERING?: AtomCountsObj[];
}

export interface LigIntHeatmapDataAPI {
  [key: string]: LigIntCountsDictionary;
}
