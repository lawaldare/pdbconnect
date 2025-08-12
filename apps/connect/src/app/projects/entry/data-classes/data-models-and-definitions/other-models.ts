import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';

export interface PreferredAssemblyData {
  name: string;
  preferred: number;
  composition: string | undefined;
  complexId: string | undefined;
}

export interface EntryDescription {
  macromoleculesDescription: string;
  entryContentsDescription: string[];
}

export interface OutlierDict {
  uniqueOutlierTypes: Set<string>;
  molstarSelectionsByOutlierType: Record<string, MolstarSelectionObj>;
  residuesWith1Outlier: MolstarSelectionObj;
  residuesWith2Outliers: MolstarSelectionObj;
  residuesWith3OrMoreOutliers: MolstarSelectionObj;
}

export type OutliersByModelId = Record<string, OutlierDict>;

export type TableNames = 'Assemblies' | 'Macromolecules' | 'Ligands' | 'Domains' | 'LLM';

export interface ValueLabel {
  value: string;
  label: string;
  shell?: string;
}

export interface Filter {
  types: string[];
  description: string;
}

// this types are used by this file and the facade and related to sequence rendering
export interface SequenceDetail {
  title: string;
  fullSequence: string;
  segments: {
    sequence: string;
    color?: string;
  }[];
}

export interface MappedResidue {
  range: string[];
  coverage: string;
  chainId: string;
  uniprot: string;
  open: boolean;
}

export enum MobileTabChips {
  MQuality = 'MQuality',
  Assemblies = 'Assemblies',
  Macromolecules = 'Macromolecules',
  Ligands = 'Ligands',
  Domains = 'Domains',
}
