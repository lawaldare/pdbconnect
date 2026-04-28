import { ChangeDetectionStrategy, Component, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GalleryState } from '../../service/gallery.state';
import { GalleryConfig } from '../../config';
import { GalleryService } from '../../service/gallery.service';
import { CommonModule } from '@angular/common';
import { GalleryBulletsComponent } from '../gallery-bullets/gallery-bullets.component';
import { GalleryThumbComponent } from '../gallery-thumb/gallery-thumb.component';
import { GalleryImageComponent } from '../gallery-image/gallery-image.component';
import { GalleryNavComponent } from '../gallery-nav/gallery-nav.component';
import { GalleryTextComponent } from '../gallery-text/gallery-text.component';
import { GalleryPlayerComponent } from '../gallery-player/gallery-player.component';

@Component({
  selector: 'pdbc-gallery-main',
  templateUrl: './gallery-main.component.html',
  styleUrls: ['./gallery-main.component.scss'],
  imports: [CommonModule, GalleryBulletsComponent, GalleryThumbComponent, GalleryImageComponent, GalleryNavComponent, GalleryTextComponent, GalleryPlayerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GalleryMainComponent implements OnInit {
  public readonly galleryService = inject(GalleryService);
  @Input() state!: GalleryState;
  @Input() config!: GalleryConfig;
  loading!: any;
  thumbDirection!: string;
  showDescription = true;

  ngOnInit() {
    // shortcut for thumbnail config
    if (this.config) {
      const thumbPos = this.config?.thumbnails?.position;
      this.thumbDirection = thumbPos === 'left' || thumbPos === 'right' ? 'row' : 'column';
    }
  }
}
