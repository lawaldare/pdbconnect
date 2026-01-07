/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { Observable, of, Subject, switchMap } from 'rxjs';

// import 'rxjs/add/operator/delay';

@Directive({
  selector: '[lazyImage]',
})
export class LazyDirective {
  // Image source
  @Input('lazyImage') set lazyImage(imagePath: any) {
    this.getImage(imagePath);
  }

  /** A subject to emit only last selected image */
  lazyWorker = new Subject<boolean>();

  @Output() lazyLoad = new EventEmitter<boolean>(false);

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    // this.lazyTest.switchMap((done) => (done) ? Observable.of(done).delay(1000) : Observable.of(done)
    this.lazyWorker
      .asObservable()
      .pipe(switchMap((done) => of(done)))
      .subscribe((img) => {
        if (img) {
          this.renderer.setProperty(this.el.nativeElement, 'src', img);
          this.lazyLoad.emit(true);
        } else {
          this.lazyLoad.emit(false);
        }
      });
  }

  getImage(imagePath: any) {
    this.lazyWorker.next(false);
    const img = this.renderer.createElement('img');
    img.src = imagePath;

    img.onload = () => {
      this.lazyWorker.next(imagePath);
    };

    img.onerror = (err: any) => {
      console.error('[GalleryLazyDirective]:', err);
      this.lazyWorker.next(false);
    };
  }
}
