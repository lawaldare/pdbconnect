import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
// import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { SearchAppComponent } from '@pdbc/search-app';

import { EMPTY, filter, map, mergeMap, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '@pdbc/core';
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
import { MolstarExtendedForEntryPages } from '../../helpers/molstar/molstar-extended-for-entry-pgs';
import { InteractiveTablesComponent } from '../../components/shared/interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../../components/shared/details-dashboard/details-dashboard.component';
import { ExperimentsValidationComponent } from '../../components/model-quality-tab/experiments-validation.component';
import { EntryPageHeaderComponent } from '../../components/entry-page-header/entry-page-header.component';
import { environment } from '../../../../../environments/environment';
import { MobileMainComponent } from '../mobile/mobile-main/mobile-main.component';
import { MobileHeaderComponent } from '@pdbc/mobile-header';

export type TableNames = 'Assemblies' | 'Macromolecules' | 'Ligands' | 'Domains';

// Some interesting entries:
// 4aqd carbs
// 6hr1 chimera protein from 4 different organisms (preferred assembly does not have all chains)
// 7v08 large em
// 3irj only carb
// 3l3t 4 assemblies
// 1trn interesting varying domain definitions, modifications
// 4v99 large chains

/**
 * TODO:
 * - Add status pages
 * - Make <SCRIPT> tags loading Dynamic
 */
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
    InteractiveTablesComponent,
    DetailsDashboardComponent,
    EntryPageHeaderComponent,
    SearchAppComponent,
    MobileMainComponent,
    MobileHeaderComponent,
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
  private readonly molstarVisualisation = inject(MolstarExtendedForEntryPages);

  private readonly router = inject(Router);

  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly mobileHeaderConfig = mobileHeaderConfig;

  public statusCode = signal<StatusCode>('INITIAL');
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);

  public readonly molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded());
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());
  public readonly isSidebarCollapsed = computed(() => !this.compCommunication.isSidebarCollapsed());

  public readonly commonTabs = computed(() => {
    const isTabDataGenerated = this.compCommunication.isTabDataGenerated();
    const tabs = [
      { label: 'Assemblies', id: 'Assemblies' },
      { label: 'Macromolecules', id: 'Macromolecules' },
      { label: 'Ligands and Environments', id: 'Ligands' },
      { label: 'Domains', id: 'Domains' },
    ];
    const mappedCommonTabs = [];
    for (const tab of tabs) {
      const dataExists = isTabDataGenerated ? this.compCommunication.getTabData(tab.id).tableRows().length > 0 : false;
      const hasData = isTabDataGenerated && dataExists;
      mappedCommonTabs.push({
        name: tab.label,
        hasData,
        id: tab.id,
      });
    }
    return mappedCommonTabs;
  });
  private readonly entryId = signal<string>('');

  public currentTab = this.compCommunication.currentTab;
  public tabSwitchOrigin = this.compCommunication.tabSwitchOrigin;
  public previousTab = 'undefined';

  public doesTabHasData = signal<boolean>(true);

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;
  @ViewChild('tabs') tabGroup!: MatTabGroup;

  selectedTab = 0;

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

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const routeTabs = this.dataProcessing.routeTabs;
      const tabName = params['activeTab'];
      const tabIndex = routeTabs.findIndex((tab) => tab.id === tabName);
      this.selectedTab = tabIndex;
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
          this.entryId.set(entryId);
          this.globalStore.dispatch(EntryActions.setCurrentEntryId({ entryId }));
          this.globalStore.dispatch(EntryActions.getEntryStatus());
          return this.globalStore.select(EntrySelectors.entryStatus).pipe(
            filter(Boolean),
            tap((status: EntryStatus) => this.entryStatus.set({ ...status, entryId })),
            map((response: EntryStatus) => response.status_code)
          );
        }),
        mergeMap((statusCode: StatusCode) => {
          this.statusCode.set(statusCode);
          if (statusCode === 'REL') {
            setTimeout(() => {
              console.log('molstar render initial');
              this.molstarVisualisation.renderMolstarInitial(this.entryId() ?? '', this.molstarViewer.nativeElement);
            });
            this.dataProcessing.processInteractiveTablesData();
            this.dataProcessing.getPageData();
          } else {
            this.statusCode.set(statusCode);
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  selectTab(event: MatTabChangeEvent) {
    const routeTabs = this.dataProcessing.routeTabs;
    const tabName = routeTabs[event.index].id;
    this.previousTab = `${tabName}`;
    this.tabSwitchOrigin.set('main');
    this.currentTab.set(tabName);
    setTimeout(() => {
      this.doesTabHasData.set(this.compCommunication.getTabData(tabName)?.tableRows()?.length > 0);
    }, 2000);
    this.router.navigate([], {
      queryParams: { activeTab: tabName },
      queryParamsHandling: 'merge',
    });
  }
}
