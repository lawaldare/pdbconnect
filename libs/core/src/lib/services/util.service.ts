import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  // constructor() {}

  public generateQueryURL(arr: string[] | string, queryTerm: string): string {
    const isArray = Array.isArray(arr);

    let queryArray: { value: string; condition1: string; condition2: string }[];

    if (isArray) {
      queryArray = (arr as string[]).map((str) => {
        return { value: str, condition1: 'OR', condition2: 'Equal to' };
      });
    } else {
      queryArray = [{ value: arr as string, condition1: 'AND', condition2: 'Contains' }];
    }

    const payload = { [queryTerm]: queryArray };

    const urlStringObject = JSON.stringify(payload);

    const encodedURL = encodeURIComponent(urlStringObject);

    const first = 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=';

    return first + encodedURL;
  }
}
