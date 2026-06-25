import { Component, OnInit, inject, DestroyRef, signal, Renderer2, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PropertiesComponent } from '../../page-sections/properties/properties.component';
import { StructuresComponent } from '../../page-sections/structures/structures.component';
import { InteractionComponent } from '../../page-sections/interaction/interaction.component';
import { RelatedLigandsComponent } from '../../page-sections/related-ligands/related-ligands.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { LigandSpecificDatabasesComponent } from '../../page-sections/ligand-specific-databases/ligand-specific-databases.component';
import { DropdownMenuComponent } from '@pdbe-lib/dropdown-menu';
import { mergeMap, switchMap } from 'rxjs/operators';
import { cofactorTooltip, drugTooltip, headerSearchConfig, ligandRouteTabs, ligandsHeaderLogoMenuConfig, reactantTooltip } from '../../../ligand.constant';
import {
  ClarityConsentService,
  DataLayerService,
  DataPrivacyBannerComponent,
  GoogleAnalyticsService,
  MaterialModule,
  ScrollPositionService,
  SeoService,
  SurveyConfig,
  SurveyPopupComponent,
  SurveyService,
} from '@pdbc/core';
import { LigandsBioschemasService } from '../../../services/ligands.bioschemas';
import { LigandUtilService } from '../../../ligand-util.service';
import { LigandStoreState } from '../../../store/ligand-store.model';
import { Store } from '@ngrx/store';
import { LigandSelectors } from '../../../store/ligand.selectors';
import { combineLatest, of } from 'rxjs';
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
import { environment } from '../../../../environments/environment';
import { HelpIconForMolstarService } from '@pdbe-lib/molstar-for-apps';
import { LigandPageTutorialTourService } from '../../../services/ligands-page-tutorial-tour.service';

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
    SurveyPopupComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class LigandsMainPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  public readonly dlService = inject(DataLayerService);
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly bioschemasService = inject(LigandsBioschemasService);
  public readonly helpIconForMolstarService = inject(HelpIconForMolstarService);
  public readonly tutorialTourService = inject(LigandPageTutorialTourService);
  private readonly seoService = inject(SeoService);

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

  public readonly ligandsHeaderLogoMenuConfig = ligandsHeaderLogoMenuConfig;
  public readonly headerSearchConfig = headerSearchConfig;

  public ligandId = signal<string>('');

  public readonly status = LoadingState;

  public selectedTab = signal<number>(0);
  public showNotificationBanner = signal<boolean>(false);

  @ViewChild('tabs') tabGroup!: MatTabGroup;
  private readonly platformId = inject(PLATFORM_ID);
  private isDesktop = signal(false);

  public surveyService = inject(SurveyService);

  constructor() {
    this.showNotification();
    this.route.queryParams.subscribe((params) => {
      const routeTabs = ligandRouteTabs;
      const tabName = params['activeTab'];
      this.ligandUtilService.updateLigandTabName(tabName ?? 'description');
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
      // this.gAS.logPageEvents('cp_tab_access', {
      //   tab: tabName,
      // });
    });
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop.set(window.innerWidth > 768);
      Clarity.init(environment.clarityProjectIdForLigandPages);
      this.clarityConsentService.init(environment.clarityProjectIdForLigandPages);
    }

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
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.launchSurveyForLigandsPage(this.ligandId(), this.isDesktop());
        this.seoService.update(
          {
            title: `PDB ${this.ligandId()}: ${this.description()?.name} | Protein Data Bank in Europe Knowledge Base - PDBe-KB`,
            description: `PDB ${this.ligandId()}: ${this.description()?.name} | Protein Data Bank in Europe Knowledge Base - PDBe-KB`,
            url: `${environment.baseUrl}pdbe-srv/pdbechem/chemicalCompound/show/${this.ligandId()}`,
          },
          this.renderer
        );
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
    this.bioschemasService.setUpRenderedForBioschemas(this.renderer);
  }

  public selectTab(event: MatTabChangeEvent) {
    const routeTabs = ligandRouteTabs;
    const tabName = routeTabs[event.index].id;
    this.ligandUtilService.updateLigandTabName(tabName ?? 'description');

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
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const href = document.location.href;
    if (href.includes('dev.') || href.includes('wwwdev.')) {
      this.showNotificationBanner.set(true);
    } else {
      this.showNotificationBanner.set(false);
    }
  }

  public openHelpModal(): void {
    this.tutorialTourService.showHelpGuideModal.set(true);
  }

  public closeHelpGuideModal(): void {
    this.tutorialTourService.showHelpGuideModal.set(false);
  }

  private launchSurveyForLigandsPage(ligandId: string, isDesktop: boolean) {
    const surveyConfig: SurveyConfig = {
      identifier: 'ligandspage_satisfaction_v1',
      title: 'Help us improve the PDBe Ligands Pages',
      expiresAt: '01/03/2026',
      webhookUrl: environment.epSurveyWebhookUrl1,

      questions: [
        { id: 'q1', type: 'rating', title: 'How would you rate this page?', skip: false },
        { id: 'q2', type: 'text', title: 'What is the reason for your score?', skip: true },
      ],

      extraParams: {
        entry: `ligand id: ${ligandId}`,
        mode: isDesktop ? 'desktop' : 'mobile',
      },

      feedbackUrl: 'https://www.ebi.ac.uk/about/contact/support/pdbe',
    };

    this.surveyService.init(surveyConfig);
  }
}
