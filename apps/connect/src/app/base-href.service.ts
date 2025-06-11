import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseHrefService {
  public setBaseHref() {
    const hostname = document.location.hostname;
    const pathname = document.location.pathname;

    let baseHref: string;

    if (hostname === 'localhost') {
      baseHref = '/';
    } else if (pathname.includes('complexes')) {
      baseHref = '/pdbe/pdbe-kb/';
    } else if (pathname.includes('entry')) {
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
