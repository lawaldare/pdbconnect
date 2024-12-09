import { ThemeType } from '@pdbc/core';

export const pdbeLogoConfig = {
  backgroundColor: '#056643',
  logoType: 'PDBe',
  urls: [
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services' },
    { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation' },
    { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training' },
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
  | 'interproMapping'
  | 'downloadOptions'
  | 'viewOptions'
  | 'pfamMapping'
  | 'summaryQualityScores'
  | 'cathMapping'
  | 'scop175Mapping'
  | 'modifications'
  | 'residueListing'
  | 'validationKeyStats'
  | 'validationXRayRefine'
  | 'primaryPublication'
  | 'articlesCiting'
  | 'complexDetails'
  | 'assemblies'
  | 'pisaAssemblies'
  | 'carbohydrates';

export const COMPONENT_DEPENDENCIES: Record<string, ApiDataItem[]> = {
  titleInfo: ['experimentalMethod', 'resolutionValues', 'summaryData'],
  mainInfoArea: ['summaryData', 'organismScientificNames', 'primaryPublication', 'summaryQualityScores'],
  overviewMolstar: ['complexDetails', 'macroMolecules', 'boundLigands', 'modifications', 'residueListing', 'pfamMapping', 'cathMapping', 'scop175Mapping'],
  interactiveTables: [
    'complexDetails',
    'assemblies',
    'pisaAssemblies',
    'pfamMapping',
    'cathMapping',
    'scop175Mapping',
    'macroMolecules',
    'residueListing',
    'boundLigands',
    'modifications',
    'carbohydrates',
    'uniprotMapping',
    'bestStructuresMappingsByUniProtIds',
  ],
  detailsDashboard: ['macroMolecules'],
  experimentsValidationTab: ['summaryData', 'experimentalDetails', 'validationKeyStats', 'validationXRayRefine'],
  citationsTab: ['primaryPublication', 'articlesCiting'],
};

export const INITIAL_API_STATUS = Object.fromEntries(
  (Object.keys(COMPONENT_DEPENDENCIES).flatMap((key) => COMPONENT_DEPENDENCIES[key]) as ApiDataItem[]).map((item) => [item, 'pending'])
) as Record<ApiDataItem, 'pending' | 'done'>;
