import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { EntryApiService } from '../../services/entry-api.service';
import { catchError, combineLatest, EMPTY, filter, forkJoin, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UniProtMapping } from '../../data-models/uniprot-mapping.model';
import { BestStructureMapping } from '../../data-models/uniport-best-structures.model';
import { BestStructureDict } from '../../data-models/uniprot-best-structures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickOutsideDirective } from '@pdbc/core';
import { MainInformationAreaComponent } from '../../components/main-information-area/main-information-area.component';
import { OverviewMolstarComponent } from '../../components/overview-molstar/overview-molstar.component';
import { InteractiveTablesComponent } from '../../components/interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../../components/details-dashboard/details-dashboard.component';
import { ExperimentsValidationTabComponent } from '../../components/experiments-validation-tab/experiments-validation-tab.component';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { pdbeLogoConfig, pdbeSearchConfig, allTabs, tableTabs, COMPONENT_DEPENDENCIES, INITIAL_API_STATUS } from '../../entry-constant';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { EntryDropdownComponent } from '../../components/entry-dropdown/entry-dropdown.component';
import { TabConfig } from '../../components/overview-molstar/state-management.service';
import { MainDataProcessingFacade } from './data-processing.facade';
import { ProteinSummaryStats } from '../../data-models/protein-summary-stats.model';

import { EntryStatus, StatusCode } from '../../data-models/status.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryMainAlternativeComponent } from '../../components/entry-main-alternative/entry-main-alternative.component';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';

export type TableNames = 'Assemblies' | 'Macromolecules' | 'Ligands' | 'Domains';

