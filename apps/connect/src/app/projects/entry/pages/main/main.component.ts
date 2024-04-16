import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../page-sections/summary/summary.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeDropdownComponent } from '@pdbe-lib/dropdown';
import { AggregatedApiService, EntryData } from '../../services/aggregated-api.service';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, SummaryComponent, PdbeNavMenuComponent, PdbeButtonComponent, PdbeDropdownComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  entryId: string | undefined; // Currently displayed entry id
  entryData: EntryData | undefined; // Entry pages data
  @ViewChild('vDropdown') viewDropdown!: PdbeDropdownComponent; // To access dropdown class instance
  @ViewChild('vDropdown', { read: ElementRef }) viewDropdownContainer!: ElementRef; // To access dropdown HTML element
  @ViewChild('dDropdown') downloadDropdown!: PdbeDropdownComponent; // To access dropdown class instance
  @ViewChild('dDropdown', { read: ElementRef }) downloadDropdownContainer!: ElementRef; // To access dropdown HTML element
  // Data for sticky navigation menu
  navSections = [
    { sectionName: 'Summary', subsections: [] },
    { sectionName: 'Function and Biology', subsections: [] },
    { sectionName: 'Family and Domains', subsections: [] },
    { sectionName: 'Macromolecules', subsections: [] },
    { sectionName: 'Ligands and Environments', subsections: [] },
    { sectionName: 'Assemblies', subsections: [] },
    { sectionName: 'Experiments and Validation', subsections: [] },
    { sectionName: 'Citations', subsections: [] },
  ];
  // Data for download dropdown control
  downloadOptions = [
    { name: 'Archive mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs.cif', downloadable: true },
    { name: 'Updated mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_updated.cif', downloadable: true },
    { name: 'PDB file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/pdb1cbs.ent', downloadable: true },
    { name: 'FASTA (entry)', url: 'https://www.ebi.ac.uk/pdbe/entry/pdb/1cbs/fasta', downloadable: true },
    { name: 'Full report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_full_validation.pdf', downloadable: true },
    { name: 'Experimental restraints (text)', url: '', downloadable: true },
    { name: 'Validation data (XML)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_validation.xml', downloadable: true },
    { name: 'Assembly 1 (mmCIF; gz)', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs-assembly1.cif.gz', downloadable: true },
    { name: 'SIFTS XML file with residue-level mappings', url: 'https://www.ebi.ac.uk/pdbe/files/sifts/1cbs.xml.gz', downloadable: true },
    { name: 'PDB header', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs.header', downloadable: true },
    {
      name: 'PDB file (gz)',
      url: 'https://ftp.ebi.ac.uk/pub/databases/rcsb/pdb-remediated/data/structures/divided/pdb/cb/pdb1cbs.ent.gz',
      downloadable: true,
    },
    { name: 'PDBML', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs.xml', downloadable: true },
    { name: 'PDBML (ATOM lines)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs-extatom.xml', downloadable: true },
    { name: 'PDBML (no atoms)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs-noatom.xml', downloadable: true },
    { name: 'Assembly composition XML', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs-assembly.xml', downloadable: true },
    { name: 'Assembly 1 (atom only; mmCIF)', url: 'https://www.ebi.ac.uk/pdbe/static/entry/download/1cbs-assembly-1_atom_site.cif.gz', downloadable: true },
    { name: 'Summary report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_validation.pdf', downloadable: true },
    { name: 'Percentile plot (PNG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_multipercentile_validation.png', downloadable: true },
    { name: 'Percentile plot (SVG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/download/1cbs_multipercentile_validation.svg', downloadable: true },
  ];
  // Data for view dropdown control
  viewOptions = [
    { name: 'Archive mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs.cif', downloadable: false },
    { name: 'Updated mmCIF file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_updated.cif', downloadable: false },
    { name: 'PDB file', url: 'https://www.ebi.ac.uk/pdbe/entry-files/pdb1cbs.ent', downloadable: false },
    { name: 'PDB header', url: 'https://www.ebi.ac.uk/pdbe/static/entry/1cbs.header', downloadable: false },
    { name: 'Assembly composition XML', url: 'https://www.ebi.ac.uk/pdbe/static/entry/1cbs-assembly.xml', downloadable: false },
    { name: 'FASTA (entry)', url: 'https://www.ebi.ac.uk/pdbe/entry/pdb/1cbs/fasta', downloadable: false },
    { name: 'Summary report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_validation.pdf', downloadable: false },
    { name: 'Full report (PDF)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_full_validation.pdf', downloadable: false },
    { name: 'Percentile plot (PNG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_multipercentile_validation.png', downloadable: false },
    { name: 'Percentile plot (SVG)', url: 'https://www.ebi.ac.uk/pdbe/entry-files/1cbs_multipercentile_validation.svg', downloadable: false },
  ];

  constructor(private route: ActivatedRoute, private router: Router, private aggregatedApiService: AggregatedApiService) {
    /**
     * Entry id is taken from route parameters in URL
     * we also make sure this id is always lowercase
     */
    this.route.params.subscribe((params) => {
      this.entryId = params['entryId'].toLowerCase();
      if (params['entryId'] !== this.entryId) {
        this.router.navigate(['', this.entryId]);
      }
    });
  }

  ngOnInit(): void {
    /**
     * Entry pages data is retrieved from the API service and post processed for simplicity (see EntryData model)
     */
    this.aggregatedApiService.fetchEntryPagesData(this.entryId!).subscribe((data) => {
      this.entryData = this.aggregatedApiService.processEntryPagesData(this.entryId!, data);
    });
  }

  /**
   * Function to close dropdowns when page is clicked elsewhere
   * @param event
   */
  @HostListener('document:click', ['$event'])
  clickOutsideDropdowns(event: Event) {
    const hasClickedView = this.viewDropdownContainer.nativeElement.contains(event.target);
    const hasClickedDownload = this.downloadDropdownContainer.nativeElement.contains(event.target);
    if (!hasClickedView && !hasClickedDownload) {
      this.downloadDropdown.closeDropdown();
      this.viewDropdown.closeDropdown();
    }
  }

  /**
   * Function to close other dropdowns when a given dropdown is clicked
   * @param dropdownId identifier of clicked dropdown
   */
  closeOtherDropdowns(dropdownId: string) {
    if (dropdownId === 'view-btn') {
      this.downloadDropdown.closeDropdown();
    } else {
      this.viewDropdown.closeDropdown();
    }
  }
}
