import { Component, DestroyRef, ElementRef, HostListener, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
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
  private readonly renderer = inject(Renderer2);

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
  public readonly navigationLinks = [
    { id: 'primary-publication', title: 'Primary publication' },
    { id: 'articles-cited', title: 'Articles citing the PDB entry' },
    { id: 'reviews-cited', title: 'Reviews citing the publication' },
    { id: 'articles-not-cited', title: `Articles -${this.entryId()} mentioned but not cited` },
    { id: 'reviews-not-cited', title: `Reviews -${this.entryId()} mentioned but not cited` },
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

          if (this.primaryPublication() !== undefined && this.primaryPublication().pubmed_id) {
            this.getXMLImages(this.primaryPublication().pubmed_id ?? '');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
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
            console.log(this.imageXMLText());
            this.parseAndRenderXML();
          } else {
            this.imageXMLText.set('');
          }
        }
      );
  }

  private parseAndRenderXML() {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.imageXMLText(), 'application/xml');
    const figElement = xmlDoc.querySelector('fig');

    if (figElement) {
      this.renderFigElement(figElement);
    }
  }

  private renderFigElement(figElement: Element) {
    const container = this.imageContainer.nativeElement;
    const figure = this.renderer.createElement('figure');
    this.renderer.setAttribute(figure, 'id', figElement.getAttribute('id') || '');
    this.renderer.appendChild(container, figure);

    const graphic = figElement.querySelector('graphic');
    if (graphic) {
      const img = this.renderer.createElement('img');
      const cover = this.renderer.createElement('div');
      this.renderer.addClass(cover, 'image-cover');
      const href = 'https://europepmc.org' + graphic.getAttribute('href') || '';
      this.renderer.setAttribute(img, 'src', href);
      this.renderer.setAttribute(img, 'alt', figElement.querySelector('name')?.textContent || '');
      this.renderer.appendChild(cover, img);
      this.renderer.appendChild(figure, cover);
    }
  }

  public scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.isFullLinksDisplayed.set(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({ top: offsetTop - 320, behavior: 'smooth' });
    }
  }
}
