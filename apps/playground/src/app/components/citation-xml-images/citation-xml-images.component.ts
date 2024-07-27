import { AfterViewInit, Component, DestroyRef, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XMLImageRendererService, MaterialModule } from '@pdbc/core';
import { PlaygroundService } from '../../services/playground.service';
import Splide from '@splidejs/splide';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'pdbe-citation-xml-images',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './citation-xml-images.component.html',
  styleUrl: './citation-xml-images.component.scss',
})
export class CitationXmlImagesComponent implements AfterViewInit {
  @ViewChild('gallery', { read: ElementRef }) galleryContainer!: ElementRef;
  @ViewChild('main', { read: ElementRef }) mainContainer!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { pubmedId: string; entryId: string },
    private readonly playgroundService: PlaygroundService,
    private readonly xmlImageRendererService: XMLImageRendererService,
    private readonly renderer: Renderer2,
    private readonly destroyRef: DestroyRef,
    private dialogRef: MatDialogRef<CitationXmlImagesComponent>
  ) {}

  ngAfterViewInit(): void {
    this.getXMLImages(this.data.pubmedId);
    setTimeout(() => {
      const main = new Splide('#main', {
        type: 'fade',
        rewind: true,
        pagination: false,
        arrows: false,
      });
      const thumbnails = new Splide('#thumbnail', {
        fixedWidth: 100,
        fixedHeight: 60,
        gap: 10,
        rewind: true,
        pagination: false,
        isNavigation: true,
        breakpoints: {
          600: {
            fixedWidth: 60,
            fixedHeight: 44,
          },
        },
      });
      main.sync(thumbnails);
      main.mount();
      thumbnails.mount();
    }, 500);
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
          const container = this.galleryContainer.nativeElement;
          const main = this.mainContainer.nativeElement;
          this.xmlImageRendererService.parseAndRenderXML(this.renderer, error.error.text, container);
          this.xmlImageRendererService.parseAndRenderXML(this.renderer, error.error.text, main);
        }
      );
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
