import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map, tap } from 'rxjs';
import { CitationArticleComponent } from '../../components/citation-article/citation-article.component';
import { CitationPublicationComponent } from '../../components/citation-publication/citation-publication.component';
import { PopupWindowService } from '@pdbc/core';
import { CitationXmlImagesComponent } from '../../components/citation-xml-images/citation-xml-images.component';

@Component({
  selector: 'pdbe-citation',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent, CitationPublicationComponent, CitationXmlImagesComponent],
  templateUrl: './citation.component.html',
  styleUrl: './citation.component.scss',
})
export class CitationComponent {
  private readonly playgroundService = inject(PlaygroundService);
  private readonly popupWindowService = inject(PopupWindowService);

  public entryId = signal('7v08'); //'7v08', '3d12', '5tj5
  public relatedEntries!: string[];

  public pubmedId!: string;

  @ViewChild('popoutWrapper') private popoutWrapper!: ElementRef;

  public pageData$ = combineLatest([
    this.playgroundService.getPrimaryPublicationAbstract(this.entryId()),
    this.playgroundService.getArticleCitingPDBEntry(this.entryId()),
  ]).pipe(
    map((data) => ({ sectionOne: data[0], sectionTwo: data[1] })),
    tap((data) => {
      this.pubmedId = data.sectionOne.pubmed_id;
      this.setRelatedEntries(data.sectionOne.associated_entries ?? null);
    })
  );

  private setRelatedEntries(entries: string): void {
    this.relatedEntries = entries?.split(',').map((entry) => entry.trim()) ?? null;
  }

  public openXMLImagesInNewWindow(): void {
    this.popupWindowService.popOut(this.popoutWrapper, 'curve-analysis-chart');
  }
}
