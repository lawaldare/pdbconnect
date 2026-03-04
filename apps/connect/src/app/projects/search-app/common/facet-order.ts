export const FacetGroups = [
  'Latest PDB release',
  'Entry Information',
  'Macromolecules',
  'Function and Biology',
  'Sequence and Structure classification',
  'Experimental Information',
  'NMR',
];

export const FacetOrder = {
  q_latest_pdb_entry_type: {
    facetLabel: 'Entries released this week',
    solrManager: 'latestPdbEntriesFacetManager',
    groupingIndex: 0,
  },
  q_new_unp: {
    facetLabel: 'New UniProt in PDB',
    solrManager: 'newUnpFacetManager',
    groupingIndex: 0,
  },
  q_new_ligand: {
    facetLabel: 'New ligands in PDB',
    solrManager: 'newLigandsFacetManager',
    groupingIndex: 0,
  },
  q_revised_ligand: {
    facetLabel: 'Revised ligands',
    solrManager: 'revisedLigandsFacetManager',
    groupingIndex: 0,
  },
  q_status: {
    facetLabel: 'Entry status',
    solrManager: 'statusFacetManager',
    groupingIndex: 1,
  },
  q_experimental_method: {
    facetLabel: 'Experimental methods',
    solrManager: 'expMethodFacetManager',
    groupingIndex: 1,
  },
  q_all_authors: {
    facetLabel: 'Authors',
    solrManager: 'allAuthorFacetManager',
    groupingIndex: 1,
  },
  q_assembly_form: {
    facetLabel: 'Homo / hetero assembly',
    solrManager: 'assemblyFormFacetManager',
    groupingIndex: 1,
  },
  q_assembly_composition: {
    facetLabel: 'Assembly composition',
    solrManager: 'assemblyCompositionFacetManager',
    groupingIndex: 1,
  },
  q_assembly_type: {
    facetLabel: 'Assembly polymer count',
    solrManager: 'assemblyTypeFacetManager',
    groupingIndex: 1,
  },
  q_resolution: {
    facetLabel: 'Resolution distribution',
    solrManager: 'resolutionFacetsManager',
    groupingIndex: 1,
  },
  q_release_year: {
    facetLabel: 'Release year distribution',
    solrManager: 'relYearFacetsManager',
    groupingIndex: 1,
  },
  q_journal: {
    facetLabel: 'Journal',
    solrManager: 'journalFacetManager',
    groupingIndex: 1,
  },
  q_superkingdom: {
    facetLabel: 'Organism superkingdom',
    solrManager: 'superkingdomFacetManager',
    groupingIndex: 2,
  },
  q_organism_name: {
    facetLabel: 'Organism name',
    solrManager: 'orgSciNameFacetManager',
    groupingIndex: 2,
  },
  q_all_molecule_names: {
    facetLabel: 'Molecule name',
    solrManager: 'moleNameFacetManager',
    groupingIndex: 2,
  },
  q_molecule_type: {
    facetLabel: 'Molecule type',
    solrManager: 'molTypeFacetManager',
    groupingIndex: 2,
  },
  q_gene_name: {
    facetLabel: 'Gene names',
    solrManager: 'geneNameFacetManager',
    groupingIndex: 2,
  },
  q_interacting_molecules: {
    facetLabel: 'Interacting Molecules',
    solrManager: 'interactingMolFacetManager',
    groupingIndex: 2,
  },
  q_interacting_ligands: {
    facetLabel: 'Interacting ligands',
    solrManager: 'interactingLigandsFacetManager',
    groupingIndex: 2,
  },
  q_enzyme_num_name: {
    facetLabel: 'EC number / name',
    solrManager: 'ecNumberFacetManager',
    groupingIndex: 3,
  },
  q_biological_function: {
    facetLabel: 'Biological function',
    solrManager: 'biologicalFunctionFacetManager',
    groupingIndex: 3,
  },
  q_biological_process: {
    facetLabel: 'Biological process',
    solrManager: 'biologicalProcessFacetManager',
    groupingIndex: 3,
  },
  q_biological_cell_component: {
    facetLabel: 'Biological cell component',
    solrManager: 'bioCellComponentFacetManager',
    groupingIndex: 3,
  },
  q_cofactor_class: {
    facetLabel: 'Compound cofactor class',
    solrManager: 'cofactorClassFacetManager',
    groupingIndex: 3,
  },
  q_scop_fold: {
    facetLabel: 'SCOP fold',
    solrManager: 'scopFoldFacetManager',
    groupingIndex: 4,
  },
  q_scop_family: {
    facetLabel: 'SCOP family',
    solrManager: 'scopFamilyFacetManager',
    groupingIndex: 4,
  },
  q_cath_class: {
    facetLabel: 'CATH class',
    solrManager: 'cathClassFacetManager',
    groupingIndex: 4,
  },
  q_cath_topology: {
    facetLabel: 'CATH topology',
    solrManager: 'cathTopologyFacetManager',
    groupingIndex: 4,
  },
  q_pfam: {
    facetLabel: 'Pfam accession / name',
    solrManager: 'pfamFacetManager',
    groupingIndex: 4,
  },
  q_rfam: {
    facetLabel: 'Rfam accession / id',
    solrManager: 'rfamFacetManager',
    groupingIndex: 4,
  },
  q_diffraction_protocol: {
    facetLabel: 'Diffraction protocol',
    solrManager: 'diffProtocolFacetManager',
    groupingIndex: 5,
  },
  q_beam_source_name: {
    facetLabel: 'Diffraction radiation source type',
    solrManager: 'beamSrcNameFacetManager',
    groupingIndex: 5,
  },
  q_diffraction_source_type: {
    facetLabel: 'Diffraction source',
    solrManager: 'diffSourceFacetManager',
    groupingIndex: 5,
  },
  q_synchrotron_site: {
    facetLabel: 'Synchrotron site',
    solrManager: 'synchrotronSiteFacetManager',
    groupingIndex: 5,
  },
  q_detector: {
    facetLabel: 'Diffraction detector type',
    solrManager: 'detectorFacetManager',
    groupingIndex: 5,
  },
  q_refinement_software: {
    facetLabel: 'Refinement software',
    solrManager: 'refSoftFacetManager',
    groupingIndex: 5,
  },
  q_em_microscope_model: {
    facetLabel: 'EM microscope model',
    solrManager: 'emMicroscopeModelFacetManager',
    groupingIndex: 5,
  },
  q_em_electron_detection: {
    facetLabel: 'EM detector name',
    solrManager: 'emDetectorNameFacetManager',
    groupingIndex: 5,
  },
  q_nmr_software_name: {
    facetLabel: 'NMR software packages',
    solrManager: 'nmrSoftwareFacetManager',
    groupingIndex: 6,
  },
  q_nmr_field_strength: {
    facetLabel: 'NMR Field Strength',
    solrManager: 'nmrFieldStrengthFacetManager',
    groupingIndex: 6,
  },
};
