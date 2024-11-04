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
import { navSections } from '../../../ligand.constant';
import { combineLatest, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { LigandUtilService } from '../../../ligand-util.service';
import { GoogleAnalyticsService } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { Store } from '@ngrx/store';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { MatDialog } from '@angular/material/dialog';
import { LoadingState } from '../../../enums/loading-state.enum';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LigandSpecificDatabasesComponent } from '../../page-sections/ligand-specific-databases/ligand-specific-databases.component';

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
    NgxSkeletonLoaderModule,
    LigandSpecificDatabasesComponent,
  ],
  templateUrl: './clc-prd-main.component.html',
  styleUrls: ['../main/main.component.scss', './clc-prd-main.component.sass'],
})
export class ClcPrdMainComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public readonly ligandUtilService = inject(LigandUtilService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  private readonly bioschemasService = inject(LigandsBioschemasService);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);

  public readonly navSections = navSections;
  private readonly globalStore = inject(Store<LigandStoreState>);

  public description = toSignal(this.globalStore.select(LigandSelectors.description));
  public downloadOptions = toSignal(this.globalStore.select(LigandSelectors.downloadOptions));
  public supercomponents = toSignal(this.globalStore.select(LigandSelectors.supercomponents));
  public descriptionLoaded = computed(() => (Object.keys(this.description() ?? {}).length ? true : false));

  public redirectText$ = this.globalStore.select(LigandSelectors.emptyPageText);
  public loaded = toSignal(this.globalStore.select(LigandSelectors.loadingState));

  private fragments = toSignal(this.globalStore.select(LigandSelectors.fragments));

  public isThereStructures = signal<boolean>(true);

  public ligandId = signal<string>('');

  public status = LoadingState;

  ngOnInit(): void {
    combineLatest([
      this.globalStore.select(LigandSelectors.ligandId),
      this.globalStore.select(LigandSelectors.structures),
      this.globalStore.select(LigandSelectors.description),
    ])
      .pipe(
        map(([ligandId, structures, description]) => {
          this.ligandUtilService.redirectLigandPages(description);
          this.ligandId.set(ligandId);
          this.isThereStructures.update(() => structures.length > 0);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.generateSchemaData();
      });
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
