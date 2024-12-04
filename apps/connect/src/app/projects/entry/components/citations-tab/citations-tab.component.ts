import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationArticleComponent } from '../citation-article/citation-article.component';
import { CitationPublicationComponent } from '../citation-publication/citation-publication.component';
import { MaterialModule } from '@pdbc/core';
import { CitationXmlImagesComponent } from '../citation-xml-images/citation-xml-images.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CitationDetail } from '../../data-models/publication.model';
import { RelatedPublication } from '../../data-models/related-publications.model';
import { EntryApiService } from '../../services/entry-api.service';

@Component({
  selector: 'pdbc-citations-tab',
  standalone: true,
  imports: [CommonModule, CitationArticleComponent, CitationPublicationComponent, MaterialModule, CitationXmlImagesComponent],
  templateUrl: './citations-tab.component.html',
  styleUrl: './citations-tab.component.scss',
})
export class CitationsTabComponent implements OnInit {
  // public readonly sectionOne
  // public readonly sectionTwo

  private readonly entryAPIService = inject(EntryApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);

  // private staticEntryId = '7v08'; //'7v08', '3d12', '5tj5', '4zqo'

  public readonly entryId = input.required<string>();
  public readonly primaryPublication = input.required<CitationDetail>();
  public readonly articlesCiting = input.required<RelatedPublication>();

  public relatedEntries!: string[];

  public imageXMLText = signal('');

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  ngOnInit(): void {
    if (this.primaryPublication().pubmed_id) {
      this.getXMLImages(this.primaryPublication().pubmed_id!);
    }
    if (this.primaryPublication().associated_entries) {
      this.setRelatedEntries(this.primaryPublication().associated_entries!);
    }
  }

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
