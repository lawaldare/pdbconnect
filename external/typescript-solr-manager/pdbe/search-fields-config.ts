namespace PDBe.SolrApp {

  export const fieldGroups = [
    'Text',  // 0
    'Latest', // 1
    'Sequence search', // 2
    'Entry Information', // 3
    'Experimental Information', // 4
    'Author Names', // 5
    'Citation', // 6
    'Macromolecules', // 7
    'Enzyme Information', // 8
    'Assembly Information', // 9
    'Source Organism', // 1
    'Expression host', // 11
    'Compound', // 12
    'Diffraction Experiment Details', // 13
    'Diffraction radiation source', // 14
    'Diffraction Detector', // 15
    'EM Experimental information', // 16
    'EM image processing and reconstruction', // 17
    'EM microscope', // 18
    'EM Detector', // 19
    'EM grid', // 20
    'Diffraction Software', // 21
    'NMR', // 22
    'Biological Classification (Gene Ontology)', // 23
    'Sequence classification', // 24
    'Structure classification', // 25
    'Nucleic acid conf features', // 26
    'Crystallographic cell parameters', // 27
    'Crystallisation pH / reservoir', // 28
    'Representative Structures', // 29
    'IDs' // 30
  ];

  // Search field interface
  interface SearchFieldInterface {
    [index: string]: {
      label: string,
      label2?: string,
      type: 'string' | 'largeString' | 'int' | 'float' | 'date',
      groupingIndex: number,
      alias?: string[],
      relation?: string,
      condition?: string,
      autocomplete?: boolean,
      value?: string[],
      valueType?: string,
      queryField?: string,
      fqValue?: string,
      appendValueToParams?: boolean,
      appendValueToFq?: boolean,
      format?: string,
      submitFilter?: string,
      exampleText?: string,
      descText?: string
    };
  }

  export const searchFields: SearchFieldInterface = {

    text: {
      label: 'Text',
      type: 'string',
      groupingIndex: 0
    },
    q_title: {
      label: 'Title',
      type: 'string',
      autocomplete: true,
      groupingIndex: 0,
      exampleText: 'NMR solution structure of oxytocin',
      descText: 'Title of the PDB entry'
    },
    q_latest_pdb_entry_type: {
      label: 'Entries released this week',
      type: 'string',
      value: ['revised', 'new'],
      groupingIndex: 1
    },
    q_fasta_sequence: {
      label: 'FASTA sequence search',
      queryField: 'xjoin_fasta=true&bf=fasta(percentIdentity)&xjoin_fasta.external.expupperlim=0.1&xjoin_fasta.external.sequence',
      type: 'largeString',
      valueType: 'fastaSequence',
      fqValue: '{!xjoin}xjoin_fasta',
      appendValueToParams: true,
      appendValueToFq: false,
      groupingIndex: 2
    },
    q_phmmer_sequence: {
      label: 'Phmmer sequence search',
      queryField: 'xjoin_phmmer.fl=*&xjoin_phmmer=true&xjoin_phmmer.external.sequence',
      type: 'largeString',
      valueType: 'phmmerSequence',
      fqValue: '{!xjoin}xjoin_phmmer',
      appendValueToParams: true,
      appendValueToFq: false,
      groupingIndex: 2,
      exampleText: 'ADKSDLGYTGLTDEQAQELHSVYMSGLWLFSAVAIVAHLAVYIWRPWF'
    },
    q_experimental_method: {
      label: 'Experimental method',
      type: 'string',
      autocomplete: true,
      groupingIndex: 3,
      exampleText: 'Solution NMR',
      descText: 'The experimental method used to determine the structure'
    },
    q_status: {
      label: 'Entry status',
      type: 'string',
      autocomplete: true,
      groupingIndex: 3,
      relation: 'Equal to',
      exampleText: 'HPUB / REL / WDRN',
      descText: 'Status of a PDB entry'
    },
    q_release_date: {
      label: 'Release date',
      type: 'date',
      format: 'YYYY-MM-DDThh:mm:ssZ',
      groupingIndex: 3,
      exampleText: '4/20/2013',
      descText: 'The release date of the entry'
    },
    q_deposition_date: {
      label: 'Deposition date',
      type: 'date',
      format: 'YYYY-MM-DDThh:mm:ssZ',
      groupingIndex: 3,
      exampleText: '4/20/2012',
      descText: 'The date of initial deposition'
    },
    /*q_overall_quality: {
        label: 'Overall quality',
        type: 'float',
        groupingIndex: 3
    },*/
    q_model_quality: {
      label: 'Model quality',
      type: 'float',
      groupingIndex: 3,
      exampleText: '70',
      descText: 'Percentile quality score for model geometry, relative to the whole PDB archive. From 0-100 with 100 being the best'
    },
    q_data_quality: {
      label: 'Data quality',
      type: 'float',
      groupingIndex: 3,
      exampleText: '70',
      descText: 'Percentile quality score for fit of the model to data, relative to the whole PDB archive. From 0-100 with 100 being the best'
    },
    q_experiment_data_available: {
      label: 'Experiment data available',
      type: 'string',
      value: ['y', 'n'],
      groupingIndex: 3,
      valueType: 'yn',
      exampleText: 'y',
      descText: 'Indicates whether experimental data has been deposited to support the model'
    },
    q_resolution: {
      label: 'Resolution',
      alias: ['em_resolution'],
      type: 'float',
      groupingIndex: 4,
      exampleText: '1.4',
      descText: 'The stated resolution of the data (in Ångströms)'
    },
    q_all_authors: {
      label: 'All authors',
      type: 'string',
      autocomplete: true,
      groupingIndex: 5,
      exampleText: 'smith jb',
      descText: 'Name of an author of the PDB entry or the citation'
    },
    q_entry_authors: {
      label: 'Entry authors',
      type: 'string',
      autocomplete: true,
      groupingIndex: 5,
      exampleText: 'smith jb',
      descText: 'Name of an author of the PDB entry'
    },
    q_citation_authors: {
      label: 'Citation authors',
      type: 'string',
      autocomplete: true,
      groupingIndex: 5,
      exampleText: 'smith jb',
      descText: 'Name of an author of the citation'
    },
    q_journal: {
      label: 'Journal',
      type: 'string',
      autocomplete: true,
      groupingIndex: 6,
      exampleText: 'j. biol. chem.',
      descText: 'Abbreviated name of the cited journal'
    },
    q_citation_title: {
      label: 'Citation title',
      type: 'string',
      groupingIndex: 6,
      exampleText: 'Exploring hydrophobic sites in proteins',
      descText: 'The title of the citation'
    },
    q_citation_year: {
      label: 'Citation year',
      type: 'int',
      groupingIndex: 6,
      exampleText: '2014',
      descText: 'The year of the citation'
    },
    q_pubmed_id: {
      label: 'PubMed ID',
      type: 'string',
      groupingIndex: 6,
      exampleText: '14096470',
      descText: 'Ascession number used by PubMed to identify the citation'
    },
    q_citation_doi: {
      label: 'Citation DOI',
      type: 'string',
      groupingIndex: 6,
      exampleText: '10.1093/nar/gkv1501',
      descText: 'Digital Object Identifier for the citation'
    },
    q_all_molecule_names: {
      label: 'Molecule name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7,
      exampleText: 'Carbonic anhydrase 2',
      descText: 'Name of a macromolecule'
    },
    q_molecule_type: {
      label: 'Molecule type',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7,
      exampleText: 'Protein / RNA',
      descText: 'The polymer type of the macromolecule'
    },
    q_interacting_molecules: {
      label: 'Interacting Molecules',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7
    },
    q_sample_preparation_method: {
      label: 'Molecule expression method',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7,
      exampleText: 'engineered / natural / synthetic',
      descText: 'The method by which the macromolecule was produced'
    },
    q_gene_name: {
      label: 'Gene name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7,
      exampleText: 'PhoQ',
      descText: 'Name of the gene encoding the macromolecule'
    },
    q_entity_weight: {
      label: 'Macromolecule molecular weight',
      type: 'float',
      groupingIndex: 7,
      exampleText: '43397',
      descText: 'Molecular mass of the macromolecule (in Daltons)'
    },
    q_chimera: {
      label: 'Chimera',
      type: 'string',
      value: ['y', 'n'],
      groupingIndex: 7,
      valueType: 'yn',
      exampleText: 'y',
      descText: 'Does an entity contain multiple macromolecules engineered into a single chain?'
    },
    q_microheterogeneity: {
      label: 'Microheterogeneity',
      type: 'string',
      value: ['y', 'n'],
      groupingIndex: 7,
      valueType: 'yn',
      exampleText: 'y',
      descText: 'Cases where two different residues are observed at the same position in a polymer chain'
    },
    q_mutation_type: {
      label: 'Mutation type',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7,
      exampleText: 'engineered mutation',
      descText: 'Description of a discrepancy between the protein sequence and reference database'
    },
    q_interacting_ligands: {
      label: 'Interacting ligands',
      type: 'string',
      autocomplete: true,
      groupingIndex: 7,
      exampleText: 'HEM',
      descText: 'Ligands that interact with the macromolecule in the search'
    },
    q_all_enzyme_names: {
      label: 'Enzyme name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 8,
      exampleText: 'alcohol dehydrogenase',
      descText: 'Name of an enzyme'
    },
    q_enzyme_num_name: {
      label: 'EC number / name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 8,
      descText: 'Enzyme Commission (EC) number or name'
    },
    q_assembly_composition: {
      label: 'Assembly composition',
      type: 'string',
      autocomplete: true,
      groupingIndex: 9,
      exampleText: 'DNA/protein complex',
      descText: 'Macromolecule types that form an assembly'
    },
    q_assembly_form: {
      label: 'Assembly form',
      type: 'string',
      value: ['homo', 'hetero'],
      groupingIndex: 9,
      exampleText: 'homo / hetero',
      descText: 'Defines whether an assembly is formed from one identical macromolecule, or from different macromolecules'
    },
    q_assembly_type: {
      label: 'Assembly polymer count',
      label2: '-mer',
      type: 'int',
      submitFilter: 'processAssemblyType',
      groupingIndex: 9,
      exampleText: '6',
      descText: 'Number of polymeric chains present in a given assembly'
    },
    q_complex_name: {
      label: 'Complex name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 9,
      exampleText: 'HipBA toxin'
    },
    q_complex_id: {
      label: 'PDBe Complex ID',
      type: 'string',
      groupingIndex: 9,
      exampleText: 'PDB-CPX-100487'
    },
    q_assembly_mol_wt: {
      label: 'Molecular weight (Preferred Assembly)',
      type: 'float',
      groupingIndex: 9,
      exampleText: '65.688',
      descText: 'Molecular weight (Preferred Assembly) in kDA'
    },
    q_all_assembly_mol_wt: {
      label: 'Molecular weight (All Assemblies)',
      type: 'float',
      groupingIndex: 9,
      exampleText: '65.688',
      descText: 'Molecular weight (All Assemblies) in kDA'
    },
    q_organism_name: {
      label: 'Organism name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 10,
      exampleText: 'Homo sapiens',
      descText: 'Species name of the source organism for the macromolecule'
    },
    /*q_atcc: {
        label: 'Organism ATCC ID',
        type: 'string',
        autocomplete: true,
        groupingIndex: 10
    },*/
    q_genus: {
      label: 'Organism genus',
      type: 'string',
      autocomplete: true,
      groupingIndex: 10,
      exampleText: 'Bacillus',
      descText: 'Genus of the organism in which the macromolecule was expressed'
    },
    q_superkingdom: {
      label: 'Organism superkingdom',
      type: 'string',
      autocomplete: true,
      groupingIndex: 10,
      exampleText: 'eukaryota',
      descText: 'Superkingdom of the organism in which the macromolecule was expressed'
    },
    q_expression_organism_name: {
      label: 'Expression host name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 11,
      exampleText: 'Trichoplusia ni',
      descText: 'Species name of the organism in which the macromolecule was expressed'
    },
    // q_expression_host_genus: {
    //     label: 'Expression host genus',
    //     type: 'string',
    //     groupingIndex: 11,
    //     exampleText: 'Bacillus',
    //     descText: 'Genus of the organism in which the macromolecule was expressed'
    // },
    q_expression_host_superkingdom: {
      label: 'Expression host superkingdom',
      type: 'string',
      groupingIndex: 11,
      exampleText: 'eukaryota',
      descText: 'Superkingdom of the organism in which the macromolecule was expressed'
    },
    q_compound_id: {
      label: 'Compound three letter code',
      type: 'string',
      groupingIndex: 12,
      exampleText: 'GOL',
      descText: 'Code identifier of a chemical compound'
    },
    q_all_compound_names: {
      label: 'Compound name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 12,
      exampleText: 'Glycerol',
      descText: 'Chemical or common name of a chemical compound'
    },
    q_compound_weight: {
      label: 'Compound molecular weight',
      type: 'float',
      groupingIndex: 12,
      exampleText: '427',
      descText: 'Molecular mass of the compound (in Daltons)'
    },
    q_cofactor_class: {
      label: 'Compound cofactor class',
      type: 'string',
      groupingIndex: 12,
      value: [
        'adenosylcobalamin',
        'ascorbic acid',
        'biotin',
        'biopterin',
        'coenzyme a',
        'coenzyme b',
        'coenzyme m',
        'flavin adenine dinucleotide',
        'flavin mononucleotide',
        'factor f430',
        'glutathione',
        'heme',
        'lipoic acid',
        'molybdopterin',
        'nicotinamide-adenine dinucleotide',
        'pyridoxal 5\'-phosphate',
        'pyrroloquinoline quinone',
        's-adenosylmethionine',
        'tetrahydrofolic acid',
        'thiamine diphosphate',
        'ubiquinone'
      ],
      exampleText: 'Thiamine diphosphate',
      descText: 'The cofactor class that a bound compound belongs to'
    },
    q_structure_determination_method: {
      label: 'Phasing method',
      type: 'string',
      autocomplete: true,
      groupingIndex: 13,
      exampleText: 'Molecular replacement ',
      descText: 'Method(s) used to determine the phases for a diffraction experiment'
    },
    q_diffraction_protocol: { // single wavelength etc..
      label: 'Diffraction protocol',
      type: 'string',
      autocomplete: true,
      groupingIndex: 13,
      exampleText: 'Single wavelength',
      descText: 'Protocol for a diffraction experiment'
    },
    q_diffraction_wavelengths: {
      label: 'Diffraction wavelength',
      type: 'float',
      groupingIndex: 15,
      exampleText: '1.5418',
      descText: 'Diffraction wavelength'
    },
    q_beam_source_name: { // synchrotron, home source etc...
      label: 'Diffraction radiation source type',
      type: 'string',
      autocomplete: true,
      groupingIndex: 14,
      exampleText: 'synchrotron',
      descText: 'Type of radiation source used in the diffraction experiment'
    },
    q_diffraction_source_type: { // combined source and beamline etc...
      label: 'Diffraction source',
      type: 'string',
      autocomplete: true,
      groupingIndex: 14,
      exampleText: 'ESRF beamline MASSIF-1',
      descText: 'The name of the radiation source'
    },
    q_synchrotron_site: {
      label: 'Synchrotron site',
      type: 'string',
      autocomplete: true,
      groupingIndex: 14,
      exampleText: 'Diamond',
      descText: 'Name of the synchrotron at which the data were collected'
    },
    q_detector: {
      label: 'Diffraction  Detector type',
      type: 'string',
      autocomplete: true,
      groupingIndex: 15,
      exampleText: 'Image plate',
      descText: 'The general type of radiation detector'
    },
    q_detector_type: {
      label: 'Detector name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 15,
      exampleText: 'PSI PILATUS 6M',
      descText: 'The make, model or name of the detector device used'
    },
    q_em_imaging_cryogen: {
      label: 'EM imaging cryogen',
      type: 'string',
      autocomplete: true,
      groupingIndex: 16,
      exampleText: 'Nitrogen',
      descText: 'Cryogen type used to maintain the specimen stage temperature during imaging in the microscope'
    },
    q_em_resolution: {
      label: 'EM resolution',
      type: 'float',
      groupingIndex: 17,
      exampleText: '6.8',
      descText: 'The stated resolution of the 3D reconstruction (in Ångströms)'
    },
    q_em_resolution_method: {
      label: 'EM resolution method',
      type: 'string',
      autocomplete: true,
      groupingIndex: 17,
      exampleText: 'FSC 0.143 cut-off',
      descText: 'The method used to determine the resolution of the 3D reconstruction'
    },
    // em_method: {
    //     label: 'EM experiment',
    //     type: 'string',
    //     autocomplete: true,
    //     groupingIndex: 17
    // },
    q_em_reconstruction_method: {
      label: 'EM reconstruction method',
      type: 'string',
      autocomplete: true,
      groupingIndex: 17,
      exampleText: 'Single particle',
      descText: 'The reconstruction method used in the EM experiment'
    },
    q_em_symmetry_type: {
      label: 'EM symmetry type',
      type: 'string',
      autocomplete: true,
      groupingIndex: 17,
      exampleText: 'point',
      descText: 'The single particle symmetry type'
    },
    q_em_nominal_pixel_size: {
      label: 'EM nominal pixel size',
      type: 'float',
      groupingIndex: 17,
      exampleText: '1.54',
      descText: 'The nominal pixel size, in Ångström, of the projection set of images'
    },
    q_em_actual_pixel_size: {
      label: 'EM actual pixel size',
      type: 'float',
      groupingIndex: 17,
      exampleText: '1.57',
      descText: 'The actual pixel size, in Ångström, of projection set of images'
    },
    q_em_num_particles_picked: {
      label: 'EM number particles picked',
      type: 'int',
      groupingIndex: 17,
      exampleText: '124864',
      descText: 'The number of particles (2D projections) or 3D subtomograms used in the 3D reconstruction'
    },
    q_em_model_refinement_software: {
      label: 'EM model refinement software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 17,
      exampleText: 'REFMAC',
      descText: 'The name of the software package used for model refinement'
    },
    q_em_classification_software: {
      label: 'EM classification software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 17,
      exampleText: 'RELION',
      descText: 'The name of the software package used for classification'
    },
    q_em_reconstruction_software: {
      label: 'EM reconstruction software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 17,
      exampleText: 'SPIDER',
      descText: 'The name of the software package used for reconstruction'
    },
    q_em_microscope_model: {
      label: 'EM microscope model',
      type: 'string',
      autocomplete: true,
      groupingIndex: 18,
      exampleText: 'FEI Titan Krios',
      descText: 'The make or model of the microscope'
    },
    q_em_electron_source: {
      label: 'EM electron source',
      type: 'string',
      autocomplete: true,
      groupingIndex: 18,
      exampleText: 'Field emission gun',
      descText: 'The source of electrons (the electron gun)'
    },
    q_em_accelerating_voltage: {
      label: 'EM accelerating voltage',
      type: 'int',
      groupingIndex: 18,
      exampleText: '300',
      descText: 'A value of accelerating voltage used for imaging (in kV)'
    },
    q_em_illumination_mode: {
      label: 'EM illumination mode',
      type: 'string',
      autocomplete: true,
      groupingIndex: 18,
      exampleText: 'Flood beam',
      descText: 'The mode of illumination'
    },
    q_em_c2_aperture_diameter: {
      label: 'EM C2 aperture diameter',
      type: 'float',
      groupingIndex: 18,
      exampleText: '70',
      descText: 'C2 lens aperture diameter, in mm'
    },
    q_em_imaging_date: {
      label: 'EM imaging date',
      type: 'date',
      format: 'YYYY-MM-DDThh:mm:ssZ',
      groupingIndex: 18,
      exampleText: '4/20/2016',
      descText: 'Date of imaging experiment or the date at which a series of experiments began'
    },
    q_em_electron_detection: {
      label: 'EM detector name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 19,
      exampleText: 'GATAN K2 Quantum (4k x 4k)',
      descText: 'The detector type used for recording images'
    },
    q_em_detector_mode: {
      label: 'EM detector mode',
      type: 'string',
      autocomplete: true,
      groupingIndex: 19,
      exampleText: 'Counting',
      descText: 'The detector mode used during image recording'
    },
    q_em_imaging_mode: {
      label: 'EM imaging mode',
      type: 'string',
      autocomplete: true,
      groupingIndex: 19,
      exampleText: 'BRIGHT FIELD',
      descText: 'The mode of imaging'
    },
    q_em_energyfilter_name: {
      label: 'EM energy filter',
      type: 'string',
      autocomplete: true,
      groupingIndex: 19,
      exampleText: 'GIF Quantum LS',
      descText: 'The type of energy filter spectrometer'
    },
    q_em_grid_material: {
      label: 'EM grid material',
      type: 'string',
      autocomplete: true,
      groupingIndex: 20,
      exampleText: 'Copper',
      descText: 'The name of the material from which the grid is made'
    },
    em_grid_mesh_size: {
      label: 'EM grid size',
      type: 'int',
      groupingIndex: 20,
      exampleText: '300',
      descText: 'The value of the mesh size of the em grid (in divisions per inch)'
    },
    q_em_grid_type: {
      label: 'EM grid type',
      type: 'string',
      autocomplete: true,
      groupingIndex: 20,
      exampleText: 'Quantifoil R1.2/1.3',
      descText: 'A description of the grid type'
    },
    q_em_sample_support_details: {
      label: 'EM sample support details',
      type: 'string',
      autocomplete: true,
      groupingIndex: 20,
      exampleText: 'Coated with gold',
      descText: 'Any additional details concerning the sample support'
    },
    q_data_reduction_software: {
      label: 'Reduction software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 21,
      exampleText: 'XDS',
      descText: 'Software used to reduce the data'
    },
    q_data_scaling_software: {
      label: 'Scaling software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 21,
      exampleText: 'Scalepack',
      descText: 'Software used to scale the data'
    },
    q_refinement_software: {
      label: 'Refinement software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 21,
      exampleText: 'Phenix',
      descText: 'Software used to refine the model'
    },
    q_structure_solution_software: {
      label: 'Structure solution software',
      type: 'string',
      autocomplete: true,
      groupingIndex: 21,
      exampleText: 'Phaser',
      descText: 'Software used for phasing'
    },
    q_nmr_spectrometer_manufacturer: {
      label: 'NMR Spectrometer Manufacturer',
      type: 'string',
      autocomplete: true,
      groupingIndex: 22,
      exampleText: 'Bruker'
    },
    q_nmr_spectrometer_model: {
      label: 'NMR Spectrometer Model',
      type: 'string',
      autocomplete: true,
      groupingIndex: 22,
      exampleText: 'AVANCE III'
    },
    q_nmr_field_strength: {
      label: 'NMR Field Strength',
      type: 'int',
      groupingIndex: 22,
      exampleText: '800'
    },
    q_nmr_software_name: {
      label: 'NMR software packages',
      type: 'string',
      autocomplete: true,
      groupingIndex: 22
    },
    q_nmr_tot_conformers_calc: {
      label: 'Total Calculated Conformers',
      type: 'int',
      groupingIndex: 22,
      exampleText: '100'
    },
    q_nmr_tot_conformers_deposited: {
      label: 'Total Deposited Conformers',
      type: 'int',
      groupingIndex: 22,
      exampleText: '20'
    },
    q_biological_cell_component: {
      label: 'Biological cell component',
      type: 'string',
      autocomplete: true,
      groupingIndex: 23,
      exampleText: 'Cytoplasm',
      descText: 'Location occupied by a macromolecular machine when it carries out a molecular function, as assigned by Gene Ontology (GO)'
    },
    q_biological_function: {
      label: 'Biological function',
      type: 'string',
      autocomplete: true,
      groupingIndex: 23,
      exampleText: 'transporter activity',
      descText: 'Describes activities that occur at the molecular level as assigned by Gene Ontology (GO)'
    },
    q_biological_process: {
      label: 'Biological process',
      type: 'string',
      autocomplete: true,
      groupingIndex: 23,
      exampleText: 'tricarboxylic acid cycle',
      descText: 'A biological process term describes a series of events accomplished by one or more organized assemblies of molecular functions, as assigned by Gene Ontology (GO)'
    },
    q_all_sequence_family: { // interpro name, pfam clan, rfam id, rfam clan
      label: 'Sequence family',
      type: 'string',
      autocomplete: true,
      groupingIndex: 24,
      descText: 'The unique identifier for any of Rfam, Pfam or Interpro databases'
    },
    q_interpro_accession: {
      label: 'Interpro accession',
      type: 'string',
      autocomplete: true,
      groupingIndex: 24,
      exampleText: 'ipr013783 / immunoglobulin-like fold',
      descText: 'The unique identifier of protein families in the Interpro database'
    },
    q_pfam: {
      label: 'Pfam accession / name',
      type: 'string',
      autocomplete: true,
      groupingIndex: 24,
      exampleText: 'PF00089 / trypsin',
      descText: 'The unique identifier of protein families in the Pfam database'
    },
    q_rfam: {
      label: 'Rfam accession / id',
      type: 'string',
      autocomplete: true,
      groupingIndex: 24,
      exampleText: 'RF00005 / tRNA',
      descText: 'The unique identifier of RNA families in the Rfam database'
    },
    q_uniprot: {
      label: 'Uniprot accession / id',
      type: 'string',
      autocomplete: true,
      groupingIndex: 24,
      exampleText: 'P01308 / ins_human',
      descText: 'The unique identifier of a protein sequence in the UniProt database'
    },
    q_uniprot_features: {
      label: 'Uniprot features',
      type: 'string',
      autocomplete: true,
      groupingIndex: 24,
      exampleText: 'kinase activation loop',
      descText: 'Sequence annotations describing regions or sites of interest in the protein sequence in the UniProt database'
    },
    q_scop_fold: {
      label: 'SCOP fold',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'sh3-like barrel',
      descText: 'The different shapes of domains within a class'
    },
    q_scop_family: {
      label: 'SCOP family',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'sh3-domain'
    },
    q_scop_superfamily: {
      label: 'SCOP superfamily',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'sh3-domain'
    },
    q_cath_architecture: {
      label: 'CATH architecture',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'alpha horseshoe',
      descText: 'General arrangement of the secondary structures assigned by the CATH database'
    },
    q_cath_class: {
      label: 'CATH class',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'mainly beta',
      descText: 'The overall secondary-structure content of the domain assigned by the CATH database'
    },
    q_cath_code: {
      label: 'CATH code',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: '1.10.510.10',
      descText: 'Code assigned by the CATH database to a protein fold'
    },
    q_cath_homologous_superfamily: {
      label: 'CATH Homologous superfamily',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'sh3 domains',
      descText: 'Domains that are believed to be related by a common ancestor assigned by the CATH database'
    },
    q_cath_topology: {
      label: 'CATH topology',
      type: 'string',
      autocomplete: true,
      groupingIndex: 25,
      exampleText: 'sh3 type barrels',
      descText: 'Overall fold assigned by the CATH database'
    },
    q_na_conf_features: {
      label: 'Nucleic acid conf features',
      type: 'string',
      value: [
        'b-form double helix', 'quadruple helix', 'double helix', 'bulge loop', 'parallel strands',
        'z-form double helix', 'a-form double helix', 'mismatched base pair', 'hairpin loop',
        'internal loop', 'tetraloop', 'triple helix', 'three-way junction', 'four-way junction'
      ],
      groupingIndex: 26,
      exampleText: 'hairpin loop',
      descText: 'Nucleic acid secondary structure feature'
    },
    q_spacegroup: {
      label: 'Spacegroup',
      type: 'string',
      autocomplete: true,
      groupingIndex: 27,
      exampleText: 'P 21 21 21',
      descText: 'Hermann-Mauguin space-group symbol'
    },
    q_cell_a: {
      label: 'Cell a',
      type: 'float',
      groupingIndex: 27,
      exampleText: '99.691',
      descText: 'Unit-cell length a in Ångström'
    },
    q_cell_b: {
      label: 'Cell b',
      type: 'float',
      groupingIndex: 27,
      exampleText: '',
      descText: 'Unit-cell length a in Ångström'
    },
    q_cell_c: {
      label: 'Cell c',
      type: 'float',
      groupingIndex: 27,
      exampleText: '99.691',
      descText: 'Unit-cell length a in Ångström'
    },
    q_cell_alpha: {
      label: 'Cell alpha',
      type: 'float',
      groupingIndex: 27,
      exampleText: '90',
      descText: 'Unit-cell angle alpha in degrees'
    },
    q_cell_beta: {
      label: 'Cell beta',
      type: 'float',
      groupingIndex: 27,
      exampleText: '90',
      descText: 'Unit-cell angle alpha in degrees'
    },
    q_cell_gamma: {
      label: 'Cell gamma',
      type: 'float',
      groupingIndex: 27,
      exampleText: '90',
      descText: 'Unit-cell angle alpha in degrees'
    },
    q_crystallisation_ph: {
      label: 'Crystallisation pH',
      type: 'float',
      groupingIndex: 28,
      exampleText: '7.6',
      descText: 'The pH at which the crystal was grown'
    },
    q_crystallisation_cond: {
      label: 'Crystallisation Reservoir solution',
      type: 'string',
      autocomplete: true,
      groupingIndex: 28
    },
    q_crystallisation_method: {
      label: 'Crystallisation growth method',
      type: 'string',
      autocomplete: true,
      groupingIndex: 28,
      descText: 'The method used to grow the crystals'
    },
    q_crystallisation_temperature: {
      label: 'Crystallisation temperature',
      type: 'int',
      groupingIndex: 28,
      exampleText: '277',
      descText: 'The temperature in kelvins at which the crystal was grown'
    },
    q_seq_100_cluster_number: {
      label: 'Representative Structures',
      type: 'string',
      value: ['100%', '95%', '90%', '70%', '50%', '40%', '30%'],
      groupingIndex: 29
    },
    q_pdb_id: {
      label: 'PDB ID',
      type: 'string',
      groupingIndex: 30,
      exampleText: '1cbs'
    },
    q_bmrb_id: {
      label: 'BMRB ID',
      type: 'string',
      groupingIndex: 30
    },
    q_emdb_id: {
      label: 'EMDB ID',
      type: 'string',
      groupingIndex: 30,
      exampleText: 'emd-1234'
    },
    q_go_id: {
      label: 'GO ID',
      type: 'string',
      groupingIndex: 30
    },
    q_go_mapping: {
      label: 'GO Mapping',
      type: 'string',
      autocomplete: true,
      groupingIndex: 30
    },
    q_psi_id: {
      label: 'PSI ID',
      type: 'string',
      groupingIndex: 30
    }


  };

}
