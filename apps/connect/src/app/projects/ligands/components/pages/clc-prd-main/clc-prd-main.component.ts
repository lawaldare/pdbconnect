import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, Renderer2, signal } from '@angular/core';
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
import { combineLatest, EMPTY, mergeMap, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { MainComponentStore } from '../main/main.store';
import { LigandUtilService } from '../../../ligand-util.service';
import { GoogleAnalyticsService } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { BiodataSelectors } from '../../../../store/biodata.selectors';
import { Store } from '@ngrx/store';
import { BiodataState } from '../../../../store/biodata.model';

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
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  private readonly bioschemasService = inject(LigandsBioschemasService);
  private readonly renderer = inject(Renderer2);

  public readonly navSections = navSections;
  private readonly globalStore = inject(Store<BiodataState>);

  public description = this.store.description;
  public downloadOptions = this.store.downloadOptions;
  public supercomponents = this.store.supercomponents;
  public descriptionLoaded = computed(() => (Object.keys(this.description()).length ? true : false));

  public isThereStructures = signal<boolean>(true);

  public ligandId!: string;

  private readonly schemas = computed(() => ({
    similarLigands: this.ligandUtilService.currentSimilarLigands(),
    structures: this.ligandUtilService.currentStuctures(),
    summary: this.ligandUtilService.currentSummary(),
  }));

  ngOnInit(): void {
    combineLatest([this.globalStore.select(BiodataSelectors.ligandId), this.globalStore.select(BiodataSelectors.structures)])
      .pipe(
        mergeMap(([ligandId, structures]) => {
          this.ligandId = ligandId;
          this.store.init(this.ligandId);
          setTimeout(() => {
            this.generateSchemaData();
          }, 1000);
          this.isThereStructures.update(() => structures.length > 0);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private generateSchemaData(): void {
    this.bioschemasService.buildBioschemasJSON(this.renderer, this.schemas, this.ligandId);
  }

  public openMolstarDialog(): void {
    this.store.openMolstarDialog();
  }
}
