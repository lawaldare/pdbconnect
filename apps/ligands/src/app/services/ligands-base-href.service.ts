import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LigandsBaseHrefService {
  public setBaseHref() {
    const hostname = document.location.hostname;
    const pathname = document.location.pathname;

    let baseHref: string;

    if (hostname === 'localhost') {
      baseHref = '/';
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
