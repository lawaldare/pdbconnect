import { Component, computed, DestroyRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { UtilService } from '@pdbc/core';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { TableFilter } from '../../../data-classes/data-models-and-definitions/row-and-table.model';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { combineLatest, filter, map } from 'rxjs';
import { CitationDetail } from '../../../data-models/publication.model';
import { StrucQualityGradientsComponent } from '../../../components/shared/struc-quality-gradients/struc-quality-gradients.component';
import { NavigationLink } from '../mb-citation-tab/mb-citation-tab.component';
import { MolstarGalleryComponent } from '@pdbe-lib/molstar-for-apps';
import { MobileFacade } from '../mobile.facade';
import { RelatedPublication } from '../../../data-models/related-publications.model';
import { MappedResidue } from '../../../data-classes/data-models-and-definitions/other-models';

@Component({
  selector: 'pdbc-mb-overview-tab',
  imports: [CommonModule, NgxSkeletonLoaderModule, StrucQualityGradientsComponent, MolstarGalleryComponent],
  templateUrl: './mb-overview-tab.component.html',
  styleUrls: ['../mb-citation-tab/mb-citation-tab.component.scss', './mb-overview-tab.component.scss'],
})
export class MbOverviewTabComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly mbFacade = inject(MobileFacade);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly entryStoreId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly organismScientificNames = toSignal(this.globalStore.select(EntrySelectors.organismScientificNames));
  public readonly qualityScores = toSignal(this.globalStore.select(EntrySelectors.summaryQualityScores));
  public readonly resolutionValues = toSignal(this.globalStore.select(EntrySelectors.resolutionValues));
  public readonly experimentalMethod = toSignal(this.globalStore.select(EntrySelectors.experimentalMethod));
  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));

  public readonly macromoleculeInitialCount = signal<number>(5);
  public readonly ligandInitialCount = signal<number>(5);

  public readonly tabDataLoaded = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    return isLoaded;
  });

  public readonly articlesCiting = signal<RelatedPublication>({} as RelatedPublication);

  public readonly miniFilters = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const hasData = this.compCommunication.hasProcessedLigands() && this.compCommunication.hasProcessedMacromolecules();

    if (!isLoaded || !hasData) return [];
    const filters: TableFilter[] = [];

    const macromoleculeTableData = this.compCommunication.macromoleculesTableData;
    if (macromoleculeTableData) {
      filters.push(...macromoleculeTableData.tableFilters().filter((f) => !f.description.includes('All')));
    }
    const ligandTableData = this.compCommunication.ligandsTableData;
    if (ligandTableData) {
      filters.push(...ligandTableData.tableFilters().filter((f) => !f.description.includes('All')));
    }
    return filters;
  });

  public readonly assemblyTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const hasData = this.compCommunication.hasProcessedAssemblies();

    if (isLoaded && hasData) {
      const tabData = this.compCommunication.processedAssemblies;
      return tabData;
    }
    return [];
  });

  public readonly macromoleculeTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const hasData = this.compCommunication.hasProcessedMacromolecules();
    const mappedResiduesList = this.mappedResiduesSignal();

    if (isLoaded && hasData) {
      const datum = this.compCommunication.processedMacromolecules;
      const mappedDatum = datum.map((data, index) => {
        return {
          ...data,
          index,
          mappedResidues: mappedResiduesList[index] ?? [],
          organisms: [...new Set(data['organisms'])],
        };
      });
      return mappedDatum;
    }
    return [];
  });

  public readonly ligandTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const hasData = this.compCommunication.hasProcessedLigands();
    if (isLoaded && hasData) {
      const tabData = this.compCommunication.processedLigandsAndModifications;
      return tabData;
    }
    return [];
  });

  public bestResidues = computed(() => {
    const isoformsMappingKeys = Object.keys(this.isoformsMapping() ?? {});
    const filteredIsoformsMapping: any[] = [];

    isoformsMappingKeys.forEach((uniprot: string) => {
      if (uniprot.indexOf('-') !== -1) {
        filteredIsoformsMapping.push({ ...this.isoformsMapping()?.[uniprot], uniprot });
      }
    });

    return filteredIsoformsMapping;
  });

  public readonly entryId = signal<string>('');
  public readonly primaryPublication = signal<CitationDetail>({} as CitationDetail);
  public relatedEntries = signal<string[]>([]);
  public residues = signal<MappedResidue[]>([]);
  readonly mappedResiduesSignal = signal<MappedResidue[][]>([]);

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

  public initialCount = signal<number>(5);
  public initialAuthorCount = signal<number>(5);

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

  public toggleRelatedEntriesList(): void {
    this.initialCount.update((prev) => (prev === 5 ? this.relatedEntries().length : 5));
  }

  public toggleAuthorList(): void {
    this.initialAuthorCount.update((prev) => (prev === 5 ? this.primaryPublication().author_list.length : 5));
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
  }

  public toggleMacromoleculeList(): void {
    this.macromoleculeInitialCount.update((prev) => (prev === 5 ? this.macromoleculeTableRows().length : 5));
  }

  public toggleLigandList(): void {
    this.ligandInitialCount.update((prev) => (prev === 5 ? this.ligandTableRows().length : 5));
  }

  ngOnInit(): void {
    combineLatest([
      this.globalStore.select(EntrySelectors.primaryPublication).pipe(filter(Boolean)),
      this.globalStore.select(EntrySelectors.entryId).pipe(filter(Boolean)),
      this.globalStore.select(EntrySelectors.articlesCiting).pipe(filter(Boolean)),
    ])
      .pipe(
        map(([primaryPublication, entryId, articlesCiting]) => {
          this.primaryPublication.set(primaryPublication);
          this.articlesCiting.set(articlesCiting);
          this.entryId.set(entryId);

          if (this.primaryPublication() !== undefined && this.primaryPublication().associated_entries) {
            this.setRelatedEntries(this.primaryPublication()?.associated_entries ?? '');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  private setRelatedEntries(entries: string): void {
    const mappedEntries = entries?.split(',').map((entry) => entry.trim()) ?? null;
    this.relatedEntries.update(() => mappedEntries);
  }

  public openMolstarPage(): void {
    this.mbFacade.selectPage('molstar');
  }

  public navigateToCitationPage(): void {
    this.mbFacade.selectPage('citation');
  }

  public navigateToPageSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.mbFacade.selectPage('citation');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      const toc = document.querySelector('.table-of-contents') as HTMLElement;
      if (element && toc) {
        const offsetTop = element.offsetTop;
        window.scrollTo({ top: offsetTop - toc.offsetHeight, behavior: 'smooth' });
      }
    }, 500);
  }
}
