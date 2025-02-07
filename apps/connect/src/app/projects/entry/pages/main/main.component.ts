import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { EMPTY, filter, map, mergeMap, switchMap, tap } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MaterialModule } from '@pdbc/core';
import { InteractiveTablesComponent } from '../../components/interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../../components/details-dashboard/details-dashboard.component';
import { ExperimentsValidationTabComponent } from '../../components/experiments-validation-tab/experiments-validation-tab.component';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { pdbeLogoConfig, pdbeSearchConfig, allTabs, tableTabs, INITIAL_API_STATUS } from '../../entry-constant';

import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { MainDataProcessingFacade } from './data-processing.facade';

import { EntryStatus, StatusCode } from '../../data-models/status.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryMainAlternativeComponent } from '../../components/entry-main-alternative/entry-main-alternative.component';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { InformationTabComponent } from '../../components/information-tab/information-tab.component';
import { AssembliesTabComponent } from '../../components/assemblies-tab/assemblies-tab.component';
import { DomainsTabComponent } from '../../components/domains-tab/domains-tab.component';
import { MacromoleculesTabComponent } from '../../components/macromolecules-tab/macromolecules-tab.component';
import { LigandsTabComponent } from '../../components/ligands-tab/ligands-tab.component';

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
    InteractiveTablesComponent,
    DetailsDashboardComponent,
    ExperimentsValidationTabComponent,
    CitationsTabComponent,
    NgxSkeletonLoaderModule,
    EntryMainAlternativeComponent,
    MaterialModule,
    InformationTabComponent,
    AssembliesTabComponent,
    DomainsTabComponent,
    MacromoleculesTabComponent,
    LigandsTabComponent,
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
  private molstarVisualisation = inject(MolstarVisualisationsForTabs);
  public dataProcessing = inject(MainDataProcessingFacade);

  public currentTab = this.compCommunication.currentTab;
  public tabSwitchOrigin = this.compCommunication.tabSwitchOrigin;
  public previousTab = 'undefined';

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

  public apiLoadedStatus = signal(INITIAL_API_STATUS);

  public molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded()); // boolean
  public molstarResidueInfo = this.compCommunication.molstarResidueInfo; // residue listing

  public tabsInfo = this.dataProcessing.tabsInfo;

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

  private getPageData(): void {
    this.dataProcessing.getPageData();
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

  selectTab(event: MatTabChangeEvent) {
    console.log(event);
  }
}
