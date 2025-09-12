import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { CathMappings, InterProMappings, PfamMappings, ScopMappings } from '../data-models/domains.model';
import { AnyExperimentDetail } from '../data-models/experimental-details.model';
import { Molecule } from '../data-models/molecule.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import { ProcessedSummary } from '../data-models/summary.model';
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
import { InteractionFromAPI } from '../data-models/interaction.model';
import { PolymerCoverageMolecule } from '../data-models/polymer-coverage.model';
import { LigandMonomer } from '../data-models/ligand-monomers.model';
import { ResidueWiseOutliersMolecule } from '../data-models/residuewise-outliers.model';
import { APIConservationData, APITrackData, APIVariationData } from '@pdbe-lib/pv-nightingale-components';
import { LLMAnnotation } from '../data-models/llm-model';
import { ResidueListed } from '../data-models/residue-listing.model';
import { AssemblyUICard, ProcessedAssembly } from './data-processing/assembly-processing';
import { Filter, OutliersByModelId, PreferredAssemblyData } from './data-processing/models/other-models';
import { MacromoleculesDescriptions, MacromoleculeUICard } from './data-processing/macromolecule-processing';
import { LigandOrModUICard, ProcessedLigandOrMod } from './data-processing/ligand-processing';
import { DomainsWithMacromolecules, DomainUICard } from './data-processing/domain-processing';
import { ProcessedDomain, ProcessedMacromolecule } from './data-processing/models/processed-entities.model';
import { LigandSummaryStats } from '../data-models/ligand-summary-stats.model';
import { ComplexSummaryStats } from '../data-models/complex-summary-stats.model';
import { BoundMolecule } from '../data-models/bound-molecule.model';
export interface EntryStoreState {
  entryId: string;
  summaryData: ProcessedSummary | undefined;
  macroMolecules: Molecule[] | undefined;
  macromolsDescriptions: MacromoleculesDescriptions | undefined;
  macromolsChainsToEntityIds: { [key: string]: string } | undefined;
  boundLigands: Molecule[] | undefined;
  boundMolecules: BoundMolecule[] | undefined;
  organismScientificNames: string[];
  hasRNA: boolean;
  experimentalDetails: AnyExperimentDetail[] | undefined;
  resolutionValues: (number | undefined)[];
  experimentalMethod: string;
  uniprotMapping: UniProtMapping | undefined;
  proteinPagesSummaryByUniProtIds: {
    [uniprotId: string]: ProteinSummaryStats;
  };
  // complexPagesSummary: ComplexSummaryStats[] | undefined;
  ligandPagesSummary: LigandSummaryStats[] | undefined;
  complexPagesSummary: ComplexSummaryStats | undefined;
  interproMapping: InterProMappings | undefined;
  isoformsMapping: UniProtMapping | undefined;
  goMapping: GOMapping | undefined;
  ecMapping: ECMapping | undefined;
  pfamMapping: PfamMappings | undefined;
  downloadOptions: { group: string; items: DownloadOption[] }[];
  viewOptions: { group: string; items: DownloadOption[] }[];
  summaryQualityScores: ProcessedQualityScores | undefined;
  cathMapping: CathMappings | undefined;
  scop175Mapping: ScopMappings | undefined;
  modifications: ModifiedResidue[] | undefined;
  validationKeyStats: KeyValidationStats | undefined;
  modelQualityXray: ModelQualityXray | undefined;
  validationXRayRefine: XRayRefine | undefined;
  primaryPublication: CitationDetail | undefined;
  articlesCiting: RelatedPublication | undefined;
  complexDetails: ComplexDetails[] | undefined;
  assemblies: AssemblyData[] | undefined;
  pisaAssemblies: PisaAssembly[] | undefined;
  carbohydrates: CarbohydrateMolecule[] | undefined;
  pdbRedoQualityScores: ProcessedQualityScores | undefined;
  experimentRawDataBMRB: BMRBExperimentRawData[];
  experimentRawDataSBGrid: SBGRIDExperimentRawData | undefined;
  experimentRawDataIRRMC: IRRMCExperimentRawData | undefined;
  experimentRawDataEMPIAR: EMPIARExperimentRawData[];
  experimentRawDataPDB: PDBExperimentRawData[];
  entryStatus: EntryStatus | undefined;
  interactions: {
    [chainId: string]: {
      [residueId: string]: InteractionFromAPI;
    };
  };
  residueListing: ResidueListed[];
  symmetry: Symmetry[];
  polymerCoverage: PolymerCoverageMolecule[] | undefined;
  ligandMonomers: LigandMonomer[] | undefined;
  residueWiseOutliers: ResidueWiseOutliersMolecule[];
  outliersByModelId: OutliersByModelId | undefined;
  processedAssemblies: ProcessedAssembly[] | undefined;
  procAssembliesCards: AssemblyUICard[] | undefined;
  procAssembliesFilters: Filter[] | undefined;
  processedMacromolecules: ProcessedMacromolecule[] | undefined;
  procMacromoleculesCards: MacromoleculeUICard[] | undefined;
  procMacromoleculesFilters: Filter[] | undefined;
  procLigandsCards: LigandOrModUICard[] | undefined;
  procLigandsFilters: Filter[] | undefined;
  processedLigands: ProcessedLigandOrMod[] | undefined;
  procDomainsCards: DomainUICard[] | undefined;
  procDomainsFilters: Filter[] | undefined;
  processedDomains: ProcessedDomain[] | undefined;
  procLLMCards: MacromoleculeUICard[] | undefined;
  processedMacromoleculesForLLM: ProcessedMacromolecule[] | undefined;
  processedDomainsWithMacromols: DomainsWithMacromolecules | undefined;
  processedPrefAssembly: PreferredAssemblyData | undefined;
  entityPvUniprot: {
    [entityId: string]: APITrackData;
  };
  entityPvChains: {
    [entityId: string]: APITrackData;
  };
  entityPvDomains: {
    [entityId: string]: APITrackData;
  };
  entityPvRfam: {
    [entityId: string]: APITrackData;
  };
  entityPvSecondaryStructure: {
    [entityId: string]: APITrackData;
  };
  entityPvBindingSites: {
    [entityId: string]: APITrackData;
  };
  entityPvInterfaces: {
    [entityId: string]: APITrackData;
  };
  entityPvAnnotations: {
    [entityId: string]: APITrackData;
  };
  entityPvConservation: {
    [entityId: string]: APIConservationData;
  };
  entityPvVariation: {
    [entityId: string]: APIVariationData;
  };
  llmAnnotations: LLMAnnotation[] | undefined;
}

export interface EntryMoleculesData {
  macroMolecules: Molecule[];
  macromolsDescriptions: MacromoleculesDescriptions;
  macromolsChainsToEntityIds: { [key: string]: string };
  boundLigands: Molecule[];
  organismScientificNames: string[];
  hasRNA: boolean;
}

export interface EntryResidueWiseData {
  residueWiseOutliers: ResidueWiseOutliersMolecule[];
  outliersByModelId: OutliersByModelId;
}

export interface ExperimentData {
  experimentalDetails: AnyExperimentDetail[];
  resolutionValues: (number | undefined)[];
  experimentalMethod: string;
}

export interface DownloadOptionData {
  downloadOptions: { group: string; items: DownloadOption[] }[];
  viewOptions: { group: string; items: DownloadOption[] }[];
}

export interface AssembliesData {
  assemblies: AssemblyData[];
  pisaAssemblies: PisaAssembly[];
}
