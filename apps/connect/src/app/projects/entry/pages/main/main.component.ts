import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { AssembliesTabComponent } from '../../components/assemblies-tab/assemblies-tab.component';
import { DomainsTabComponent } from '../../components/domains-tab/domains-tab.component';
import { MacromoleculesTabComponent } from '../../components/macromolecules-tab/macromolecules-tab.component';
import { LigandsTabComponent } from '../../components/ligands-tab/ligands-tab.component';
import { ModelQualityTabComponent } from '../../components/model-quality-tab/model-quality-tab.component';

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
    AssembliesTabComponent,
    DomainsTabComponent,
    MacromoleculesTabComponent,
    LigandsTabComponent,
    ModelQualityTabComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class EntryMainPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly pdbeLogoConfig = pdbeLogoConfig;
  public readonly pdbeSearchConfig = pdbeSearchConfig;

  public statusCode = signal<StatusCode>('INITIAL');
  public entryStatus = signal<EntryStatus>({ status_code: 'INITIAL' } as EntryStatus);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const entryId = params['entryId'].toLowerCase();
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
    console.log(event);
  }
}
