const isDev = location.hostname.includes('wwwdev');

const base = isDev ? 'https://wwwdev.ebi.ac.uk' : 'https://www.ebi.ac.uk';

export const keyFeatureListslides = [
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
      "<div>Overlay all the observed bound molecules on representative conformations of a protein segment across the complete PDB archive. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P24666/structures'>View example</a> <div style='font-size: 12px'>(Click button <i>\"3D view of superposed structures\"</i>)</div></div>",
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
    src: 'assets/img/v2-images/3d_beacons_overview.png',
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
      "<div>Compare experimental models from the PDB with AlphaFold models at PDBe-KB Aggregated Views of Protein. <a target='_blank' class='link-legend-style-kf' href='https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/structures'>View example</a> <div style='font-size: 12px'>(Click button <i>\"3D view of superposed structures > Load AlphaFold structure\"</i>)</div></div>",
    div_content: 'Compare experimental models from the PDB with AlphaFold models at PDBe-KB Aggregated Views of Protein. ',
    anchor_content: 'View example',
    event_label: 'features_afsuperposition',
    example_href: 'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/P00439/structures',
  },
];

export const markersColors = {
  'Biophysical parameters': '#8495a9',
  'Small-molecule sites': '#00596c',
  'Protein binding sites': '#00897b',
  'Proteins/domains': '#13c66d',
  'Evolutionary conserved sites': '#84e18f',
  'Mutations/variations': '#d9f3ce',
};

export const SEO_CONFIG = {
  home: {
    title: 'PDBe-KB | Protein Knowledgebase at EMBL-EBI',
    description:
      'PDBe-KB integrates structural biology data with functional annotations to provide a comprehensive protein knowledgebase powered by EMBL-EBI and partner resources.',
    canonicalUrl: `${base}/pdbe/pdbe-kb/`,
  },
  services: {
    title: 'PDBe-KB Services | Aggregated Views, API, Graph Database & Data Access',
    description:
      'Explore PDBe-KB services including aggregated protein views, APIs, graph database access, FTP downloads, and data visualisation tools for structural biology.',
    canonicalUrl: `${base}/pdbe/pdbe-kb/services`,
  },
  partners: {
    title: 'PDBe-KB Data & Partners | Protein Annotation Resources and Collaborations',
    description:
      'Discover PDBe-KB partner resources providing protein and domain annotations, structural data, and biological insights across multiple data providers worldwide.',
    canonicalUrl: `${base}/pdbe/pdbe-kb/partners`,
  },
  join: {
    title: 'Join PDBe-KB | Contribute Data and Become a Partner Resource',
    description: 'Learn how to join PDBe-KB, contribute functional annotations, and integrate your resource into a global protein knowledgebase powered by EMBL-EBI.',
    canonicalUrl: `${base}/pdbe/pdbe-kb/join`,
  },
  schema: {
    title: 'PDBe Graph Schema Explorer | Data Model and Neo4j Structure',
    description:
      'Explore the PDBe graph database schema, including nodes, relationships, and data structure used to integrate structural and functional protein annotations.',
    canonicalUrl: `${base}/pdbe/pdbe-kb/schema`,
  },
  graph: {
    title: 'PDBe Graph Database (Neo4j) | Setup Guide, Downloads & Queries',
    description:
      'Download and set up the PDBe graph database in Neo4j. Follow step-by-step instructions, explore documentation, and run Cypher queries on protein data.',
    canonicalUrl: `${base}/pdbe/pdbe-kb/graph`,
  },
};
