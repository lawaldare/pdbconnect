import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseHrefService {
  public setBaseHref() {
    const hostname = document.location.hostname;
    const pathname = document.location.pathname;
    const pathnamesArray = pathname.split('/');
    const mappedBaseHref = `/${pathnamesArray[1]}/${pathnamesArray[2]}/`;
    let baseHref: string;

    console.log('pathname:->', pathname);

    if (hostname === 'localhost') {
      baseHref = '/';
    } else if (mappedBaseHref === '/pdbe-srv/pdbechem/') {
      baseHref = '/pdbe/connect/';
    } else {
      baseHref = mappedBaseHref;
    }

    const baseTag = document.querySelector('base');
    if (baseTag) {
      baseTag.setAttribute('href', baseHref);
    }
  }
}
