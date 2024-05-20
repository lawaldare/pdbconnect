import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DescriptionComponent } from '../page-sections/description/description.component';
import { ImageCarouselComponent } from '../page-sections/image-carousel/image-carousel.component';
import { PropertiesComponent } from '../page-sections/properties/properties.component';
import { StructuresComponent } from '../page-sections/structures/structures.component';
import { InteractionComponent } from '../page-sections/interaction/interaction.component';
import { RelatedLigandsComponent } from '../page-sections/related-ligands/related-ligands.component';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeDropdownComponent } from '@pdbe-lib/dropdown';
import { PdbeChipsComponent } from '@pdbe-lib/chips';
import { AggregatedApiService, descriptionData } from '../../services/aggregated-api.service';
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
    ImageCarouselComponent,
    PropertiesComponent,
    StructuresComponent,
    InteractionComponent,
    RelatedLigandsComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  ligandId: string | undefined;
  description?: descriptionData;
  downloadOptions: downloadOption[] = [];
  expandedDropdowns = false;

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

  /**
   * Function to fetch and process data from Summary API
   * @param ligandId
   */
  getDescription(ligandId: string) {
    this.aggregatedApiService.fetchDescription(ligandId).subscribe((data) => {
      this.description = this.aggregatedApiService.processDescriptionData(ligandId, data);
    });
  }

  /**
   * Function to fetch and process downloadable files of ligand
   * @param ligandId
   */
  getDownloads(ligandId: string) {
    this.aggregatedApiService.fetchDownload(ligandId).subscribe((data) => {
      const download = this.aggregatedApiService.processDownloadData(ligandId, data);
      // Data for download dropdown control
      this.downloadOptions = [
        { name: 'CIF file', url: download.cif, downloadable: true },
        { name: 'Ideal SDF', url: download.idealSDF, downloadable: true },
        { name: 'Model SDF', url: download.modelSDF, downloadable: true },
        { name: 'Model CML', url: download.modelCML, downloadable: true },
      ];
    });
  }

  ngOnInit(): void {
    if (this.ligandId) {
      this.getDescription(this.ligandId);
      this.getDownloads(this.ligandId);
    }
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
      this.expandedDropdowns = false;
    } else if (this.dDropdown.expandedStatus) {
      // if click inside any of the dropdowns
      this.expandedDropdowns = true;
    } else {
      this.expandedDropdowns = false;
    }
  }
}
