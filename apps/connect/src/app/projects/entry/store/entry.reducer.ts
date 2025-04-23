/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReducer, on } from '@ngrx/store';
import { EntryStoreState } from './entry-store.model';
import { EntryActions } from './entry.actions';
// import { UniProtMapping } from '../data-models/uniprot-mapping.model';
// import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import { ProcessedQualityScores } from '../data-models/summary-quality-scores.model';
import { KeyValidationStats } from '../data-models/key-validation-stats.model';
import { XRayRefine } from '../data-models/x-ray-refine.model';
import { CitationDetail } from '../data-models/publication.model';
// import { CathMappings, InterProMappings, PfamMappings, ScopMappings } from '../data-models/domains.model';
import { ProcessedSummary } from '../data-models/summary.model';
import { RelatedPublication } from '../data-models/related-publications.model';
import { IRRMCExperimentRawData, SBGRIDExperimentRawData } from '../data-models/experiment-raw-data.model';
import { entryStatusDefault } from '../data-models/status.model';

export const ENTRY_STORE_STATE_KEY = 'entry';

const initialState: EntryStoreState = {
  entryId: '',
  summaryData: {} as ProcessedSummary,
  macroMolecules: [],
  boundLigands: [],
  organismScientificNames: [],
  hasRNA: false,
  experimentalDetails: [],
  resolutionValues: [],
  experimentalMethod: '',
  uniprotMapping: {},
  uniprotCountsInPDBe: {},
  bestStructuresMappingsByUniProtIds: {},
  proteinPagesSummaryByUniProtIds: {},
  interproMapping: {},
  isoformsMapping: {},
  goMapping: {},
  ecMapping: {},
  pfamMapping: {},
  downloadOptions: [],
  viewOptions: [],
  summaryQualityScores: {} as ProcessedQualityScores,
  cathMapping: {},
  scop175Mapping: {},
  modifications: [],
  validationKeyStats: {} as KeyValidationStats,
  validationXRayRefine: {} as XRayRefine,
  primaryPublication: {} as CitationDetail,
  articlesCiting: {} as RelatedPublication,
  complexDetails: [],
  assemblies: [],
  pisaAssemblies: [],
  carbohydrates: [],
  pdbRedoQualityScores: {} as ProcessedQualityScores,
  experimentRawDataBMRB: [],
  experimentRawDataSBGrid: {} as SBGRIDExperimentRawData,
  experimentRawDataIRRMC: {} as IRRMCExperimentRawData,
  experimentRawDataEMPIAR: [],
  experimentRawDataPDB: [],
  entryStatus: { ...entryStatusDefault },
  interactions: [],
  symmetry: [],
  polymerCoverage: [],
  ligandMonomers: [],
};

