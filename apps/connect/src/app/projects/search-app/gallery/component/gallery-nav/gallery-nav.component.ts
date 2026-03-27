import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { GalleryService } from '../../service/gallery.service';

@Component({
  selector: 'pdbc-gallery-nav',
  templateUrl: './gallery-nav.component.html',
  styleUrls: ['./gallery-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryNavComponent {
  public readonly galleryService = inject(GalleryService);
  @Input() state!: any;
}
