import { Component, computed, DestroyRef, HostListener, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { SearchAppComponent } from '@pdbc/search-app';

import { combineLatest, EMPTY, filter, map, mergeMap, switchMap, take, tap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { GoogleAnalyticsService, MaterialModule, ScrollPositionService } from '@pdbc/core';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { ENTRY_PAGES_LINKS, mobileHeaderConfig, pdbeLogoConfig, pdbeSearchConfig } from '../../entry-constant';
import { EntryStatus, StatusCode } from '../../data-models/status.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryMainAlternativeComponent } from '../../components/entry-main-alternative/entry-main-alternative.component';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { SummaryTabComponent } from '../../components/summary-tab/summary-tab.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { ExperimentsValidationComponent } from '../../components/model-quality-tab/experiments-validation.component';
import { EntryPageHeaderComponent } from '../../components/entry-page-header/entry-page-header.component';
import { environment } from '../../../../../environments/environment';
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
import { ErrorPageComponent } from '../../../../error-page/error-page.component';
import { Meta, Title } from '@angular/platform-browser';
import { ApplicationAPIDispatcher } from '../../services/application-api-dispacher.service';
import { SpeedTestService } from 'ng-speed-test';

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
    NotificationComponent,
    ErrorPageComponent,
    VisualisationInteractivityDirective,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly util = inject(EntryUtilService);
  public readonly scrollService = inject(ScrollPositionService);
  private readonly entryBioschemasService = inject(EntryBioschemasService);
  private readonly renderer = inject(Renderer2);
  public readonly gAS = inject(GoogleAnalyticsService);
  private readonly speedTest = inject(SpeedTestService);

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

  public entryPageView = this.util.entryPageView;
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);
  public entryStatusObs$ = toObservable(this.entryStatus);

  private readonly entryId = signal<string>('');
  public isDesktop = signal(false);
  public isDesktopObs$ = toObservable(this.isDesktop);

  public currentTabNameObs$ = toObservable(this.compCommunication.currentTabName);

  @ViewChild('tabs') tabGroup!: MatTabGroup;

  public selectedTab = signal<number>(0);

  public showNotificationBanner = signal<boolean>(false);
  public molstarHeight = '480px';

  public readonly apiSearchConfig = {
    additionalParams: 'rows=20000&json.nl=map&wt=json',
    fields: 'value,num_pdb_entries,var_name',
    group: 'group=true&group.field=category',
    groupLimit: '25',
    redirectOnClick: true,
    resultBoxAlign: 'left',
    searchUrl: 'https://www.ebi.ac.uk/pdbe/search/pdb-autocomplete/select',
    sort: 'category+asc,num_pdb_entries+desc',
    view: 'entries',
    env: environment.production ? '' : 'dev',
  };

  public readonly routeTabs = [
    { label: 'Summary', id: 'summary' },
    { label: 'Model quality', id: 'model-quality' },
    { label: 'Assemblies', id: 'assemblies' },
    { label: 'Macromolecules', id: 'macromolecules' },
    { label: 'Ligands and Environments', id: 'ligands' },
    { label: 'Domains', id: 'domains' },
    { label: 'Text Annotation (LLM)', id: 'llm' },
    { label: 'Citations', id: 'citations' },
  ];

  constructor() {
    this.checkWindowWidth();
    this.route.queryParams.subscribe((params) => {
      // Check for screen width <= 768px
      if (window.innerWidth <= 768) return;
      const routeTabs = this.routeTabs;
      const tabName = params['activeTab'] ?? 'summary';
      this.compCommunication.currentTabName.set(tabName);
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
      this.gAS.logEntryPageEvents('ep_desktop_tab_access', {
        tab: tabName,
      });
    });
    this.testNetworkSpeed();
  }

  private testNetworkSpeed() {
    const customSettings = {
      iterations: 1, // Run 1 test for better accuracy
      retryDelay: 500, // Wait 1 second between retries
      file: {
        // path: 'https://www.ebi.ac.uk/pdbe/entry-files/download/10mh.bcif.gz',
        // size: 103402,        // 106KB in bytes
        // path: 'https://raw.githubusercontent.com/jrquick17/ng-speed-test/02c59e4afde67c35a5ba74014b91d44b33c0b3fe/demo/src/assets/500kb.jpg',
        // size: 500000,        // 106KB in bytes
        path: 'https://www.ebi.ac.uk/pdbe/entry-files/download/3d12.bcif',
        size: 401069,
        shouldBustCache: true, // Prevent browser caching
      },
    };

    this.speedTest.isOnline().subscribe((isOnline) => {
      if (!isOnline) {
        console.log('No internet connection');
      }
    });

    this.speedTest.getMbps(customSettings).subscribe({
      next: (speed) => {
        // speed is in Mbps
        // console.log('Detected speed (Mbps):', speed);
        if (speed < 7.5) this.compCommunication.slowNetwork$.next(true);
        else this.compCommunication.slowNetwork$.next(false);
      },
      error: (err) => {
        console.error('Speed test failed', err), console.log('Setting default as slow network mode');
        this.compCommunication.slowNetwork$.next(true);
      },
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowWidth();
  }

  private checkWindowWidth(): void {
    this.isDesktop.set(window.innerWidth > 768);
  }

  ngOnInit(): void {
    if (environment.production === false) {
      Clarity.init(environment.clarityProjectId);
    }

    this.showNotification();
    this.checkWindowWidth();
    // else {
    // Clarity.init('yourProjectId'); // Replace with production ID when it's time
    // }
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase().replace('pdb_0000', '');
          this.entryId.set(entryId);
          this.globalStore.dispatch(EntryActions.setCurrentEntryId({ entryId }));
          this.globalStore.dispatch(EntryActions.getEntryStatus());
          return this.globalStore.select(EntrySelectors.entryStatus).pipe(
            filter(Boolean),
            tap((status: EntryStatus) => this.entryStatus.set({ ...status, entryId })),
            map((response: EntryStatus) => response.status_code)
          );
        }),
        mergeMap(async (status: StatusCode) => {
          if (status === 'REL') {
            this.util.setEntryStatus('SUCCESS');
            this.buildMetaTags();

            // used in multiple tabs
            this.globalStore.dispatch(EntryActions.getSummaryData());
            // used in citations-tab, llm-tab, summary-tab, mb-citation-tab, mb-overview-tab, entry.bioschemas
            this.globalStore.dispatch(EntryActions.getPrimaryPublication());
            this.entryBioschemasService.buildBioschemasJSON(this.renderer);
          } else if (status !== 'INITIAL') {
            this.util.setEntryStatus('OTHER');
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    // detects current tab, if entry is released and we are in desktop mode
    combineLatest([this.entryStatusObs$, this.isDesktopObs$, this.currentTabNameObs$])
      .pipe(
        map(([entryStatus, isDesktop, tabName]) => {
          if (entryStatus === undefined || isDesktop === undefined || tabName === undefined) return;
          if (entryStatus.status_code === 'REL' && isDesktop) {
            // if released and desktop mode dispatch listeners for data status of different tabs
            this.applicationApiDispatcher.dispatchForTab(tabName);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({});
  }

  private isTitleAndMetaProcessed = false;

  private buildMetaTags() {
    this.globalStore
      .select(EntrySelectors.summaryData)
      .pipe(
        filter((summaryData) => {
          return summaryData !== undefined && Object.keys(summaryData).length > 0;
        }),
        take(1),
        map((summaryData) => {
          if (summaryData && this.isTitleAndMetaProcessed === false) {
            const titleAndDescription = `PDB ${this.entryId()}: ${summaryData.entryTitle} | Protein Data Bank in Europe - PDBe`;
            this.titleService.setTitle(titleAndDescription);
            this.metaService.addTag({ name: 'description', content: titleAndDescription });
            this.metaService.addTag({ name: 'author', content: 'Protein Data Bank in Europe - PDBe' });
            this.metaService.addTag({ name: 'email', content: 'pdbegroup@gmail.com' });
            this.metaService.addTag({ name: 'Distribution', content: 'Global' });
            this.metaService.addTag({ name: 'Rating', content: 'General' });

            this.metaService.addTag({ property: 'og:title', content: `PDB: ${this.entryId()} | Protein Data Bank in Europe - PDBe` });
            this.metaService.addTag({ property: 'og:description', content: `Entry title: "${summaryData.entryTitle}"` });
            this.metaService.addTag({ property: 'og:url', content: `${environment.pdbeBaseUrl}/entry/pdb/1trn` });
            this.metaService.addTag({
              property: 'og:image',
              content: `https://www.ebi.ac.uk/pdbe/static/entry/${this.entryId()}_deposited_chain_front_image-800x800.png`,
            });
            this.metaService.addTag({ property: 'og:image:alt', content: `PDBe ${this.entryId()} Structure` });
            this.metaService.addTag({ property: 'og:type', content: 'website' });
            this.metaService.addTag({ property: 'og:locale', content: 'en_GB' });
            this.metaService.addTag({ property: 'og:site_name', content: 'PDBe Entry Pages' });

            this.metaService.addTag({ name: 'twitter:card', content: 'summary_large_image' });
            this.metaService.addTag({ name: 'twitter:title', content: titleAndDescription });
            this.metaService.addTag({ name: 'twitter:description', content: titleAndDescription });
            this.metaService.addTag({ name: 'twitter:url', content: `${environment.pdbeBaseUrl}/entry/pdb/1trn` });
            this.metaService.addTag({
              name: 'twitter:image',
              content: `https://www.ebi.ac.uk/pdbe/static/entry/${this.entryId()}_deposited_chain_front_image-800x800.png`,
            });
            this.metaService.addTag({ name: 'twitter:image:alt', content: `PDBe ${this.entryId()} Structure` });
            this.metaService.addTag({ name: 'twitter:site', content: `PDBeurope` });

            for (const linkObj of ENTRY_PAGES_LINKS) {
              const linkEl = this.renderer.createElement('link');
              this.renderer.setAttribute(linkEl, 'rel', linkObj.rel);
              this.renderer.setAttribute(linkEl, 'type', linkObj.type);
              this.renderer.setAttribute(linkEl, 'href', linkObj.href);
              if (linkObj.sizes) this.renderer.setAttribute(linkEl, 'sizes', linkObj.sizes!);
              if (linkObj.title) this.renderer.setAttribute(linkEl, 'title', linkObj.title!);
              this.renderer.appendChild(document.head, linkEl);
            }
            this.isTitleAndMetaProcessed = true;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private showNotification() {
    const href = document.location.href;
    if (href.includes('dev.') || href.includes('wwwdev.')) {
      this.showNotificationBanner.set(true);
    } else {
      this.showNotificationBanner.set(false);
    }
  }

  async selectTab(event: MatTabChangeEvent) {
    const routeTabs = this.routeTabs;
    const tabName = routeTabs[event.index].id;
    this.scrollService.handleScrollPosition(this.tabGroup, event.index);
    this.compCommunication.currentTabName.set(tabName);
    this.gAS.logEntryPageEvents('ep_desktop_tab_switch', {
      tab: tabName,
    });

    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: 'merge',
    });
    Clarity.event('tab-change');
    Clarity.event(`tab-access-${tabName}`);
  }
}