export const entryReducer = createReducer(
  initialState,
  on(EntryActions.setCurrentEntryId, (state, action) => ({
    ...state,
    entryId: action.entryId,
  })),
  on(EntryActions.getCathMappingSuccess, (state, action) => ({
    ...state,
    cathMapping: action.cathMapping,
  })),
  on(EntryActions.getSymmetrySuccess, (state, action) => ({
    ...state,
    symmetry: action.symmetry,
  })),
  on(EntryActions.getInteractionsSuccess, (state, action) => ({
    ...state,
    interactions: action.interactions,
  })),
  on(EntryActions.getPfamMappingSuccess, (state, action) => ({
    ...state,
    pfamMapping: action.pfamMapping,
  })),
  on(EntryActions.getGOMappingSuccess, (state, action) => ({
    ...state,
    goMapping: action.goMapping,
  })),
  on(EntryActions.getECMappingSuccess, (state, action) => ({
    ...state,
    ecMapping: action.ecMapping,
  })),
  on(EntryActions.getSummaryDataSuccess, (state, action) => ({
    ...state,
    summaryData: action.summaryData,
  })),
  on(EntryActions.getPrimaryPublicationSuccess, (state, action) => ({
    ...state,
    primaryPublication: action.primaryPublication,
  })),
  on(EntryActions.getPreferredAssemblySuccess, (state, action) => ({
    ...state,
    complexDetails: action.complexDetails,
  })),
  on(EntryActions.getArticleCitingPDBEntrySuccess, (state, action) => ({
    ...state,
    articlesCiting: action.articlesCiting,
  })),
  on(EntryActions.getValidationKeyStatsSuccess, (state, action) => ({
    ...state,
    validationKeyStats: action.validationKeyStats,
  })),
  on(EntryActions.getInterproMappingSuccess, (state, action) => ({
    ...state,
    interproMapping: action.interproMapping,
  })),
  on(EntryActions.getIsoformsMappingSuccess, (state, action) => ({
    ...state,
    isoformsMapping: action.isoformsMapping,
  })),
  on(EntryActions.getModificationsSuccess, (state, action) => ({
    ...state,
    modifications: action.modifications,
  })),
  on(EntryActions.getSummaryQualityScoresSuccess, (state, action) => ({
    ...state,
    summaryQualityScores: action.summaryQualityScores,
  })),
  on(EntryActions.getPDBRedoQualityScoresSuccess, (state, action) => ({
    ...state,
    pdbRedoQualityScores: action.pdbRedoQualityScore,
  })),
  on(EntryActions.getScop175MappingSuccess, (state, action) => ({
    ...state,
    scop175Mapping: action.scop175Mapping,
  })),
  on(EntryActions.getDownloadOptionsSuccess, (state, action) => ({
    ...state,
    downloadOptions: action.data.downloadOptions,
    viewOptions: action.data.viewOptions,
  })),
  on(EntryActions.getEntryMoleculesSuccess, (state, action) => ({
    ...state,
    macroMolecules: action.data.macroMolecules,
    boundLigands: action.data.boundLigands,
    organismScientificNames: action.data.organismScientificNames,
    hasRNA: action.data.hasRNA,
  })),
  on(EntryActions.getExperimentSuccess, (state, action) => ({
    ...state,
    experimentalDetails: action.data.experimentalDetails,
    resolutionValues: action.data.resolutionValues,
    experimentalMethod: action.data.experimentalMethod,
  })),
  on(EntryActions.getUniprotMappingSuccess, (state, action) => ({
    ...state,
    uniprotMapping: action.data.uniprotMapping,
    uniprotCountsInPDBe: action.data.uniprotCountsInPDBe,
    bestStructuresMappingsByUniProtIds: action.data.bestStructuresMappingsByUniProtIds,
    proteinPagesSummaryByUniProtIds: action.data.proteinPagesSummaryByUniProtIds,
  })),
  on(EntryActions.getValidationXrayRefineSuccess, (state, action) => ({
    ...state,
    validationXRayRefine: action.validationXRayRefine,
  })),
  on(EntryActions.getAssembliesSuccess, (state, action) => ({
    ...state,
    assemblies: action.data.assemblies,
    pisaAssemblies: action.data.pisaAssemblies,
  })),
  on(EntryActions.getCarbohydratesSuccess, (state, action) => ({
    ...state,
    carbohydrates: action.carbohydrates,
  })),
  on(EntryActions.getExperimentBMRBRawDataSuccess, (state, action) => ({
    ...state,
    experimentRawDataBMRB: action.experimentRawDataBMRB,
  })),
  on(EntryActions.getExperimentSBGridRawDataSuccess, (state, action) => ({
    ...state,
    experimentRawDataSBGrid: action.experimentRawDataSBGrid,
  })),
  on(EntryActions.getExperimentIRRMCRawDataSuccess, (state, action) => ({
    ...state,
    experimentRawDataIRRMC: action.experimentRawDataIRRMC,
  })),
  on(EntryActions.getExperimentEMPIARRawDataSuccess, (state, action) => ({
    ...state,
    experimentRawDataEMPIAR: action.experimentRawDataEMPIAR,
  })),
  on(EntryActions.getExperimentPDBRawDataSuccess, (state, action) => ({
    ...state,
    experimentRawDataPDB: action.experimentRawDataPDB,
  })),
  on(EntryActions.getEntryStatusSuccess, (state, action) => ({
    ...state,
    entryStatus: action.entryStatus,
  })),
  on(EntryActions.getEntryPolymerCoverageSuccess, (state, action) => {
    console.log('[Reducer] Storing Polymer Coverage:', action.polymerCoverage);
    return {
      ...state,
      polymerCoverage: action.polymerCoverage,
    };
  }),
  on(EntryActions.getEntryLigandMonomersSuccess, (state, action) => {
    console.log('[Reducer] Storing Ligand Monomers:', action.ligandMonomers);
    return {
      ...state,
      ligandMonomers: action.ligandMonomers,
    };
  })
);
