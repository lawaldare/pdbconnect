import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';

@Component({
  selector: 'pdbc-ligand-summary',
  standalone: true,
  imports: [CommonModule, DescriptionComponent, ImageCarouselComponent],
  template: `
    <section class="description">
      <pdbc-description />
      <pdbc-image-carousel #imageCarouselRef />
    </section>
  `,
  styles: [
    `
      section.description {
        display: flex;
        justify-content: space-between;
        padding-bottom: 40px;
        gap: 12px;

        @media screen and (width <= 768px) {
          flex-direction: column;
          gap: 30px;
        }
      }
    `,
  ],
})
export class LigandSummaryComponent {}
