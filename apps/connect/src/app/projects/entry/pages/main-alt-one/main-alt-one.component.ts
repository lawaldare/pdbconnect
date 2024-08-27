import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { EntryApiService, EntryDataAltOne } from '../../services/entry-api.service';
import { StrucQualityGradientsComponent } from '../../components/struc-quality-gradients/struc-quality-gradients.component';
import { PdbeMolstarForAppsComponent } from '@pdbe-lib/molstar-for-apps';
import { InitParams } from 'pdbe-molstar/lib/spec';
import { SummaryAltOneComponent } from '../page-sections/summary-alt-one/summary-alt-one.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';

@Component({
  selector: 'pdbc-main-alt-one',
  standalone: true,
  imports: [
    CommonModule,
    PdbeMolstarForAppsComponent,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    SummaryAltOneComponent,
    StrucQualityGradientsComponent,
    PdbeLinkButtonComponent,
    PdbeNavMenuComponent,
    DropdownMenuComponent,
  ],
  templateUrl: './main-alt-one.component.html',
  styleUrl: './main-alt-one.component.scss',
})
export class EntryMainAltOnePageComponent implements OnInit {
  entryId: string | undefined; // Currently displayed entry id
  entryData: EntryDataAltOne | undefined; // Entry pages data

  public headerLogoMenuConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [
      { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services' },
      { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation' },
      { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training' },
    ],
    menuHighlightColor: '#0a5032',
  };

  // Data for sticky navigation menu
  navSections = [
    { sectionId: 'summary-section', isSubSection: false, sectionName: 'Summary' },
    { sectionId: 'function-biology-section', isSubSection: false, sectionName: 'Function and Biology' },
    { sectionId: 'family-domains-section', isSubSection: false, sectionName: 'Family and Domains' },
    { sectionId: 'macromolecules-section', isSubSection: false, sectionName: 'Macromolecules' },
    { sectionId: 'ligands-envs-section', isSubSection: false, sectionName: 'Ligands and Environments' },
    { sectionId: 'assemblies-section', isSubSection: false, sectionName: 'Assemblies' },
    { sectionId: 'exp-validation-section', isSubSection: false, sectionName: 'Experiments and Validation' },
    { sectionId: 'citations-section', isSubSection: false, sectionName: 'Citations' },
  ];
  // Data for download dropdown control
  downloadOptions: { name: string; url: string; downloadable: boolean }[] = [];
  // Data for view dropdown control
  viewOptions: { name: string; url: string; downloadable: boolean }[] = [];

  // configuration to initialize molstar
  // docs in: https://github.com/molstar/pdbe-molstar/wiki/1.-PDBe-Molstar-as-JS-plugin#plugin-parameters-options
  // https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/grails-app/views/pdb/protein_entity.gsp
  molstarConfigs: Partial<InitParams> = {
    moleculeId: '',
    hideControls: true,
    // hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
    landscape: true,
    // landscape: false,
    subscribeEvents: false,
    // subscribeEvents: true,

    pdbeUrl: 'https://www.ebi.ac.uk/pdbe/',
    loadMaps: true,
    validationAnnotation: true,
    symmetryAnnotation: true,
    domainAnnotation: true,
    assemblyId: 'preferred', //'deposited'

    sequencePanel: false,
    loadingOverlay: true,
    pdbeLink: false,

    bgColor: { r: 255, g: 255, b: 255 },
  };
  molstarHideCanvasControls: string[] = ['screenshot', 'selection', 'animation', 'controlToggle', 'controlInfo'];
  molstarShowControls = false;
  molstarShowSeqPanel = false;
  molstarLoaded = false;

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
    this.entryApiService.fetchEntryPagesAltOneData(this.entryId!).subscribe((data) => {
      this.entryData = this.entryApiService.processEntryPagesAltOneData(this.entryId!, data);

      this.downloadOptions = this.entryData.fileURLs.downloads;
      this.viewOptions = this.entryData.fileURLs.views;
    });
  }

  setMolstarAnnotationView(isExpanded: boolean) {
    // let newMolstarConfigs = JSON.parse(JSON.stringify(this.molstarConfigs));
    if (isExpanded) {
      // newMolstarConfigs.hideControls = false;
      // newMolstarConfigs.hideCanvasControls = [];
      // newMolstarConfigs.subscribeEvents = true;
      // newMolstarConfigs.sequencePanel = true;
      // newMolstarConfigs.loadingOverlay = true;
      this.molstarHideCanvasControls = [];
      this.molstarShowControls = true;
      this.molstarShowSeqPanel = true;
      // this.molstarConfigs = newMolstarConfigs;
    } else {
      // newMolstarConfigs.hideControls = true;
      // newMolstarConfigs.hideCanvasControls = ['selection', 'animation', 'controlToggle', 'controlInfo'];
      // newMolstarConfigs.subscribeEvents = false;
      // newMolstarConfigs.sequencePanel = false;
      // newMolstarConfigs.loadingOverlay = false;
      this.molstarHideCanvasControls = ['screenshot', 'selection', 'animation', 'controlToggle', 'controlInfo'];
      this.molstarShowControls = false;
      this.molstarShowSeqPanel = false;
      // this.molstarConfigs = newMolstarConfigs;
    }
  }

  toggleAnnotationButton(isLoaded: boolean) {
    this.molstarLoaded = isLoaded;
  }

  triggerAnnotatatedView() {
    const currentBtnEle = <HTMLInputElement>document.querySelector('button[title="Toggle Expanded Viewport"]');
    currentBtnEle.click();
  }
}
