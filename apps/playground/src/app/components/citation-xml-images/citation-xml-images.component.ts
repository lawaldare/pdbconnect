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
      const splide = new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        focus: 'center',
        // fixedHeight: '600px',
      });

      splide.mount();
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
          this.xmlImageRendererService.parseAndRenderXML(this.renderer, error.error.text, container);
        }
      );
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
