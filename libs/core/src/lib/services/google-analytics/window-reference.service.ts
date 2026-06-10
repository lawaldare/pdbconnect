import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowReferenceService {
  private platformId = inject(PLATFORM_ID);
  get nativeWindow() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    return getWindow();
  }
}
