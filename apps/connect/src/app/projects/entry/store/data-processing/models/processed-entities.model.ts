import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Molecule } from '../../../data-models/molecule.model';
import { MappedResidue } from './other-models';

export interface DomainsBoundaries {
  chain: string;
  entity: number;
  start: number;
  end: number;
}

export interface ProcessedDomain {
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
    selections: QueryParam[][];
    selectionNames: string[];
  };
  mappedboundaries?: string[];
  molstarColorHex?: string;
}

export interface ProcessedMacromolecule {
  name: {
    molecule: string;
    chains: string[];
  };
  length: number;
  organisms: string[];
  genes: string[];
  additionalData: {
    molecule: Molecule;
    selections: QueryParam[][];
    selectionNames: string[];
  };
  mappedResiduesByChain?: { [key: string]: MappedResidue };
  molstarColorHex?: string;
}
