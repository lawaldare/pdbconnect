import { ThemeType } from '@pdbc/core';

export const navSections = [
  { sectionId: 'description-section', sectionName: 'Description', isSubSection: false },
  { sectionId: 'properties-section', sectionName: 'Physicochemical properties', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Structures', isSubSection: false },
  { sectionId: 'interaction-section', sectionName: 'Interaction statistics', isSubSection: false },
  { sectionId: 'related-ligand-section', sectionName: 'Related ligands', isSubSection: false },
  { sectionId: 'scaffold-section', sectionName: 'Same scaffold', isSubSection: true },
  { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
  { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
];

export const navComplexSections = [
  { sectionId: 'summary-section', sectionName: 'Summary', isSubSection: false },
  // { sectionId: 'properties-section', sectionName: 'Physiochemical properties', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Structures', isSubSection: false },
  // { sectionId: 'interaction-section', sectionName: 'Interaction statistics', isSubSection: false },
  // { sectionId: 'related-ligand-section', sectionName: 'Related ligands', isSubSection: false },
  // { sectionId: 'scaffold-section', sectionName: 'Same scaffold', isSubSection: true },
  // { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
  // { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
];

export const headerSearchConfig = {
  examples: [
    { label: 'STI', url: '/ligands/STI' },
    { label: 'GLC', url: '/ligands/GLC' },
    { label: 'XRS', url: '/ligands/XRS' },
    { label: 'NAG', url: '/ligands/NAG' },
    { label: 'HEM', url: '/ligands/HEM' },
  ],
  backgroundColor: 'rgba(8, 95, 92, 0.79)',
  type: ThemeType.PDBEKB,
};

export const headerSearchComplexConfig = {
  examples: [
    { label: 'PDB-CPX-159519', url: '/complex/PDB-CPX-159519' },
    { label: 'PDB-CPX-127444', url: '/complex/PDB-CPX-127444' },
    { label: 'PDB-CPX-169229', url: '/complex/PDB-CPX-169229' },
    { label: 'PDB-CPX-162423', url: '/complex/PDB-CPX-162423' },
  ],
  backgroundColor: 'rgba(8, 95, 92, 0.79)',
  type: ThemeType.PDBEKB,
};

export const headerLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  headerTitle: 'Ligands',
};

export const headerComplexLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  headerTitle: 'Complex',
};
