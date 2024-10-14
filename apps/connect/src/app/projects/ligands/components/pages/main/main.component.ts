import { Component, OnInit, inject, DestroyRef, computed, signal, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DescriptionComponent } from '../../page-sections/description/description.component';
import { ImageCarouselComponent } from '../../page-sections/image-carousel/image-carousel.component';
import { PropertiesComponent } from '../../page-sections/properties/properties.component';
import { StructuresComponent } from '../../page-sections/structures/structures.component';
import { InteractionComponent } from '../../page-sections/interaction/interaction.component';
import { RelatedLigandsComponent } from '../../page-sections/related-ligands/related-ligands.component';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { PdbeChipsComponent } from '@pdbe-lib/chips';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LigandSpecificDatabasesComponent } from '../../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { cofactorTooltip, drugTooltip, headerLogoMenuConfig, headerSearchConfig, navSections, reactantTooltip } from '../../../ligand.constant';
import { MainComponentStore } from './main.store';
import { DataLayerService, GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    PdbeNavMenuComponent,
    PdbeChipsComponent,
    DescriptionComponent,
    ImageCarouselComponent,
    PropertiesComponent,
    StructuresComponent,
    InteractionComponent,
    RelatedLigandsComponent,
    LigandSpecificDatabasesComponent,
    DropdownMenuComponent,
    MaterialModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(MainComponentStore);
  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly bioschemasService = inject(LigandsBioschemasService);
  private readonly renderer = inject(Renderer2);

  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;
  public readonly navSections = navSections;

  public description = this.store.description;
  public downloadOptions = this.store.downloadOptions;
  public supercomponents = this.store.supercomponents;
  public redirectText = this.store.redirectText;
  public descriptionLoaded = computed(() => (Object.keys(this.description()).length ? true : false));

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;

  public ligandId!: string;

  public schema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'angular.io',
    url: 'https://angular.io',
  };

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.ligandId = params['ligandId'].toUpperCase();
          this.store.init(this.ligandId);
          this.generateSchemaData();
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private generateSchemaData(): void {
    const schema = {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: this.ligandId,
      url: 'https://angular.io',
    };
    this.bioschemasService.setJsonLd(this.renderer, schema);
  }

  public openMolstarDialog(): void {
    this.store.openMolstarDialog();
    this.googleAnalyticsService.logClickEvents('view_3d_button_click', 'Interaction', 'view_3d', 'View 3D');
  }
}
