import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../page-sections/summary/summary.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PdbeDropdownComponent } from '@pdbe-lib/dropdown';
import { EntryApiService, EntryData } from '../../services/entry-api.service';
import { StrucQualityGradientsComponent } from '../../components/struc-quality-gradients/struc-quality-gradients.component';
import { PdbeMolstarForAppsComponent } from '@pdbe-lib/molstar-for-apps';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeMolstarForAppsComponent,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    SummaryComponent,
    StrucQualityGradientsComponent,
    PdbeLinkButtonComponent,
    PdbeNavMenuComponent,
    PdbeButtonComponent,
    PdbeDropdownComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  entryId: string | undefined; // Currently displayed entry id
  entryData: EntryData | undefined; // Entry pages data

  expandedDropdowns = false;
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
  downloadOptions: { name: string; url: string; downloadable: boolean }[] = [];
  // Data for view dropdown control
  viewOptions: { name: string; url: string; downloadable: boolean }[] = [];

  // configuration to initialize molstar
  // docs in: https://github.com/molstar/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin#plugin-parameters-options
  molstarConfigs = {
    moleculeId: '',
    hideControls: true,
    landscape: true,
    hideExpandIcon: true,
    subscribeEvents: false,
    bgColor: { r: 255, g: 255, b: 255 },
  };

  molstarConfigs = {
    // moleculeId: '1cbs',
    // subscribeEvents: true,
    // bgColor:  {r: 255, g: 255, b: 255},
    // hideStructure: ['water'],
    // lighting: 'plastic',
    // landscape: true,
    moleculeId: '',
    hideControls: true,
    // loadMaps: true,
    // validationAnnotation: true,
    // domainAnnotation: true,
    // expanded: false,
    landscape: true,
    hideExpandIcon: true,
    subscribeEvents: false,
    bgColor: { r: 255, g: 255, b: 255 },
  };

  constructor(private route: ActivatedRoute, private router: Router, private entryApiService: EntryApiService) {
    /**
     * Entry id is taken from route parameters in URL
     * we also make sure this id is always lowercase
     */
    this.route.params.subscribe((params) => {
      this.entryId = params['entryId'].toLowerCase();
      if (params['entryId'] !== this.entryId) {
        this.router.navigate(['', this.entryId]);
      }
      this.molstarConfigs.moleculeId = this.entryId!;
    });
  }

  ngOnInit(): void {
    /**
     * Entry pages data is retrieved from the API service and post processed for simplicity (see EntryData model)
     */
    this.entryApiService.fetchEntryPagesData(this.entryId!).subscribe((data) => {
      this.entryData = this.entryApiService.processEntryPagesData(this.entryId!, data);

      this.downloadOptions = this.entryData.fileURLs.downloads;
      this.viewOptions = this.entryData.fileURLs.views;
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
      // if click outside dropdowns
      this.downloadDropdown.closeDropdown();
      this.viewDropdown.closeDropdown();
      this.expandedDropdowns = false;
    } else if (this.downloadDropdown.expandedStatus || this.viewDropdown.expandedStatus) {
      // if click inside any of the dropdowns
      this.expandedDropdowns = true;
    } else {
      this.expandedDropdowns = false;
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
