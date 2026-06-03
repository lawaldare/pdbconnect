/* eslint-disable @angular-eslint/directive-selector */
/** This directive enable tap if HammerJS is loaded, otherwise it uses the normal click event (useful for thumbnail click) */

import { Directive, ElementRef, EventEmitter, inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { GalleryService } from '../service/gallery.service';

declare const Hammer: any;

@Directive({
  selector: '[tap]',
})
export class TapDirective implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);

  @Input() tap: any;
  @Output() tapClick = new EventEmitter();

  ngOnInit() {
    this.setTapEvent();
  }

  /** Enable gestures if hammer is loaded */
  setTapEvent() {
    if (this.galleryService.config.gestures) {
      if (typeof Hammer === 'undefined') {
        throw Error('[NgGallery]: HammerJS is undefined, make sure it is loaded');
      } else {
        /** Use tap for click event */
        if (typeof Hammer !== 'undefined') {
          const mc = new Hammer(this.el.nativeElement);
          mc.on('tap', () => {
            this.tapClick.emit(null);
          });
        }
      }
    } else {
      /** Use normal click event */
      this.renderer.setProperty(this.el.nativeElement, 'onclick', () => {
        this.tapClick.emit(null);
      });
    }
  }
}
