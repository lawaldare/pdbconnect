import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { GalleryService } from '../../service/gallery.service';
import { GalleryMainComponent } from '../gallery-main/gallery-main.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-gallery',
  template: `
    @if (gallery.state | async; as state) {
      <pdbc-gallery-main [state]="state" [config]="gallery.config"></pdbc-gallery-main>
    }
  `,
  imports: [GalleryMainComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnDestroy {
  constructor(public gallery: GalleryService) {}

  ngOnDestroy() {
    this.gallery.reset();
  }
}
