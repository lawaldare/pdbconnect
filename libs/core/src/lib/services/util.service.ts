import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  // constructor() {}

  public generateMultipleQueryURL(arr: string[]): string {
    const queryArray = arr.map((str) => {
      return { value: str, condition1: 'OR', condition2: 'Equal to' };
    });

    const payload = { q_pdb_id: queryArray };

    const urlStringObject = JSON.stringify(payload);

    const encodedURL = encodeURIComponent(urlStringObject);

    const first = 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=';

    return first + encodedURL;
  }
}
