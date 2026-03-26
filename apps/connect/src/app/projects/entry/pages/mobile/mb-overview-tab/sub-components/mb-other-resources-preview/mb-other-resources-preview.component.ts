import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MobileFacade } from '../../../mobile.facade';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'pdbc-mb-other-resources-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-other-resources-preview.component.html',
  styleUrl: './mb-other-resources-preview.component.scss',
})
export class MbOtherResourcesPreviewComponent {
  private readonly mbFacade = inject(MobileFacade);
  public baseUrl = environment.baseUrl;

  public navigateToPageSection(event: Event, sectionId: string): void {
    event.preventDefault();
    this.mbFacade.selectPage('other-resources', sectionId);
  }
}
