import { AfterViewInit, Component, computed, DestroyRef, ElementRef, HostListener, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { SearchAppComponent } from '@pdbc/search-app';

import { EMPTY, filter, map, mergeMap, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { GoogleAnalyticsService, MaterialModule, ScrollPositionService } from '@pdbc/core';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { mobileHeaderConfig, pdbeLogoConfig, pdbeSearchConfig } from '../../entry-constant';
import { MainDataProcessingFacade } from './data-processing.facade';
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
    VisualisationInteractivityDirective,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly util = inject(EntryUtilService);
  public readonly scrollService = inject(ScrollPositionService);
  private readonly entryBioschemasService = inject(EntryBioschemasService);
  private readonly renderer = inject(Renderer2);
  public readonly gAS = inject(GoogleAnalyticsService);

  public hasLoadedAssemblies = computed(() => this.compCommunication.hasProcessedAssemblies());
  public hasAssemblies = computed(() => {
    if (!this.compCommunication.hasProcessedAssemblies()) return false;
    return this.compCommunication.processedAssemblies.length > 0;
  });
  public hasLoadedDomains = computed(() => this.compCommunication.hasProcessedDomains());
  public hasDomains = computed(() => {
    if (!this.compCommunication.hasProcessedDomains()) return false;
    return this.compCommunication.processedDomainsAsList.length > 0;
  });
  public hasLoadedMacromolecules = computed(() => this.compCommunication.hasProcessedMacromolecules());
  public hasMacromolecules = computed(() => {
    if (!this.compCommunication.hasProcessedMacromolecules()) return false;
    return this.compCommunication.processedMacromolecules.length > 0;
  });
  public hasLoadedLigands = computed(() => this.compCommunication.hasProcessedDomains());
  public hasLigands = computed(() => {
    if (!this.compCommunication.hasProcessedLigands()) return false;
    return this.compCommunication.processedLigandsAndModifications.length > 0;
  });
  public annotationsSignal = toSignal(this.dataProcessing.llmAnnotations);
  public hasLoadedAnnotations = computed(() => this.annotationsSignal() !== undefined);
  public hasAnnotations = computed(() => {
    const annotations = this.annotationsSignal();
    return annotations && annotations.filter((a: any) => a.primaryCitation === 'Y').length > 0;
  });

  private readonly router = inject(Router);

  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly mobileHeaderConfig = mobileHeaderConfig;

  public entryPageView = this.util.entryPageView;
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);

  private readonly entryId = signal<string>('');
  public isDesktop = signal(false);

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

  public preferredAssemblyData = computed(() => this.compCommunication.preferredAssemblyData());

  constructor() {
    this.checkWindowWidth();
    this.route.queryParams.subscribe((params) => {
      // Check for screen width <= 768px
      if (window.innerWidth <= 768) return;
      const routeTabs = this.dataProcessing.routeTabs;
      const tabName = params['activeTab'] ?? 'summary';
      this.compCommunication.currentTabName.set(tabName);
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab.set(tabIndex);
      this.gAS.logEntryPageEvents('ep_desktop_tab_access', {
        tab: tabName,
      });
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
            this.dataProcessing.processInteractiveTablesData(this.entryId());
            this.dataProcessing.getPageData();
            this.entryBioschemasService.buildBioschemasJSON(this.renderer);
          } else {
            this.util.setEntryStatus('OTHER');
          }
          return EMPTY;
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
    const routeTabs = this.dataProcessing.routeTabs;
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
