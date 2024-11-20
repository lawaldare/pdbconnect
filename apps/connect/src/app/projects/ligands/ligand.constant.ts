import { ThemeType } from '@pdbc/core';

export const navSections = [
  { sectionId: 'description-section', sectionName: 'Description', isSubSection: false },
  { sectionId: 'properties-section', sectionName: 'Physicochemical properties', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Bound structures', isSubSection: false },
  { sectionId: 'interaction-section', sectionName: 'Interaction statistics', isSubSection: false },
  { sectionId: 'related-ligand-section', sectionName: 'Related ligands', isSubSection: false },
  { sectionId: 'scaffold-section', sectionName: 'Same scaffold', isSubSection: true },
  { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
  { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
];

export const clcNavSections = [
  { sectionId: 'description-section', sectionName: 'Description', isSubSection: false },
  { sectionId: 'properties-section', sectionName: 'Physicochemical properties', isSubSection: false },
  { sectionId: 'structures-section', sectionName: 'Bound structures', isSubSection: false },
  { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
];

export const headerSearchConfig = {
  examples: [
    { label: 'STI', url: '/chemicalCompound/show/STI' },
    { label: 'GLC', url: '/chemicalCompound/show/GLC' },
    { label: 'NAG', url: '/chemicalCompound/show/NAG' },
    { label: 'HEM', url: '/chemicalCompound/show/HEM' },
    { label: 'CLC_000191', url: '/chemicalCompound/show/CLC_000191' },
    { label: 'PRD_000204', url: '/chemicalCompound/show/PRD_000204' },
  ],
  backgroundColor: 'rgba(15, 92, 90, 0.60)',
  type: ThemeType.PDBEKB,
};

export const ligandHomePageSeaderSearchConfig = {
  examples: [
    { label: 'STI', url: '/chemicalCompound/show/STI' },
    { label: 'GLC', url: '/chemicalCompound/show/GLC' },
    { label: 'NAG', url: '/chemicalCompound/show/NAG' },
    { label: 'HEM', url: '/chemicalCompound/show/HEM' },
    { label: 'CLC_000191', url: '/chemicalCompound/show/CLC_000191' },
    { label: 'PRD_000204', url: '/chemicalCompound/show/PRD_000204' },
  ],
  backgroundColor: '',
  type: ThemeType.PDBEKB,
  isHomepage: true,
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

export const quickLinks = [
  {
    label: 'PDBe CCDUtils',
    url: 'https://github.com/PDBeurope/ccdutils',
  },
  {
    label: 'PDBe Arpeggio',
    url: 'https://github.com/PDBeurope/arpeggio',
  },
  {
    label: 'PDBe RelLig',
    url: 'https://github.com/PDBeurope/rellig',
  },
  {
    label: 'LigEnV component',
    url: 'https://github.com/PDBeurope/ligand-env',
  },
  {
    label: 'Database schema',
    url: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/schema',
  },
  {
    label: 'Graph database',
    url: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/graph',
  },
  {
    label: 'API',
    url: 'https://www.ebi.ac.uk/pdbe/graph-api/pdbe_doc/',
  },
  {
    label: 'FTP area',
    url: 'https://ftp.ebi.ac.uk/pub/databases/msd/pdbechem_v2/',
  },
  {
    label: 'Bulk download',
    url: 'https://www.ebi.ac.uk/pdbe/download/docs',
  },
  {
    label: 'Tutorials',
    url: 'https://github.com/PDBeurope/pdbe-notebooks/tree/main/pdbe_ligands_tutorials',
  },
];

export const slides = [
  {
    title: 'Experimental and Predicted Protein Structures',
    src: 'assets/img/experimental_and_predicted2.png',
    details:
      "<div>Compare the superposed structures of protein chains and AlphaFold predictions by clicking on the “3D-view of superposed structures” button on PDBe-KB pages. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P15291/structures'>View example</a></div>",
    div_content:
      'Compare the superposed structures of protein chains and AlphaFold predictions by clicking on the “3D-view of superposed structures” button on PDBe-KB pages. ',
    anchor_content: 'View example',
    event_label: 'features_exp_pred',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P15291/structures',
  },
  {
    title: 'Superposition of Protein Chains and Ligands',
    src: 'assets/img/superimposition2.png',
    details:
      "<div>Overlay all the observed bound molecules on representative conformations of a protein segment across the complete PDB archive. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P24666/structures'>View example</a>",
    div_content: 'Overlay all the observed bound molecules on representative conformations of a protein segment across the complete PDB archive. ',
    anchor_content: 'View example',
    event_label: 'features_superposition',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P24666/structures',
  },
  {
    title: 'Functional and Biophysical Annotations',
    // src: "assets/img/biophysical_annotations.png",
    src: 'assets/img/wordcloud2.png',
    details:
      "<div>PDBe-KB partners provide a wide array of functional and biophysical annotations for proteins and small molecules. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/Q07009/annotations'>PDB ProtVista.</a></div>",
    div_content: 'PDBe-KB partners provide a wide array of functional and biophysical annotations for proteins and small molecules. ',
    anchor_content: 'PDB ProtVista.',
    event_label: 'features_functional_biophys',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/Q07009/annotations',
  },
  {
    title: 'Macromolecular Interaction Interfaces',
    src: 'assets/img/interfaces_example2.png',
    details:
      "<div>Macromolecular interaction interface information calculated using PDBe PISA, and displayed as per residue annotations. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P54764/interactions'>View example</a></div>",
    div_content: 'Macromolecular interaction interface information calculated using PDBe PISA, and displayed as per residue annotations. ',
    anchor_content: 'View example',
    event_label: 'features_macromolecular',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P54764/interactions',
  },
  {
    title: 'Similar Proteins',
    src: 'assets/img/similar2.png',
    details:
      "<div>The similar proteins section of the aggregated views of proteins displays proteins that have >90% sequence identity to a protein of interest. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P07477/similarity'>View example</a></div>",
    div_content: 'The similar proteins section of the aggregated views of proteins displays proteins that have >90% sequence identity to a protein of interest. ',
    anchor_content: 'View example',
    event_label: 'features_similar',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P07477/similarity',
  },
  {
    title: 'Ligand Annotations',
    src: 'assets/img/ligands_annotations_highres2.png',
    details:
      "<div>A gallery of all the small molecules across the PDB archive which interact with a protein of interest. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/ligands'>View example</a></div>",
    div_content: 'A gallery of all the small molecules across the PDB archive which interact with a protein of interest. ',
    anchor_content: 'View example',
    event_label: 'features_ligands',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/ligands',
  },
  {
    title: 'Known Variants',
    src: 'assets/img/variants_highres.png',
    details:
      "<div>Variant annotations from PDBe-Kb partner resources  in a 2D sequence feature viewer, <a target='_blank' class='link-legend-style-kf' href='https://github.com/PDBeurope/protvista-pdb'>PDB ProtVista</a>.</div>",
    div_content: 'Variant annotations from PDBe-Kb partner resources  in a 2D sequence feature viewer, ',
    anchor_content: 'PDB ProtVista',
    event_label: 'features_variants',
    example_href: 'https://github.com/PDBeurope/protvista-pdb',
  },
  {
    title: 'Secondary Structure Variance',
    src: 'assets/img/sec_structures.png',
    details:
      "<div>Investigate the variation in secondary structure elements across PDB chains for a protein of interest in the 2D sequence feature viewer, <a target='_blank' class='link-legend-style-kf' href='https://github.com/PDBeurope/protvista-pdb'>PDB ProtVista</a>.</div>",
    div_content: 'Investigate the variation in secondary structure elements across PDB chains for a protein of interest in the 2D sequence feature viewer, ',
    anchor_content: 'PDB ProtVista.',
    event_label: 'features_secondary',
    example_href: 'https://github.com/PDBeurope/protvista-pdb',
  },
  {
    title: '3D-structure models and associated metadata',
    // src: "assets/img/3dbeacons2.png",
    src: 'assets/img/3d_beacons_overview.png',
    details:
      "<div>3D-Beacons aims to provide experimental and computational 3D-structure models and meta-information from all the contributing data resources in a standardised data format, on a unified platform. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/3dbeacons/search/P38398'>View example</a></div>",
    div_content:
      '3D-Beacons aims to provide experimental and computational 3D-structure models and meta-information from all the contributing data resources in a standardised data format, on a unified platform. ',
    anchor_content: 'View example',
    event_label: 'features_complexes',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/3dbeacons/search/P38398',
  },
  {
    title: 'PDB and AlphaFold Structures Superposition',
    src: 'assets/img/af_superimpose2.png',
    details:
      "<div>Compare experimental models from the PDB with AlphaFold models at PDBe-KB Aggregated Views of Protein. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/structures'>View example</a> <div style='font-size: 12px'>",
    div_content: 'Compare experimental models from the PDB with AlphaFold models at PDBe-KB Aggregated Views of Protein. ',
    anchor_content: 'View example',
    event_label: 'features_afsuperposition',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/structures',
  },
];

export const faqs = [
  {
    title: 'What is PDBe-KB?',
    content:
      'PDBe-KB is a repository of protein data derived from the Protein Data Bank (PDB) and the AlphaFold database, which aims to provide a comprehensive knowledge base on protein structures, ligands, variants, and related complexes. It is part of the PDBe Europe initiative.',
  },
  {
    title: 'How can I access PDBe-KB?',
    content:
      'You can access PDBe-KB using various tools and platforms, such as the PDBe-KB website, the PDBe-KB API, and the PDBe-KB Aggregated Views of Proteins. To find specific protein details, use the search functionality, or browse the database using the interactive views.',
  },
  {
    title: 'What is the PDBe-KB Aggregated Views of Proteins?',
    content:
      'The PDBe-KB Aggregated Views of Proteins is a platform that provides a unified view of protein data from different resources, such as the PDB, PDBe-KB, AlphaFold, and other PDBe-KB partner resources. The views are designed to help users explore and understand the complexities of protein structures, ligands, variants, and related complexes.',
  },
  {
    title: 'How can I contribute to PDBe-KB?',
    content:
      'To contribute to PDBe-KB, you can submit data, make corrections, or request new data. You can also join the PDBe-KB community by participating in discussions, contributing to the development of tools and resources, and contributing to the overall knowledge base of protein data.',
  },
  {
    title: 'What is the PDBe-KB API?',
    content:
      'The PDBe-KB API provides access to the PDBe-KB data through a RESTful API. You can use the API to retrieve protein details, download data files, and perform various analysis and visualization tasks. The API documentation can be found at https://www.ebi.ac.uk/pdbe/kb/api.',
  },
  {
    title: 'How can I use the PDBe-KB Aggregated Views of Proteins?',
    content:
      'The PDBe-KB Aggregated Views of Proteins provides an interactive and customizable platform for exploring and understanding protein data from different resources. You can use the views to navigate the database, view protein details, and perform various analysis and visualization tasks. The views are designed to help users explore and understand the complexities of protein structures, ligands, variants, and related complexes.',
  },
  {
    title: 'What is the PDBe-KB partner resources?',
    content:
      'The PDBe-KB is part of the PDBe Europe initiative, which aims to provide a comprehensive knowledge base on protein structures, ligands, variants, and related complexes. The PDBe-KB partner resources include the PDB, PDBe-KB, AlphaFold, and other PDBe-KB partner resources. The partner resources are responsible for providing experimental and computational 3D-structure models, meta-information, and other data related to protein structures, ligands, variants, and related complexes.',
  },
];

export const dataBaseOrder = [
  'ChEMBL',
  'SureChEMBL',
  'ChEBI',
  'CCDC',
  'PubChem',
  'PubChem DOTF',
  'PubChem TPHARMA',
  'DrugBank',
  'DrugCentral',
  'ClinicalTrials',
  'PharmGKB',
  'Probes And Drugs',
  'Guide to Pharmacology',
  'EPA CompTox Dashboard',
  'Mcule',
  'ZINC',
  'MedChemExpress',
  'Selleck',
  'BRENDA',
  'KEGG LIGAND',
  'Rhea',
  'BindingDb',
  'HMDB',
  'Recon',
  'MetaboLights',
  'LipidMaps',
  'SwissLipids',
  'NMRShiftDB',
  'LINCS',
  'eMolecules',
  'fdasrs',
  'Nikkaji',
  'ChemicalBook',
];
