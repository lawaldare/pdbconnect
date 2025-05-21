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
    } else if (pathname === '/pdbe-srv/pdbechem/') {
      baseHref = '/pdbe/connect/';
    } else {
      const pathnamesArray = pathname.split('/');
      baseHref = `/${pathnamesArray[1]}/${pathnamesArray[2]}/`;
    }

    const baseTag = document.querySelector('base');
    if (baseTag) {
      baseTag.setAttribute('href', baseHref);
    }
  }
}
