import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
// import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { SummaryComponent } from '../../page-sections/summary/summary.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, filter, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ComplexStructuresComponent } from '../../page-sections/complex-structures/complex-structures.component';
import {
  ClarityConsentService,
  GoogleAnalyticsService,
  MaterialModule,
  ScrollPositionService,
  SurveyConfig,
  SurveyPopupComponent,
  SurveyService,
  TruncateTextDirective,
} from '@pdbc/core';
import { headerComplexLogoMenuConfig, headerSearchComplexConfig, idWarningTooltip } from '../../../complex.constant';
import { ComplexPublicationsComponent } from '../../page-sections/complex-publications/complex-publications.component';
import { ComplexLigandsComponent } from '../../page-sections/complex-ligands/complex-ligands.component';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { ComplexActions } from '../../../store/complex.actions';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ComplexBioschemasService } from '../../../services/complex.bioschemas';
import { complexRouteTabs } from '../../../complex.constant';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { SuperComplexesComponent } from '../../page-sections/complex-supercomplex/supercomplexes.component';
import { SubComplexesComponent } from '../../page-sections/complex-subcomplex/subcomplexes.component';
// import { NotificationComponent } from '@pdbc/notification';
import { ComplexPISAComponent } from '../../page-sections/complex-pisa/complex-pisa.component';
import { DataPrivacyBannerComponent } from '@pdbc/core';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { ComplexMetaTagService } from '../../../services/complex-meta-tag.service';
import { ComplexPageTutorialTourService } from '../../../services/complex-page-tutorial-tour.service';
import { HelpIconForMolstarService } from '@pdbe-lib/molstar-for-apps';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { ComplexIdHistory } from '../../../models/complexId-history.model';
import { environment } from '../../../../environments/environment';
import Clarity from '@microsoft/clarity';
import { LoadingState } from '../../../enums/loading-state.enum';

