import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { CathMappings, InterProMappings, PfamMappings, ScopMappings } from '../data-models/domains.model';
import { AnyExperimentDetail } from '../data-models/experimental-details.model';
import { Molecule } from '../data-models/molecule.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import { ProcessedSummary } from '../data-models/summary.model';
import { BestStructureMapping } from '../data-models/uniport-best-structures.model';
import { ECMapping, GOMapping, UniProtMapping } from '../data-models/uniprot-mapping.model';
import { ProcessedQualityScores } from '../data-models/summary-quality-scores.model';
import { ModifiedResidue } from '../data-models/modified-residues.model';
import { KeyValidationStats, ModelQualityXray } from '../data-models/key-validation-stats.model';
import { XRayRefine } from '../data-models/x-ray-refine.model';
import { CitationDetail } from '../data-models/publication.model';
import { RelatedPublication } from '../data-models/related-publications.model';
import { ComplexDetails } from '../data-models/complex-details.model';
import { PisaAssembly } from '../data-models/pisa-assembly.model';
import { AssemblyData, Symmetry } from '../data-models/assembly.model';
import { CarbohydrateMolecule } from '../data-models/carbohydrate-polymer.model';
import {
  BMRBExperimentRawData,
  EMPIARExperimentRawData,
  IRRMCExperimentRawData,
  PDBExperimentRawData,
  SBGRIDExperimentRawData,
} from '../data-models/experiment-raw-data.model';
import { EntryStatus } from '../data-models/status.model';
import { Interaction } from '../data-models/interaction.model';
import { PolymerCoverageMolecule } from '../data-models/polymer-coverage.model';
import { LigandMonomer } from '../data-models/ligand-monomers.model';
import { ResidueWiseOutliersMolecule } from '../data-models/residuewise-outliers.model';
import { APIConservationData, APITrackData, APIVariationData } from '@pdbe-lib/pv-nightingale-components';

export interface EntryStoreState {
  entryId: string;
  summaryData: ProcessedSummary | undefined;
  macroMolecules: Molecule[];
  boundLigands: Molecule[];
  organismScientificNames: string[];
  hasRNA: boolean;
  experimentalDetails: AnyExperimentDetail[];
  resolutionValues: (number | undefined)[];
  experimentalMethod: string;
  uniprotMapping: UniProtMapping | undefined;
  uniprotCountsInPDBe: Record<string, number> | undefined;
  bestStructuresMappingsByUniProtIds: Record<string, BestStructureMapping[]> | undefined;
  proteinPagesSummaryByUniProtIds: Record<string, ProteinSummaryStats> | undefined;
  interproMapping: InterProMappings | undefined;
  isoformsMapping: UniProtMapping | undefined;
  goMapping: GOMapping | undefined;
  ecMapping: ECMapping | undefined;
  pfamMapping: PfamMappings | undefined;
  downloadOptions: DownloadOption[];
  viewOptions: DownloadOption[];
  summaryQualityScores: ProcessedQualityScores | undefined;
  cathMapping: CathMappings | undefined;
  scop175Mapping: ScopMappings | undefined;
  modifications: ModifiedResidue[];
  validationKeyStats: KeyValidationStats | undefined;
  modelQualityXray: ModelQualityXray | undefined;
  validationXRayRefine: XRayRefine | undefined;
  primaryPublication: CitationDetail | undefined;
  articlesCiting: RelatedPublication | undefined;
  complexDetails: ComplexDetails[] | undefined;
  assemblies: AssemblyData[];
  pisaAssemblies: PisaAssembly[];
  carbohydrates: CarbohydrateMolecule[];
  pdbRedoQualityScores: ProcessedQualityScores | undefined;
  experimentRawDataBMRB: BMRBExperimentRawData[];
  experimentRawDataSBGrid: SBGRIDExperimentRawData | undefined;
  experimentRawDataIRRMC: IRRMCExperimentRawData | undefined;
  experimentRawDataEMPIAR: EMPIARExperimentRawData[];
  experimentRawDataPDB: PDBExperimentRawData[];
  entryStatus: EntryStatus | undefined;
  interactions: Interaction[];
  symmetry: Symmetry[];
  polymerCoverage: PolymerCoverageMolecule[];
  ligandMonomers: LigandMonomer[];
  residueWiseOutliers: ResidueWiseOutliersMolecule[];
  entityPvUniprot: APITrackData;
  entityPvChains: APITrackData;
  entityPvDomains: APITrackData;
  entityPvRfam: APITrackData;
  entityPvSecondaryStructure: APITrackData;
  entityPvBindingSites: APITrackData;
  entityPvInterfaces: APITrackData;
  entityPvAnnotations: APITrackData;
  entityPvConservation: APIConservationData;
  entityPvVariation: APIVariationData;
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
