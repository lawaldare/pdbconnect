import { AfterViewInit, Component, DestroyRef, ElementRef, inject, input, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from '@pdbc/core';
import { PlaygroundService } from '../../services/playground.service';
import Splide from '@splidejs/splide';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pdbe-citation-xml-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citation-xml-images.component.html',
  styleUrl: './citation-xml-images.component.scss',
})
export class CitationXmlImagesComponent implements AfterViewInit {
  private readonly playgroundService = inject(PlaygroundService);
  private readonly coreService = inject(CoreService);

  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);

  public pubmedId = input.required<string>();

  @ViewChild('gallery', { read: ElementRef }) galleryContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.getXMLImages(this.pubmedId());
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

  private getXMLImages(pubmedId: string) {
    this.playgroundService
      .getXMLImages(pubmedId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          const container = this.galleryContainer.nativeElement;
          this.coreService.parseAndRenderXML(this.renderer, error.error.text, container);
        }
      );
  }
}
