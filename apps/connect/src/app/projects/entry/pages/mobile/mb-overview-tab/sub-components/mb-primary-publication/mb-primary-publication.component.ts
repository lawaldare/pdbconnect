import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationDetail } from '../../../../../data-models/publication.model';
import { combineLatest, filter, map } from 'rxjs';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RelatedPublication } from '../../../../../data-models/related-publications.model';
import { MobileFacade } from '../../../mobile.facade';
import { GoogleAnalyticsService } from '@pdbc/core';
import { EntryActions } from '../../../../../store/entry.actions';

@Component({
  selector: 'pdbc-mb-primary-publication',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-primary-publication.component.html',
  styleUrl: './mb-primary-publication.component.scss',
})
export class MbPrimaryPublicationComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly mbFacade = inject(MobileFacade);
  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly primaryPublication = signal<CitationDetail | undefined>(undefined);
  public readonly articlesCiting = signal<RelatedPublication | undefined>(undefined);
  public readonly entryId = signal<string>('');

  public relatedEntries = signal<string[]>([]);

  public initialCount = signal<number>(5);
  public initialAuthorCount = signal<number>(5);

  public toggleRelatedEntriesList(): void {
    this.initialCount.update((prev) => (prev === 5 ? this.relatedEntries().length : 5));
  }

  public toggleAuthorList(): void {
    const primaryPub = this.primaryPublication();
    if (!primaryPub) return;
    this.initialAuthorCount.update((prev) => (prev === 5 ? primaryPub.author_list.length : 5));
  }

  private setRelatedEntries(entries: string): void {
    const mappedEntries = entries?.split(',').map((entry) => entry.trim()) ?? null;
    this.relatedEntries.update(() => mappedEntries);
  }

  ngOnInit(): void {
    this.globalStore.dispatch(EntryActions.getPrimaryPublication());
    this.globalStore.dispatch(EntryActions.getArticleCitingPDBEntry()); // used in citations, mb-overview, mb-citations

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

          const primaryPub = this.primaryPublication();
          if (primaryPub !== undefined && primaryPub.associated_entries) {
            this.setRelatedEntries(this.primaryPublication()?.associated_entries ?? '');
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public navigateToCitationPage(): void {
    this.mbFacade.selectPage('citation');
    this.gAS.logEntryPageEvents('ep_mobile_citations_link_click', {
      page_section: 'abstract',
    });
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

    this.logGAEvents(sectionId);
  }

  private logGAEvents(sectionId: string): void {
    let eventName = '';
    switch (sectionId) {
      case 'articles-cited':
        eventName = 'articles_cite_pdb';
        break;
      case 'reviews-cited':
        eventName = 'reviews_cite_pdb';
        break;
      case 'articles-not-cited':
        eventName = 'articles_mention_pdb';
        break;
      case 'reviews-not-cited':
        eventName = 'reviews_mention_pdb';
        break;
    }

    this.gAS.logEntryPageEvents('ep_mobile_citations_link_click', {
      page_section: eventName,
    });
  }
}
