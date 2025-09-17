/* eslint-disable @angular-eslint/prefer-inject */

import { AfterViewInit, Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XMLImageRendererService, MaterialModule } from '@pdbc/core';
import Splide from '@splidejs/splide';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'pdbc-citation-xml-images',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './citation-xml-images.component.html',
  styleUrl: './citation-xml-images.component.scss',
})
export class CitationXmlImagesComponent implements AfterViewInit {
  @ViewChild('gallery', { read: ElementRef }) galleryContainer!: ElementRef;
  @ViewChild('main', { read: ElementRef }) mainContainer!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { entryId: string; imageXMLText: string },
    private readonly xmlImageRendererService: XMLImageRendererService,
    private readonly renderer: Renderer2,
    private dialogRef: MatDialogRef<CitationXmlImagesComponent>
  ) {}

  ngAfterViewInit(): void {
    this.parseAndRenderXML();
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
      // Scroll to top on slide change
      main.on('moved', () => {
        const activeSlide = document.querySelector('.splide__slide.is-active');
        if (activeSlide) {
          activeSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      main.mount();
      thumbnails.mount();
    }, 500);
  }

  private parseAndRenderXML(): void {
    const container = this.galleryContainer.nativeElement;
    const main = this.mainContainer.nativeElement;
    this.xmlImageRendererService.parseAndRenderXML(this.renderer, this.data.imageXMLText, container);
    this.xmlImageRendererService.parseAndRenderXML(this.renderer, this.data.imageXMLText, main);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
