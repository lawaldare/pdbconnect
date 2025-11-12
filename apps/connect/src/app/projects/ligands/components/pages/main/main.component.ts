import { Component, OnInit, inject, DestroyRef, signal, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesComponent } from '../../page-sections/properties/properties.component';
import { StructuresComponent } from '../../page-sections/structures/structures.component';
import { InteractionComponent } from '../../page-sections/interaction/interaction.component';
import { RelatedLigandsComponent } from '../../page-sections/related-ligands/related-ligands.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LigandSpecificDatabasesComponent } from '../../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { mergeMap, switchMap } from 'rxjs/operators';
import { cofactorTooltip, drugTooltip, headerLogoMenuConfig, headerSearchConfig, ligandRouteTabs, navSections, reactantTooltip } from '../../../ligand.constant';
import { ClarityConsentService, DataLayerService, DataPrivacyBannerComponent, GoogleAnalyticsService, MaterialModule, ScrollPositionService } from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { LigandUtilService } from '../../../ligand-util.service';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { combineLatest, EMPTY } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LoadingState } from '../../../enums/loading-state.enum';
import { LigandStructure } from '../../../data-models/structure.model';
import { LigandActions } from '../../../store/ligand.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { LigandSummaryComponent } from '../../page-sections/ligand-summary.component';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { NotificationComponent } from '@pdbc/notification';
import Clarity from '@microsoft/clarity';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    PropertiesComponent,
    StructuresComponent,
    InteractionComponent,
    RelatedLigandsComponent,
    LigandSpecificDatabasesComponent,
    DropdownMenuComponent,
    MaterialModule,
    LigandSummaryComponent,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    NotificationComponent,
    DataPrivacyBannerComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly bioschemasService = inject(LigandsBioschemasService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly renderer = inject(Renderer2);
  public readonly ligandUtilService = inject(LigandUtilService);
  private readonly globalStore = inject(Store<LigandStoreState>);

  public navSections = toSignal(this.globalStore.select(LigandSelectors.navItems));
  public readonly scrollService = inject(ScrollPositionService);
  public readonly clarityConsentService = inject(ClarityConsentService);

  public description = toSignal(this.globalStore.select(LigandSelectors.description));
  public downloadOptions = toSignal(this.globalStore.select(LigandSelectors.downloadOptions));
  public redirectText$ = this.globalStore.select(LigandSelectors.emptyPageText);

  public loaded = toSignal(this.globalStore.select(LigandSelectors.loadingState));

  public annotations = signal<string[]>([]);

  public cofactorTooltip = cofactorTooltip;
  public drugTooltip = drugTooltip;
  public reactantTooltip = reactantTooltip;

  public readonly headerLogoMenuConfig = headerLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;

  public ligandId = signal<string>('');

  public readonly status = LoadingState;

  public selectedTab = signal<number>(0);
  public showNotificationBanner = signal<boolean>(false);

  @ViewChild('tabs') tabGroup!: MatTabGroup;

  constructor() {
    this.showNotification();
    this.route.queryParams.subscribe((params) => {
      const routeTabs = ligandRouteTabs;
      const tabName = params['activeTab'];
      this.ligandUtilService.updateLigandComplexTabName(tabName ?? 'summary');
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
      // this.gAS.logPageEvents('cp_tab_access', {
      //   tab: tabName,
      // });
    });
  }
  ngOnInit(): void {
    Clarity.init(environment.clarityProjectIdForLigandPages);
    this.clarityConsentService.init(environment.clarityProjectIdForLigandPages);
    this.route.params
      .pipe(
        switchMap((params: { [x: string]: string }) => {
          const ligandId = params['ligandId'].toUpperCase();
          this.ligandId.set(ligandId);
          this.globalStore.dispatch(LigandActions.setCurrentLigandId({ ligandId }));
          this.dispatchCoreActions();
          return combineLatest([this.globalStore.select(LigandSelectors.structures), this.globalStore.select(LigandSelectors.description)]);
        }),
        mergeMap(([structures, description]) => {
          this.ligandUtilService.redirectLigandPages(description);
          this.getAnnotations(structures);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.generateSchemaData();
      });
  }

  private dispatchCoreActions(): void {
    this.globalStore.dispatch(LigandActions.getStructures());
    this.globalStore.dispatch(LigandActions.getPolymers());
    this.globalStore.dispatch(LigandActions.getSummary());
    this.globalStore.dispatch(LigandActions.setDownloadOptions());
    this.globalStore.dispatch(LigandActions.getRelatedLigands());
    this.globalStore.dispatch(LigandActions.getSupercomponents());
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

  public selectTab(event: MatTabChangeEvent) {
    const routeTabs = ligandRouteTabs;
    const tabName = routeTabs[event.index].id;
    this.ligandUtilService.updateLigandComplexTabName(tabName ?? 'summary');

    // this.gAS.logPageEvents('cp_tab_switch', {
    //   tab: tabName,
    // });

    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: 'merge',
    });

    this.scrollService.handleScrollPosition(this.tabGroup, event.index);
  }

  private showNotification() {
    const href = document.location.href;
    if (href.includes('dev.') || href.includes('wwwdev.')) {
      this.showNotificationBanner.set(true);
    } else {
      this.showNotificationBanner.set(false);
    }
  }
}
