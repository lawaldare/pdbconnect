import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { CathMappings, InterProMappings, PfamMappings, ScopMappings } from '../data-models/domains.model';
import { AnyExperimentDetail } from '../data-models/experimental-details.model';
import { Molecule } from '../data-models/molecule.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import { ProcessedSummary } from '../data-models/summary.model';
import { BestStructureMapping } from '../data-models/uniport-best-structures.model';
import { UniProtMapping } from '../data-models/uniprot-mapping.model';
import { ProcessedQualityScores } from '../data-models/summary-quality-scores.model';
import { ModifiedResidue } from '../data-models/modified-residues.model';
import { KeyValidationStats } from '../data-models/key-validation-stats.model';
import { XRayRefine } from '../data-models/x-ray-refine.model';
import { CitationDetail } from '../data-models/publication.model';
import { RelatedPublication } from '../data-models/related-publications.model';
import { ComplexDetails } from '../data-models/complex-details.model';
import { PisaAssembly } from '../data-models/pisa-assembly.model';
import { AssemblyData } from '../data-models/assembly.model';
import { CarbohydrateMolecule } from '../data-models/carbohydrate-polymer.model';
import {
  BMRBExperimentRawData,
  EMPIARExperimentRawData,
  IRRMCExperimentRawData,
  PDBExperimentRawData,
  SBGRIDExperimentRawData,
} from '../data-models/experiment-raw-data.model';
import { EntryStatus } from '../data-models/status.model';

export interface EntryStoreState {
  entryId: string;
  summaryData: ProcessedSummary;
  macroMolecules: Molecule[];
  boundLigands: Molecule[];
  organismScientificNames: string[];
  hasRNA: boolean;
  experimentalDetails: AnyExperimentDetail[];
  resolutionValues: (number | undefined)[];
  experimentalMethod: string;
  uniprotMapping: UniProtMapping;
  uniprotCountsInPDBe: Record<string, number>;
  bestStructuresMappingsByUniProtIds: Record<string, BestStructureMapping[]>;
  proteinPagesSummaryByUniProtIds: Record<string, ProteinSummaryStats>;
  interproMapping: InterProMappings;
  pfamMapping: PfamMappings;
  downloadOptions: DownloadOption[];
  viewOptions: DownloadOption[];
  summaryQualityScores: ProcessedQualityScores;
  cathMapping: CathMappings;
  scop175Mapping: ScopMappings;
  modifications: ModifiedResidue[];
  validationKeyStats: KeyValidationStats;
  validationXRayRefine: XRayRefine;
  primaryPublication: CitationDetail | undefined;
  articlesCiting: RelatedPublication;
  complexDetails: ComplexDetails[] | undefined;
  assemblies: AssemblyData[];
  pisaAssemblies: PisaAssembly[];
  carbohydrates: CarbohydrateMolecule[];
  pdbRedoQualityScores: ProcessedQualityScores;
  experimentRawDataBMRB: BMRBExperimentRawData[];
  experimentRawDataSBGrid: SBGRIDExperimentRawData;
  experimentRawDataIRRMC: IRRMCExperimentRawData;
  experimentRawDataEMPIAR: EMPIARExperimentRawData[];
  experimentRawDataPDB: PDBExperimentRawData[];
  entryStatus: EntryStatus;
}

export interface EntryMoleculesData {
  macroMolecules: Molecule[];
  boundLigands: Molecule[];
  organismScientificNames: string[];
  hasRNA: boolean;
}

export interface ExperimentData {
  experimentalDetails: AnyExperimentDetail[];
  resolutionValues: (number | undefined)[];
  experimentalMethod: string;
}

export interface UniProtMappingData {
  uniprotMapping: UniProtMapping;
  uniprotCountsInPDBe: Record<string, number>;
  bestStructuresMappingsByUniProtIds: Record<string, BestStructureMapping[]>;
  proteinPagesSummaryByUniProtIds: Record<string, ProteinSummaryStats>;
}

export interface DownloadOptionData {
  downloadOptions: DownloadOption[];
  viewOptions: DownloadOption[];
}

export interface AssembliesData {
  assemblies: AssemblyData[];
  pisaAssemblies: PisaAssembly[];
}
