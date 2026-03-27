var confAppEnv;
if (typeof confAppEnv == 'undefined') {
  confAppEnv = new RegExp('wwwdev').test(window.location.href) ? 'dev' : new RegExp('wwwint').test(window.location.href) ? 'int' : '';
}

var PDBe;
(function (PDBe) {
  var SolrApp;
  (function (SolrApp) {
    SolrApp.managerConfig = [
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'cofactorClassFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['cofactor_class'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'latestPdbEntriesFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['latest_pdb_entry_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'newUnpFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['new_unp'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'newLigandsFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['new_ligand'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'revisedLigandsFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['revised_ligand'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'expMethodFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['experimental_method'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'entryAuthorFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['entry_authors'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'allAuthorFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['all_authors'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'pfamFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['pfam_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'superkingdomFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['superkingdom'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'genusFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['genus'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'orgNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['organism_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'orgSciNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['organism_scientific_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'citationYearFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['citation_year'],
          'f.citation_year.facet.range.start': '1970',
          'f.citation_year.facet.range.end': '2050',
          'f.citation_year.facet.range.gap': '5',
          'f.citation_year.facet.range.other': 'between',
          'f.citation_year.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'spacegroupFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['spacegroup'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'biologicalProcessFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_process'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'biologicalFunctionFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_function'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'bioCellComponentFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_cell_component'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'bioCellComponentFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['biological_cell_component'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'journalFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['journal'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'assemblyCompositionFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['assembly_composition'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'assemblyFormFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['assembly_form'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'assemblyTypeFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['assembly_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'refSoftFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['refinement_software'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'detectorFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['detector'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'detectorTypeFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['detector_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'diffProtocolFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['diffraction_protocol'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'moleNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['all_molecule_names'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'statusFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['status'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'ecNumberFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['enzyme_num_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'cathClassFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['cath_class'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'cathTopologyFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['cath_topology'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'geneNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['gene_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'interproNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['interpro_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'scopClassFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['scop_class'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'scopFamilyFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['scop_family'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'scopFoldFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['scop_fold'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'citAuthorsFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['citation_authors'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'interactingMolFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['interacting_molecules'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'interactingLigandsFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['interacting_ligands'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'molTypeFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['molecule_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'beamSrcNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['beam_source_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'diffSourceFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['diffraction_source_type'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'emMicroscopeModelFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['em_microscope_model'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'emDetectorNameFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['em_electron_detection'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'pfamFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['pfam'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'rfamFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['rfam'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'synchrotronSiteFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['synchrotron_site'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'depYearFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['deposition_year'],
          'f.deposition_year.facet.range.start': '1970',
          'f.deposition_year.facet.range.end': '2050',
          'f.deposition_year.facet.range.gap': '5',
          'f.deposition_year.facet.range.other': 'between',
          'f.deposition_year.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'relYearFacetsManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['release_year'],
          'f.release_year.facet.range.start': '1970',
          'f.release_year.facet.range.end': '2050',
          'f.release_year.facet.range.gap': '5',
          'f.release_year.facet.range.other': 'between',
          'f.release_year.facet.range.include': 'all',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'resolutionFacetsManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['resolution'],
          'f.resolution.facet.range.start': '0.0',
          'f.resolution.facet.range.end': '100',
          'f.resolution.facet.range.gap': '0.5',
          'f.resolution.facet.range.other': 'between',
          'f.resolution.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'nmrSoftwareFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': ['nmr_software_name'],
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'nmrFieldStrengthFacetManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.range': ['nmr_field_strength'],
          'f.nmr_field_strength.facet.range.start': '0',
          'f.nmr_field_strength.facet.range.end': '1500',
          'f.nmr_field_strength.facet.range.gap': '100',
          'f.nmr_field_strength.facet.range.other': 'between',
          'f.nmr_field_strength.facet.range.include': 'all',
          'facet.threads': -1,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'entriesManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          rows: 100,
          'json.nl': 'map',
          fl: [
            'pdb_id',
            'citation_title',
            'citation_authors',
            'title',
            'experimental_method',
            'entry_authors',
            'pubmed_id',
            'citation_year',
            'journal',
            'organism_scientific_name',
            'assembly_composition',
            'interacting_ligands',
            'tax_id',
            'resolution',
            'status',
            'release_date',
            'prefered_assembly_id',
            'entry_author_list',
            'entry_organism_scientific_name',
            'data_quality',
            'model_quality',
            'experiment_data_available',
            'deposition_date',
            'release_year',
            'molecule_type',
            'pfam_name',
            'uniprot_coverage',
            'compound_id',
            'bound_compound_id',
            'modified_compound_id',
            'uniprot_accession_best',
            'carb_compound_id_entity',
            'entry_uniprot_accession',
            'preferred_complex_id',
            'preferred_complex_name',
          ],
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'macroMoleculesManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.pivot': 'molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'molecule_name',
          facet: true,
          'f.molecule_name.facet.limit': 100,
          'f.molecule_name.facet.offset': 0,
          rows: 0,
          'facet.limit': 20000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'macroMoleculesTotalManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.field': 'molecule_name',
          facet: true,
          rows: 0,
          'facet.limit': 100000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': true,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'pivotEntriesManager',
        },
        managerParams: {
          group: true,
          'group.facet': true,
          'group.ngroups': true,
          'group.field': ['entry_entity'],
          fl: [
            'pdb_id',
            'citation_title',
            'citation_authors',
            'title',
            'experimental_method',
            'entry_authors',
            'pubmed_id',
            'citation_year',
            'journal',
            'organism_scientific_name',
            'assembly_composition',
            'interacting_ligands',
            'tax_id',
            'resolution',
            'status',
            'release_date',
            'prefered_assembly_id',
            'entry_author_list',
            'entry_organism_scientific_name',
            'pfam_accession',
            'data_quality',
            'model_quality',
            'experiment_data_available',
            'deposition_date',
            'release_year',
            'molecule_type',
            'pfam_name',
            'uniprot_coverage',
            'compound_id',
            'bound_compound_id',
            'modified_compound_id',
            'uniprot_accession_best',
            'carb_compound_id_entity',
            'entry_uniprot_accession',
            'preferred_complex_id',
            'preferred_complex_name',
          ],
          rows: 10000,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'compoundsManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.pivot': 'interacting_ligands,molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'interacting_ligands',
          facet: true,
          'f.interacting_ligands.facet.limit': 100,
          'f.interacting_ligands.facet.offset': 0,
          rows: 0,
          'facet.limit': 20000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'compoundsTotalManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.field': 'interacting_ligands',
          facet: true,
          rows: 0,
          'facet.limit': 100000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': true,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'compoundsForLatestChemManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.pivot': 'new_revised_ligand,molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'new_revised_ligand',
          facet: true,
          'f.new_revised_ligand.facet.limit': 100,
          'f.new_revised_ligand.facet.offset': 0,
          rows: 0,
          'facet.limit': 20000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'compoundsForLatestChemTotalManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.field': 'new_revised_ligand',
          facet: true,
          rows: 0,
          'facet.limit': 100000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': true,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'proteinFamiliesManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.pivot': 'pfam_name,molecule_name,inv_overall_quality,entry_entity',
          'facet.pivot.mincount': 1,
          'facet.sort': 'overall_quality+asc',
          'facet.field': 'pfam_name',
          facet: true,
          'f.pfam_name.facet.limit': 100,
          'f.pfam_name.facet.offset': 0,
          rows: 0,
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'proteinFamiliesTotalManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'facet.field': 'pfam_name',
          facet: true,
          rows: 0,
          'facet.limit': 100000,
          'facet.mincount': 1,
          'json.nl': 'map',
          fq: 'status:REL',
          'group.facet': true,
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'validationAndPrintsManager',
        },
        managerParams: {
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          fl: ['pdb_id', 'data_quality', 'model_quality', 'experiment_data_available'],
        },
      },
      {
        managerDetails: {
          solrUrl: 'https://www' + confAppEnv + '.ebi.ac.uk/pdbe/search/pdb/',
          name: 'facetsManager',
        },
        managerParams: {
          q: '*:*',
          group: true,
          'group.field': ['pdb_id'],
          'group.ngroups': true,
          'group.facet': true,
          facet: true,
          rows: '0',
          'facet.limit': 100,
          'facet.offset': 0,
          'facet.mincount': 1,
          'facet.sort': 'count',
          'json.nl': 'map',
          'facet.field': [
            'experimental_method',
            'entry_authors',
            'pfam_name',
            'superkingdom',
            'genus',
            'organism_scientific_name',
            'spacegroup',
            'biological_process',
            'biological_function',
            'biological_cell_component',
            'journal',
            'assembly_composition',
            'assembly_form',
            'assembly_type',
            'refinement_software',
            'detector',
            'detector_type',
            'diffraction_protocol',
            'all_molecule_names',
            'status',
            'ec_number',
            'cath_class',
            'cath_topology',
            'gene_name',
            'interpro_name',
            'scop_class',
            'scop_family',
            'scop_fold',
            'citation_authors',
            'interacting_molecules',
            'interacting_ligands',
            'molecule_type',
            'beam_source_name',
            'synchrotron_site',
          ],
          'facet.range': ['deposition_year', 'release_year', 'resolution'],
          'f.deposition_year.facet.range.start': '1970',
          'f.deposition_year.facet.range.end': '2050',
          'f.deposition_year.facet.range.gap': '5',
          'f.release_year.facet.range.start': '1970',
          'f.release_year.facet.range.end': '2050',
          'f.release_year.facet.range.gap': '5',
          'f.resolution.facet.range.start': '0.0',
          'f.resolution.facet.range.end': '100',
          'f.resolution.facet.range.gap': '0.5',
          'f.deposition_year.facet.range.other': 'between',
          'f.deposition_year.facet.range.include': 'upper',
          'f.release_year.facet.range.other': 'between',
          'f.release_year.facet.range.include': 'upper',
          'f.resolution.facet.range.other': 'between',
          'f.resolution.facet.range.include': 'upper',
          'facet.threads': -1,
        },
      },
    ];
  })((SolrApp = PDBe.SolrApp || (PDBe.SolrApp = {})));
})(PDBe || (PDBe = {}));
var PDBe;
(function (PDBe) {
  var SolrApp;
  (function (SolrApp) {
    SolrApp.fieldGroups = [
      'Text',
      'Latest',
      'Sequence search',
      'Entry Information',
      'Experimental Information',
      'Author Names',
      'Citation',
      'Macromolecules',
      'Enzyme Information',
      'Assembly Information',
      'Source Organism',
      'Expression host',
      'Compound',
      'Diffraction Experiment Details',
      'Diffraction radiation source',
      'Diffraction Detector',
      'EM Experimental information',
      'EM image processing and reconstruction',
      'EM microscope',
      'EM Detector',
      'EM grid',
      'Diffraction Software',
      'NMR',
      'Biological Classification (Gene Ontology)',
      'Sequence classification',
      'Structure classification',
      'Nucleic acid conf features',
      'Crystallographic cell parameters',
      'Crystallisation pH / reservoir',
      'Representative Structures',
      'IDs', // 30
    ];
    SolrApp.searchFields = {
      text: {
        label: 'Text',
        type: 'string',
        groupingIndex: 0,
      },
      q_title: {
        label: 'Title',
        type: 'string',
        autocomplete: true,
        groupingIndex: 0,
        exampleText: 'NMR solution structure of oxytocin',
        descText: 'Title of the PDB entry',
      },
      q_latest_pdb_entry_type: {
        label: 'Entries released this week',
        type: 'string',
        value: ['revised', 'new'],
        groupingIndex: 1,
      },
      q_fasta_sequence: {
        label: 'FASTA sequence search',
        queryField: 'xjoin_fasta=true&bf=fasta(percentIdentity)&xjoin_fasta.external.expupperlim=0.1&xjoin_fasta.external.sequence',
        type: 'largeString',
        valueType: 'fastaSequence',
        fqValue: '{!xjoin}xjoin_fasta',
        appendValueToParams: true,
        appendValueToFq: false,
        groupingIndex: 2,
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
        exampleText: 'ADKSDLGYTGLTDEQAQELHSVYMSGLWLFSAVAIVAHLAVYIWRPWF',
      },
      q_experimental_method: {
        label: 'Experimental method',
        type: 'string',
        autocomplete: true,
        groupingIndex: 3,
        exampleText: 'Solution NMR',
        descText: 'The experimental method used to determine the structure',
      },
      q_status: {
        label: 'Entry status',
        type: 'string',
        autocomplete: true,
        groupingIndex: 3,
        relation: 'Equal to',
        exampleText: 'HPUB / REL / WDRN',
        descText: 'Status of a PDB entry',
      },
      q_release_date: {
        label: 'Release date',
        type: 'date',
        format: 'YYYY-MM-DDThh:mm:ssZ',
        groupingIndex: 3,
        exampleText: '4/20/2013',
        descText: 'The release date of the entry',
      },
      q_deposition_date: {
        label: 'Deposition date',
        type: 'date',
        format: 'YYYY-MM-DDThh:mm:ssZ',
        groupingIndex: 3,
        exampleText: '4/20/2012',
        descText: 'The date of initial deposition',
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
        descText: 'Percentile quality score for model geometry, relative to the whole PDB archive. From 0-100 with 100 being the best',
      },
      q_data_quality: {
        label: 'Data quality',
        type: 'float',
        groupingIndex: 3,
        exampleText: '70',
        descText: 'Percentile quality score for fit of the model to data, relative to the whole PDB archive. From 0-100 with 100 being the best',
      },
      q_experiment_data_available: {
        label: 'Experiment data available',
        type: 'string',
        value: ['y', 'n'],
        groupingIndex: 3,
        valueType: 'yn',
        exampleText: 'y',
        descText: 'Indicates whether experimental data has been deposited to support the model',
      },
      q_resolution: {
        label: 'Resolution',
        alias: ['em_resolution'],
        type: 'float',
        groupingIndex: 4,
        exampleText: '1.4',
        descText: 'The stated resolution of the data (in Ångströms)',
      },
      q_all_authors: {
        label: 'All authors',
        type: 'string',
        autocomplete: true,
        groupingIndex: 5,
        exampleText: 'smith jb',
        descText: 'Name of an author of the PDB entry or the citation',
      },
      q_entry_authors: {
        label: 'Entry authors',
        type: 'string',
        autocomplete: true,
        groupingIndex: 5,
        exampleText: 'smith jb',
        descText: 'Name of an author of the PDB entry',
      },
      q_citation_authors: {
        label: 'Citation authors',
        type: 'string',
        autocomplete: true,
        groupingIndex: 5,
        exampleText: 'smith jb',
        descText: 'Name of an author of the citation',
      },
      q_journal: {
        label: 'Journal',
        type: 'string',
        autocomplete: true,
        groupingIndex: 6,
        exampleText: 'j. biol. chem.',
        descText: 'Abbreviated name of the cited journal',
      },
      q_citation_title: {
        label: 'Citation title',
        type: 'string',
        groupingIndex: 6,
        exampleText: 'Exploring hydrophobic sites in proteins',
        descText: 'The title of the citation',
      },
      q_citation_year: {
        label: 'Citation year',
        type: 'int',
        groupingIndex: 6,
        exampleText: '2014',
        descText: 'The year of the citation',
      },
      q_pubmed_id: {
        label: 'PubMed ID',
        type: 'string',
        groupingIndex: 6,
        exampleText: '14096470',
        descText: 'Ascession number used by PubMed to identify the citation',
      },
      q_citation_doi: {
        label: 'Citation DOI',
        type: 'string',
        groupingIndex: 6,
        exampleText: '10.1093/nar/gkv1501',
        descText: 'Digital Object Identifier for the citation',
      },
      q_all_molecule_names: {
        label: 'Molecule name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
        exampleText: 'Carbonic anhydrase 2',
        descText: 'Name of a macromolecule',
      },
      q_molecule_type: {
        label: 'Molecule type',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
        exampleText: 'Protein / RNA',
        descText: 'The polymer type of the macromolecule',
      },
      q_interacting_molecules: {
        label: 'Interacting Molecules',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
      },
      q_sample_preparation_method: {
        label: 'Molecule expression method',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
        exampleText: 'engineered / natural / synthetic',
        descText: 'The method by which the macromolecule was produced',
      },
      q_gene_name: {
        label: 'Gene name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
        exampleText: 'PhoQ',
        descText: 'Name of the gene encoding the macromolecule',
      },
      q_entity_weight: {
        label: 'Macromolecule molecular weight',
        type: 'float',
        groupingIndex: 7,
        exampleText: '43397',
        descText: 'Molecular mass of the macromolecule (in Daltons)',
      },
      q_chimera: {
        label: 'Chimera',
        type: 'string',
        value: ['y', 'n'],
        groupingIndex: 7,
        valueType: 'yn',
        exampleText: 'y',
        descText: 'Does an entity contain multiple macromolecules engineered into a single chain?',
      },
      q_microheterogeneity: {
        label: 'Microheterogeneity',
        type: 'string',
        value: ['y', 'n'],
        groupingIndex: 7,
        valueType: 'yn',
        exampleText: 'y',
        descText: 'Cases where two different residues are observed at the same position in a polymer chain',
      },
      q_mutation_type: {
        label: 'Mutation type',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
        exampleText: 'engineered mutation',
        descText: 'Description of a discrepancy between the protein sequence and reference database',
      },
      q_interacting_ligands: {
        label: 'Interacting ligands',
        type: 'string',
        autocomplete: true,
        groupingIndex: 7,
        exampleText: 'HEM',
        descText: 'Ligands that interact with the macromolecule in the search',
      },
      q_all_enzyme_names: {
        label: 'Enzyme name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 8,
        exampleText: 'alcohol dehydrogenase',
        descText: 'Name of an enzyme',
      },
      q_enzyme_num_name: {
        label: 'EC number / name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 8,
        descText: 'Enzyme Commission (EC) number or name',
      },
      q_assembly_composition: {
        label: 'Assembly composition',
        type: 'string',
        autocomplete: true,
        groupingIndex: 9,
        exampleText: 'DNA/protein complex',
        descText: 'Macromolecule types that form an assembly',
      },
      q_assembly_form: {
        label: 'Assembly form',
        type: 'string',
        value: ['homo', 'hetero'],
        groupingIndex: 9,
        exampleText: 'homo / hetero',
        descText: 'Defines whether an assembly is formed from one identical macromolecule, or from different macromolecules',
      },
      q_assembly_type: {
        label: 'Assembly polymer count',
        label2: '-mer',
        type: 'int',
        submitFilter: 'processAssemblyType',
        groupingIndex: 9,
        exampleText: '6',
        descText: 'Number of polymeric chains present in a given assembly',
      },
      q_complex_name: {
        label: 'Complex name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 9,
        exampleText: 'HipBA toxin-antitoxin complex',
      },
      q_complex_id: {
        label: 'PDBe Complex ID',
        type: 'string',
        groupingIndex: 9,
        exampleText: 'PDB-CPX-100487',
      },
      q_assembly_mol_wt: {
        label: 'Molecular weight (Preferred Assembly)',
        type: 'float',
        groupingIndex: 9,
        exampleText: '65.688',
        descText: 'Molecular weight (Preferred Assembly) in kDA',
      },
      q_all_assembly_mol_wt: {
        label: 'Molecular weight (All Assemblies)',
        type: 'float',
        groupingIndex: 9,
        exampleText: '65.688',
        descText: 'Molecular weight (All Assemblies) in kDA',
      },
      q_organism_name: {
        label: 'Organism name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 10,
        exampleText: 'Homo sapiens',
        descText: 'Species name of the source organism for the macromolecule',
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
        descText: 'Genus of the organism in which the macromolecule was expressed',
      },
      q_superkingdom: {
        label: 'Organism superkingdom',
        type: 'string',
        autocomplete: true,
        groupingIndex: 10,
        exampleText: 'eukaryota',
        descText: 'Superkingdom of the organism in which the macromolecule was expressed',
      },
      q_expression_organism_name: {
        label: 'Expression host name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 11,
        exampleText: 'Trichoplusia ni',
        descText: 'Species name of the organism in which the macromolecule was expressed',
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
        descText: 'Superkingdom of the organism in which the macromolecule was expressed',
      },
      q_compound_id: {
        label: 'Compound three letter code',
        type: 'string',
        groupingIndex: 12,
        exampleText: 'GOL',
        descText: 'Code identifier of a chemical compound',
      },
      q_all_compound_names: {
        label: 'Compound name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 12,
        exampleText: 'Glycerol',
        descText: 'Chemical or common name of a chemical compound',
      },
      q_compound_weight: {
        label: 'Compound molecular weight',
        type: 'float',
        groupingIndex: 12,
        exampleText: '427',
        descText: 'Molecular mass of the compound (in Daltons)',
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
          "pyridoxal 5'-phosphate",
          'pyrroloquinoline quinone',
          's-adenosylmethionine',
          'tetrahydrofolic acid',
          'thiamine diphosphate',
          'ubiquinone',
        ],
        exampleText: 'Thiamine diphosphate',
        descText: 'The cofactor class that a bound compound belongs to',
      },
      q_structure_determination_method: {
        label: 'Phasing method',
        type: 'string',
        autocomplete: true,
        groupingIndex: 13,
        exampleText: 'Molecular replacement ',
        descText: 'Method(s) used to determine the phases for a diffraction experiment',
      },
      q_diffraction_protocol: {
        label: 'Diffraction protocol',
        type: 'string',
        autocomplete: true,
        groupingIndex: 13,
        exampleText: 'Single wavelength',
        descText: 'Protocol for a diffraction experiment',
      },
      q_diffraction_wavelengths: {
        label: 'Diffraction wavelength',
        type: 'float',
        groupingIndex: 15,
        exampleText: '1.5418',
        descText: 'Diffraction wavelength',
      },
      q_beam_source_name: {
        label: 'Diffraction radiation source type',
        type: 'string',
        autocomplete: true,
        groupingIndex: 14,
        exampleText: 'synchrotron',
        descText: 'Type of radiation source used in the diffraction experiment',
      },
      q_diffraction_source_type: {
        label: 'Diffraction source',
        type: 'string',
        autocomplete: true,
        groupingIndex: 14,
        exampleText: 'ESRF beamline MASSIF-1',
        descText: 'The name of the radiation source',
      },
      q_synchrotron_site: {
        label: 'Synchrotron site',
        type: 'string',
        autocomplete: true,
        groupingIndex: 14,
        exampleText: 'Diamond',
        descText: 'Name of the synchrotron at which the data were collected',
      },
      q_detector: {
        label: 'Diffraction  Detector type',
        type: 'string',
        autocomplete: true,
        groupingIndex: 15,
        exampleText: 'Image plate',
        descText: 'The general type of radiation detector',
      },
      q_detector_type: {
        label: 'Detector name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 15,
        exampleText: 'PSI PILATUS 6M',
        descText: 'The make, model or name of the detector device used',
      },
      q_em_imaging_cryogen: {
        label: 'EM imaging cryogen',
        type: 'string',
        autocomplete: true,
        groupingIndex: 16,
        exampleText: 'Nitrogen',
        descText: 'Cryogen type used to maintain the specimen stage temperature during imaging in the microscope',
      },
      q_em_resolution: {
        label: 'EM resolution',
        type: 'float',
        groupingIndex: 17,
        exampleText: '6.8',
        descText: 'The stated resolution of the 3D reconstruction (in Ångströms)',
      },
      q_em_resolution_method: {
        label: 'EM resolution method',
        type: 'string',
        autocomplete: true,
        groupingIndex: 17,
        exampleText: 'FSC 0.143 cut-off',
        descText: 'The method used to determine the resolution of the 3D reconstruction',
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
        descText: 'The reconstruction method used in the EM experiment',
      },
      q_em_symmetry_type: {
        label: 'EM symmetry type',
        type: 'string',
        autocomplete: true,
        groupingIndex: 17,
        exampleText: 'point',
        descText: 'The single particle symmetry type',
      },
      q_em_nominal_pixel_size: {
        label: 'EM nominal pixel size',
        type: 'float',
        groupingIndex: 17,
        exampleText: '1.54',
        descText: 'The nominal pixel size, in Ångström, of the projection set of images',
      },
      q_em_actual_pixel_size: {
        label: 'EM actual pixel size',
        type: 'float',
        groupingIndex: 17,
        exampleText: '1.57',
        descText: 'The actual pixel size, in Ångström, of projection set of images',
      },
      q_em_num_particles_picked: {
        label: 'EM number particles picked',
        type: 'int',
        groupingIndex: 17,
        exampleText: '124864',
        descText: 'The number of particles (2D projections) or 3D subtomograms used in the 3D reconstruction',
      },
      q_em_model_refinement_software: {
        label: 'EM model refinement software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 17,
        exampleText: 'REFMAC',
        descText: 'The name of the software package used for model refinement',
      },
      q_em_classification_software: {
        label: 'EM classification software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 17,
        exampleText: 'RELION',
        descText: 'The name of the software package used for classification',
      },
      q_em_reconstruction_software: {
        label: 'EM reconstruction software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 17,
        exampleText: 'SPIDER',
        descText: 'The name of the software package used for reconstruction',
      },
      q_em_microscope_model: {
        label: 'EM microscope model',
        type: 'string',
        autocomplete: true,
        groupingIndex: 18,
        exampleText: 'FEI Titan Krios',
        descText: 'The make or model of the microscope',
      },
      q_em_electron_source: {
        label: 'EM electron source',
        type: 'string',
        autocomplete: true,
        groupingIndex: 18,
        exampleText: 'Field emission gun',
        descText: 'The source of electrons (the electron gun)',
      },
      q_em_accelerating_voltage: {
        label: 'EM accelerating voltage',
        type: 'int',
        groupingIndex: 18,
        exampleText: '300',
        descText: 'A value of accelerating voltage used for imaging (in kV)',
      },
      q_em_illumination_mode: {
        label: 'EM illumination mode',
        type: 'string',
        autocomplete: true,
        groupingIndex: 18,
        exampleText: 'Flood beam',
        descText: 'The mode of illumination',
      },
      q_em_c2_aperture_diameter: {
        label: 'EM C2 aperture diameter',
        type: 'float',
        groupingIndex: 18,
        exampleText: '70',
        descText: 'C2 lens aperture diameter, in mm',
      },
      q_em_imaging_date: {
        label: 'EM imaging date',
        type: 'date',
        format: 'YYYY-MM-DDThh:mm:ssZ',
        groupingIndex: 18,
        exampleText: '4/20/2016',
        descText: 'Date of imaging experiment or the date at which a series of experiments began',
      },
      q_em_electron_detection: {
        label: 'EM detector name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 19,
        exampleText: 'GATAN K2 Quantum (4k x 4k)',
        descText: 'The detector type used for recording images',
      },
      q_em_detector_mode: {
        label: 'EM detector mode',
        type: 'string',
        autocomplete: true,
        groupingIndex: 19,
        exampleText: 'Counting',
        descText: 'The detector mode used during image recording',
      },
      q_em_imaging_mode: {
        label: 'EM imaging mode',
        type: 'string',
        autocomplete: true,
        groupingIndex: 19,
        exampleText: 'BRIGHT FIELD',
        descText: 'The mode of imaging',
      },
      q_em_energyfilter_name: {
        label: 'EM energy filter',
        type: 'string',
        autocomplete: true,
        groupingIndex: 19,
        exampleText: 'GIF Quantum LS',
        descText: 'The type of energy filter spectrometer',
      },
      q_em_grid_material: {
        label: 'EM grid material',
        type: 'string',
        autocomplete: true,
        groupingIndex: 20,
        exampleText: 'Copper',
        descText: 'The name of the material from which the grid is made',
      },
      em_grid_mesh_size: {
        label: 'EM grid size',
        type: 'int',
        groupingIndex: 20,
        exampleText: '300',
        descText: 'The value of the mesh size of the em grid (in divisions per inch)',
      },
      q_em_grid_type: {
        label: 'EM grid type',
        type: 'string',
        autocomplete: true,
        groupingIndex: 20,
        exampleText: 'Quantifoil R1.2/1.3',
        descText: 'A description of the grid type',
      },
      q_em_sample_support_details: {
        label: 'EM sample support details',
        type: 'string',
        autocomplete: true,
        groupingIndex: 20,
        exampleText: 'Coated with gold',
        descText: 'Any additional details concerning the sample support',
      },
      q_data_reduction_software: {
        label: 'Reduction software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 21,
        exampleText: 'XDS',
        descText: 'Software used to reduce the data',
      },
      q_data_scaling_software: {
        label: 'Scaling software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 21,
        exampleText: 'Scalepack',
        descText: 'Software used to scale the data',
      },
      q_refinement_software: {
        label: 'Refinement software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 21,
        exampleText: 'Phenix',
        descText: 'Software used to refine the model',
      },
      q_structure_solution_software: {
        label: 'Structure solution software',
        type: 'string',
        autocomplete: true,
        groupingIndex: 21,
        exampleText: 'Phaser',
        descText: 'Software used for phasing',
      },
      q_nmr_spectrometer_manufacturer: {
        label: 'NMR Spectrometer Manufacturer',
        type: 'string',
        autocomplete: true,
        groupingIndex: 22,
        exampleText: 'Bruker',
      },
      q_nmr_spectrometer_model: {
        label: 'NMR Spectrometer Model',
        type: 'string',
        autocomplete: true,
        groupingIndex: 22,
        exampleText: 'AVANCE III',
      },
      q_nmr_field_strength: {
        label: 'NMR Field Strength',
        type: 'int',
        groupingIndex: 22,
        exampleText: '800',
      },
      q_nmr_software_name: {
        label: 'NMR software packages',
        type: 'string',
        autocomplete: true,
        groupingIndex: 22,
      },
      q_nmr_tot_conformers_calc: {
        label: 'Total Calculated Conformers',
        type: 'int',
        groupingIndex: 22,
        exampleText: '100',
      },
      q_nmr_tot_conformers_deposited: {
        label: 'Total Deposited Conformers',
        type: 'int',
        groupingIndex: 22,
        exampleText: '20',
      },
      q_biological_cell_component: {
        label: 'Biological cell component',
        type: 'string',
        autocomplete: true,
        groupingIndex: 23,
        exampleText: 'Cytoplasm',
        descText: 'Location occupied by a macromolecular machine when it carries out a molecular function, as assigned by Gene Ontology (GO)',
      },
      q_biological_function: {
        label: 'Biological function',
        type: 'string',
        autocomplete: true,
        groupingIndex: 23,
        exampleText: 'transporter activity',
        descText: 'Describes activities that occur at the molecular level as assigned by Gene Ontology (GO)',
      },
      q_biological_process: {
        label: 'Biological process',
        type: 'string',
        autocomplete: true,
        groupingIndex: 23,
        exampleText: 'tricarboxylic acid cycle',
        descText:
          'A biological process term describes a series of events accomplished by one or more organized assemblies of molecular functions, as assigned by Gene Ontology (GO)',
      },
      q_all_sequence_family: {
        label: 'Sequence family',
        type: 'string',
        autocomplete: true,
        groupingIndex: 24,
        descText: 'The unique identifier for any of Rfam, Pfam or Interpro databases',
      },
      q_interpro_accession: {
        label: 'Interpro accession',
        type: 'string',
        autocomplete: true,
        groupingIndex: 24,
        exampleText: 'ipr013783 / immunoglobulin-like fold',
        descText: 'The unique identifier of protein families in the Interpro database',
      },
      q_pfam: {
        label: 'Pfam accession / name',
        type: 'string',
        autocomplete: true,
        groupingIndex: 24,
        exampleText: 'PF00089 / trypsin',
        descText: 'The unique identifier of protein families in the Pfam database',
      },
      q_rfam: {
        label: 'Rfam accession / id',
        type: 'string',
        autocomplete: true,
        groupingIndex: 24,
        exampleText: 'RF00005 / tRNA',
        descText: 'The unique identifier of RNA families in the Rfam database',
      },
      q_uniprot: {
        label: 'Uniprot accession / id',
        type: 'string',
        autocomplete: true,
        groupingIndex: 24,
        exampleText: 'P01308 / ins_human',
        descText: 'The unique identifier of a protein sequence in the UniProt database',
      },
      q_uniprot_features: {
        label: 'Uniprot features',
        type: 'string',
        autocomplete: true,
        groupingIndex: 24,
        exampleText: 'kinase activation loop',
        descText: 'Sequence annotations describing regions or sites of interest in the protein sequence in the UniProt database',
      },
      q_scop_fold: {
        label: 'SCOP fold',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'sh3-like barrel',
        descText: 'The different shapes of domains within a class',
      },
      q_scop_family: {
        label: 'SCOP family',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'sh3-domain',
      },
      q_scop_superfamily: {
        label: 'SCOP superfamily',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'sh3-domain',
      },
      q_cath_architecture: {
        label: 'CATH architecture',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'alpha horseshoe',
        descText: 'General arrangement of the secondary structures assigned by the CATH database',
      },
      q_cath_class: {
        label: 'CATH class',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'mainly beta',
        descText: 'The overall secondary-structure content of the domain assigned by the CATH database',
      },
      q_cath_code: {
        label: 'CATH code',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: '1.10.510.10',
        descText: 'Code assigned by the CATH database to a protein fold',
      },
      q_cath_homologous_superfamily: {
        label: 'CATH Homologous superfamily',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'sh3 domains',
        descText: 'Domains that are believed to be related by a common ancestor assigned by the CATH database',
      },
      q_cath_topology: {
        label: 'CATH topology',
        type: 'string',
        autocomplete: true,
        groupingIndex: 25,
        exampleText: 'sh3 type barrels',
        descText: 'Overall fold assigned by the CATH database',
      },
      q_na_conf_features: {
        label: 'Nucleic acid conf features',
        type: 'string',
        value: [
          'b-form double helix',
          'quadruple helix',
          'double helix',
          'bulge loop',
          'parallel strands',
          'z-form double helix',
          'a-form double helix',
          'mismatched base pair',
          'hairpin loop',
          'internal loop',
          'tetraloop',
          'triple helix',
          'three-way junction',
          'four-way junction',
        ],
        groupingIndex: 26,
        exampleText: 'hairpin loop',
        descText: 'Nucleic acid secondary structure feature',
      },
      q_spacegroup: {
        label: 'Spacegroup',
        type: 'string',
        autocomplete: true,
        groupingIndex: 27,
        exampleText: 'P 21 21 21',
        descText: 'Hermann-Mauguin space-group symbol',
      },
      q_cell_a: {
        label: 'Cell a',
        type: 'float',
        groupingIndex: 27,
        exampleText: '99.691',
        descText: 'Unit-cell length a in Ångström',
      },
      q_cell_b: {
        label: 'Cell b',
        type: 'float',
        groupingIndex: 27,
        exampleText: '',
        descText: 'Unit-cell length a in Ångström',
      },
      q_cell_c: {
        label: 'Cell c',
        type: 'float',
        groupingIndex: 27,
        exampleText: '99.691',
        descText: 'Unit-cell length a in Ångström',
      },
      q_cell_alpha: {
        label: 'Cell alpha',
        type: 'float',
        groupingIndex: 27,
        exampleText: '90',
        descText: 'Unit-cell angle alpha in degrees',
      },
      q_cell_beta: {
        label: 'Cell beta',
        type: 'float',
        groupingIndex: 27,
        exampleText: '90',
        descText: 'Unit-cell angle alpha in degrees',
      },
      q_cell_gamma: {
        label: 'Cell gamma',
        type: 'float',
        groupingIndex: 27,
        exampleText: '90',
        descText: 'Unit-cell angle alpha in degrees',
      },
      q_crystallisation_ph: {
        label: 'Crystallisation pH',
        type: 'float',
        groupingIndex: 28,
        exampleText: '7.6',
        descText: 'The pH at which the crystal was grown',
      },
      q_crystallisation_cond: {
        label: 'Crystallisation Reservoir solution',
        type: 'string',
        autocomplete: true,
        groupingIndex: 28,
      },
      q_crystallisation_method: {
        label: 'Crystallisation growth method',
        type: 'string',
        autocomplete: true,
        groupingIndex: 28,
        descText: 'The method used to grow the crystals',
      },
      q_crystallisation_temperature: {
        label: 'Crystallisation temperature',
        type: 'int',
        groupingIndex: 28,
        exampleText: '277',
        descText: 'The temperature in kelvins at which the crystal was grown',
      },
      q_seq_100_cluster_number: {
        label: 'Representative Structures',
        type: 'string',
        value: ['100%', '95%', '90%', '70%', '50%', '40%', '30%'],
        groupingIndex: 29,
      },
      q_pdb_id: {
        label: 'PDB ID',
        type: 'string',
        groupingIndex: 30,
        exampleText: '1cbs',
      },
      q_bmrb_id: {
        label: 'BMRB ID',
        type: 'string',
        groupingIndex: 30,
      },
      q_emdb_id: {
        label: 'EMDB ID',
        type: 'string',
        groupingIndex: 30,
        exampleText: 'emd-1234',
      },
      q_go_id: {
        label: 'GO ID',
        type: 'string',
        groupingIndex: 30,
      },
      q_go_mapping: {
        label: 'GO Mapping',
        type: 'string',
        autocomplete: true,
        groupingIndex: 30,
      },
      q_psi_id: {
        label: 'PSI ID',
        type: 'string',
        groupingIndex: 30,
      },
    };
  })((SolrApp = PDBe.SolrApp || (PDBe.SolrApp = {})));
})(PDBe || (PDBe = {}));
var AjaxSolr;
(function (AjaxSolr) {
  'use strict';
  /**
   * Consider replacing this function by ES6 Object.assign
   * @see https://github.com/documentcloud/underscore/blob/7342e289aa9d91c5aacfb3662ea56e7a6d081200/underscore.js#L789
   */
  function extend(child, param1, param2) {
    // From _.extend
    var obj = Array.prototype.slice.call(arguments, 1);
    // From _.extend
    var iterator = function (source) {
      if (source) {
        for (var prop in source) {
          child[prop] = source[prop];
        }
      }
    };
    // From _.each
    if (obj == null) return;
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        iterator.call(undefined, obj[i], i, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          iterator.call(undefined, obj[key], key, obj);
        }
      }
    }
    return child;
  }
  AjaxSolr.extend = extend;
  /**
   * @param value A value.
   * @param array An array.
   * @returns {Boolean} Whether value exists in the array.
   */
  function inArray(value, array) {
    if (array) {
      for (var i = 0, l = array.length; i < l; i++) {
        if (equals(array[i], value)) {
          return i;
        }
      }
    }
    return -1;
  }
  AjaxSolr.inArray = inArray;
  /**
   * @static
   * @param foo A value.
   * @param bar A value.
   * @returns {Boolean} Whether the two given values are equal.
   */
  function equals(foo, bar) {
    if (isArray(foo) && isArray(bar)) {
      if (foo.length !== bar.length) {
        return false;
      }
      for (var i = 0, l = foo.length; i < l; i++) {
        if (foo[i] !== bar[i]) {
          return false;
        }
      }
      return true;
    } else if (isRegExp(foo) && isString(bar)) {
      return bar.match(foo);
    } else if (isRegExp(bar) && isString(foo)) {
      return foo.match(bar);
    } else {
      return foo === bar;
    }
  }
  AjaxSolr.equals = equals;
  /**
   * Can't use toString.call(obj) === "[object Array]", as it may return
   * "[xpconnect wrapped native prototype]", which is undesirable.
   *
   * @static
   * @see http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
   * @see http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js
   */
  function isArray(obj) {
    return obj != null && typeof obj == 'object' && 'splice' in obj && 'join' in obj;
  }
  AjaxSolr.isArray = isArray;
  /**
   * @param obj Any object.
   * @returns {Boolean} Whether the object is a RegExp object.
   */
  function isRegExp(obj) {
    return obj != null && (typeof obj == 'object' || typeof obj == 'function') && 'ignoreCase' in obj;
  }
  AjaxSolr.isRegExp = isRegExp;
  /**
   * @param obj Any object.
   * @returns {Boolean} Whether the object is a String object.
   */
  function isString(obj) {
    return obj != null && typeof obj == 'string';
  }
  AjaxSolr.isString = isString;
  /**
   * @param obj Any object.
   * @returns {Boolean} Whether the object is a String object.
   */
  function createManagerStore(managerJsonArr) {
    var store = {};
    for (var i = 0, len = managerJsonArr.length; i < len; i++) {
      var managerConfigData = managerJsonArr[i];
      //create manager instance
      store[managerConfigData.managerDetails.name] = new AjaxSolr.Manager(managerConfigData.managerDetails);
      //add params to the store
      for (var paramName in managerConfigData.managerParams) {
        store[managerConfigData.managerDetails.name].store.addByValue(paramName, managerConfigData.managerParams[paramName]);
      }
    }
    return store;
  }
  AjaxSolr.createManagerStore = createManagerStore;
})(AjaxSolr || (AjaxSolr = {}));
var AjaxSolr;
(function (AjaxSolr) {
  'use strict';
  /**
   * The Manager acts as the controller in a Model-View-Controller framework. All
   * public calls should be performed on the manager object.
   *
   * @param properties A map of fields to set. Refer to the list of public fields.
   * @class Manager
   */
  var Manager = /** @class */ (function () {
    /**
     * @param {Object} [attributes]
     * @param {String} [attributes.solrUrl] The fully-qualified URL of the Solr
     *   application. You must include the trailing slash. Do not include the path
     *   to any Solr servlet. Defaults to "http://localhost:8983/solr/"
     * @param {String} [attributes.proxyUrl] If we want to proxy queries through a
     *   script, rather than send queries to Solr directly, set this field to the
     *   fully-qualified URL of the script.
     * @param {String} [attributes.servlet] The default Solr servlet. You may
     *   prepend the servlet with a core if using multiple cores. Defaults to
     *   "servlet".
     */
    function Manager(attributes) {
      this.name = 'solrManager';
      this.solrUrl = { normal: 'http://localhost:8983/solr/', latest: 'http://localhost:8983/solr/' };
      this.servlet = 'select';
      //extend arguments
      AjaxSolr.extend(this, this, attributes);
      //Set Parameter Store
      this.setStore(this.store);
    }
    /**
     * Set the manager's parameter store.
     *
     * @param {AjaxSolr.ParameterStore} store
     */
    Manager.prototype.setStore = function (store) {
      this.store = store ? store : new AjaxSolr.ParameterStore();
    };
    /**
     * Stores the Solr parameters to be sent to Solr and sends a request to Solr.
     *
     * @param {Boolean} [start] The Solr start offset parameter.
     * @param {String} [servlet] The Solr servlet to send the request to.
     */
    Manager.prototype.doRequest = function (start, servlet) {
      // Allow non-pagination widgets to reset the offset parameter.
      if (start !== undefined) {
        this.store.get('start').val(start);
      }
      if (servlet === undefined) {
        servlet = this.servlet;
      }
      //this.store.save(); //save the state
      this.executeRequest(servlet);
    };
    /**
     * An abstract hook for child implementations.
     *
     * <p>Sends the request to Solr, i.e. to <code>this.solrUrl</code> or <code>
     * this.proxyUrl</code>, and receives Solr's response. It should pass Solr's
     * response to <code>handleResponse()</code> for handling.</p>
     *
     * <p>See <tt>managers/Manager.jquery.js</tt> for a jQuery implementation.</p>
     *
     * @param {String} servlet The Solr servlet to send the request to.
     * @param {String} string The query string of the request. If not set, it
     *   should default to <code>this.store.string()</code>
     * @throws If not defined in child implementation.
     */
    Manager.prototype.executeRequest = function (servlet, qstring) {
      //throw 'Abstract method executeRequest must be overridden in a subclass.';
      qstring = qstring || this.store.string();
      console.log(this.solrUrl + servlet + '?' + qstring + '&wt=json');
    };
    /**
     * This method is executed after the Solr response data arrives. Allows each
     * widget to handle Solr's response separately.
     *
     * @param {Object} data The Solr response.
     */
    Manager.prototype.handleResponse = function (data) {
      this.response = data;
    };
    /**
     * This method is executed if Solr encounters an error.
     *
     * @param {String} message An error message.
     */
    Manager.prototype.handleError = function (message) {
      window.console && console.log && console.log(message);
    };
    return Manager;
  })();
  AjaxSolr.Manager = Manager;
})(AjaxSolr || (AjaxSolr = {}));
var AjaxSolr;
(function (AjaxSolr) {
  'use strict';
  // export const defaultParameterStoreArgs: ParameterStoreAttributes = {
  //     exposed: [],
  //     params: {}
  // }
  /**
   * The ParameterStore, as its name suggests, stores Solr parameters. Widgets
   * expose some of these parameters to the user. Whenever the user changes the
   * values of these parameters, the state of the application changes. In order to
   * allow the user to move back and forth between these states with the browser's
   * Back and Forward buttons, and to bookmark these states, each state needs to
   * be stored. The easiest method is to store the exposed parameters in the URL
   * hash (see the <tt>ParameterHashStore</tt> class). However, you may implement
   * your own storage method by extending this class.
   *
   * <p>For a list of possible parameters, please consult the links below.</p>
   *
   * @see http://wiki.apache.org/solr/CoreQueryParameters
   * @see http://wiki.apache.org/solr/CommonQueryParameters
   * @see http://wiki.apache.org/solr/SimpleFacetParameters
   * @see http://wiki.apache.org/solr/HighlightingParameters
   * @see http://wiki.apache.org/solr/MoreLikeThis
   * @see http://wiki.apache.org/solr/SpellCheckComponent
   * @see http://wiki.apache.org/solr/StatsComponent
   * @see http://wiki.apache.org/solr/TermsComponent
   * @see http://wiki.apache.org/solr/TermVectorComponent
   * @see http://wiki.apache.org/solr/LocalParams
   *
   * @param properties A map of fields to set. Refer to the list of public fields.
   * @class ParameterStore
   */
  var ParameterStore = /** @class */ (function () {
    function ParameterStore(attributes) {
      this.params = {};
      AjaxSolr.extend(this, this, attributes);
    }
    /**
     * Some Solr parameters may be specified multiple times. It is easiest to
     * hard-code a list of such parameters. You may change the list by passing
     * <code>{ multiple: /pattern/ }</code> as an argument to the constructor of
     * this class or one of its children, e.g.:
     *
     * <p><code>new ParameterStore({ multiple: /pattern/ })</code>
     *
     * @param {String} name The name of the parameter.
     * @returns {Boolean} Whether the parameter may be specified multiple times.
     * @see http://lucene.apache.org/solr/api/org/apache/solr/handler/DisMaxRequestHandler.html
     */
    ParameterStore.prototype.isMultiple = function (name) {
      return name.match(
        /^(?:bf|bq|facet\.date|facet\.date\.other|facet\.date\.include|facet\.field|facet\.pivot|facet\.range|facet\.range\.other|facet\.range\.include|facet\.query|fq|group\.field|group\.func|group\.query|pf|qf)$/
      );
    };
    /**
     * Returns a parameter. If the parameter doesn't exist, creates it.
     *
     * @param {String} name The name of the parameter.
     * @returns {AjaxSolr.Parameter|AjaxSolr.Parameter[]} The parameter.
     */
    ParameterStore.prototype.get = function (name) {
      if (this.params[name] === undefined) {
        var param = new AjaxSolr.Parameter({ name: name });
        if (this.isMultiple(name)) {
          this.params[name] = [param];
        } else {
          this.params[name] = param;
        }
      }
      return this.params[name];
    };
    /**
     * If the parameter may be specified multiple times, returns the values of
     * all identically-named parameters. If the parameter may be specified only
     * once, returns the value of that parameter.
     *
     * @param {String} name The name of the parameter.
     * @returns {String[]|Number[]} The value(s) of the parameter.
     */
    ParameterStore.prototype.values = function (name) {
      if (this.params[name] !== undefined) {
        if (this.isMultiple(name)) {
          var values = [];
          for (var i = 0, l = this.params[name].length; i < l; i++) {
            values.push(this.params[name][i].val());
          }
          return values;
        } else {
          return [this.params[name].val()];
        }
      }
      return [];
    };
    /**
     * If the parameter may be specified multiple times, adds the given parameter
     * to the list of identically-named parameters, unless one already exists with
     * the same value. If it may be specified only once, replaces the parameter.
     *
     * @param {String} name The name of the parameter.
     * @param {AjaxSolr.Parameter} [param] The parameter.
     * @returns {AjaxSolr.Parameter|Boolean} The parameter, or false.
     */
    ParameterStore.prototype.add = function (name, param) {
      if (param === undefined) {
        param = new AjaxSolr.Parameter({ name: name });
      }
      if (this.isMultiple(name)) {
        if (this.params[name] === undefined) {
          this.params[name] = [param];
        } else {
          if (AjaxSolr.inArray(param.val(), this.values(name)) == -1) {
            this.params[name].push(param);
          } else {
            return false;
          }
        }
      } else {
        this.params[name] = param;
      }
      return param;
    };
    /**
     * Deletes a parameter.
     *
     * @param {String} name The name of the parameter.
     * @param {Number} [index] The index of the parameter.
     */
    ParameterStore.prototype.remove = function (name, index) {
      if (index === undefined) {
        delete this.params[name];
      } else {
        this.params[name].splice(index, 1);
        if (this.params[name].length == 0) {
          delete this.params[name];
        }
      }
    };
    /**
     * Finds all parameters with matching values.
     *
     * @param {String} name The name of the parameter.
     * @param {String|Number|String[]|Number[]|RegExp} value The value.
     * @returns {String|Number[]} The indices of the parameters found.
     */
    ParameterStore.prototype.find = function (name, value) {
      if (this.params[name] !== undefined) {
        if (this.isMultiple(name)) {
          var indices = [];
          for (var i = 0, l = this.params[name].length; i < l; i++) {
            if (AjaxSolr.equals(this.params[name][i].val(), value)) {
              indices.push(i);
            }
          }
          return indices.length ? indices : false;
        } else {
          if (AjaxSolr.equals(this.params[name].val(), value)) {
            return name;
          }
        }
      }
      return false;
    };
    /**
     * If the parameter may be specified multiple times, creates a parameter using
     * the given name and value, and adds it to the list of identically-named
     * parameters, unless one already exists with the same value. If it may be
     * specified only once, replaces the parameter.
     *
     * @param {String} name The name of the parameter.
     * @param {String|Number|String[]|Number[]} value The value.
     * @param {Object} [locals] The parameter's local parameters.
     * @returns {AjaxSolr.Parameter|Boolean} The parameter, or false.
     */
    ParameterStore.prototype.addByValue = function (name, value, locals) {
      if (locals === undefined) {
        locals = {};
      }
      if (this.isMultiple(name) && AjaxSolr.isArray(value)) {
        var ret = [];
        for (var i = 0, l = value.length; i < l; i++) {
          ret.push(this.add(name, new AjaxSolr.Parameter({ name: name, value: value[i], locals: locals })));
        }
        return ret;
      } else {
        return this.add(name, new AjaxSolr.Parameter({ name: name, value: value, locals: locals }));
      }
    };
    /**
     * Deletes any parameter with a matching value.
     *
     * @param {String} name The name of the parameter.
     * @param {String|Number|String[]|Number[]|RegExp} value The value.
     * @returns {String|Number[]} The indices deleted.
     */
    ParameterStore.prototype.removeByValue = function (name, value) {
      var indices = this.find(name, value);
      if (indices) {
        if (AjaxSolr.isArray(indices)) {
          for (var i = indices.length - 1; i >= 0; i--) {
            this.remove(name, indices[i]);
          }
        } else {
          this.remove(indices);
        }
      }
      return indices;
    };
    /**
     * Returns the Solr parameters as a query string.
     *
     * <p>IE6 calls the default toString() if you write <tt>store.toString()
     * </tt>. So, we need to choose another name for toString().</p>
     */
    ParameterStore.prototype.string = function () {
      var params = [],
        string;
      for (var name in this.params) {
        if (this.isMultiple(name)) {
          for (var i = 0, l = this.params[name].length; i < l; i++) {
            string = this.params[name][i].string();
            if (string) {
              params.push(string);
            }
          }
        } else {
          string = this.params[name].string();
          if (string) {
            params.push(string);
          }
        }
      }
      return params.join('&');
    };
    /**
     * Parses a query string into Solr parameters.
     *
     * @param {String} str The string to parse.
     */
    ParameterStore.prototype.parseString = function (str) {
      var pairs = str.split('&');
      for (var i = 0, l = pairs.length; i < l; i++) {
        if (pairs[i]) {
          // ignore leading, trailing, and consecutive &'s
          var param = new AjaxSolr.Parameter();
          param.parseString(pairs[i]);
          this.add(param.name, param);
        }
      }
    };
    /**
     * Returns the exposed parameters as a query string.
     *
     * @returns {String} A string representation of the exposed parameters.
     */
    ParameterStore.prototype.exposedString = function () {
      var params = [],
        string;
      for (var i = 0, l = this.exposed.length; i < l; i++) {
        if (this.params[this.exposed[i]] !== undefined) {
          if (this.isMultiple(this.exposed[i])) {
            for (var j = 0, m = this.params[this.exposed[i]].length; j < m; j++) {
              string = this.params[this.exposed[i]][j].string();
              if (string) {
                params.push(string);
              }
            }
          } else {
            string = this.params[this.exposed[i]].string();
            if (string) {
              params.push(string);
            }
          }
        }
      }
      return params.join('&');
    };
    /**
     * Resets the values of the exposed parameters.
     */
    ParameterStore.prototype.exposedReset = function () {
      for (var i = 0, l = this.exposed.length; i < l; i++) {
        this.remove(this.exposed[i]);
      }
    };
    /**
     * Loads the values of exposed parameters from persistent storage. It is
     * necessary, in most cases, to reset the values of exposed parameters before
     * setting the parameters to the values in storage. This is to ensure that a
     * parameter whose name is not present in storage is properly reset.
     *
     * @param {Boolean} [reset=true] Whether to reset the exposed parameters.
     *   before loading new values from persistent storage. Default: true.
     */
    ParameterStore.prototype.load = function (reset) {
      if (reset === undefined) {
        reset = true;
      }
      if (reset) {
        this.exposedReset();
      }
      this.parseString(this.storedString());
    };
    /**
     * An abstract hook for child implementations.
     *
     * <p>Returns the string to parse from persistent storage.</p>
     *
     * @returns {String} The string from persistent storage.
     */
    ParameterStore.prototype.storedString = function () {
      return '';
    };
    return ParameterStore;
  })();
  AjaxSolr.ParameterStore = ParameterStore;
})(AjaxSolr || (AjaxSolr = {}));
var AjaxSolr;
(function (AjaxSolr) {
  AjaxSolr.defaultParameterArgs = {
    name: null,
    value: null,
    locals: {},
  };
  /**
   * Represents a Solr parameter.
   *
   * @param properties A map of fields to set. Refer to the list of public fields.
   * @class Parameter
   */
  var Parameter = /** @class */ (function () {
    function Parameter(attributes) {
      AjaxSolr.extend(this, this, attributes);
    }
    /**
     * Returns the value. If called with an argument, sets the value.
     *
     * @param {String|Number|String[]|Number[]} [value] The value to set.
     * @returns The value.
     */
    Parameter.prototype.val = function (value) {
      if (value === undefined) {
        return this.value;
      } else {
        this.value = value;
      }
    };
    /**
     * Returns the value of a local parameter. If called with a second argument,
     * sets the value of a local parameter.
     *
     * @param {String} name The name of the local parameter.
     * @param {String|Number|String[]|Number[]} [value] The value to set.
     * @returns The value.
     */
    Parameter.prototype.local = function (name, value) {
      if (value === undefined) {
        return this.locals[name];
      } else {
        this.locals[name] = value;
      }
    };
    /**
     * Deletes a local parameter.
     *
     * @param {String} name The name of the local parameter.
     */
    Parameter.prototype.remove = function (name) {
      delete this.locals[name];
    };
    /**
     * Returns the Solr parameter as a query string key-value pair.
     *
     * <p>IE6 calls the default toString() if you write <tt>store.toString()
     * </tt>. So, we need to choose another name for toString().</p>
     */
    Parameter.prototype.string = function () {
      var pairs = [];
      for (var name in this.locals) {
        if (this.locals[name]) {
          pairs.push(name + '=' + encodeURIComponent(this.locals[name]));
        }
      }
      var prefix = pairs.length ? '{!' + pairs.join('%20') + '}' : '';
      if (this.value || this.value == 0) {
        //handling 0 value for rows
        return this.name + '=' + prefix + this.valueString(this.value);
      }
      // For dismax request handlers, if the q parameter has local params, the
      // q parameter must be set to a non-empty value. In case the q parameter
      // has local params but is empty, use the q.alt parameter, which accepts
      // wildcards.
      else if (this.name == 'q' && prefix) {
        return 'q.alt=' + prefix + encodeURIComponent('*:*');
      } else {
        return '';
      }
    };
    /**
     * Parses a string formed by calling string().
     *
     * @param {String} str The string to parse.
     */
    Parameter.prototype.parseString = function (str) {
      var param = str.match(/^([^=]+)=(?:\{!([^\}]*)\})?(.*)$/);
      if (param) {
        var matches;
        while ((matches = /([^\s=]+)=(\S*)/g.exec(decodeURIComponent(param[2])))) {
          this.locals[matches[1]] = decodeURIComponent(matches[2]);
          param[2] = param[2].replace(matches[0], ''); // Safari's exec seems not to do this on its own
        }
        if (param[1] == 'q.alt') {
          this.name = 'q';
          // if q.alt is present, assume it is because q was empty, as above
        } else {
          this.name = param[1];
          this.value = this.parseValueString(param[3]);
        }
      }
    };
    /**
     * Returns the value as a URL-encoded string.
     *
     * @private
     * @param {String|Number|String[]|Number[]} value The value.
     * @returns {String} The URL-encoded string.
     */
    Parameter.prototype.valueString = function (value) {
      value = AjaxSolr.isArray(value) ? value.join(',') : value;
      return encodeURIComponent(value);
    };
    /**
     * Parses a URL-encoded string to return the value.
     *
     * @private
     * @param {String} str The URL-encoded string.
     * @returns {Array} The value.
     */
    Parameter.prototype.parseValueString = function (str) {
      str = decodeURIComponent(str);
      return str.indexOf(',') == -1 ? str : str.split(',');
    };
    return Parameter;
  })();
  AjaxSolr.Parameter = Parameter;
})(AjaxSolr || (AjaxSolr = {}));
/// <reference path="../core/core.ts" />
/// <reference path="../core/manager.ts" />
/// <reference path="../core/store.ts" />
/// <reference path="../core/parameter.ts" />
var PDBe;
(function (PDBe) {
  var SolrApp;
  (function (SolrApp) {
    function escapeValue(value) {
      // If the field value has a space, colon, quotation mark or forward slash
      // in it, wrap it in quotes, unless it is a range query or it is already
      // wrapped in quotes.
      if (window.location.href.indexOf('text:') < 0) {
        if (value.match(/[ :\/"]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
          return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
        }
      } else {
        // else if it is a text search, don't put quotes around the search term when there is a space
        if (value.match(/[:\/"]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
          return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
        }
      }
      return value;
    }
    SolrApp.escapeValue = escapeValue;
    SolrApp.appManagers = AjaxSolr.createManagerStore(PDBe.SolrApp.managerConfig);
    //console.log(appManagers);
  })((SolrApp = PDBe.SolrApp || (PDBe.SolrApp = {})));
})(PDBe || (PDBe = {}));
