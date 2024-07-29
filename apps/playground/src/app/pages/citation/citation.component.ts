import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, map, tap } from 'rxjs';
import { CitationArticleComponent } from '../../components/citation-article/citation-article.component';
import { CitationPublicationComponent } from '../../components/citation-publication/citation-publication.component';
import { MaterialModule } from '@pdbc/core';
import { CitationXmlImagesComponent } from '../../components/citation-xml-images/citation-xml-images.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbe-citation',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent, CitationPublicationComponent, MaterialModule, CitationXmlImagesComponent],
  templateUrl: './citation.component.html',
  styleUrl: './citation.component.scss',
})
export class CitationComponent {
  private readonly playgroundService = inject(PlaygroundService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly dialog = inject(MatDialog);

  public entryId = signal('4zqo'); //'7v08', '3d12', '5tj5', '4zqo'
  public relatedEntries!: string[];

  public imageXMLText = signal('');

  public pageData$ = combineLatest([
    this.playgroundService.getPrimaryPublicationAbstract(this.entryId()),
    this.playgroundService.getArticleCitingPDBEntry(this.entryId()),
  ]).pipe(
    map((data) => ({ sectionOne: data[0], sectionTwo: data[1] })),
    tap((data) => {
      this.getXMLImages(data.sectionOne.pubmed_id);
      this.setRelatedEntries(data.sectionOne.associated_entries ?? null);
    })
  );

  private setRelatedEntries(entries: string): void {
    this.relatedEntries = entries?.split(',').map((entry) => entry.trim()) ?? null;
  }

  public openXMLImagesInNewWindow(): void {
    this.dialog.open(CitationXmlImagesComponent, {
      height: '800px',
      width: '1200px',
      data: { entryId: this.entryId(), imageXMLText: this.imageXMLText() },
    });
  }

  private getXMLImages(pubmedId: string): void {
    this.playgroundService
      .getXMLImages(pubmedId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          if (error.status === 200) {
            this.imageXMLText.set(error.error.text);
          }
        }
      );
  }
}
