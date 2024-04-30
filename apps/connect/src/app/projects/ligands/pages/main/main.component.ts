import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DescriptionComponent } from '../page-sections/description/description.component';
import { PropertiesComponent } from '../page-sections/properties/properties.component';
import { StructuresComponent } from '../page-sections/structures/structures.component';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeDropdownComponent } from '@pdbe-lib/dropdown';
import { PdbeChipsComponent } from '@pdbe-lib/chips';
import { AggregatedApiService, LigandData } from '../../services/aggregated-api.service';
import { downloadOption } from '../../data-models/download.model';
@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    PdbeNavMenuComponent,
    PdbeButtonComponent,
    PdbeDropdownComponent,
    PdbeChipsComponent,
    DescriptionComponent,
    PropertiesComponent,
    StructuresComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  ligandId: string | undefined;
  ligandData: LigandData | undefined;
  downloadOptions: downloadOption[] = [];

  @ViewChild('dDropdown') dDropdown!: PdbeDropdownComponent;
  @ViewChild('dDropdown', { read: ElementRef }) downloadDropdownContainer!: ElementRef; // To access dropdown HTML element
  // Data for sticky navigation menu
  navSections = [
    { sectionName: 'Description', subsections: [] },
    { sectionName: 'Physicochemical properties', subsections: [] },
    { sectionName: 'Structures', subsections: [] },
    { sectionName: 'Interaction statistics', subsections: [] },
    { sectionName: 'Related ligands', subsections: [{ sectionName: 'Same scaffolds' }, { sectionName: 'Similar ligands' }, { sectionName: 'Stereoisomers' }] },
    { sectionName: 'Ligand-specific databases', subsections: [] },
  ];

  constructor(private route: ActivatedRoute, private aggregatedApiService: AggregatedApiService) {
    this.route.params.subscribe((params) => {
      this.ligandId = params['ligandId'].toUpperCase();
    });
  }

  ngOnInit(): void {
    this.aggregatedApiService.fetchLigandPagesData(this.ligandId!).subscribe((data) => {
      this.ligandData = this.aggregatedApiService.processLigandPagesData(this.ligandId!, data);

      // Data for download dropdown control
      this.downloadOptions = [
        { name: 'CIF file', url: this.ligandData.download.cif, downloadable: true },
        { name: 'Ideal SDF', url: this.ligandData.download.idealSDF, downloadable: true },
        { name: 'Model SDF', url: this.ligandData.download.modelSDF, downloadable: true },
        { name: 'Model CML', url: this.ligandData.download.modelCML, downloadable: true },
      ];
    });
  }

  /**
   * Function to close dropdowns when page is clicked elsewhere
   * @param event
   */
  @HostListener('document:click', ['$event'])
  clickOutsideDropdowns(event: Event) {
    const hasClickedDownload = this.downloadDropdownContainer.nativeElement.contains(event.target);
    if (!hasClickedDownload) {
      this.dDropdown.closeDropdown();
    }
  }
}
