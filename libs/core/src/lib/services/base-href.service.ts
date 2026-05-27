import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseHrefService {
  private readonly platformId = inject(PLATFORM_ID);

  public setBaseHref() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const hostname = document.location.hostname;
    const pathname = document.location.pathname;

    let baseHref: string;

    if (hostname === 'localhost') {
      baseHref = '/';
    } else if (pathname.includes('complexes')) {
      baseHref = '/pdbe/pdbe-kb/';
    } else if (pathname.includes('entry')) {
      baseHref = '/pdbe/entry/';
    } else if (pathname.includes('search/index')) {
      baseHref = '/pdbe/entry/';
    } else {
      const pathnamesArray = pathname.split('/');
      const mappedHref = `/${pathnamesArray[1]}/${pathnamesArray[2]}/`;
      baseHref = mappedHref;
    }

    const baseTag = document.querySelector('base');
    if (baseTag) {
      baseTag.setAttribute('href', baseHref);
    }
  }
}
