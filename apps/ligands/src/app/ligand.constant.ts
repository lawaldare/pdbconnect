import { ThemeType } from '@pdbc/core';

export const ligandRouteTabs = [
  { label: 'Description', id: 'description' },
  { label: 'Physicochemical properties', id: 'properties' },
  { label: 'Bound structures', id: 'structures' },
  { label: 'Interactions statistics', id: 'interactions' },
  { label: 'Related ligands', id: 'related-ligands' },
  { label: 'Ligand-specific databases', id: 'databases' },
];

export const tourIds = {
  description: 'tour-ligands-description',
  properties: 'tour-ligands-properties',
  structures: 'tour-ligands-structures',
  interactions: 'tour-ligands-interactions',
  ligands: 'tour-ligands-related-ligands',
};

export const headerSearchConfig = {
  examples: ['STI', 'GLC', 'NAG', 'HEM', 'CLC_000191', 'PRD_000468'],
  backgroundColor: '#085f5ccc',
  type: ThemeType.PDBEKB,
  placeholderText: 'View PDBe-KB ligand by PDB ligand ID (CCD/PRD/CLC)',
  complexPage: false,
};

export const ligandHomePageSeaderSearchConfig = {
  examples: ['STI', 'GLC', 'NAG', 'HEM', 'CLC_000191', 'PRD_000468'],
  backgroundColor: '',
  type: ThemeType.PDBEKB,
  placeholderText: 'View PDBe-KB ligand by PDB ligand ID (CCD/PRD/CLC)',
};

export const ligandsHeaderLogoMenuConfig = {
  backgroundColor: '#085F5C',
  logoType: 'PDBe-KB',
  urls: [
    { name: 'Home', path: 'https://www.ebi.ac.uk/pdbe-srv/pdbechem/', openInNewTab: true },
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
    { name: 'Documentation', path: 'https://github.com/PDBe-KB/pdbe-kb-manual/wiki', openInNewTab: true },
    { name: 'Training', path: 'https://github.com/PDBeurope/pdbe-notebooks/tree/main/pdbe_ligands_tutorials', openInNewTab: true },
  ],
  newHeaderLogo: true,
  logoPath: 'images/logo.png',
  logoWidth: '350px',
};

export const homePageUrls = [
  { name: 'Home', path: '/', openInNewTab: false },
  { name: 'Latest releases', path: '/latest-releases', openInNewTab: false },
  { name: 'Documentation', path: 'https://github.com/PDBe-KB/pdbe-kb-manual/wiki', openInNewTab: true },
];

export const cofactorTooltip = `Ligands are annotated as “cofactor-like” if their PARITY (https://www.sciencedirect.com/science/article/pii/S0969212618300492) similarity to one of the 27 cofactor classes defined in the CoFactor (https://www.ebi.ac.uk/thornton-srv/databases/CoFactor/) database is above a set threshold, and the protein binding to the ligand is an enzyme associated with that cofactor class`;
export const drugTooltip = `Ligands are annotated as “drug-like” if the  protein binding to them is reported as a pharmacologically active target in the DrugBank database (https://go.drugbank.com/).`;
export const reactantTooltip = `Ligands are annotated as “reactant-like” if the protein binding to them is reported to participate in a reaction in Rhea database (https://www.rhea-db.org/), and the ligand’s PARITY (https://www.sciencedirect.com/science/article/pii/S0969212618300492) similarity to a reaction participant exceeds 0.7. `;
export const unannotatedTooltip = `No annotation available for the functional role of the ligand.`;

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
