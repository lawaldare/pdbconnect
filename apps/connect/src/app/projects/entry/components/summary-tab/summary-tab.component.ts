import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tourIds } from '../../entry-constant';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';

import { SummaryInfoSectionComponent } from './sub-components/summary-info-section/summary-info-section.component';
import { Summary3DSectionComponent } from './sub-components/summary-3d-section/summary-3d-section.component';
@Component({
  selector: 'pdbc-summary-tab',
  imports: [CommonModule, SummaryInfoSectionComponent, Summary3DSectionComponent],
  templateUrl: './summary-tab.component.html',
  styleUrl: './summary-tab.component.scss',
})
export class SummaryTabComponent implements AfterViewInit {
  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  // Wrapper signal if you want it reactive
  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    const agreed = this.tutorialTourService.getCookie(tourIds.summary);
    if (agreed) {
      this.isBannerCookies.set(true);
    }
  }

  public startSummaryTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.summaryTabTourSteps);
  }
}
