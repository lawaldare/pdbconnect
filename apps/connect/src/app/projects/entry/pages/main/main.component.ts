import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { EMPTY, filter, map, mergeMap, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MaterialModule } from '@pdbc/core';
import { CitationsTabComponent } from '../../components/citations-tab/citations-tab.component';
import { pdbeLogoConfig, pdbeSearchConfig } from '../../entry-constant';
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
import { ModelQualityTabComponent } from '../../components/model-quality-tab/model-quality-tab.component';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MolstarVisualisationsForTabs } from '../../helpers/molstar/molstar-visualisations-for-detail-tabs';
import { InteractiveTablesComponent } from '../../components/interactive-tables/interactive-tables.component';
import { DetailsDashboardComponent } from '../../components/details-dashboard/details-dashboard.component';

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
    CitationsTabComponent,
    NgxSkeletonLoaderModule,
    EntryMainAlternativeComponent,
    MaterialModule,
    InformationTabComponent,
    ModelQualityTabComponent,
    InteractiveTablesComponent,
    DetailsDashboardComponent,
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
  private readonly molstarVisualisation = inject(MolstarVisualisationsForTabs);

  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;

  public statusCode = signal<StatusCode>('INITIAL');
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);

  public readonly molstarResidueInfoLoaded = computed(() => this.compCommunication.molstarResidueInfoLoaded());
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public readonly commonTabs = ['Assemblies', 'Macromolecules', 'Ligands', 'Domains'];
  private readonly entryId = signal<string>('');

  public currentTab = this.compCommunication.currentTab;
  public tabSwitchOrigin = this.compCommunication.tabSwitchOrigin;
  public previousTab = 'undefined';

  @ViewChild('molstarViewer') molstarViewer!: ElementRef;

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
              this.molstarVisualisation.renderMolstarInitial(this.entryId() ?? '', this.molstarViewer.nativeElement);
            });
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
    const tabName = event.tab.textLabel;
    this.previousTab = `${tabName}`;
    this.tabSwitchOrigin.set('main');
    this.currentTab.set(tabName);
  }
}
