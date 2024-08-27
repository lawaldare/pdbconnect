import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from '../page-sections/summary/summary.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { EntryApiService, EntryData } from '../../services/entry-api.service';
import { StrucQualityGradientsComponent } from '../../components/struc-quality-gradients/struc-quality-gradients.component';
import { PdbeMolstarForAppsComponent } from '@pdbe-lib/molstar-for-apps';
import { InitParams } from 'pdbe-molstar/lib/spec';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';

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
    DropdownMenuComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  entryId!: string;
  entryData: EntryData | undefined; // Entry pages data

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
  molstarConfigs: Partial<InitParams> = {
    moleculeId: '',
    hideControls: true,
    hideCanvasControls: ['selection', 'animation', 'controlToggle', 'controlInfo'],
    landscape: true,
    subscribeEvents: false,
    bgColor: { r: 255, g: 255, b: 255 },
  };

  constructor(private route: ActivatedRoute, private router: Router, private entryApiService: EntryApiService) {
    this.route.params.subscribe((params) => {
      this.entryId = params['entryId'].toLowerCase();
      if (params['entryId'] !== this.entryId) {
        this.router.navigate(['', this.entryId]);
      }
      this.molstarConfigs.moleculeId = this.entryId!;
    });
  }

  ngOnInit(): void {
    this.entryApiService.fetchEntryPagesData(this.entryId).subscribe((data) => {
      this.entryData = this.entryApiService.processEntryPagesData(this.entryId, data);

      this.downloadOptions = this.entryData.fileURLs.downloads;
      this.viewOptions = this.entryData.fileURLs.views;
    });
  }
}