enum ComplexIdHistoryStatus {
  Active = 'active',
  Superseded = 'superseded',
  Obsolete = 'obsolete',
}
@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    PdbeHeaderSearchComponent,
    SummaryComponent,
    ComplexStructuresComponent,
    ComplexPISAComponent,
    TruncateTextDirective,
    SubComplexesComponent,
    ComplexPublicationsComponent,
    ComplexLigandsComponent,
    NgxSkeletonLoaderModule,
    MaterialModule,
    SuperComplexesComponent,
    // NotificationComponent,
    DataPrivacyBannerComponent,
    SurveyPopupComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gAS = inject(GoogleAnalyticsService);
  public readonly clarityConsentService = inject(ClarityConsentService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly bioschemasService = inject(ComplexBioschemasService);
  private readonly complexMetaTagService = inject(ComplexMetaTagService);
  private readonly complexUtilService = inject(ComplexUtilService);
  private readonly renderer = inject(Renderer2);

  public readonly headerLogoMenuConfig = { ...headerComplexLogoMenuConfig, isComplexPage: true };
  public readonly headerSearchConfig = headerSearchComplexConfig;

  public readonly tutorialTourService = inject(ComplexPageTutorialTourService);
  public readonly helpIconForMolstarService = inject(HelpIconForMolstarService);

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly scrollService = inject(ScrollPositionService);

  public summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData).pipe(filter(Boolean)));
  public complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));
  public loaded = toSignal(this.globalStore.select(ComplexSelectors.loadingState));

  public supercomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));
  public complexLigands = toSignal(this.globalStore.select(ComplexSelectors.complexLigands));

  public readonly status = LoadingState;
  public selectedTab = signal<number>(0);

  public readonly complexIdHistoryStatus = ComplexIdHistoryStatus;

  public historyMessage = signal<string>('');
  public history = signal<ComplexIdHistory>(null as any);
  public environment = environment;

  // public showNotificationBanner = signal<boolean>(false);

  public idWarningTooltip = idWarningTooltip;

  public pageView = signal<string>('INITIAL');

  @ViewChild('tabs') tabGroup!: MatTabGroup;

  public surveyService = inject(SurveyService);
  private readonly platformId = inject(PLATFORM_ID);
  private isDesktop = signal(false);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const routeTabs = complexRouteTabs;
      const tabName = params['activeTab'];
      this.complexUtilService.updateCurrentComplexTabName(tabName ?? 'summary');
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
      this.gAS.logPageEvents('cp_tab_access', {
        tab: tabName,
      });
    });
  }

  ngOnInit(): void {
    // this.showNotification();

    if (isPlatformBrowser(this.platformId)) {
      this.isDesktop.set(window.innerWidth > 768);
      Clarity.init(environment.clarityProjectIdForComplexPages);
      this.clarityConsentService.init(environment.clarityProjectIdForComplexPages);
    }

    this.route.params
      .pipe(
        switchMap((params) => {
          const complexId = params['complexId'].toUpperCase();
          this.globalStore.dispatch(ComplexActions.setCurrentComplexId({ complexId }));
          this.globalStore.dispatch(ComplexActions.getComplexIdHistory());
          return this.globalStore.select(ComplexSelectors.history).pipe(filter(Boolean));
        }),
        mergeMap((history: ComplexIdHistory) => {
          this.history.set(history);
          if (history.status === this.complexIdHistoryStatus.Superseded) {
            this.historyMessage.set(`${history.query_id} has been superseded since ${history.canonical.effective_date} by ${history.canonical.id}`);
            this.router.navigate(['/complexes', history.canonical.id]);
            this.globalStore.dispatch(ComplexActions.setCurrentComplexId({ complexId: history.canonical.id }));
            this.dispatchCoreActions();
          } else if (history.canonical.status === this.complexIdHistoryStatus.Active) {
            this.pageView.set('SUCCESS');
            this.dispatchCoreActions();
          }
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.bioschemasService.buildBioschemasJSON(this.renderer);
        this.complexMetaTagService.buildMetaTags();
        this.launchSurveyForComplexesPage(this.complexId() ?? '', this.isDesktop());
      });
  }

  private dispatchCoreActions() {
    this.globalStore.dispatch(ComplexActions.getComplexData());
    this.globalStore.dispatch(ComplexActions.getLigandsForComplexes());
    this.globalStore.dispatch(ComplexActions.getComplexInteractions());
    this.globalStore.dispatch(ComplexActions.getPISAAssembliesParams());
  }

  public selectTab(event: MatTabChangeEvent) {
    const routeTabs = complexRouteTabs;
    const tabName = routeTabs[event.index].id;
    this.complexUtilService.updateCurrentComplexTabName(tabName ?? 'summary');

    this.gAS.logPageEvents('cp_tab_switch', {
      tab: tabName,
    });

    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: 'merge',
    });

    this.scrollService.handleScrollPosition(this.tabGroup, event.index);
  }

  // private showNotification() {
  //   const href = document.location.href;
  //   if (href.includes('dev.') || href.includes('wwwdev.')) {
  //     this.showNotificationBanner.set(true);
  //   } else {
  //     this.showNotificationBanner.set(false);
  //   }
  // }

  // public openFeedbackForm(): void {
  //   window.open('https://docs.google.com/forms/d/e/1FAIpQLSeSy9zqhqm5n46GtjKizNKOipoRgmj9juweopKUHY2lQc-dyQ/viewform', '_blank');
  // }

  public openHelpModal(): void {
    this.tutorialTourService.showHelpGuideModal.set(true);
  }

  public closeHelpGuideModal(): void {
    this.tutorialTourService.showHelpGuideModal.set(false);
  }

  private launchSurveyForComplexesPage(complexId: string, isDesktop: boolean) {
    const surveyConfig: SurveyConfig = {
      identifier: 'complexespage_satisfaction_v1',
      title: 'Help us improve the PDBe Complexes Pages',
      expiresAt: '01/03/2026',
      webhookUrl: environment.epSurveyWebhookUrl1,

      questions: [
        { id: 'q1', type: 'rating', title: 'How would you rate this page?', skip: false },
        { id: 'q2', type: 'text', title: 'What is the reason for your score?', skip: true },
      ],

      extraParams: {
        entry: `complex id: ${complexId}`,
        mode: isDesktop ? 'desktop' : 'mobile',
      },

      feedbackUrl: 'https://www.ebi.ac.uk/about/contact/support/pdbe',
    };

    this.surveyService.init(surveyConfig);
  }
}
