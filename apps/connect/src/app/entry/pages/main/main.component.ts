import { Component, computed, DestroyRef, HostListener, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { SearchAppComponent } from '@pdbc/search-app';

import { combineLatest, map } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ClarityConsentService, DataPrivacyBannerComponent, GoogleAnalyticsService, MaterialModule, ScrollPositionService, SurveyPopupComponent } from '@pdbc/core';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { mobileHeaderConfig, pdbeLogoConfig, pdbeSearchConfig, routeTabs, tourIds } from '../../entry-constant';
import { EntryStatus } from '../../data-models/status.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryMainAlternativeComponent } from '../../components/entry-main-alternative/entry-main-alternative.component';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { SummaryTabComponent } from '../../components/summary-tab/summary-tab.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { ExperimentsValidationComponent } from '../../components/model-quality-tab/experiments-validation.component';
import { EntryPageHeaderComponent } from '../../components/entry-page-header/entry-page-header.component';
import { environment } from '../../../../environments/environment';
import { MobileMainComponent } from '../mobile/mobile-main/mobile-main.component';
import { MobileHeaderComponent } from '@pdbc/mobile-header';
import { AssembliesTabComponent } from '../../components/assemblies-tab/assemblies-tab.component';
import { MacromoleculesTabComponent } from '../../components/macromolecules-tab/macromolecules-tab.component';
import { LigandsTabComponent } from '../../components/ligands-tab/ligands-tab.component';
import { DomainsTabComponent } from '../../components/domains-tab/domains-tab.component';
import Clarity from '@microsoft/clarity';
import { NotificationComponent } from '@pdbc/notification';
import { EntryUtilService } from '../../services/entry-util.service';
import { LLMTabComponent } from '../../components/llm-tab/llm-tab.component';
import { VisualisationInteractivityDirective } from '../../directives/visualisation-interactivity.directive';
import { EntryBioschemasService } from '../../services/entry.bioschemas';
import { ErrorPageComponent } from '../../../error-page/error-page.component';
import { ApplicationAPIDispatcher } from '../../services/application-api-dispacher.service';

import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { MetaTagService } from '../../services/meta-tag.service';
import { EntryMainFacade } from './entry-main.facade';
import { HelpIconForMolstarService } from '@pdbe-lib/molstar-for-apps';
import { OtherResourcesTabComponent } from '../../components/other-resources-tab/other-resources-tab.component';

