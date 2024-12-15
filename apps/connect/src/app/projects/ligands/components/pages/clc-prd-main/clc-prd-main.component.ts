import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, Renderer2, signal } from '@angular/core';
import { PdbeNavMenuComponent } from '@pdbe-lib/nav-menu';
import { DescriptionComponent } from '../../page-sections/description/description.component';
import { ImageCarouselComponent } from '../../page-sections/image-carousel/image-carousel.component';
import { PropertiesComponent } from '../../page-sections/properties/properties.component';
import { StructuresComponent } from '../../page-sections/structures/structures.component';
import { combineLatest, map, take } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { LigandUtilService } from '../../../ligand-util.service';
import { GoogleAnalyticsService, NavSection } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { Store } from '@ngrx/store';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { MolstarDialogComponent } from '@pdbe-lib/molstar-for-apps';
import { MatDialog } from '@angular/material/dialog';
import { LoadingState } from '../../../enums/loading-state.enum';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LigandSpecificDatabasesComponent } from '../../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { LigandStructure } from '../../../data-models/structure.model';
import { clcNavSections } from '../../../ligand.constant';
import { LigandActions } from '../../../store/ligand.actions';

@Component({
  selector: 'pdbc-clc-prd-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeNavMenuComponent,
    DescriptionComponent,
    ImageCarouselComponent,
    PropertiesComponent,
    StructuresComponent,
    DropdownMenuComponent,
    NgxSkeletonLoaderModule,
    LigandSpecificDatabasesComponent,
  ],
  templateUrl: './clc-prd-main.component.html',
  styleUrls: ['../main/main.component.scss'],
})
export class ClcPrdMainComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public readonly ligandUtilService = inject(LigandUtilService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  private readonly bioschemasService = inject(LigandsBioschemasService);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);

  private readonly globalStore = inject(Store<LigandStoreState>);

  public navSections = toSignal(this.globalStore.select(LigandSelectors.navItems));

  public description = toSignal(this.globalStore.select(LigandSelectors.description));
  public downloadOptions = toSignal(this.globalStore.select(LigandSelectors.downloadOptions));
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
      this.globalStore.select(LigandSelectors.navItems).pipe(take(1)),
    ])
      .pipe(
        map(([ligandId, structures, description, navItems]) => {
          this.updateNavItemsWhenNoStructure(navItems, structures);
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

  private updateNavItemsWhenNoStructure(navItems: NavSection[], structures: LigandStructure[]): void {
    let tempNavsections = [];
    if (structures.length === 0) {
      tempNavsections = navItems.filter((section) => section.sectionId !== 'structures-section');
      tempNavsections = tempNavsections.filter((section) => section.sectionId !== 'ligand-databases-section');
    } else {
      tempNavsections = clcNavSections;
    }
    this.globalStore.dispatch(LigandActions.setNavItems({ navItems: tempNavsections }));
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
