import { Component, computed, DestroyRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService } from '@pdbc/core';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { combineLatest, filter, map } from 'rxjs';
import { NavigationLink } from '../mb-citation-tab/mb-citation-tab.component';
import { MolstarGalleryComponent } from '@pdbe-lib/molstar-for-apps';
import { MobileFacade } from '../mobile.facade';
import { MbStructureOverviewComponent } from './sub-components/mb-structure-overview/mb-structure-overview.component';
import { MbPrimaryPublicationComponent } from './sub-components/mb-primary-publication/mb-primary-publication.component';
import { MbModelQualitySummaryOverviewComponent } from './sub-components/mb-pdb-model-quality-summary/mb-pdb-model-quality-summary.component';
import { MbOverviewAssemblyComponent } from './sub-components/mb-overview-assembly/mb-overview-assembly.component';
import { MbOverviewMacromoleculesComponent } from './sub-components/mb-overview-macromolecules/mb-overview-macromolecules.component';
import { MbOverviewLigandsAndModsComponent } from './sub-components/mb-overview-ligands-and-mods/mb-overview-ligands-and-mods.component';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MbSlowNetworkImageGalleryComponent } from './sub-components/mb-slow-network-img-gallery/mb-slow-network-img-gallery.component';

@Component({
  selector: 'pdbc-mb-overview-tab',
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule,
    MolstarGalleryComponent,
    MbStructureOverviewComponent,
    MbPrimaryPublicationComponent,
    MbModelQualitySummaryOverviewComponent,
    MbOverviewAssemblyComponent,
    MbOverviewMacromoleculesComponent,
    MbOverviewLigandsAndModsComponent,
    MbSlowNetworkImageGalleryComponent,
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

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // 👈 assume "unknown/loading" until we know
  );

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

  public isFullLinksDisplayed = signal<boolean>(false);
  public currentNavigationLink = signal<NavigationLink>({ id: 'structure-overview', title: 'Structure overview' });
  public readonly navigationLinks = [
    { id: 'structure-overview', title: 'Structure overview' },
    { id: 'primary-publication', title: 'Primary publication' },
    { id: 'model-quality-summary', title: 'PDB model quality summary' },
    { id: 'assembly', title: 'Assembly (preferred)' },
    { id: 'macromolecules', title: 'Macromolecules' },
    { id: 'ligands-and-modifications', title: 'Ligands and modifications' },
    { id: 'related-databases', title: 'Related databases and links' },
  ];

  @HostListener('window:scroll', [])
  onScroll() {
    this.navigationLinks.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.currentNavigationLink.set(section);
        }
      }
    });
  }

  public toggleNavigationLinks(): void {
    this.isFullLinksDisplayed.update((value) => !value);
  }

  public scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.isFullLinksDisplayed.set(false);
    const element = document.getElementById(sectionId);
    const toc = document.querySelector('.table-of-contents') as HTMLElement;
    if (element && toc) {
      const offsetTop = element.offsetTop;
      window.scrollTo({ top: offsetTop - toc.offsetHeight, behavior: 'smooth' });
    }
    this.gAS.logEntryPageEvents('ep_mobile_quick_access_click', {});
  }

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
    this.mbFacade.selectPage('molstar');
    this.gAS.logEntryPageEvents('ep_mobile_3d_btn_click', {});
  }
}