// Some interesting entries:
// 4aqd carbs
// 6hr1 chimera protein from 4 different organisms (preferred assembly does not have all chains)
// 7v08 large em
// 3irj only carb
// 3l3t 4 assemblies
// 1trn interesting varying domain definitions, modifications

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
    PdbeHeaderSearchComponent,
    ClickOutsideDirective,
    MainInformationAreaComponent,
    OverviewMolstarComponent,
    InteractiveTablesComponent,
    DetailsDashboardComponent,
    ExperimentsValidationTabComponent,
    CitationsTabComponent,
    EntryDropdownComponent,
    NgxSkeletonLoaderModule,
    EntryMainAlternativeComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements AfterViewInit, OnInit {
  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;
  public readonly allTabs = allTabs;
  public readonly tableTabs = tableTabs;

  public entryId = signal('1trn'); //'7v08', '3d12', '5tj5', '4zqo'
  public showDownloadOptions = signal(false);
  public showViewOptions = signal(false);

  private route = inject(ActivatedRoute);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly entryAPIService = inject(EntryApiService);
  private _snackBar = inject(MatSnackBar);
  private molstarVisualisation = inject(MolstarVisualisationsForTabs);
  public dataProcessing = inject(MainDataProcessingFacade);

  public currentTab = this.compCommunication.currentTab;
  public tabSwitchOrigin = this.compCommunication.tabSwitchOrigin;
  public previousTab = 'undefined';

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

  // signal that holds whether an API call is pending or done for all needed APIs
  public apiLoadedStatus = signal(INITIAL_API_STATUS);

  // signals for residue listing information provided by Molstar inside OverviewMolstar component
  public molstarResidueInfoLoaded = this.compCommunication.molstarResidueInfoLoaded; // boolean
  public molstarResidueInfo = this.compCommunication.molstarResidueInfo; // residue listing

  // signal that is computed as API calls go from pending to done
  // for each component it holds the necessary API calls that need status done
  public componentLoadedStatus = computed(() => {
    const apiStatus = this.apiLoadedStatus();
    const status: Record<string, boolean> = {};

    // for each component name and the list of API dependencies in COMPONENT_DEPENDENCIES dictionary
    Object.entries(COMPONENT_DEPENDENCIES).forEach(([component, dependencies]) => {
      // component load status is updated to true if every needed API dependency has status 'done'
      status[component] = dependencies.every((dep) => apiStatus[dep] === 'done');
    });

    return status;
  });

  // Use an effect to trigger side effects when componentLoadedStatus status for detailsDashboard changes to true
  // this happens when all API endpoints required information is loaded
  _loadRowsEffect = effect(
    () => {
      if (this.compCommunication.isTabDataGenerated() === false && this.molstarResidueInfoLoaded()) {
        this.dataProcessing.setTabName('Assemblies');
        this.processInteractiveTablesData();
      }
    },
    { allowSignalWrites: true }
  );

  // signal that computes whether interactive table tabs have any rows (data) to display
  public tabsInfo = computed(() => {
    const isTabDataGenerated = this.compCommunication.isTabDataGenerated();
    const tabsConfig: TabConfig[] = [];
    const tabsStatus: { [key: string]: string } = {};
    const tableTabsData = allTabs.filter((tab) => tableTabs.indexOf(tab.name) > -1);
    for (const tab of tableTabsData) {
      // an interactive table has data if the data has been loaded and the number of table rows is bigger than 0
      tabsStatus[tab.name] = isTabDataGenerated ? 'loaded' : 'loading';
      const dataExists = isTabDataGenerated ? this.compCommunication.getTabData(tab.name).tableRows().length > 0 : false;
      if (isTabDataGenerated) tabsStatus[tab.name] = dataExists ? 'has-data' : 'empty-data';

      const hasData = isTabDataGenerated && dataExists;
      tabsConfig.push({
        id: tab.name,
        displayName: tab.display,
        width: '229px',
        tagContent: hasData ? '' : 'N/A',
        tagClass: hasData ? 'no-chip' : 'na',
      });
    }
    tabsConfig.push({
      id: 'Experiments',
      displayName: 'Experiments and Validation',
      width: '229px',
      tagContent: '',
      tagClass: 'no-chip',
    });
    tabsConfig.push({
      id: 'Citations',
      displayName: 'Citations',
      width: '96px',
      tagContent: '',
      tagClass: 'no-chip',
    });
    return {
      config: tabsConfig,
      status: tabsStatus,
    };
  });

  public statusCode = signal<StatusCode>('INITIAL');
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly resolutionValues = toSignal(this.globalStore.select(EntrySelectors.resolutionValues));
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly downloadOptions = toSignal(this.globalStore.select(EntrySelectors.downloadOptions));
  public readonly viewOptions = toSignal(this.globalStore.select(EntrySelectors.viewOptions));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  ngOnInit(): void {
    // if (this.compCommunication.isTabDataGenerated() === false && this.molstarResidueInfoLoaded()) {
    //   this.dataProcessing.setTabName('Assemblies');
    //   this.processInteractiveTablesData();
    // }

    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
          this.globalStore.dispatch(EntryActions.setCurrentEntryId({ entryId }));
          this.globalStore.dispatch(EntryActions.getEntryStatus());
          this.entryId.set(entryId);
          return this.globalStore.select(EntrySelectors.entryStatus).pipe(
            filter(Boolean),
            tap((status: EntryStatus) => this.entryStatus.set({ ...status, entryId })),
            map((response: EntryStatus) => response.status_code)
          );
          // return of({});
        }),
        mergeMap((statusCode: StatusCode) => {
          this.statusCode.set(statusCode);
          if (statusCode === 'REL') {
            setTimeout(() => {
              this.molstarVisualisation.renderMolstarInitial(this.entryId(), this.molstarViewer.nativeElement);
            });
            this.getPageData();
            return EMPTY;
          } else {
            this.statusCode.set(statusCode);
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private processInteractiveTablesData(): void {
    this.dataProcessing.processInteractiveTablesData();
  }

  private getPageData(): void {
    this.globalStore.dispatch(EntryActions.getSummaryData());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getExperiment());
    this.globalStore.dispatch(EntryActions.getUniprotMapping());
    this.globalStore.dispatch(EntryActions.getInterproMapping());
    this.globalStore.dispatch(EntryActions.getPfamMapping());
    this.globalStore.dispatch(EntryActions.getDownloadOptions());
    this.globalStore.dispatch(EntryActions.getSummaryQualityScores());
    this.globalStore.dispatch(EntryActions.getCathMapping());
    this.globalStore.dispatch(EntryActions.getScop175Mapping());
    this.globalStore.dispatch(EntryActions.getModifications());
    this.globalStore.dispatch(EntryActions.getValidationKeyStats());
    this.globalStore.dispatch(EntryActions.getValidationXrayRefine());
    this.globalStore.dispatch(EntryActions.getPrimaryPublication());
    this.globalStore.dispatch(EntryActions.getArticleCitingPDBEntry());
    this.globalStore.dispatch(EntryActions.getPreferredAssembly());
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getCarbohydrates());
    this.globalStore.dispatch(EntryActions.getExperimentBMRBRawData());
    this.globalStore.dispatch(EntryActions.getPDBRedoQualityScores());
    this.globalStore.dispatch(EntryActions.getExperimentSBGridRawData());
    this.globalStore.dispatch(EntryActions.getExperimentIRRMCRawData());
    this.globalStore.dispatch(EntryActions.getExperimentEMPIARRawData());
    this.globalStore.dispatch(EntryActions.getExperimentPDBRawData());
    this.globalStore.dispatch(EntryActions.getUniprotMapping());
  }

  async ngAfterViewInit() {
    this.previousTab = `${this.currentTab()}`;
  }

  public changeCurrentTab(tabName: string) {
    this.previousTab = `${tabName}`;
    this.tabSwitchOrigin.set('main');
    this.currentTab.set(tabName);
  }

  public getTableName(tabName: string) {
    return tabName as TableNames;
  }

  public onClickedOutside() {
    this.showViewOptions.set(false);
    this.showDownloadOptions.set(false);
  }
}
