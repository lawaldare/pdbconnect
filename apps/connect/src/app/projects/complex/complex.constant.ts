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
  placeholderText: 'View PDBe-KB complex by PDBe complex ID',
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
