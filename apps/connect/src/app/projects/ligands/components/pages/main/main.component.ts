import { Component, OnInit, inject, DestroyRef, signal, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { mergeMap } from 'rxjs/operators';
import { cofactorTooltip, drugTooltip, navSections, reactantTooltip } from '../../../ligand.constant';
import { DataLayerService, GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { LigandUtilService } from '../../../ligand-util.service';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { combineLatest } from 'rxjs';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { MatDialog } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingState } from '../../../enums/loading-state.enum';
import { AggregatedApiService } from '../../../services/aggregated-api.service';
import { LigandStructure } from '../../../data-models/structure.model';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
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
  private readonly destroyRef = inject(DestroyRef);
  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly bioschemasService = inject(LigandsBioschemasService);
  private readonly aggregatedApiService = inject(AggregatedApiService);

  private readonly renderer = inject(Renderer2);
  public readonly ligandUtilService = inject(LigandUtilService);
  private readonly globalStore = inject(Store<LigandStoreState>);
  private readonly dialog = inject(MatDialog);

  public readonly navSections = navSections;

  public description = toSignal(this.globalStore.select(LigandSelectors.description));
  public downloadOptions = toSignal(this.globalStore.select(LigandSelectors.downloadOptions));
  public supercomponents = toSignal(this.globalStore.select(LigandSelectors.supercomponents));
  public redirectText$ = this.globalStore.select(LigandSelectors.emptyPageText);

  public loaded = toSignal(this.globalStore.select(LigandSelectors.loadingState));

  public annotations = signal<string[]>([]);

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;

  public ligandId = signal<string>('');

  public status = LoadingState;

  public isThereStructures = signal<boolean>(true);

  private fragments = toSignal(this.globalStore.select(LigandSelectors.fragments));

  ngOnInit(): void {
    combineLatest([
      this.globalStore.select(LigandSelectors.ligandId),
      this.globalStore.select(LigandSelectors.structures),
      this.globalStore.select(LigandSelectors.description),
    ])
      .pipe(
        mergeMap(([ligandId, structures, description]) => {
          this.ligandUtilService.redirectLigandPages(description);
          this.ligandId.set(ligandId);
          this.isThereStructures.update(() => structures.length > 0);
          this.getAnnotations(structures);
          return this.aggregatedApiService.fetchDepiction(this.ligandId());
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.generateSchemaData();
      });
  }

  private getAnnotations(structures: LigandStructure[]): void {
    const structuresWithAnnotations = (structures ?? []).filter((structure) => structure.annotations);
    const mappedAnnotations = structuresWithAnnotations.reduce((acc: string[], structure) => {
      return acc.concat(structure.annotations);
    }, []);
    const uniqueAnnotations = [...new Set(mappedAnnotations)];
    this.annotations.update(() => uniqueAnnotations);
  }

  private generateSchemaData(): void {
    this.bioschemasService.buildBioschemasJSON(this.renderer);
  }

  public openMolstarDialog(): void {
    this.googleAnalyticsService.logClickEvents('view_3d_button_click', 'Interaction', 'view_3d', 'View 3D');
    this.dialog.open(MolstarDialogComponent, {
      disableClose: false,
      panelClass: 'molstarDialog',
      data: {
        moleculeId: this.ligandId(),
        fragments: this.fragments,
      },
    });
  }
}
