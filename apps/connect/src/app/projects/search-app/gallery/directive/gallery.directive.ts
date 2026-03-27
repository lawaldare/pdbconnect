/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, Renderer2, Input, OnInit, inject } from '@angular/core';
import { GalleryService } from '../service/gallery.service';
import { GalleryImage } from '../service/gallery.state';
import { finalize, from, fromEvent, map } from 'rxjs';

@Directive({
  selector: '[gallerize]',
})
export class GalleryDirective implements OnInit {
  private readonly galleryService = inject(GalleryService);
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef);
  // A flag to check if content has changed
  content: any;

  @Input() gallerize!: any;

  ngOnInit() {
    /** Listen for InnerHtml changes */
    fromEvent(this.el.nativeElement, 'DOMSubtreeModified').subscribe(() => {
      // skip if content is the same
      if (this.content === this.el.nativeElement.innerText) {
        return;
      } else {
        this.content = this.el.nativeElement.innerText;
      }

      const images: GalleryImage[] = [];
      const classes = this.gallerize ? this.gallerize.split(' ').map((className: any) => '.' + className) : '';

      // get all img elements from content
      const imageElements = this.el.nativeElement.querySelectorAll(`img${classes}`);

      if (imageElements) {
        from(imageElements)
          .pipe(
            map((img: any, i) => {
              // add click event to the images
              this.renderer.setStyle(img, 'cursor', 'pointer');
              this.renderer.setProperty(img, 'onclick', () => {
                this.galleryService.set(i);
              });

              // create an image item
              images.push({
                src: img.src,
                text: img.alt,
              });
            }),
            finalize(() => this.galleryService.load(images))
          )
          .subscribe();
      }
    });
  }
}
