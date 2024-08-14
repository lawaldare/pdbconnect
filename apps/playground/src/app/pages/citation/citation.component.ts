import { Component, DestroyRef, ElementRef, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaygroundService } from '../../services/playground.service';
import { combineLatest, forkJoin, map, switchMap, tap } from 'rxjs';
import { CitationArticleComponent } from '../../components/citation-article/citation-article.component';
import { CitationPublicationComponent } from '../../components/citation-publication/citation-publication.component';
import { MaterialModule } from '@pdbc/core';
import { CitationXmlImagesComponent } from '../../components/citation-xml-images/citation-xml-images.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

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
  private readonly renderer = inject(Renderer2);

  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);

  private staticEntryId = '7v08'; //'7v08', '3d12', '5tj5', '4zqo'

  public entryId = signal(this.staticEntryId);
  public relatedEntries!: string[];

  public imageXMLText = signal('');

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  public pageData$ = this.route.params.pipe(
    switchMap((params) => {
      const entryId = params['entryId'] ? params['entryId'].toLowerCase() : this.staticEntryId;
      this.entryId.set(entryId);
      return forkJoin([this.playgroundService.getPrimaryPublicationAbstract(this.entryId()), this.playgroundService.getArticleCitingPDBEntry(this.entryId())]);
    }),
    map((data) => ({ sectionOne: data[0], sectionTwo: data[1] })),
    tap((data) => {
      if (data.sectionOne.pubmed_id) {
        this.getXMLImages(data.sectionOne.pubmed_id);
      }
      if (data.sectionOne.associated_entries) {
        this.setRelatedEntries(data.sectionOne.associated_entries);
      }
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
            this.parseAndRenderXML();
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
}
