import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseHrefService {
  public setBaseHref() {
    const hostname = document.location.hostname;
    let baseHref: string;

    if (hostname === 'localhost') {
      baseHref = '/';
    } else {
      const pathname = document.location.pathname;
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
