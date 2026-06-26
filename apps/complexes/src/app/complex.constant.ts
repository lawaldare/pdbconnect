import { ThemeType } from '@pdbc/core';
import * as d3 from 'd3';
import { environment } from '../environments/environment';

export const headerSearchComplexConfig = {
  examples: [
    {
      label: 'Hemoglobin HbA (PDB-CPX-154652)',
      value: 'PDB-CPX-154652',
    },
    {
      label: 'SARS-CoV-2 post-fusion S2 spike (CPX-7043)',
      value: 'CPX-7043',
    },
    {
      label: 'Aspartate carbamoyltransferase (4fyy)',
      value: '4fyy',
    },
  ],
  backgroundColor: 'rgba(8, 95, 92, 0.79)',
  type: ThemeType.PDBEKB,
  placeholderText: 'View PDBe-KB complex by PDBe complex ID, PDB entry ID, or Complex Portal ID',
  complexPage: true,
  projectId: 'complexes',
};

export const navComplexSections = [
  { sectionId: 'summary-section', sectionName: 'Summary', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Structures', isSubSection: false },
  { sectionId: 'ligands-section', sectionName: 'Ligands', isSubSection: false },
  { sectionId: 'interaction-section', sectionName: 'Subcomplexes and supercomplexes', isSubSection: false },
  { sectionId: 'publications-section', sectionName: 'Publications', isSubSection: false },
];

export const complexesHeaderLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  urls: [
    { name: 'Home', path: 'https://www.ebi.ac.uk/pdbe/', openInNewTab: true },
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
    { name: 'Documentation', path: 'https://github.com/PDBe-KB/pdbe-kb-manual/wiki', openInNewTab: true },
  ],
  newHeaderLogo: true,
  logoPath: 'images/logo.png',
  logoWidth: '400px',
};

export const complexRouteTabs = [
  { label: 'Summary', id: 'summary' },
  { label: 'Structures', id: 'structures' },
  { label: 'PISA-Derived Properties', id: 'pisa' },
  { label: 'Ligands', id: 'ligands' },
  { label: 'Subcomplexes', id: 'subcomplexes' },
  { label: 'Supercomplexes', id: 'supercomplexes' },
  { label: 'Citations', id: 'citations' },
];

export const tourIds = {
  summary: 'tour-complex-summary',
  structures: 'tour-complex-structures',
  pisa: 'tour-complex-pisa',
  ligands: 'tour-complex-ligands',
  subcomplexes: 'tour-complex-subcomplexes',
  supercomplexes: 'tour-complex-supercomplexes',
  citations: 'tour-complex-citations',
};

export const complexSummaryTabTooltips = {
  polymerComposition: 'Shows the total number of each polymer type in the complex: protein, RNA, DNA, or hybrid DNA/RNA. Counts come from component stoichiometry.',
  globalSymmetry:
    'Displays the symmetry most often observed for this complex (identified with AnAnaS). PDB assemblies with different or missing symmetry are listed separately.',
  observedCofactors:
    'Lists all unique cofactors observed bound across all instances of this complex. A ligand is marked as a cofactor when it matches a class in the CoFactor database and binds a protein with a recognised enzymatic role.',
  component:
    'Shows every macromolecule in the complex with its copy number. Mapped proteins link to UniProt while mapped RNAs link to Rfam. Unmapped macromolecules are displayed as type_PDB_entityID_stoichiometry (for example, Protein_3qwr_3_1), where type refers to the polymer type: Protein, DNA, DNA/RNA or RNA.',
  uniqueBoundMacromolecules:
    'Lists all unique additional macromolecules observed bound across all instances of this complex. A bound macromolecule can be one of seven types: antibody, peptide (less than 20 amino acids and unmapped), mRNA (only in ribosome complexes), tRNA (only in ribosome complexes), short nucleic acid fragments (less than 25 nucleotides and unmapped).',
};

export const PARAMS = [
  {
    label: 'Acc. SA (Å²)',
    value: 'accessible_surface_area',
  },
  {
    label: 'Bur. SA (Å²)',
    value: 'buried_surface_area',
  },
  {
    label: 'Solv. ΔG (kcal/mol)',
    value: 'solvation_energy_gain',
  },
  {
    label: 'Diss. ΔG (kcal/mol)',
    value: 'dissociation_energy',
  },
  {
    label: 'Diss. TΔS (kcal/mol)',
    value: 'dissociation_entropy',
  },
];
/* 2-decimal formatter used everywhere */
export const fmt2 = d3.format('.2f');

/* NEW – first letter only, used for slider labels */
export const ucfirst = (str: string) => str[0].toUpperCase() + str.slice(1);

export const baseUrl = `${environment.baseUrl}pdbe/`;

export const formatLabel = (str: string) =>
  str
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

export const cofactorTooltip = `Ligands are annotated as “cofactor-like” if their PARITY (https://www.sciencedirect.com/science/article/pii/S0969212618300492) similarity to one of the 27 cofactor classes defined in the CoFactor (https://www.ebi.ac.uk/thornton-srv/databases/CoFactor/) database is above a set threshold, and the protein binding to the ligand is an enzyme associated with that cofactor class`;
export const drugTooltip = `Ligands are annotated as “drug-like” if the  protein binding to them is reported as a pharmacologically active target in the DrugBank database (https://go.drugbank.com/).`;
export const reactantTooltip = `Ligands are annotated as “reactant-like” if the protein binding to them is reported to participate in a reaction in Rhea database (https://www.rhea-db.org/), and the ligand’s PARITY (https://www.sciencedirect.com/science/article/pii/S0969212618300492) similarity to a reaction participant exceeds 0.7. `;
export const unannotatedTooltip = `No annotation available for the functional role of the ligand.`;

export const pisaTableTooltip = {
  ASA: 'Surface area indicates the total solvent-accessible surface area of the assembly, in Å2.',
  BSA: "Buried area indicates, in Å2, the total solvent-accessible surface area of the assembly, buried upon formation of all assembly's interfaces.",
  SEA: 'Indicates the solvation free energy gain upon formation of the assembly, in kcal/mol. The value is calculated as difference in total solvation energies of isolated and assembled structures.',
  DEG: 'Indicates the free energy of assembly dissociation, in kcal/mol. The free energy of dissociation corresponds to the free energy difference between dissociated and associated states. Positive values of ΔGdiss indicate that an external driving force should be applied in order to dissociate the assembly, therefore assemblies with ΔGdiss>0 are thermodynamically stable.',
  DEP: 'Indicates the rigid-body entropy change at dissociation, in kcal/mol. The entropy change corresponds to the lowest free energy way to dissociate the assembly into a set of stable assemblies or monomeric units.',
};

export const superpositionTooltip =
  'Complexes are aligned based on the largest common component (measured the by number of residues) with a UniProt mapping. In case there are no common components with Uniprot mapping, the largest common component with an Rfam mapping is used Residue-residue correspondence is determined by UniProt residue numbers (for UniProt mappings) or by sequence alignment (for Rfam mappings)';

export const idWarningTooltip =
  'The identifier shown on this page is currently part of the beta release. These identifiers are subject to change during the beta phase. Final, stable IDs will be assigned and maintained once the resource enters full production.';
