import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { AssetPipe } from '@pdbc/core';
import { LigandPageTutorialTourService } from '../../services/ligands-page-tutorial-tour.service';
import { tourIds } from '../../ligand.constant';

@Component({
  selector: 'pdbc-ligand-summary',
  standalone: true,
  imports: [CommonModule, DescriptionComponent, ImageCarouselComponent, AssetPipe],
  template: `
    @if (tutorialTourService.showDescriptionTourBanner() && !isBannerCookies()) {
      <section class="onboarding-tutorial-banner">
        <img [src]="'images/light-star.svg' | asset" alt="light start icon" />
        <p>We have redesigned this page to enhance your experience. <span (click)="startDescriptionTabTour()">Take an on-page tour.</span></p>
      </section>
    }
    <section class="description">
      <pdbc-description id="ligand-description-tour" />
      <pdbc-image-carousel #imageCarouselRef id="ligand-gallery-tour" />
    </section>
  `,
  styles: [
    `
      section.description {
        display: flex;
        justify-content: space-between;
        padding-bottom: 60px;
        gap: 12px;

        @media screen and (width <= 768px) {
          flex-direction: column;
          gap: 30px;
        }
      }
    `,
  ],
})
export class LigandSummaryComponent implements AfterViewInit {
  public readonly tutorialTourService = inject(LigandPageTutorialTourService);
  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    const agreed = this.tutorialTourService.getCookie(tourIds.description);
    if (agreed) {
      this.isBannerCookies.set(true);
    }
  }

  public startDescriptionTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.descriptionTabTourSteps);
  }
}