// Some interesting entries:
// 4aqd carbs
// 6hr1 chimera protein from 4 different organisms (preferred assembly does not have all chains)
// 7v08 large em
// 3irj only carb
// 3l3t 4 assemblies
// 1trn interesting varying domain definitions, modifications
// 4v99 large chains
@Component({
  selector: 'pdbc-main',
  standalone: true,
  imports: [
    CommonModule,
    PdbeHeaderLogoMenuComponent,
    // PdbeHeaderSearchComponent,
    CitationsTabComponent,
    NgxSkeletonLoaderModule,
    EntryMainAlternativeComponent,
    MaterialModule,
    SummaryTabComponent,
    ExperimentsValidationComponent,
    EntryPageHeaderComponent,
    SearchAppComponent,
    MobileMainComponent,
    MobileHeaderComponent,
    AssembliesTabComponent,
    MacromoleculesTabComponent,
    LLMTabComponent,
    LigandsTabComponent,
    DomainsTabComponent,
    OtherResourcesTabComponent,
    NotificationComponent,
    ErrorPageComponent,
    VisualisationInteractivityDirective,
    DataPrivacyBannerComponent,
    SurveyPopupComponent,
    RouterModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);
  private readonly route = inject(ActivatedRoute);
  private readonly metaTagService = inject(MetaTagService);
  private readonly facade = inject(EntryMainFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly util = inject(EntryUtilService);
  public readonly scrollService = inject(ScrollPositionService);
  private readonly entryBioschemasService = inject(EntryBioschemasService);
  private readonly renderer = inject(Renderer2);
  public readonly gAS = inject(GoogleAnalyticsService);
  public readonly tutorialTourService = inject(EntryPageTutorialTourService);
  public readonly helpIconForMolstarService = inject(HelpIconForMolstarService);
  public readonly clarityConsentService = inject(ClarityConsentService);

  private procAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));
  private procMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  private procLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private procDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomains));
  private procLLMMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromoleculesForLLM));
  private processedDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomainsWithMacromols));
  public llmAnnotations = toSignal(this.globalStore.select(EntrySelectors.llmAnnotations));

  public hasLoadedAssemblies = computed(() => this.procAssemblies() !== undefined);
  public hasAssemblies = computed(() => {
    const rows = this.procAssemblies();
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  public hasLoadedDomains = computed(() => this.processedDomains() !== undefined);
  public hasDomains = computed(() => {
    const rows = this.procDomains();
    const procWithMacro = this.processedDomains();
    if (procWithMacro === undefined) return false;
    if (rows === undefined) return false;
    return rows.length > 0;
  });
  public hasLoadedMacromolecules = computed(() => this.procMacromolecules() !== undefined);
  public hasMacromolecules = computed(() => {
    const rows = this.procMacromolecules();
    if (rows === undefined) return false;
    return rows.length > 0;
  });
  public hasLoadedLigands = computed(() => this.procLigands() !== undefined);
  public hasLigands = computed(() => {
    const rows = this.procLigands();
    if (rows === undefined) return false;
    return rows.length > 0;
  });
  public hasLoadedAnnotations = computed(() => this.procLLMMacromolecules() !== undefined);
  public hasAnnotations = computed(() => {
    const rows = this.procLLMMacromolecules();
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  private readonly router = inject(Router);

  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly mobileHeaderConfig = mobileHeaderConfig;

  public pageView = this.util.pageView;
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);
  public entryStatusObs$ = toObservable(this.entryStatus);

  private readonly entryId = signal<string>('');

  public currentTabNameObs$ = toObservable(this.compCommunication.currentTabName);

  @ViewChild('tabs') tabGroup!: MatTabGroup;

  public selectedTabIndex = this.compCommunication.selectedTabIndex;

  public showNotificationBanner = this.facade.showNotificationBanner;
  public isDesktop = this.facade.isDesktop;
  public isDesktopObs$ = toObservable(this.isDesktop);
  public molstarHeight = '480px';

  public readonly apiSearchConfig = this.facade.apiSearchConfig;

  constructor() {
    this.facade.checkWindowWidth();
    this.route.queryParams.subscribe((params) => {
      // Check for screen width <= 768px
      if (window.innerWidth <= 768) return;
      let tabName = params['activeTab'] ?? 'summary';
      if (tabName === 'assemblies') tabName = 'complexes';
      let tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      if (tabIndex === -1) {
        tabIndex = 0;
        tabName = 'summary';
      }
      this.compCommunication.currentTabName.set(tabName);
      this.compCommunication.updateSelectedTabIndex(tabIndex);
      this.gAS.logPageEvents('ep_desktop_tab_access', {
        tab: tabName,
      });
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.facade.checkWindowWidth();
  }

  ngOnInit(): void {
    /** Setting styles dynamically for mac scrollbar compatibility */
    document.documentElement.style.overflowX = 'hidden'; // <html>
    document.body.style.overflowX = 'hidden'; // <body>
    document.body.style.width = '100%';

    Clarity.init(environment.clarityProjectIdForEntryPages);
    this.clarityConsentService.init(environment.clarityProjectIdForEntryPages);

    this.facade.showNotification();
    this.facade.checkWindowWidth();

    const resolved = this.route.snapshot.data['initialData'];

    const entryId = resolved.entryId;
    const status = resolved.status;
    const summary = resolved.summaryData;
    const primaryPublication = resolved.primaryPublication;

    this.entryId.set(entryId);
    this.entryStatus.set({ ...status, entryId });

    if (status.status_code === 'REL') {
      this.util.setPageView('SUCCESS');
      this.metaTagService.buildMetaTagsFromSummaryData(this.renderer, summary);
      this.entryBioschemasService.setUpRenderedForBioschemas(this.renderer);

      const isWebGlEnabled = this.facade.checkWebglEnabled();
      if (isWebGlEnabled) this.facade.testNetworkSpeed();
      this.facade.testProcessingPower();
      this.facade.launchSurveyForEntryPage(this.entryId(), this.isDesktop());
    } else if (status.status_code !== 'INITIAL') {
      this.util.setPageView('OTHER');
    } else {
      this.util.setPageView('LOADING');
    }

    // detects current tab, if entry is released and we are in desktop mode
    combineLatest([this.entryStatusObs$, this.isDesktopObs$, this.currentTabNameObs$])
      .pipe(
        map(([entryStatus, isDesktop, tabName]) => {
          if (entryStatus === undefined || isDesktop === undefined || tabName === undefined) return;
          if (tabName === 'assemblies') tabName = 'complexes';
          if (entryStatus.status_code === 'REL' && isDesktop) {
            // if released and desktop mode dispatch listeners for data status of different tabs
            this.applicationApiDispatcher.dispatchForTab(tabName);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({});
  }

  async selectTab(event: MatTabChangeEvent) {
    const tabName = routeTabs[event.index].id;
    this.scrollService.handleScrollPosition(this.tabGroup, event.index);
    this.compCommunication.currentTabName.set(tabName);
    this.gAS.logPageEvents('ep_desktop_tab_switch', {
      tab: tabName,
    });

    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: '',
    });
    if ((window as any).clarity) {
      Clarity.event('tab-change');
      Clarity.event(`tab-access-${tabName}`);
    }
  }

  public startTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.summaryTabTourSteps);
  }

  public openHelpModal(): void {
    this.tutorialTourService.showHelpGuideModal.set(true);
  }

  public closeHelpGuideModal(): void {
    this.tutorialTourService.showHelpGuideModal.set(false);
  }
}
