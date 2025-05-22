/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, computed, DestroyRef, ElementRef, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitationPublicationComponent } from './sub-components/citation-publication/citation-publication.component';
import { MaterialModule, UtilService } from '@pdbc/core';
import { CitationXmlImagesComponent } from './sub-components/citation-xml-images/citation-xml-images.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntryApiService } from '../../services/entry-api.service';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { delay, filter, tap } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-citations-tab',
  standalone: true,
  imports: [CommonModule, CitationPublicationComponent, MaterialModule, NgxSkeletonLoaderModule],
  templateUrl: './citations-tab.component.html',
  styleUrl: './citations-tab.component.scss',
})
export class CitationsTabComponent implements OnInit {
  private readonly entryAPIService = inject(EntryApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(MatDialog);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly util = inject(UtilService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId).pipe(filter(Boolean)));
  public readonly articlesCiting = toSignal(this.globalStore.select(EntrySelectors.articlesCiting));
  public readonly primaryPublication = toSignal(this.globalStore.select(EntrySelectors.primaryPublication));

  public readonly isPrimaryPublicationDataAvailable = computed(() => {
    const abstract = this.primaryPublication()?.abstract;
    return (
      abstract?.background || abstract?.objective || abstract?.methods || abstract?.results || abstract?.conclusions || abstract?.unassigned || abstract?.conclusions
    );
  });

  public relatedEntries!: string[];

  public imageXMLText = signal('');

  @ViewChild('imageContainer', { read: ElementRef }) imageContainer!: ElementRef;

  ngOnInit(): void {
    if (this.primaryPublication() !== undefined && this.primaryPublication()!.pubmed_id) {
      this.getXMLImages(this.primaryPublication()!.pubmed_id!);
    }
    if (this.primaryPublication() !== undefined && this.primaryPublication()!.associated_entries) {
      this.setRelatedEntries(this.primaryPublication()!.associated_entries!);
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
