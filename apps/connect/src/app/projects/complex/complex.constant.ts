import { ThemeType } from '@pdbc/core';

export const headerSearchComplexConfig = {
  examples: [
    { label: 'PDB-CPX-159519', url: '/complex/PDB-CPX-159519' },
    { label: 'PDB-CPX-137978', url: '/complex/PDB-CPX-137978' },
    { label: 'PDB-CPX-129080', url: '/complex/PDB-CPX-129080' },
    { label: 'PDB-CPX-134220', url: '/complex/PDB-CPX-134220' },
  ],
  backgroundColor: 'rgba(8, 95, 92, 0.79)',
  type: ThemeType.PDBEKB,
};

export const navComplexSections = [
  { sectionId: 'summary-section', sectionName: 'Summary', isSubSection: false },
  // { sectionId: 'properties-section', sectionName: 'Physiochemical properties', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Structures', isSubSection: false },
  { sectionId: 'interaction-section', sectionName: 'Interactions', isSubSection: false },
  { sectionId: 'publications-section', sectionName: 'Publications', isSubSection: false },
  // { sectionId: 'scaffold-section', sectionName: 'Same scaffold', isSubSection: true },
  // { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
  // { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
];

export const headerComplexLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  headerTitle: 'Complex',
};
