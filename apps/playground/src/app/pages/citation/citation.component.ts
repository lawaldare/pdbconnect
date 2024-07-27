import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map, tap } from 'rxjs';
import { CitationArticleComponent } from '../../components/citation-article/citation-article.component';
import { CitationPublicationComponent } from '../../components/citation-publication/citation-publication.component';
import { MaterialModule } from '@pdbc/core';
import { CitationXmlImagesComponent } from '../../components/citation-xml-images/citation-xml-images.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pdbe-citation',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent, CitationPublicationComponent, MaterialModule, CitationXmlImagesComponent],
  templateUrl: './citation.component.html',
  styleUrl: './citation.component.scss',
})
export class CitationComponent {
  private readonly playgroundService = inject(PlaygroundService);
  readonly dialog = inject(MatDialog);

  public entryId = signal('4zqo'); //'7v08', '3d12', '5tj5', '4zqo'
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
    const dialogRef = this.dialog.open(CitationXmlImagesComponent, {
      height: '800px',
      width: '800px',
      data: { pubmedId: this.pubmedId, entryId: this.entryId() },
    });
  }
}
