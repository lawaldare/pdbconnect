import { ThemeType } from '@pdbc/core';

export const navSections = [
  { sectionId: 'description-section', sectionName: 'Description', isSubSection: false },
  { sectionId: 'properties-section', sectionName: 'Physicochemical properties', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Bond structures', isSubSection: false },
  { sectionId: 'interaction-section', sectionName: 'Interaction statistics', isSubSection: false },
  { sectionId: 'related-ligand-section', sectionName: 'Related ligands', isSubSection: false },
  { sectionId: 'scaffold-section', sectionName: 'Same scaffold', isSubSection: true },
  { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
  { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
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

export const headerLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  headerTitle: 'Ligands',
};

export const cofactorTooltip = `Using the PARITY method, ligands are initially compared to a template library of 27 cofactor classes. If they meet the similarity threshold, they are further compared to the representative molecule for the matched cofactor class. If the similarity score remains above the threshold and the ligand is found in a PDB entry with an approved EC number for the matched class, it is classified as cofactor-like; otherwise, it is flagged for manual annotation. For more information, please refer to: https://doi.org/10.1093/bioinformatics/btz115.`;
export const drugTooltip = `Drug-like molecules are annotated by mapping to the DrugBank database (https://go.drugbank.com/). Ligands bound to PDB structures of pharmacologically active targets listed in DrugBank are classified as drug-like.`;
export const reactantTooltip = `Reactants are annotated based on mapping to the Rhea database (https://www.rhea-db.org/), an expert-curated resource that uses the ChEBI ontology to describe reaction participants and their structures. For each reaction in Rhea, we map all associated PDB structures based on the protein (UniProt accession) that catalyses the reaction. Using the PARITY method, we then compare the bound ligands in these PDB structures to ChEBI compounds involved in the reaction, annotating those with a minimum similarity score of 0.7 as reactant-like.`;
export const unannotatedTooltip = `The functional role of these ligands has not yet been annotated.`;
