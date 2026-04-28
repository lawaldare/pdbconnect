import { ChangeDetectionStrategy, Component, OnInit, Input, ElementRef, Renderer2, inject } from '@angular/core';
import { GalleryState } from '../../service/gallery.state';
import { GalleryConfig } from '../../config';
import { GalleryService } from '../../service/gallery.service';
import { animation } from './gallery-image.animation';
import { CommonModule } from '@angular/common';
import { GalleryLoaderComponent } from '../gallery-loader/gallery-loader.component';
import { LazyDirective } from '../../directive/lazy.directive';

declare const Hammer: any;

@Component({
  selector: 'pdbc-gallery-image',
  templateUrl: './gallery-image.component.html',
  styleUrls: ['./gallery-image.component.scss'],
  imports: [CommonModule, GalleryLoaderComponent, LazyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animation,
})
export class GalleryImageComponent implements OnInit {
  public readonly galleryService = inject(GalleryService);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  @Input() state!: GalleryState;
  @Input() config!: GalleryConfig;
  loading!: boolean;
  animate!: string;

  ngOnInit() {
    /** Enable gestures */
    if (this.config.gestures) {
      if (typeof Hammer === 'undefined') {
        throw Error('[NgGallery]: HammerJS is undefined, make sure it is loaded');
      } else {
        const el = this.el.nativeElement;
        const mc = new Hammer(el);

        mc.on('panstart', () => {
          this.renderer.removeClass(el, 'g-pan-reset');
        });
        mc.on('panend', () => {
          this.renderer.addClass(el, 'g-pan-reset');
        });
        mc.on('pan', (e: any) => {
          this.renderer.setStyle(el, 'transform', `translate3d(${e.deltaX}px, 0px, 0px)`);
        });
        /** Swipe next and prev */
        mc.on('swipeleft', () => {
          this.galleryService.next();
        });
        mc.on('swiperight', () => {
          this.galleryService.prev();
        });
      }
    }
  }

  imageLoad(done: boolean) {
    this.loading = !done;
    /** TODO: Add some animation */

    if (!done) {
      this.animate = 'none';
    } else {
      switch (this.config.animation) {
        case 'fade':
          this.animate = 'fade';
          break;
        default:
          this.animate = 'none';
      }
      //     this.animate = 'none';
      //   case 'slide':
      //     this.animate = (this.state.currIndex > this.state.prevIndex) ? 'slideLeft' : 'slideRight';
      //     break;
      //   default:
      //     this.animate = 'none';
    }
  }
}
