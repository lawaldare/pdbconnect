import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { OutlierResidues } from '../../../data-models/residuewise-outliers.model';

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
  molstarSelectionsByOutlierType: Record<string, QueryParam[]>;
  residuesWith1Outlier: QueryParam[];
  residuesWith2Outliers: QueryParam[];
  residuesWith3OrMoreOutliers: QueryParam[];
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

export interface LabelUniProtMappingRows {
  uniprotId: string;
  isCanonical: boolean;
  coverage: string;
  identity: string;
  chainIds: string[];
  uniprotSegments: string[];
  labelSegments: string[];
}
export interface UniProtMappingRows {
  uniprotId: string;
  isCanonical: boolean;
  coverage: string;
  identity: string;
  chainIds: string[];
  uniprotSegments: string[];
  authSegments: string[];
  hasNonObserved: boolean;
  labelSegments: string[];
}

export enum MobileTabChips {
  MQuality = 'MQuality',
  Assemblies = 'Complexes',
  Macromolecules = 'Macromolecules',
  Ligands = 'Ligands',
  Domains = 'Domains',
}

export type FlatOutlierResidue = OutlierResidues & { entity_id: number; chain_id: string; struct_asym_id: string };
