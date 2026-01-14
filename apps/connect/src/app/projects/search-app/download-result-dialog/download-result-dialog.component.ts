import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DownloadService } from '../common/download.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-download-result-dialog',
  templateUrl: './download-result-dialog.component.html',
  styleUrls: ['./download-result-dialog.component.scss'],
  imports: [CommonModule, MaterialModule, FormsModule],
  providers: [DownloadService],
})
export class DownloadResultDialogComponent implements OnInit, OnDestroy {
  ajaxSubscriber: any;

  selectAll = false;
  downloadInProgress = false;
  downloadFields = [
    ['publication', 'quality', 'audit', 'ligand', 'macromolecule', 'xref'],
    ['organism', 'interaction', 'experiment', 'expression', 'assembly', 'pdbid'],
  ];
  downloadFieldLabels = [
    ['Publication', 'Quality', 'Audit data', 'Ligand information', 'Macromolecule', 'External references'],
    ['Organism', 'Interaction information', 'Experiment', 'Expression', 'Assembly', 'PDB ID'],
  ];

  selectedFields = ['pdbid'];
  downloadFormat = 'xml';
  downloadType = 'all';

  downloadMapping: any = {
    publication: [
      'journal',
      'journal_volume',
      'journal_first_page',
      'journal_last_page',
      'citation_title',
      'citation_doi',
      'journal_page',
      'citation_year',
      'pubmed_id',
      'citation_authors',
    ],
    quality: ['model_quality', 'data_quality', 'r_factor', 'resolution', 'r_free'],
    audit: ['status', 'revision_date', 'release_date', 'processing_site', 'deposition_site', 'deposition_date', 'superseded_by', 'obsoletes'],
    ligand: ['compound_id', 'compound_weight', 'compound_name', 'compound_systematic_name'],
    macromolecule: [
      'entity_weight',
      'number_of_polymers',
      'number_of_polymer_residues',
      'number_of_polymer_entities',
      'number_of_bound_entities',
      'number_of_protein_chains',
      'max_observed_residues',
      'molecule_name',
      'all_molecule_name',
      'modified_residue_flag',
      'molecule_type',
      'mutation_type',
      'entry_uniprot_accession',
      'uniprot_id',
      'molecule_synonym',
      'gene_name',
    ],
    organism: ['organism_scientific_name', 'tax_id', 'organism_synonyms', 'rank', 'genus', 'superkingdom'],
    interaction: ['interacting_molecules', 'interacting_ligands'],
    experiment: [
      'experimental_method',
      'experiment_data_available',
      'title',
      'entry_authors',
      'sample_preparation_method',
      'detector',
      'detector_type',
      'synchrotron_beamline',
      'beam_source_name',
      'diffraction_protocol',
      'structure_determination_method',
      'refinement_software',
      'spacegroup',
      'beam_source_type',
      'synchrotron_site',
      'structure_solution_software',
      'data_reduction_software',
      'data_scaling_software',
      'phasing_method',
      'SG_center_name',
      'SG_full_name',
      'crystallisation_reservoir',
      'crystallisation_ph',
    ],
    expression: ['expression_host_sci_name', 'expression_host_tax_id', 'expression_host_synonyms', 'expression_host_genus', 'expression_host_superkingdom'],
    assembly: ['prefered_assembly_id', 'assembly_form', 'assembly_id', 'assembly_composition', 'assembly_type'],
    xref: [
      'pfam_accession',
      'pfam_name',
      'pfam_clan_name',
      'pfam_description',
      'interpro_accession',
      'interpro_name',
      'cath_code',
      'cath_class',
      'cath_architecture',
      'cath_topology',
      'cath_homologous_superfamily',
      'ec_number',
      'enzyme_name',
      'enzyme_systematic_name',
      'ec_hierarchy_name',
      'go_id',
      'biological_process',
      'biological_function',
      'biological_cell_component',
      'scop_class',
      'scop_fold',
      'scop_superfamily',
      'scop_family',
      'entry_uniprot_accession',
      'uniprot_id',
      'uniprot_coverage',
      'bmrb_id',
      'emdb_id',
    ],
    pdbid: ['pdb_id'],
    entity_id: ['entity_id'],
  };

  constructor(
    private downloadService: DownloadService,
    public dialogRef: MatDialogRef<DownloadResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit() {
    this.selectAll = false;
    if (this.dialogData.selectedEntries.length > 0) this.downloadType = 'selected';
  }

  onSelectAllClick(e: { checked: any }) {
    if (e.checked) {
      this.downloadFields.forEach((fieldArr) => {
        this.selectedFields = this.selectedFields.concat(fieldArr);
      });
    } else {
      this.selectedFields = ['pdbid'];
    }
  }

  onCheckboxChange(e: { source: { value: string }; checked: any }) {
    const selectedFieldIndex = this.selectedFields.indexOf(e.source.value);
    if (e.checked) {
      if (selectedFieldIndex == -1) this.selectedFields.push(e.source.value);
    } else {
      if (selectedFieldIndex > -1) this.selectedFields.splice(selectedFieldIndex, 1);
    }
  }

  triggerDownload() {
    const downloadData = this.dialogData.solrQueryData;
    if (typeof downloadData != 'undefined') {
      let selectedFields = this.selectedFields;

      if (selectedFields.length == 0) selectedFields = ['pdbid'];

      let downloadUrl = downloadData.url + '?omitHeader=true&rows=100000';

      if (this.downloadFormat == 'json' || this.downloadFormat == 'xml') {
        downloadUrl += '&group=true&group.field=pdb_id&group.ngroups=true&fl=';

        //remove entity_id
        const eIdIndex = selectedFields.indexOf('entity_id');
        if (eIdIndex > -1) selectedFields.splice(eIdIndex, 1);
      } else {
        downloadUrl += '&fl=';
        selectedFields.push('entity_id');
      }

      const allFieldsArr: any[] = [];
      this.selectedFields.forEach((fieldKey) => {
        allFieldsArr.push(this.downloadMapping[fieldKey].join(','));
      });

      downloadUrl += allFieldsArr.join(',');

      if (this.downloadType == 'all') {
        if (typeof downloadData.q != 'undefined' && downloadData.q != '' && downloadData.q != 'q=') downloadUrl += '&' + downloadData.q;
        if (typeof downloadData.fq != 'undefined' && downloadData.fq != '' && downloadData.fq != 'fq=') downloadUrl += '&' + downloadData.fq;
        if (typeof downloadData.paramCardString != 'undefined' && downloadData.paramCardString != '') downloadUrl += '&' + downloadData.paramCardString;
      } else {
        downloadUrl += '&q=pdb_id:' + this.dialogData.selectedEntries.join(' OR pdb_id:');
      }

      downloadUrl += '&wt=' + this.downloadFormat;

      if (this.downloadFormat == 'json') downloadUrl += '&json.nl=map';

      this.downloadInProgress = true; //show loading

      if (this.ajaxSubscriber) this.ajaxSubscriber.unsubscribe();

      this.ajaxSubscriber = this.downloadService.downloadFile(downloadUrl).subscribe(
        (res) => {
          this.downloadInProgress = false; //hide loading
          this.downloadService.saveFile(res, 'PDBe_search.' + this.downloadFormat);
        },
        (err) => {
          this.downloadInProgress = false; //hide loading
        }
      );
    }
  }

  closeDialog() {
    if (this.ajaxSubscriber) this.ajaxSubscriber.unsubscribe();
    this.dialogRef.close('Cancel');
  }

  ngOnDestroy() {
    if (this.ajaxSubscriber) this.ajaxSubscriber.unsubscribe();
  }
}
