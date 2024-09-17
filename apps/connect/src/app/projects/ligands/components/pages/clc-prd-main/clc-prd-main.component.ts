import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { PdbeChipsComponent } from '@pdbe-lib/chips';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { DescriptionComponent } from '../../page-sections/description/description.component';
import { ImageCarouselComponent } from '../../page-sections/image-carousel/image-carousel.component';
import { PropertiesComponent } from '../../page-sections/properties/properties.component';
import { StructuresComponent } from '../../page-sections/structures/structures.component';
import { headerLogoMenuConfig, headerSearchConfig, navSections } from '../../../ligand.constant';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { MainComponentStore } from '../main/main.store';
import { LigandUtilService } from '../../../ligand-util.service';

@Component({
  selector: 'pdbc-clc-prd-main',
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
    DropdownMenuComponent,
  ],
  templateUrl: './clc-prd-main.component.html',
  styleUrls: ['../main/main.component.scss', './clc-prd-main.component.sass'],
})
export class ClcPrdMainComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(MainComponentStore);
  public readonly ligandUtilService = inject(LigandUtilService);

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
          this.store.init(this.ligandId);
          return of({});
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public openMolstarDialog(): void {
    this.store.openMolstarDialog();
  }
}
