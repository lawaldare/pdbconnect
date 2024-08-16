import { Component, OnInit, inject, DestroyRef } from '@angular/core';
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
import { PdbeChipsComponent } from '@pdbe-lib/chips';
import { AggregatedApiService, DescriptionData } from '../../services/aggregated-api.service';
import { downloadOption } from '../../data-models/download.model';
import { ThemeType } from '@pdbc/core';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LigandSpecificDatabasesComponent } from '../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    PdbeNavMenuComponent,
    PdbeButtonComponent,
    PdbeChipsComponent,
    DescriptionComponent,
    ImageCarouselComponent,
    PropertiesComponent,
    StructuresComponent,
    InteractionComponent,
    RelatedLigandsComponent,
    LigandSpecificDatabasesComponent,
    DropdownMenuComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  public ligandId!: string;
  public description!: DescriptionData;
  public downloadOptions: downloadOption[] = [];

  public readonly headerLogoMenuConfig = {
    backgroundColor: '#085F5C',
    logoType: 'PDBe-KB',
    headerTitle: 'Ligands',
  };

  public readonly headerSearchConfig = {
    examples: [
      { label: 'STI', url: '/ligands/STI' },
      { label: 'XRS', url: '/ligands/XRS' },
      { label: 'MHS', url: '/ligands/MHS' },
      { label: 'V9P', url: '/ligands/V9P' },
    ],
    backgroundColor: 'rgba(8, 95, 92, 0.79)',
    type: ThemeType.PDBEKB,
  };

  // Data for sticky navigation menu
  navSections = [
    { sectionId: 'description-section', sectionName: 'Description', isSubSection: false },
    { sectionId: 'properties-section', sectionName: 'Physicochemical properties', isSubSection: false },
    { sectionId: 'structures-section', sectionName: 'Structures', isSubSection: false },
    { sectionId: 'interaction-section', sectionName: 'Interaction statistics', isSubSection: false },
    { sectionId: 'related-ligand-section', sectionName: 'Related ligands', isSubSection: false },
    { sectionId: 'scaffold-section', sectionName: 'Same scaffold', isSubSection: true },
    { sectionId: 'similar-ligand-section', sectionName: 'Similar ligands', isSubSection: true },
    { sectionId: 'ligand-databases-section', sectionName: 'Ligand-specific databases', isSubSection: false },
  ];

  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const ligandId = params['ligandId'].toUpperCase();
          return forkJoin([this.aggregatedApiService.fetchDescription(ligandId), this.aggregatedApiService.fetchDownload(ligandId), of(ligandId)]);
        }),
        tap(([, , ligandId]) => (this.ligandId = ligandId)),
        map(([descriptionData, downloadData, ligandId]) => {
          return {
            processDescriptionData: this.aggregatedApiService.processDescriptionData(ligandId, descriptionData),
            processDownloadData: this.aggregatedApiService.processDownloadData(ligandId, downloadData),
          };
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.description = data.processDescriptionData;
        this.downloadOptions = [
          { name: 'CIF file', url: data.processDownloadData.cif, downloadable: true },
          { name: 'Ideal SDF', url: data.processDownloadData.idealSDF, downloadable: true },
          { name: 'Model SDF', url: data.processDownloadData.modelSDF, downloadable: true },
          { name: 'Model CML', url: data.processDownloadData.modelCML, downloadable: true },
        ];
      });
  }
}
