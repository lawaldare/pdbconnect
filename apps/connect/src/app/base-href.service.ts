import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseHrefService {
  public setBaseHref() {
    const hostname = document.location.hostname;
    let baseHref: string;

    if (hostname === 'localhost') {
      console.log('Running on localhost', hostname);
      baseHref = '/';
    } else {
      console.log('Running on production', hostname);
      const pathnamesArray = document.location.pathname.split('/');
      baseHref = `/${pathnamesArray[1]}/${pathnamesArray[2]}/`;
    }

    const baseTag = document.querySelector('base');
    if (baseTag) {
      baseTag.setAttribute('href', baseHref);
    }
  }
}
