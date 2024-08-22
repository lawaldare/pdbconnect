export const dataContentSmallMolecules = [
  {
    title: 'wwPDB Chemical Component Dictionary',
    content: [
      {
        subtitle: 'Type',
        subText: 'Updated CCD files in CIF format.',
        subContent: ['Combined mmCIF', 'Individual mmCIFs'],
        values: ['compound-mmcif-combined', 'compound-mmcif-individual'],
        text: ['Updated CCD files in CIF format combined in a single file.', 'Updated CCD files in CIF format in individual files.'],
      },
    ],
  },
  {
    title: 'Coordinates (PDB format)',
    content: [
      {
        subtitle: 'Model coordinates',
        subText: 'Conformer generated based on mmCIF _chem_comp_atom.model_Cartn_ item.',
        subContent: ['Conventional atom naming scheme', 'Alternative atom naming scheme'],
        values: ['model-conventional', 'model-alternative'],
        text: [
          'Use the conventional atom identifier, corresponding to the mmCIF _chem_comp_atom.atom_id item.',
          'Use the alternative identifier for atoms, corresponding to the mmCIF _chem_comp_atom.alt_atom_id item.',
        ],
      },
      {
        subtitle: 'Ideal coordinates',
        subText: 'Conformer generated based on mmCIF _chem_comp_atom.model_Cartn_ideal item.',
        subContent: ['Conventional atom naming scheme', 'Alternative atom naming scheme'],
        values: ['ideal-conventional', 'ideal-alternative'],
        text: [
          'Use the conventional atom identifier, corresponding to the mmCIF _chem_comp_atom.atom_id item.',
          'Use the alternative identifier for atoms, corresponding to the mmCIF _chem_comp_atom.alt_atom_id item.',
        ],
      },
    ],
  },
  {
    title: 'Coordinates (SDF format)',
    content: [
      {
        subtitle: 'Model coordinates',
        subText: 'Conformer generated based on mmCIF _chem_comp_atom.model_Cartn_ item.',
        subContent: ['Combined SDF', 'Individual SDF'],
        values: ['model-combined', 'model-individual'],
        text: ['Chemical component coordinates in a single SDF file.', 'Chemical component coordinates in individual SDF files.'],
      },
      {
        subtitle: 'Ideal coordinates',
        subText: 'Conformer generated based on mmCIF _chem_comp_atom.model_Cartn_ideal item.',
        subContent: ['Combined SDF', 'Individual SDF'],
        values: ['ideal-combined', 'ideal-individual'],
        text: ['Chemical component coordinates in a single SDF file.', 'Chemical component coordinates in individual SDF files.'],
      },
    ],
  },
];

export const dataContentStructure = [
  {
    title: 'Coordinate data',
    content: [
      {
        subtitle: 'Coordinates',
        subText: 'Coordinates in mmCIF and PDB file formats.',
        subContent: ['Updated mmCIF file', 'Archive mmCIF file', 'PDB file'],
        values: ['updated-mmCIF', 'archive-mmCIF', 'archive-PDB'],
        text: [
          'An updated version of the PDB archive mmCIF format file. Generated with standardisation of ' +
            'vocabularies, and addition of connectivity information for every chemical compound present in the PDB entry.',
          'The PDB archive file in mmCIF file format.',
          'The PDB archive file in PDB file format.',
        ],
      },
      {
        subtitle: 'Assemblies',
        subText: 'Assemblies for a set of PDB entries.',
        subContent: ['All assemblies', 'Preferred assemblies'],
        values: ['assembly-all', 'assembly-preferred'],
        text: ['All the annotated assemblies for a set of PDB entries.', 'Only the preferred assemblies for a set of PDB entries.'],
      },
      {
        subtitle: 'Experimental data',
        subText: 'Experimental data for a set of PDB entries.',
        subContent: ['Structure factors', 'Electron density map coefficients', 'NMR data'],
        values: ['structure-factors', 'map-coefficients', 'nmr-data'],
        text: [
          'Structure factors for a set of PDB entries.',
          'Electron density map coefficients (2Fo - Fc) and (Fo - Fc) for a set of PDB entries in mmCIF file format.',
          'Chemical shifts and NMR restraints combined in a single file. This data is provided in both STAR and ' +
            'NMR Exchange Format (NEF) formats per PDB entry.',
        ],
      },
    ],
  },
  {
    title: 'Validation data',
    content: [
      {
        subtitle: 'Validation report (PDF)',
        subText: 'Validation reports for a set of PDB entries.',
        subContent: ['Full', 'Summary'],
        values: ['validation-report-full', 'validation-report-summary'],
        text: ['Full wwPDB validation reports for a set of PDB entries.', 'The summary of validation reports for a set of PDB entries.'],
      },
      {
        subtitle: 'Validation data',
        subText: 'Validation data for a set of PDB entries.',
        subContent: ['Validation data (XML)'],
        values: ['validation-data'],
        text: ['Validation data for a set of PDB entries.'],
      },
    ],
  },
  {
    title: 'Sequences (FASTA)',
    content: [
      {
        subtitle: 'Sequences',
        subText: 'Sequences in FASTA format.',
        subContent: ['Combined FASTA', 'Individual FASTA'],
        values: ['fasta-combined', 'fasta-individual'],
        text: ['Sequences for a set of PDB entries in a single FASTA file.', 'Sequences for a set of PDB entries in individual FASTA files.'],
      },
    ],
  },
];

export const dataContentSifts = [
  {
    title: 'Residue-level mapping',
    content: [
      {
        subtitle: 'SIFTS annotation',
        subText: 'SIFTS mappings between UniProt and PDB entries.',
        subContent: ['XML format'],
        values: ['sifts'],
        text: ['Residue-level mapping between UniProt and PDB entries in XML format.'],
      },
    ],
  },
];

export const descriptorStructure = {
  boxTitle: 'Structures and Sequences',
  idType: 'PDB',
  fE: '1cbs',
  sE: '3tu8',
};

export const descriptorSmallMolecules = {
  boxTitle: 'Small Molecules',
  idType: 'small molecule',
  fE: 'DU',
  sE: 'HEM',
};

export const descriptorSifts = {
  boxTitle: 'Residue-level mapping between UniProt and PDB entries (SIFTS)',
  idType: 'PDB',
  fE: '1cbs',
  sE: '5hht',
};
