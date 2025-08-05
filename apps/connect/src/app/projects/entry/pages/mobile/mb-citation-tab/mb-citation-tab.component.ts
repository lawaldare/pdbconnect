import { Component, DestroyRef, ElementRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { UtilService } from '@pdbc/core';
import { combineLatest, filter, map } from 'rxjs';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { ProcessedSummary } from '../../../data-models/summary.model';
import { RelatedPublication } from '../../../data-models/related-publications.model';
import { CitationDetail } from '../../../data-models/publication.model';
import { EntryApiService } from '../../../services/entry-api.service';
import { CitationArticleComponent } from '../../../components/citations-tab/sub-components/citation-article/citation-article.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CitationXmlImagesComponent } from '../../../components/citations-tab/sub-components/citation-xml-images/citation-xml-images.component';
import { MatDialog } from '@angular/material/dialog';
import { MobileFacade } from '../mobile.facade';
import { MobileTabNames } from '../mobile-main/mobile-main.component';

export interface NavigationLink {
  id: string;
  title: string;
}

@Component({
  selector: 'pdbc-mb-citation-tab',
  imports: [CommonModule, CitationArticleComponent, NgxSkeletonLoaderModule],
  templateUrl: './mb-citation-tab.component.html',
  styleUrl: './mb-citation-tab.component.scss',
})
export class MbCitationTabComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);
  private readonly entryAPIService = inject(EntryApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly mbFacade = inject(MobileFacade);

  public readonly summary = signal<ProcessedSummary>({} as ProcessedSummary);
  public readonly entryId = signal<string>('');
  public readonly articlesCiting = signal<RelatedPublication>({} as RelatedPublication);
  public readonly primaryPublication = signal<CitationDetail>({} as CitationDetail);

  public relatedEntries = signal<string[]>([]);
  public imageXMLText = signal('');

  public readonly isArticlesCitingMuch = signal<boolean>(false);
  public readonly isReviewsCitingMuch = signal<boolean>(false);
  public readonly isArticlesNotCitedMuch = signal<boolean>(false);
  public readonly isReviewsNotCitedMuch = signal<boolean>(false);

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  public isFullLinksDisplayed = signal<boolean>(false);
  public currentNavigationLink = signal<NavigationLink>({ id: 'primary-publication', title: 'Primary publication' });
  public navigationLinks: NavigationLink[] = [];

  public imageUrl = signal('');

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

  ngOnInit(): void {
    combineLatest([
      this.globalStore.select(EntrySelectors.summaryData).pipe(filter(Boolean)),
      this.globalStore.select(EntrySelectors.primaryPublication).pipe(filter(Boolean)),
      this.globalStore.select(EntrySelectors.articlesCiting).pipe(filter(Boolean)),
      this.globalStore.select(EntrySelectors.entryId).pipe(filter(Boolean)),
    ])
      .pipe(
        map(([summary, primaryPublication, articlesCiting, entryId]) => {
          this.summary.set(summary);
          this.primaryPublication.set(primaryPublication);
          this.articlesCiting.set(articlesCiting);
          this.entryId.set(entryId);

          if (this.primaryPublication() !== undefined && this.primaryPublication().associated_entries) {
            this.setRelatedEntries(this.primaryPublication()?.associated_entries ?? '');
          }

          if (this.primaryPublication().title && this.articlesCiting().cited_by && this.articlesCiting().appears_without_citation) {
            this.setNavigationLinks();
          }

          if (this.primaryPublication() !== undefined && this.primaryPublication().pubmed_id) {
            this.getXMLImages(this.primaryPublication().pubmed_id ?? '');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public toggleRelatedEntriesList(): void {
    this.initialCount.update((prev) => (prev === 5 ? this.relatedEntries().length : 5));
  }

  public toggleAuthorList(): void {
    this.initialAuthorCount.update((prev) => (prev === 5 ? this.primaryPublication().author_list.length : 5));
  }

  private setNavigationLinks(): void {
    if (this.primaryPublication().title) {
      this.navigationLinks.push({ id: 'primary-publication', title: 'Primary publication' });
    }

    if (this.articlesCiting().cited_by.Articles.length) {
      this.navigationLinks.push({ id: 'articles-cited', title: 'Articles citing the PDB entry' });
    }

    if (this.articlesCiting().cited_by.Reviews.length) {
      this.navigationLinks.push({ id: 'reviews-cited', title: 'Reviews citing the publication' });
    }

    if (this.articlesCiting().appears_without_citation.Articles.length) {
      this.navigationLinks.push({ id: 'articles-not-cited', title: 'Articles mentioned but not cited' });
    }

    if (this.articlesCiting().appears_without_citation.Reviews.length) {
      this.navigationLinks.push({ id: 'reviews-not-cited', title: 'Reviews mentioned but not cited' });
    }
  }

  public toggleArticlesCitingList(): void {
    this.isArticlesCitingMuch.update((value) => !value);
  }

  public toggleNavigationLinks(): void {
    this.isFullLinksDisplayed.update((value) => !value);
  }

  public toggleReviewsCitingList(): void {
    this.isReviewsCitingMuch.update((value) => !value);
  }

  public toggleArticlesNotCitedList(): void {
    this.isArticlesNotCitedMuch.update((value) => !value);
  }
  public toggleReviewsNotCitedList(): void {
    this.isReviewsNotCitedMuch.update((value) => !value);
  }

  private setRelatedEntries(entries: string): void {
    const mappedEntries = entries?.split(',').map((entry) => entry.trim()) ?? null;
    this.relatedEntries.update(() => mappedEntries);
  }

  private getXMLImages(pubmedId: string): void {
    this.entryAPIService
      .getXMLImages(pubmedId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          if (error.status === 200) {
            this.imageXMLText.set(error.error.text);
            this.parseAndRenderXML();
          } else {
            this.imageXMLText.set('');
          }
        }
      );
  }

  public openXMLImagesInNewWindow(): void {
    this.dialog.open(CitationXmlImagesComponent, {
      height: '800px',
      width: '1200px',
      data: { entryId: this.entryId(), imageXMLText: this.imageXMLText() },
    });
  }

  private parseAndRenderXML() {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.imageXMLText(), 'application/xml');
    const figElement = xmlDoc.querySelector('fig');

    if (figElement) {
      const graphic = figElement.querySelector('graphic');
      if (graphic) {
        const link = 'https://europepmc.org' + graphic.getAttribute('href') || '';
        this.imageUrl.set(link);
      }
    }
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

  public goBackToOverviewPage(): void {
    this.mbFacade.selectPage(MobileTabNames.Overview);
  }
}
