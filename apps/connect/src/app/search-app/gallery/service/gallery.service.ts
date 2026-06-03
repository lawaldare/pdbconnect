import { Inject, Injectable, Optional } from '@angular/core';

import { GalleryState, GalleryImage } from './gallery.state';
import { GalleryConfig } from '../config/gallery.config';
import { defaultState, defaultConfig } from '../config/gallery.default';
import { BehaviorSubject, finalize, interval, Observable, of, Subject, switchMap, takeWhile, tap } from 'rxjs';
import { GALLERY_CONFIG } from '../config/gallery.tokens';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  /** Gallery state */
  // state: BehaviorSubject<GalleryState>;
  /** Gallery config */
  // config: GalleryConfig = defaultConfig;
  /** Gallery slide show player */
  // player: Subject<number>;

  state = new BehaviorSubject<GalleryState>(defaultState);
  config: GalleryConfig;
  player = new Subject<number>();

  // constructor(@Optional() config: GalleryConfig) {
  //   /** Initialize the state */
  //   this.state = new BehaviorSubject<GalleryState>(defaultState);
  //   /** Initialize the config */
  //   this.config = Object.assign({}, defaultConfig, config);

  //   /** Initialize the player for play/pause commands */
  //   this.player = new Subject();
  //   this.player
  //     .asObservable()
  //     .pipe(
  //       switchMap((interval) =>
  //         interval ? this.playerEngine(interval) : of(null)
  //       )
  //     )
  //     .subscribe();
  // }
  constructor(@Optional() @Inject(GALLERY_CONFIG) cfg: GalleryConfig | null) {
    this.config = { ...defaultConfig, ...(cfg ?? {}) };

    this.player
      .asObservable()
      .pipe(switchMap((ms) => (ms ? this.playerEngine(ms) : of(null))))
      .subscribe();
  }

  /** Load images and reset the state */
  load(images: GalleryImage[]) {
    this.state.next({
      images: images,
      currIndex: 0,
      hasNext: images.length > 1,
      hasPrev: false,
      active: false,
    });
  }

  /** Set current image and update the state */
  set(index: number) {
    const state = this.state.getValue();

    this.state.next(
      Object.assign({}, state, {
        prevIndex: state.currIndex,
        currIndex: index,
        hasNext: index < state.images.length - 1,
        hasPrev: index > 0,
        active: true,
      })
    );
  }

  /** Go to next image and update the state */
  next() {
    const state = this.state.getValue();

    if (state.hasNext) {
      const index = state.currIndex + 1;
      this.set(index);
    } else {
      this.set(0);
    }
  }

  /** Go to previous image and update the state */
  prev() {
    const state = this.state.getValue();

    if (state.hasPrev) {
      const index = state.currIndex - 1;
      this.set(index);
    } else {
      this.set(state.images.length - 1);
    }
  }

  /** Close gallery modal if open */
  close() {
    const state = this.state.getValue();

    this.state.next(
      Object.assign({}, state, {
        active: false,
        play: false,
      })
    );
    this.stop();
  }

  /** Reset gallery with initial state */
  reset() {
    this.state.next(defaultState);
    this.stop();
  }

  /** Play slide show */
  play(interval?: number) {
    const speed = interval || this.config.player?.speed || 2000;

    const state = this.state.getValue();
    /** Open and play the gallery, 'active' opens gallery modal */
    this.state.next(Object.assign({}, state, { play: true, active: true }));
    this.player.next(speed);
  }

  /** End slide show */
  stop() {
    this.player.next(0);
  }

  // playerEngine(interval?:number) {
  //   return interval(interval)
  //     .takeWhile(() => this.state.getValue().play)
  //     .do(() => {
  //       this.next();
  //     })
  //     .finally(() => {
  //       this.state.next(
  //         Object.assign({}, this.state.getValue(), { play: false })
  //       );
  //     });
  // }

  playerEngine(ms: number) {
    return interval(ms).pipe(
      takeWhile(() => !!this.state.getValue().play),
      tap(() => this.next()),
      finalize(() => {
        this.state.next({ ...this.state.getValue(), play: false });
      })
    );
  }
}
