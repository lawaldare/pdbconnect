import { ThemeType } from '@pdbc/core';
import * as d3 from 'd3';

export const headerSearchComplexConfig = {
  examples: [
    {
      label: 'Hemoglobin HbA complex',
      value: 'PDB-CPX-159519',
    },
    {
      label: 'Cyclin A2-CDK2 complex',
      value: 'PDB-CPX-148886',
    },
    {
      label: '2nu8',
      value: '2nu8',
    },
    {
      label: '4fyy',
      value: '4fyy',
    },
  ],
  backgroundColor: 'rgba(8, 95, 92, 0.79)',
  type: ThemeType.PDBEKB,
  placeholderText: 'View PDBe-KB complex by PDBe complex ID',
  complexPage: true,
};

export const navComplexSections = [
  { sectionId: 'summary-section', sectionName: 'Summary', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Structures', isSubSection: false },
  { sectionId: 'ligands-section', sectionName: 'Ligands', isSubSection: false },
  { sectionId: 'interaction-section', sectionName: 'Subcomplexes and supercomplexes', isSubSection: false },
  { sectionId: 'publications-section', sectionName: 'Publications', isSubSection: false },
  // { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
  // { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
];

export const headerComplexLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  headerTitle: 'Complex',
  urls: [
    { name: 'Home', path: 'https://www.ebi.ac.uk/pdbe-srv/pdbechem/', openInNewTab: true },
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
    { name: 'Documentation', path: 'https://github.com/PDBe-KB/pdbe-kb-manual/wiki', openInNewTab: true },
  ],
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

export const complexSummaryTabTooltips = {
  polymerComposition: 'Shows the total number of each polymer type in the complex: protein, RNA, DNA, or hybrid DNA/RNA. Counts come from component stoichiometry.',
  globalSymmetry:
    'Displays the symmetry most often observed for this complex (identified with AnAnaS). PDB assemblies with different or missing symmetry are listed separately.',
  observedCofactors:
    'Lists every unique cofactor bound to the complex. A ligand is marked as a cofactor when it matches a class in the CoFactor database and binds a protein with a recognised enzymatic role.',
  component:
    'Shows every macromolecule in the complex with its copy number. Mapped proteins link to UniProt while mapped RNAs link to Rfam. Unmapped macromolecules are displayed as type_PDB_entityID (for example, antibody_5mv4_1), where type refers to the molecule class: protein, DNA, RNA, or antibody.',
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

export const formatLabel = (str: string) =>
  str
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

export const pisaTableTooltip = {
  ASA: 'Surface area indicates the total solvent-accessible surface area of the assembly, in Å2.',
  BSA: "Buried area indicates, in Å2, the total solvent-accessible surface area of the assembly, buried upon formation of all assembly's interfaces.",
  SEA: 'Indicates the solvation free energy gain upon formation of the assembly, in kcal/mol. The value is calculated as difference in total solvation energies of isolated and assembled structures.',
  DEG: 'Indicates the free energy of assembly dissociation, in kcal/mol. The free energy of dissociation corresponds to the free energy difference between dissociated and associated states. Positive values of ΔGdiss indicate that an external driving force should be applied in order to dissociate the assembly, therefore assemblies with ΔGdiss>0 are thermodynamically stable.',
  DEP: 'Indicates the rigid-body entropy change at dissociation, in kcal/mol. The entropy change corresponds to the lowest free energy way to dissociate the assembly into a set of stable assemblies or monomeric units.',
};
