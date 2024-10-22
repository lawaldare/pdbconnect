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
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LigandSpecificDatabasesComponent } from '../../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { cofactorTooltip, drugTooltip, headerLogoMenuConfig, headerSearchConfig, navSections, reactantTooltip } from '../../../ligand.constant';
import { MainComponentStore } from './main.store';
import { DataLayerService, GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { LigandUtilService } from '../../../ligand-util.service';
import { LigandStructure } from '../../../data-models/structure.model';
import { BiodataState } from '../../../../store/biodata.model';
import { Store } from '@ngrx/store';
import { BiodataActions } from '../../../../store/biodata.actions';
import { BiodataSelectors } from '../../../../store/biodata.selectors';

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
  public readonly ligandUtilService = inject(LigandUtilService);
  private readonly globalStore = inject(Store<BiodataState>);

  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;
  public readonly navSections = navSections;

  public description = this.store.description;
  public downloadOptions = this.store.downloadOptions;
  public supercomponents = this.store.supercomponents;
  public redirectText = this.store.redirectText;
  public descriptionLoaded = computed(() => (Object.keys(this.description()).length ? true : false));

  public annotations = signal<string[]>([]);

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;

  public ligandId!: string;

  private readonly schemas = computed(() => ({
    similarLigands: this.ligandUtilService.currentSimilarLigands(),
    structures: this.ligandUtilService.currentStuctures(),
    summary: this.ligandUtilService.currentSummary(),
  }));

  private structures = toSignal(this.globalStore.select(BiodataSelectors.structures));
  public isThereStructures = computed(() => (this.structures() ?? []).length > 0);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          this.ligandId = params['ligandId'].toUpperCase();
          this.globalStore.dispatch(BiodataActions.setCurrentLigandId({ ligandId: this.ligandId }));
          this.globalStore.dispatch(BiodataActions.getStructures());
          // this.globalStore.dispatch(BiodataActions.getSummary());
          // this.globalStore.dispatch(BiodataActions.setDownloadOptions());
          // this.globalStore.dispatch(BiodataActions.getRelatedLigands());
          // this.globalStore.dispatch(BiodataActions.getSupercomponents());
          // this.globalStore.dispatch(BiodataActions.getSubstructures());
          this.store.init(this.ligandId);
          setTimeout(() => {
            this.generateSchemaData();
            this.getAnnotationsFromStructures();
          }, 1000);
          return of({});
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
    this.googleAnalyticsService.logClickEvents('view_3d_button_click', 'Interaction', 'view_3d', 'View 3D');
  }

  private getAnnotationsFromStructures(): void {
    const structuresWithAnnotations = this.ligandUtilService.currentStuctures().filter((structure) => structure.annotations);
    const mappedAnnotations = structuresWithAnnotations.reduce((acc: string[], structure) => {
      return acc.concat(structure.annotations);
    }, []);
    const uniqueAnnotations = [...new Set(mappedAnnotations)];
    this.annotations.update(() => uniqueAnnotations);
  }
}
