export interface Fileitem {
  label: string;
  url: string;
}

export interface LigandFileItem {
  downloads: Fileitem[];
  views: Fileitem[];
}

export interface LigandFile {
  ligand: LigandFileItem;
}

export interface PDBLigandFile {
  [key: string]: LigandFile;
}

export interface DownloadOption {
  name: string;
  url: string;
  downloadable: boolean;
}
