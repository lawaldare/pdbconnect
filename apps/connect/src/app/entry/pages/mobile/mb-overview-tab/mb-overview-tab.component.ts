import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService } from '@pdbc/core';
import { MolstarGalleryComponent } from '@pdbe-lib/molstar-for-apps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { combineLatest, filter, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MbTableOfContentsComponent, NavigationLink } from '../mb-table-of-contents/mb-table-of-contents.component';
import { MobileFacade } from '../mobile.facade';
import { MbOtherResourcesPreviewComponent } from './sub-components/mb-other-resources-preview/mb-other-resources-preview.component';
import { MbOverviewAssemblyComponent } from './sub-components/mb-overview-assembly/mb-overview-assembly.component';
import { MbOverviewLigandsAndModsComponent } from './sub-components/mb-overview-ligands-and-mods/mb-overview-ligands-and-mods.component';
import { MbOverviewMacromoleculesComponent } from './sub-components/mb-overview-macromolecules/mb-overview-macromolecules.component';
import { MbModelQualitySummaryOverviewComponent } from './sub-components/mb-pdb-model-quality-summary/mb-pdb-model-quality-summary.component';
import { MbPrimaryPublicationComponent } from './sub-components/mb-primary-publication/mb-primary-publication.component';
import { MbSlowNetworkImageGalleryComponent } from './sub-components/mb-slow-network-img-gallery/mb-slow-network-img-gallery.component';
import { MbStructureOverviewComponent } from './sub-components/mb-structure-overview/mb-structure-overview.component';

@Component({
  selector: 'pdbc-mb-overview-tab',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    MbTableOfContentsComponent,
    MolstarGalleryComponent,
    MbStructureOverviewComponent,
    MbPrimaryPublicationComponent,
    MbModelQualitySummaryOverviewComponent,
    MbOverviewAssemblyComponent,
    MbOverviewMacromoleculesComponent,
    MbOverviewLigandsAndModsComponent,
    MbSlowNetworkImageGalleryComponent,
    MbOtherResourcesPreviewComponent,
  ],
  templateUrl: './mb-overview-tab.component.html',
  styleUrls: ['../mb-citation-tab/mb-citation-tab.component.scss', './mb-overview-tab.component.scss'],
})
export class MbOverviewTabComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mbFacade = inject(MobileFacade);
  public readonly gAS = inject(GoogleAnalyticsService);
  public readonly compCommunication = inject(ComponentCommunicationService);

  // summary dispatch called in main.component.ts and used for related
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly entryStoreId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly pdbeUrl = environment.baseUrl.replace(/\/$/, '') + '/pdbe';

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public readonly imageGallery = computed(() => {
    const entryId = this.entryStoreId();
    if (!entryId) return [];
    // if (!this.slowNetwork()) return [];
    return [
      `https://www.ebi.ac.uk/pdbe/static/entry/${entryId.toLowerCase()}_deposited_chemically_distinct_molecules_front_image-800x800.png`,
      `https://www.ebi.ac.uk/pdbe/static/entry/${entryId.toLowerCase()}_deposited_chemically_distinct_molecules_side_image-800x800.png`,
      `https://www.ebi.ac.uk/pdbe/static/entry/${entryId.toLowerCase()}_deposited_chemically_distinct_molecules_top_image-800x800.png`,
    ];
  });

  public readonly entryId = signal<string>('');
  public relatedEntries = signal<string[]>([]);

  public readonly navigationLinks: NavigationLink[] = [
    { id: 'structure-overview', title: 'Structure overview' },
    { id: 'primary-publication', title: 'Primary publication' },
    { id: 'model-quality-summary', title: 'PDB model quality summary' },
    { id: 'assembly', title: 'Assembly (preferred)' },
    { id: 'macromolecules', title: 'Macromolecules' },
    { id: 'ligands-and-modifications', title: 'Ligands and modifications' },
    { id: 'related-databases', title: 'Other resources' },
  ];

  ngOnInit(): void {
    combineLatest([this.globalStore.select(EntrySelectors.entryId).pipe(filter(Boolean))])
      .pipe(
        map(([entryId]) => {
          this.entryId.set(entryId);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public openMolstarPage(): void {
    this.compCommunication.mobileIsPrefAssembly.set(true);
    this.mbFacade.selectPage('molstar');
    this.gAS.logPageEvents('ep_mobile_3d_btn_click', {});
  }
}
