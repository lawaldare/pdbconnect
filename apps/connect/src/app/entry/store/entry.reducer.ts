/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReducer, on } from '@ngrx/store';
import { IRRMCExperimentRawData, SBGRIDExperimentRawData } from '../data-models/experiment-raw-data.model';
import { KeyValidationStats, ModelQualityXray } from '../data-models/key-validation-stats.model';
import { CitationDetail } from '../data-models/publication.model';
import { RelatedPublication } from '../data-models/related-publications.model';
import { entryStatusDefault } from '../data-models/status.model';
import { ProcessedQualityScores } from '../data-models/summary-quality-scores.model';
import { XRayRefine } from '../data-models/x-ray-refine.model';
import { EntryStoreState } from './entry-store.model';
import { EntryActions } from './entry.actions';

export const ENTRY_STORE_STATE_KEY = 'entry';

const initialState: EntryStoreState = {
  entryId: '',
  summaryData: undefined,
  macroMolecules: undefined,
  macromolsDescriptions: undefined,
  macromolsChainsToEntityIds: undefined,
  boundLigands: undefined,
  boundMolecules: undefined,
  moleculeSources: [],
  hasRNA: false,
  experimentalDetails: undefined,
  resolutionValues: [],
  experimentalMethod: '',
  uniprotMapping: undefined,
  proteinPagesSummaryByUniProtIds: {},
  interproMapping: {},
  isoformsMapping: {},
  goMapping: {},
  ecMapping: {},
  pfamMapping: undefined,
  rfamMapping: undefined,
  downloadOptions: [],
  viewOptions: [],
  summaryQualityScores: {} as ProcessedQualityScores,
  cathMapping: undefined,
  scop175Mapping: undefined,
  modifications: undefined,
  modelQualityXray: {} as ModelQualityXray,
  validationKeyStats: {} as KeyValidationStats,
  validationXRayRefine: {} as XRayRefine,
  primaryPublication: {} as CitationDetail,
  articlesCiting: {} as RelatedPublication,
  complexDetails: undefined,
  assemblies: undefined,
  pisaAssemblies: undefined,
  carbohydrates: undefined,
  pdbRedoQualityScores: {} as ProcessedQualityScores,
  experimentRawDataBMRB: [],
  experimentRawDataSBGrid: {} as SBGRIDExperimentRawData,
  experimentRawDataIRRMC: {} as IRRMCExperimentRawData,
  experimentRawDataEMPIAR: [],
  experimentRawDataPDB: [],
  entryStatus: { ...entryStatusDefault },
  interactions: {},
  residueListing: undefined,
  symmetry: [],
  polymerCoverage: undefined,
  ligandMonomers: undefined,
  residueWiseOutliers: undefined,
  outliersByModelId: undefined,
  procAssembliesCards: undefined,
  procAssembliesFilters: undefined,
  processedAssemblies: undefined,
  procMacromoleculesCards: undefined,
  procMacromoleculesFilters: undefined,
  processedMacromolecules: undefined,
  procLigandsCards: undefined,
  procLigandsFilters: undefined,
  processedLigands: undefined,
  procDomainsCards: undefined,
  procDomainsFilters: undefined,
  processedDomains: undefined,
  procLLMCards: undefined,
  processedDomainsWithMacromols: undefined,
  processedMacromoleculesForLLM: undefined,
  processedPrefAssembly: undefined,
  ligandPagesSummary: undefined,
  complexPagesSummary: undefined,
  entityPvUniprot: {},
  entityPvChains: {},
  entityPvDomains: {},
  entityPvRfam: {},
  entityPvSecondaryStructure: {},
  entityPvBindingSites: {},
  entityPvInterfaces: {},
  entityPvAnnotations: {},
  entityPvConservation: {},
  entityPvVariation: {},
  llmAnnotations: undefined,
  hasMDDB: undefined,
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
  on(EntryActions.getInteractionsSuccess, (state, action) => {
    const prevInteractions = state.interactions ?? {};

    const prevChain = prevInteractions[action.chainId] ?? {};
    const updatedChain = {
      ...prevChain,
      [action.residueId]: action.interactions,
    };

    const updatedInteractions = {
      ...prevInteractions,
      [action.chainId]: updatedChain,
    };

    return {
      ...state,
      interactions: updatedInteractions,
    };
  }),
  on(EntryActions.getResidueListingSuccess, (state, action) => ({
    ...state,
    residueListing: action.residueListing,
  })),
  on(EntryActions.getPfamMappingSuccess, (state, action) => ({
    ...state,
    pfamMapping: action.pfamMapping,
  })),
  on(EntryActions.getRfamMappingSuccess, (state, action) => ({
    ...state,
    rfamMapping: action.rfamMapping,
  })),
  on(EntryActions.getGOMappingSuccess, (state, action) => ({
    ...state,
    goMapping: action.goMapping,
  })),
  on(EntryActions.getECMappingSuccess, (state, action) => ({
    ...state,
    ecMapping: action.ecMapping,
  })),
  on(EntryActions.getLLMAnnotationsSuccess, (state, action) => ({
    ...state,
    llmAnnotations: action.llmAnnotations,
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
  on(EntryActions.getModelQualityXraySuccess, (state, action) => ({
    ...state,
    modelQualityXray: action.modelQualityXray,
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
    moleculeSources: action.data.moleculeSources,
    macromolsDescriptions: action.data.macromolsDescriptions,
    macromolsChainsToEntityIds: action.data.macromolsChainsToEntityIds,
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
    uniprotMapping: action.uniprotMapping,
  })),
  // on(EntryActions.getUniprotSummarySuccess, (state, action) => ({
  //   ...state,
  //   proteinPagesSummaryByUniProtIds: action.unpSummaryData,
  // })),
  on(EntryActions.getBoundMoleculesSuccess, (state, action) => ({
    ...state,
    boundMolecules: action.boundMolecules,
  })),
  on(EntryActions.getLigandSummarySuccess, (state, action) => ({
    ...state,
    ligandPagesSummary: action.ligandPagesSummary,
  })),
  on(EntryActions.getComplexSummarySuccess, (state, action) => ({
    ...state,
    complexPagesSummary: action.complexPagesSummary,
  })),
  on(EntryActions.getUniprotSummarySuccess, (state, action) => {
    const prevData = state.proteinPagesSummaryByUniProtIds ?? {};

    const updatedData = {
      ...prevData,
      [action.uniprotId]: action.unpSummaryData,
    };

    return {
      ...state,
      proteinPagesSummaryByUniProtIds: updatedData,
    };
  }),
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
  on(EntryActions.getEntryPolymerCoverageSuccess, (state, action) => ({
    ...state,
    polymerCoverage: action.polymerCoverage,
  })),
  on(EntryActions.getEntryLigandMonomersSuccess, (state, action) => ({
    ...state,
    ligandMonomers: action.ligandMonomers,
  })),
  on(EntryActions.getEntryResidueWiseOutliersSuccess, (state, action) => ({
    ...state,
    residueWiseOutliers: action.data.residueWiseOutliers,
    outliersByModelId: action.data.outliersByModelId,
  })),
  on(EntryActions.getProcessedAssembliesSuccess, (state, action) => ({
    ...state,
    processedAssemblies: action.processedAssemblies,
  })),
  on(EntryActions.getProcAssembliesFiltersSuccess, (state, action) => ({
    ...state,
    procAssembliesFilters: action.procAssembliesFilters,
  })),
  on(EntryActions.getProcAssembliesCardsSuccess, (state, action) => ({
    ...state,
    procAssembliesCards: action.procAssembliesCards,
  })),
  on(EntryActions.getProcessedMacromoleculesSuccess, (state, action) => ({
    ...state,
    processedMacromolecules: action.processedMacromolecules,
  })),
  on(EntryActions.getProcMacromoleculesFiltersSuccess, (state, action) => ({
    ...state,
    procMacromoleculesFilters: action.procMacromoleculesFilters,
  })),
  on(EntryActions.getProcMacromoleculesCardsSuccess, (state, action) => ({
    ...state,
    procMacromoleculesCards: action.procMacromoleculesCards,
  })),
  on(EntryActions.getProcessedLigandsSuccess, (state, action) => ({
    ...state,
    processedLigands: action.processedLigands,
  })),
  on(EntryActions.getProcLigandsFiltersSuccess, (state, action) => ({
    ...state,
    procLigandsFilters: action.procLigandsFilters,
  })),
  on(EntryActions.getProcLigandsCardsSuccess, (state, action) => ({
    ...state,
    procLigandsCards: action.procLigandsCards,
  })),
  on(EntryActions.getProcessedDomainsSuccess, (state, action) => ({
    ...state,
    processedDomains: action.processedDomains,
  })),
  on(EntryActions.getProcDomainsFiltersSuccess, (state, action) => ({
    ...state,
    procDomainsFilters: action.procDomainsFilters,
  })),
  on(EntryActions.getProcDomainsCardsSuccess, (state, action) => ({
    ...state,
    procDomainsCards: action.procDomainsCards,
  })),
  on(EntryActions.getProcessedMacromolsForLLMSuccess, (state, action) => ({
    ...state,
    processedMacromoleculesForLLM: action.processedMacromoleculesForLLM,
  })),
  on(EntryActions.getProcLLMCardsSuccess, (state, action) => ({
    ...state,
    procLLMCards: action.procLLMCards,
  })),
  on(EntryActions.getProcessedDomainsWithMacromolsSuccess, (state, action) => ({
    ...state,
    processedDomainsWithMacromols: action.processedDomainsWithMacromols,
  })),
  on(EntryActions.getProcessedPrefAssemblySuccess, (state, action) => ({
    ...state,
    processedPrefAssembly: action.processedPrefAssembly,
  })),
  on(EntryActions.getEntryProtvistaUniprotMappingSuccess, (state, action) => {
    const prevTrackData = state.entityPvUniprot ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvUniprot,
    };

    return {
      ...state,
      entityPvUniprot: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaChainsSuccess, (state, action) => {
    const prevTrackData = state.entityPvChains ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvChains,
    };

    return {
      ...state,
      entityPvChains: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaDomainsSuccess, (state, action) => {
    const prevTrackData = state.entityPvDomains ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvDomains,
    };

    return {
      ...state,
      entityPvDomains: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaRfamSuccess, (state, action) => {
    const prevTrackData = state.entityPvRfam ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvRfam,
    };

    return {
      ...state,
      entityPvRfam: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaSecondaryStructureSuccess, (state, action) => {
    const prevTrackData = state.entityPvSecondaryStructure ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvSecondaryStructure,
    };

    return {
      ...state,
      entityPvSecondaryStructure: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaBindingSitesSuccess, (state, action) => {
    const prevTrackData = state.entityPvBindingSites ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvBindingSites,
    };

    return {
      ...state,
      entityPvBindingSites: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaInterfacesSuccess, (state, action) => {
    const prevTrackData = state.entityPvInterfaces ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvInterfaces,
    };

    return {
      ...state,
      entityPvInterfaces: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaAnnotationsSuccess, (state, action) => {
    const prevTrackData = state.entityPvAnnotations ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvAnnotations,
    };

    return {
      ...state,
      entityPvAnnotations: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaConservationSuccess, (state, action) => {
    const prevTrackData = state.entityPvConservation ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvConservation,
    };

    return {
      ...state,
      entityPvConservation: updatedTrackData,
    };
  }),
  on(EntryActions.getEntryProtvistaVariationSuccess, (state, action) => {
    const prevTrackData = state.entityPvVariation ?? {};

    const updatedTrackData = {
      ...prevTrackData,
      [action.entityId]: action.entityPvVariation,
    };

    return {
      ...state,
      entityPvVariation: updatedTrackData,
    };
  }),
  on(EntryActions.clearEntityProtvistaData, (state) => ({
    ...state,
    entityPvUniprot: {},
    entityPvChains: {},
    entityPvDomains: {},
    entityPvRfam: {},
    entityPvSecondaryStructure: {},
    entityPvBindingSites: {},
    entityPvInterfaces: {},
    entityPvAnnotations: {},
    entityPvConservation: {},
    entityPvVariation: {},
  })),
  on(EntryActions.getHasMDDBSuccess, (state, { hasMDDB }) => ({
    ...state,
    hasMDDB,
  })),
  on(EntryActions.getHasMDDBFailure, (state) => ({
    ...state,
    hasMDDB: false,
  }))
);
