import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
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
import { DownloadOption } from '../../data-models/download.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LigandSpecificDatabasesComponent } from '../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { switchMap, map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Fragment } from '../../data-models/structure.model';
import { LigandUtilService } from '../../ligand-util.service';
import { headerLogoMenuConfig, headerSearchConfig, navSections } from '../../ligand.constant';

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
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ligandUtilService = inject(LigandUtilService);
  private currentFragment = signal<any>({});

  public ligandId!: string;
  public description!: DescriptionData;
  public downloadOptions: DownloadOption[] = [];
  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;
  public readonly navSections = navSections;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          const ligandId = params['ligandId'].toUpperCase();
          this.ligandId = ligandId;
          return forkJoin([this.aggregatedApiService.fetchDescription(ligandId), this.aggregatedApiService.fetchDownload(ligandId), of(ligandId)]);
        }),
        map(([descriptionData, downloadData, ligandId]) => {
          return {
            processDescriptionData: this.aggregatedApiService.processDescriptionData(ligandId, descriptionData),
            processDownloadData: this.aggregatedApiService.processDownloadData(ligandId, downloadData),
          };
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: { processDescriptionData: DescriptionData; processDownloadData: { cif: any; idealSDF: any; modelSDF: any; modelCML: any } }) => {
        this.description = data.processDescriptionData;
        this.downloadOptions = [
          { name: 'CIF file', url: data.processDownloadData.cif, downloadable: true },
          { name: 'Ideal SDF', url: data.processDownloadData.idealSDF, downloadable: true },
          { name: 'Model SDF', url: data.processDownloadData.modelSDF, downloadable: true },
          { name: 'Model CML', url: data.processDownloadData.modelCML, downloadable: true },
        ];
      });
  }

  public getCurrentFragment(currentFragment: Fragment): void {
    this.currentFragment.set(currentFragment);
  }

  public openMolstarDialog(): void {
    this.ligandUtilService.openMolstarDialog(this.currentFragment(), this.ligandId);
  }
}
