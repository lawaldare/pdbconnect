import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2, OnInit, inject } from '@angular/core';
import { GalleryService } from '../../service/gallery.service';
import { GalleryState } from '../../service/gallery.state';
import { GalleryThumbConfig } from '../../config';
import { CommonModule } from '@angular/common';
import { TapDirective } from '../../directive/tap.directive';

declare const Hammer: any;

@Component({
  selector: 'pdbc-gallery-thumb',
  templateUrl: './gallery-thumb.component.html',
  styleUrls: ['./gallery-thumb.component.scss'],
  imports: [CommonModule, TapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryThumbComponent implements OnInit {
  public readonly galleryService = inject(GalleryService);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  @Input() state!: GalleryState;
  @Input() config!: GalleryThumbConfig;

  contStyle!: any;

  ngOnInit() {
    this.contStyle = this.getContainerStyle();

    /** Enable gestures */
    if (this.galleryService.config.gestures) {
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

        /** Pan left and right */
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

  translateThumbs() {
    if (!this.state?.currIndex || !this.config?.width) return 'translate3d(0px, 0, 0)';

    const x = this.state.currIndex * this.config.width + this.config.width / 2;
    return `translate3d(${-x}px, 0, 0)`;
  }

  getContainerStyle() {
    /** Set thumbnails position (top, bottom) */
    const order = this.config.position === 'top' ? 0 : 2;
    this.renderer.setStyle(this.el.nativeElement, 'order', order);

    return {
      height: this.config.height + 'px',
      margin: this.config.space + 'px',
    };
  }

  getThumbImage(i: any) {
    /** Use thumbnail if presented */
    return `url(${this.state.images?.[i].thumbnail || this.state.images?.[i].src})`;
  }

  getThumbImageTitle(i: any) {
    return this.state.images?.[i].text ? this.state.images[i].text : '';
  }
}
