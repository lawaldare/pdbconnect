import { Component, OnInit, inject, DestroyRef, computed } from '@angular/core';
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
import { headerLogoMenuConfig, headerSearchConfig, navSections } from '../../../ligand.constant';
import { MainComponentFacade } from './main.facade';
import { MainComponentStore } from './main.store';

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
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly facade = inject(MainComponentFacade);

  private readonly store = inject(MainComponentStore);

  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;
  public readonly navSections = navSections;

  public description = this.store.description;
  public downloadOptions = this.store.downloadOptions;
  public supercomponents = this.store.supercomponents;
  public descriptionLoaded = computed(() => (Object.keys(this.description()).length ? true : false));

  public ligandId!: string;

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.ligandId = params['ligandId'].toUpperCase();
          // this.facade.init(this.ligandId);
          this.store.init(this.ligandId);
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public openMolstarDialog(): void {
    this.facade.openMolstarDialog();
  }
}
