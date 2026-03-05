import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { GalleryService } from '../../service/gallery.service';
import { GalleryPlayConfig } from '../../config';
import { GalleryState } from '../../service/gallery.state';

@Component({
  selector: 'pdbc-gallery-player',
  templateUrl: './gallery-player.component.html',
  styleUrls: ['./gallery-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryPlayerComponent implements OnInit {
  private readonly galleryService = inject(GalleryService);
  @Input() config!: GalleryPlayConfig;
  @Input() state!: GalleryState;

  ngOnInit() {
    /** Start auto-play if enabled */
    if (this.config.autoplay) {
      this.galleryService.play();
    }

    /** TODO: Display status bar */
  }
}
