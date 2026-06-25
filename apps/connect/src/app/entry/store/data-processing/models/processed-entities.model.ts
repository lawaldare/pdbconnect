import { Molecule } from '../../../data-models/molecule.model';
import { QueryParamForHelpers } from '../../../helpers/molstar-helpers';
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
  allSegmentsInPrefAssembly: boolean;
  symmOpListForSegments: string[][];
  additionalData: {
    accession: string;
    boundaries: DomainsBoundaries[];
    segmentsResidNumbers: string[];
    selections: QueryParamForHelpers[][];
    selectionNames: string[];
    selectionsInPrefAssembly: boolean[];
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
  chainSymmOperators: { [authAsymId: string]: string[] };
  additionalData: {
    molecule: Molecule;
    selections: QueryParamForHelpers[][];
    selectionNames: string[];
    selectionsInPrefAssembly: boolean[];
  };
  molstarColorHex?: string;
}
