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

export const mobileHeaderConfig = {
  backgroundColor: '#056643',
  urls: [
    { name: 'Home', path: 'https://www.ebi.ac.uk/pdbe/', openInNewTab: false },
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
    { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation', openInNewTab: true },
    { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training', openInNewTab: true },
  ],
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

export const modelQualityTooltips = {
  validationInfoTooltip:
    'Quality indicators assess structural deviations from known high-resolution standards. These include clashscore, bond angles/lengths, sidechain rotamer outliers, and RSRZ outliers. They highlight steric clashes, geometric inconsistencies to expected values, and poor model-to-data fit.',
  sampleInfoTooltip: 'Information about the biological specimen used in the experiment, including its source',
  expInfoTooltip:
    'Detailed information about the experimental method used to obtain the model, including key parameters such as resolution, data collection methods, and refinement techniques specific to the technique. See the tooltips in the table for more detail of each parameter.',
  expRawDataTooltip: 'Summary information and links to available unprocessed experimental data from PDB, IRRMC, SBGrid, EMPIAR and BMRB',
  timelineTooltip: 'Important dates related to this PDB entry',
  pdbRedoTooltip:
    'PDB-REDO is an automated procedure that refines, rebuilds, and validates crystallographic structure models, integrating up-to-date crystallographic software with specialized tools to enhance model accuracy and reliability',
  modelQualityTooltip:
    'Evaluates how well the atomic model fits expected geometry and the experimental map, including bond lengths, angles, and density fit metrics.',
  experimentalInfoTooltip: 'Describes how the structure was determined, including sample origin, data collection conditions, and experimental instrumentation.',
  crystalInfoTooltip: 'Summarizes crystal properties like symmetry, unit cell, and twinning, which are critical for solving and validating the structure.',
  softwareTooltip: 'Lists key software and versions used in structure determination to support model transparency and reproducibility.',
  dataQualityTooltip: 'Shows how complete and consistent the diffraction data is using metrics like resolution, completeness, and signal-to-noise.',
  refinementTooltip: 'Reports final model accuracy against experimental data, including R-factors, resolution, and refinement method.',
};

export const nmrSampleTooltip = 'Identifier for a sample that has been analyzed using nuclear magnetic resonance (NMR) spectroscopy';
export const nmrContentsTooltip =
  'A detailed description of the composition of the NMR sample, including the molecules or compounds present, their concentrations, and the labeling of specific atoms (e.g., isotopic labels).';

export const expEmBufferTooltip = 'The name of the buffer used for the sample in the electron microscopy experiment';

export const depositionDateTooltip = 'Date when the coordinates were deposited to the PDB archive';
export const releaseDateTooltip = 'Date when the coordinates were released in the PDB archive';
export const revisionDateTooltip = 'Date of the current version or last minor or major revision of a PDB entry';

const baseUrl = window.location.hostname === 'www.ebi.ac.uk' ? 'https://www.ebi.ac.uk/pdbe/' : 'https://wwwdev.ebi.ac.uk/pdbe/';
const ligandBaseUrl = window.location.hostname === 'www.ebi.ac.uk' ? 'https://www.ebi.ac.uk/pdbe-srv/pdbechem/' : 'https://wwwdev.ebi.ac.uk/pdbe-srv/pdbechem/';

/**
 * For dashboard details display of statistic links bar
 */

export const dashboardStatLinks = {
  Assemblies: [],
  Macromolecules: [
    {
      id: 'pdbs',
      displayName: 'structures',
      link: `${baseUrl}pdbe-kb/proteins/`,
      linkSuffix: '/structures',
    },
    {
      id: 'ligands',
      displayName: 'ligands',
      link: `${baseUrl}pdbe-kb/proteins/`,
      linkSuffix: '/ligands',
    },
    {
      id: 'similar_proteins',
      displayName: 'similar proteins',
      link: `${baseUrl}pdbe-kb/proteins/`,
      linkSuffix: '/similarity',
    },
    {
      id: 'interaction_partners',
      displayName: 'interactions',
      link: `${baseUrl}pdbe-kb/proteins/`,
      linkSuffix: '/interactions',
    },
  ],
  Ligands: [
    {
      id: 'pdbs',
      displayName: 'bound structures',
      link: `${ligandBaseUrl}chemicalCompound/show/`,
      linkSuffix: '#structures-section',
    },
    {
      id: 'ligands',
      displayName: 'interaction statistics',
      link: `${ligandBaseUrl}chemicalCompound/show/`,
      linkSuffix: '#interaction-section',
    },
    {
      id: 'similar_proteins',
      displayName: 'related ligands',
      link: `${ligandBaseUrl}chemicalCompound/show/`,
      linkSuffix: '#related-ligand-section',
    },
  ],
  Domains: [],
};

export const resourceUrls: any = {
  CATH: 'https://www.cathdb.info/version/latest/superfamily/',
  SCOP: 'https://ftp.ebi.ac.uk/pub/databases/pdbe-kb/scop-legacy/',
  Pfam: `https://www.ebi.ac.uk/pdbe/interpro/entry/pfam/`,
};

export const handleBarSrc = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjE5Ij4KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSI2cHgiIGhlaWdodD0iMThweCIgc3R5bGU9ImZpbGw6IGRhcmtncmV5OyBzdHJva2U6IGJsYWNrOyBzdHJva2Utd2lkdGg6IDFweDsiPjwvcmVjdD4KPC9zdmc+`;

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

export const OUTLIER_TYPE_LABELS: Record<string, string> = {
  bond_angles: 'Bond Angles',
  bond_lengths: 'Bond Lengths',
  chirals: 'Chirality Issues',
  planes: 'Planarity Deviations',
  clashes: 'Clashes',
  symm_clashes: 'Symmetry Clashes',
  sidechain_outliers: 'Sidechain Outliers',
  ramachandran_outliers: 'Ramachandran Outliers',
  RSRZ: 'RSRZ Outliers',
  suite_outliers: 'RNA-Suite Outliers',
  pucker_outliers: 'RNA Pucker Outliers',
};

// https://web.archive.org/web/20250209115645/https://personal.sron.nl/~pault/
export const PAUL_TOL_COLORBLIND_SCALE: string[] = ['#332288', '#117733', '#44AA99', '#88CCEE', '#DDCC77', '#CC6677', '#AA4499', '#882255'];

// https://web.archive.org/web/20210108233739/http://jfly.iam.u-tokyo.ac.jp/color/
export const OKABE_AND_ITO_COLORBLIND_SCALE: string[] = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

// https://jacksonlab.agronomy.wisc.edu/2016/05/23/15-level-colorblind-friendly-palette/
// https://mk.bcgsc.ca/biovis2012/
export const MARTIN_KRZYWINSKI_COLORBLIND_SCALE: string[] = [
  '#004949',
  '#009292',
  '#FF6DB6',
  '#FFB6DB',
  '#006DDB',
  '#6DB6FF',
  '#920000',
  '#924900',
  '#DB6D00',
  '#24FF24',
  '#FFFF6D',
  '#490092',
  '#B66DFF',
  '#B6DBFF',
  '#000000',
];

// https://www.nature.com/articles/nmeth.1618
export const BANG_WONG_COLORBLIND_SCALE: string[] = ['#D55E00', '#0072B2', '#E69F00', '#56B4E9', '#009E73', '#F0E442', '#CC79A7', '#000000'];

// https://stackoverflow.com/questions/65013406/how-to-generate-30-distinct-colors-that-are-color-blind-friendly
export const RCOLORBREWER_COLORBLIND_SCALE: string[] = ['#FC9272', '#AE017E', '#F7F7F7', '#DF65B0', '#EF3B2C', '#74C476', '#E5F5F9', '#1D91C0'];
/**
 * https://medium.com/@rjurney/kellys-22-colours-of-maximum-contrast-58edb70c90d1
 * Tested in:
 * https://davidmathlogic.com/colorblind/#%23FDFDFD-%231D1D1D-%23EBCE2B-%23702C8C-%23DB6917-%2396CDE6-%23BA1C30-%23C0BD7F-%237F7E80-%235FA641-%234277B6-%23463397-%23E1A11A-%237E1510-%2392AE31-%236F340D-%23D32B1E-%232B3514
 */
export const FILTERED_KELLY22_COLORBLIND_SCALE: string[] = [
  '#ebce2b',
  '#702c8c',
  '#db6917',
  '#96cde6',
  '#ba1c30',
  '#c0bd7f',
  '#7f7e80',
  '#5fa641',
  '#1d1d1d',
  '#4277b6',
  '#463397',
  '#e1a11a',
  '#7e1510',
  '#92ae31',
  '#6f340d',
  '#d32b1e',
  '#2b3514',
];

export const entryAssembliesTooltips = {
  assemblyName: 'The assembly name is a descriptive label assigned to a specific molecular arrangement in the PDB archive.',
  multimericState:
    "This label describes the assembly's composition: the prefix (homo- or hetero-) indicates whether the macromolecules that make up the assembly are identical or different, and the suffix shows the total number of these macromolecules.",
  pdbeComplexId: 'Stable identifiers for each unique assembly composition across the PDB archive.',
  accessbileSurfaceArea: 'Surface area indicates the total solvent-accessible surface area of the assembly, in Å2.',
  buriedSurfaceArea: "Buried area indicates, in Å2, the total solvent-accessible surface area of the assembly, buried upon formation of all assembly's interfaces.",
  dissociationEnergy:
    'Indicates the free energy of assembly dissociation, in kcal/M. The free energy of dissociation corresponds to the free energy difference between dissociated and associated states. Positive values of ΔGdiss indicate that an external driving force should be applied in order to dissociate the assembly, therefore assemblies with ΔGdiss>0 are thermodynamically stable.',
  dissociationEntropy:
    'Indicates the rigid-body entropy change at dissociation, in kcal/M. The entropy change corresponds to the lowest free energy way to dissociate the assembly into a set of stable assemblies or monomeric units.',
  assemblySymmetry:
    'Point group symmetry for the biological assembly. The symmetry group is calculated using the AnAnaS software. It detects five symmetry groups: cyclic, dihedral, tetrahedral, octahedral and icosahedral.',
};

export const entryDomainsTooltips = {
  description: 'Descriptive name of this domain’s classification, as defined in the source database.',
  sourceDomainAccession: 'Source database and unique classification identifier for a domain.',
  domainName:
    'Domain names uniquely identify a domain in a macromolecule. It encodes information like classification hierarchy and source (e.g., PDB ID, chain, domain number) for consistent referencing.',
  authorSegments:
    'Author segments refer to the residue numbering as provided by the original authors of the PDB entry. This numbering may differ from canonical or sequential numbering due to biological context, insertions, or historical reasons.',
  segments: 'Segments represent continuous stretches of a sequence with sequential residue numbering, starting from 1 at the N-terminus.',
};

export const annotationsTooltips = {
  'reactant-like': `Assigned to ligands whose binding proteins are reported in the <a href="https://www.rhea-db.org/" target="_blank">Rhea database</a>, as participating in reactions, with a <a href="https://www.sciencedirect.com/science/article/pii/S0969212618300492" target="_blank">PARITY</a> similarity score to a reaction participant exceeding 0.7.`,
  'cofactor-like': `Assigned to ligands with a <a href="https://www.sciencedirect.com/science/article/pii/S0969212618300492" target="_blank">PARITY</a> similarity above the threshold for one of the 27 cofactor classes in the <a href="https://www.ebi.ac.uk/thornton-srv/databases/CoFactor/" target="_blank">CoFactor database</a>. The ligand’s binding proteins must also be enzymes associated with that cofactor class.`,
  'drug-like': `Assigned to ligands whose binding proteins are reported as pharmacologically active targets in the <a href="https://go.drugbank.com/" target="_blank">DrugBank database</a>.`,
  unannotated: `No annotation is available for the functional role of the ligand.`,
  modification: `Chemically modified amino acids or nucleotides within protein, DNA, or RNA chains, these may affect the macromolecule’s structure or function.`,
};

export const INTX_NAME_COLORS: Record<string, string> = {
  clash: '#D32B1E',
  covalent: '#1D1D1D',
  vdw_clash: '#D32B1E',
  vdw: '#E1A11A',
  hbond: '#4277B6',
  xbond: '#DB6917',
  ionic: '#702C8C',
  metal_complex: '#463397',
  aromatic: '#92AE31',
  hydrophobic: '#EBCE2B',
  carbonyl: '#2B3514',
  polar: '#4277B6',
  CARBONPI: '#C0BD7F',
  CATIONPI: '#C0BD7F',
  DONORPI: '#C0BD7F',
  HALOGENPI: '#C0BD7F',
  METSULPHURPI: '#C0BD7F',
  plane_plane: '#92AE31',
  AMIDEAMIDE: '#2B3514',
  AMIDERING: '#C0BD7F',
  weak_polar: '#96CDE6',
  weak_hbond: '#96CDE6',
  mixed: '#7F7E80',
};
