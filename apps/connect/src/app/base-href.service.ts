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
      console.log('Setting base href for production environment', document.location.pathname);
      const pathnamesArray = document.location.pathname.split('/');
      baseHref = `/${pathnamesArray[1]}/${pathnamesArray[2]}/`;
    }

    const baseTag = document.querySelector('base');
    console.log('Setting base href:', baseTag);
    if (baseTag) {
      baseTag.setAttribute('href', baseHref);
    }
  }
}
