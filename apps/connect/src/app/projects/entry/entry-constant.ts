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
  examples: [
    {
      label: 'Haemoglobin',
      url: 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22hemoglobin%22, %22condition1%22:%22AND%22, %22condition2%22:%22Contains%22%7D%5D, %22resultState%22:%7B%22tabIndex%22:0, %22paginationIndex%22:1, %22perPage%22:%2210%22, %22sortBy%22:%22Sort%20by%22%7D%7D',
    },
    {
      label: 'BRCA1_HUMAN',
      url: 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=%7B%22text%22:%5B%7B%22value%22:%22BRCA1_HUMAN%22, %22condition1%22:%22AND%22, %22condition2%22:%22Contains%22%7D%5D, %22resultState%22:%7B%22tabIndex%22:0, %22paginationIndex%22:1, %22perPage%22:%2210%22, %22sortBy%22:%22Sort%20by%22%7D%7D',
    },
  ],
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

export const validationInfoTooltip = '';
export const sampleInfoTooltip = '';
export const expInfoTooltip = '';
export const depositionDateTooltip = '';
export const releaseDateTooltip = '';
export const revisionDateTooltip = '';
export const nmrSampleTooltip = '';
export const nmrContentsTooltip = '';
export const expRawDataTooltip = '';

export const relatedEntriesTooltip = '';

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
  | 'carbohydrates';

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
  experimentsValidationTab: ['summaryData', 'experimentalDetails', 'validationKeyStats', 'validationXRayRefine'],
  citationsTab: ['primaryPublication', 'articlesCiting'],
};

export const INITIAL_API_STATUS = Object.fromEntries(
  (Object.keys(COMPONENT_DEPENDENCIES).flatMap((key) => COMPONENT_DEPENDENCIES[key]) as ApiDataItem[]).map((item) => [item, 'pending'])
) as Record<ApiDataItem, 'pending' | 'done'>;
