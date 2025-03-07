import { ThemeType } from '@pdbc/core';
import { cofactorTooltip, drugTooltip, reactantTooltip, unannotatedTooltip } from '../ligands/ligand.constant';

export const pdbeLogoConfig = {
  backgroundColor: '#056643',
  logoType: 'PDBe',
  urls: [
    { name: 'Home', path: 'https://www.ebi.ac.uk/pdbe/', openInNewTab: false },
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
    { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation', openInNewTab: true },
    { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training', openInNewTab: true },
  ],
  menuHighlightColor: '#0a5032',
};

export const pdbeSearchConfig = {
  examples: ['1trn', '1cbs', '7v08', '4v99', '4aqd'],
  backgroundColor: '#007B53',
  hasAdvancedSearch: true,
  buttonText: 'Search',
  placeholderText: 'View PDBe entry by PDB entry ID',
  type: ThemeType.PDBE,
};

// export const currentTab = 'Assemblies';
export const allTabs = [
  {
    name: 'Assemblies',
    display: 'Assemblies',
  },
  {
    name: 'Macromolecules',
    display: 'Macromolecules',
  },
  {
    name: 'Ligands',
    display: 'Ligands and Environments',
  },
  {
    name: 'Domains',
    display: 'Domains',
  },
  {
    name: 'Experiments',
    display: 'Experiments and Validation',
  },
  {
    name: 'Citations',
    display: 'Citations',
  },
];
export const tableTabs = ['Assemblies', 'Macromolecules', 'Ligands', 'Domains'];

export const ligandChipColors: {
  [key: string]: string;
} = {
  Unannotated: '#E4E4E4',
  'Drug-like': '#D2DE56',
  'Cofactor-like': '#DBBFE3',
  'Reactant-like': '#FEE99A',
  Modification: '#FE9A9A',
};

/**
 * Tooltips:
 */

export const modelQualitySummaryTooltip = `
Percentile-sliders comparing the quality scores of a model with other models in the archive.

These scores are harmonic means of absolute percentiles of geometric metrics (e.g. ramachandran, clashscore, sidechains) and reflections-based metrics (Rfree, RSRZ).
Sometimes reflections-based metrics are absent due to unavailability of experimental data itself.`;

export const assemblyTooltip = `Assembly refers to ‘quaternary structures’ representing a collection of associated macromolecules and small molecules.

Preferred assembly is the smallest assembly containing all polymeric entities`;

export const preferredAssemblyTooltip = `Preferred assembly is the smallest assembly containing all polymeric entities`;

export const assemblyNameTooltip = `Name is the human-readable assigned denomination of a given unique assembly composition in the PDB archive.`;

export const complexIdTooltip = `Stable identifiers for each unique assembly composition across the PDB archive.`;

export const assemblyCompositionTooltip = `Description of the assembly composition according to their molecular stoichiometry`;

export const ligandChipTooltips: { [key: string]: string } = {
  Unannotated: unannotatedTooltip,
  'Drug-like': drugTooltip,
  'Cofactor-like': cofactorTooltip,
  'Reactant-like': reactantTooltip,
  Modification: 'Modified amino acids or nucleotides in protein, DNA or RNA chains',
};

export const validationInfoTooltip =
  'Quality descriptors for covalent geometry, torsion angles, rotameric conformations and data model fit in protein, DNA and RNA molecules.';
export const sampleInfoTooltip = 'Information about the sample used in an experiment and its sources';
export const expInfoTooltip = 'Detailed information about the experiment performed to obtain the current model';
export const expRawDataTooltip = 'Summary information and links to available unprocessed experimental data from PDB, IRRMC, SBGrid, EMPIAR and BMRB';
export const timelineTooltip = 'Important dates related to this PDB entry';

export const nmrSampleTooltip = 'Identifier for a sample that has been analyzed using nuclear magnetic resonance (NMR) spectroscopy';
export const nmrContentsTooltip = 'Detailed description of the NMR sample composition';

export const expEmBufferTooltip = 'The name of the buffer used for the sample in the electron microscopy experiment';

export const depositionDateTooltip = 'Date when the coordinates were deposited to the PDB archive';
export const releaseDateTooltip = 'Date when the coordinates were released in the PDB archive';
export const revisionDateTooltip = 'Date of the current version or last minor or major revision of a PDB entry';
export const pdbRedoTooltip = 'PDB-REDO is a software pipeline that automatically refines, rebuilds, and validates crystallographic structure models in the PDB';

// export const relatedEntriesTooltip = '';

/**
 * For dashboard details display of statistic links bar
 */

export const dashboardStatLinks = {
  Assemblies: [],
  Macromolecules: [
    {
      id: 'pdbs',
      displayName: 'structures',
      link: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/',
      linkSuffix: '/structures',
    },
    {
      id: 'ligands',
      displayName: 'ligands',
      link: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/',
      linkSuffix: '/ligands',
    },
    {
      id: 'similar_proteins',
      displayName: 'similar proteins',
      link: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/',
      linkSuffix: '/similarity',
    },
    {
      id: 'interaction_partners',
      displayName: 'interactions',
      link: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/',
      linkSuffix: '/interactions',
    },
  ],
  Ligands: [],
  Domains: [],
};

export type ApiDataItem =
  | 'summaryData'
  | 'macroMolecules'
  | 'boundLigands'
  | 'organismScientificNames'
  | 'hasRna'
  | 'experimentalDetails'
  | 'experimentalMethod'
  | 'resolutionValues'
  | 'uniprotMapping'
  | 'uniprotCountsInPDBe'
  | 'bestStructuresMappingsByUniProtIds'
  | 'proteinPagesSummaryByUniProtIds'
  | 'interproMapping'
  | 'downloadOptions'
  | 'viewOptions'
  | 'pfamMapping'
  | 'summaryQualityScores'
  | 'cathMapping'
  | 'scop175Mapping'
  | 'modifications'
  | 'validationKeyStats'
  | 'validationXRayRefine'
  | 'primaryPublication'
  | 'articlesCiting'
  | 'complexDetails'
  | 'assemblies'
  | 'pisaAssemblies'
  | 'carbohydrates'
  | 'pdbRedoQualityScore'
  | 'experimentRawDataPDB'
  | 'experimentRawDataBMRB'
  | 'experimentRawDataSBGrid'
  | 'experimentRawDataIRRMC'
  | 'experimentRawDataEMPIAR';

/**
 * For different components of the page, this lists their API dependencies
 */
export const COMPONENT_DEPENDENCIES: Record<string, ApiDataItem[]> = {
  titleInfo: ['experimentalMethod', 'resolutionValues', 'summaryData'],
  mainInfoArea: ['summaryData', 'organismScientificNames', 'primaryPublication', 'summaryQualityScores'],
  overviewMolstar: ['complexDetails', 'macroMolecules', 'boundLigands', 'modifications', 'pfamMapping', 'cathMapping', 'scop175Mapping', 'primaryPublication'],
  interactiveTables: [
    'complexDetails',
    'assemblies',
    'pisaAssemblies',
    'pfamMapping',
    'cathMapping',
    'scop175Mapping',
    'macroMolecules',
    'boundLigands',
    'modifications',
    'carbohydrates',
    'uniprotMapping',
    'bestStructuresMappingsByUniProtIds',
  ],
  detailsDashboard: ['macroMolecules', 'proteinPagesSummaryByUniProtIds'],
  experimentsValidationTab: [
    'summaryData',
    'hasRna',
    'experimentalDetails',
    'validationKeyStats',
    'validationXRayRefine',
    'pdbRedoQualityScore',
    'experimentRawDataPDB',
    'experimentRawDataBMRB',
    'experimentRawDataSBGrid',
    'experimentRawDataIRRMC',
    'experimentRawDataEMPIAR',
  ],
  citationsTab: ['primaryPublication', 'articlesCiting'],
};

export const INITIAL_API_STATUS = Object.fromEntries(
  (Object.keys(COMPONENT_DEPENDENCIES).flatMap((key) => COMPONENT_DEPENDENCIES[key]) as ApiDataItem[]).map((item) => [item, 'pending'])
) as Record<ApiDataItem, 'pending' | 'done'>;
