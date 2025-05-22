import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseHrefService {
  public setBaseHref() {
    const hostname = document.location.hostname;
    const pathname = document.location.pathname;
    const pathnamesArray = pathname.split('/');
    const mappedHref = `/${pathnamesArray[1]}/${pathnamesArray[2]}/`;
    let baseHref: string;

    if (hostname === 'localhost') {
      baseHref = '/';
    } else {
      if (mappedHref === '/pdbe-srv/pdbechem/') {
        baseHref = '/pdbe/connect';
      } else {
        baseHref = mappedHref;
      }
    }

    const baseTag = document.querySelector('base');
    if (baseTag) {
      baseTag.setAttribute('href', baseHref);
    }
  }
}
