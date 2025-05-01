/**
 * Generic types for all table row data and filters
 */

import { ModifiedResidue } from '../../../../data-models/modified-residues.model';
import { Molecule } from '../../../../data-models/molecule.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';

export type TableRow = AssembliesRowData | MacromoleculesRowData | LigandsRowData | DomainsRowData;

export interface TableFilter {
  types: string[];
  description: string;
}

/**
 * Assemblies table row data
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
    interfaceCount: string;
    selections: MolstarSelectionObj[];
  };
}

/**
 * Macromolecules table row data
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
    selectionNames: string[];
    uniprotAccessions: string[];
  };
  mappedResidues?: any[];
}

/**
 * Ligands and Environments table row data
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
    selectionNames: string[];
  };
}

/**
 * Domains table row data
 */

export interface DomainsBoundaries {
  chain: string;
  entity: number;
  start: number;
  end: number;
}

export interface DomainsRowData {
  accessionName: string;
  resource: string;
  domain: string;
  moleculeNames: string[];
  segments: string[];
  segmentsAsText: string;
  additionalData: {
    accession: string;
    boundaries: DomainsBoundaries[];
    segmentsResidNumbers: string[];
    selections: MolstarSelectionObj[];
    selectionNames: string[];
  };
  mappedboundaries?: string[];
}
