import { ModifiedResidue } from '../../../data-models/modified-residues.model';
import { Molecule } from '../../../data-models/molecule.model';
import { MolstarSelectionObj } from '../../../helpers/molstar/molstar-helpers';

/**
 * Generic types
 */

export type TableRow = AssembliesRowData | MacromoleculesRowData | LigandsRowData | DomainsRowData;

export interface TableFilter {
  types: string[];
  description: string;
}

/**
 * Assemblies table
 */

export interface AssembliesRowData {
  assemblyId: string;
  assemblyName: string;
  moleculeNames: string[];
  complexId: string;
  complexName: string;
  multimericStates: string;
  additionalData: {
    accessibleSurfaceArea: string;
    buriedSurfaceArea: string;
    dissociationArea: string;
    dissociationEnergy: string;
    dissociationEntropy: string;
    symmetryNumber: string;
    selections: MolstarSelectionObj[];
  };
}

/**
 * Macromolecules table
 */

export interface MacromoleculesName {
  molecule: string;
  chains: string[];
}

export interface MacromoleculesResidueRanges {
  range: string;
  coverage: string;
  uniprot: string;
  chainId?: string;
}

export interface MacromoleculesRowData {
  name: MacromoleculesName;
  length: number;
  residues: MacromoleculesResidueRanges[];
  organisms: string[];
  genes: string[];
  additionalData: {
    molecule: Molecule;
    selections: MolstarSelectionObj[];
    uniprotAccessions: string[];
  };
}

/**
 * Ligands and Environments table
 */

export interface LigandsCodeAndName {
  count: number;
  name: string;
}

export interface LigandsAnnotation {
  description: string;
  isChip: boolean;
}

export interface LigandsRowData {
  type: string;
  id: string;
  codeAndName: LigandsCodeAndName;
  annotation: LigandsAnnotation;
  additionalData: {
    source: Molecule | ModifiedResidue[];
    selections: MolstarSelectionObj[];
  };
}

/**
 * Domains table
 */

export interface DomainsBoundaries {
  chain: string;
  entity: number;
  start: number;
  end: number;
}

export interface DomainsRowData {
  domainName: string;
  resource: string;
  domain: string;
  moleculeNames: string[];
  segments: string[];
  additionalData: {
    accession: string;
    boundaries: DomainsBoundaries[];
    segmentsResidNumbers: string[];
    selections: MolstarSelectionObj[];
  };
}
