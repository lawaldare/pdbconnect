/* eslint-disable no-useless-escape */
import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  // public baseUrl = computed(() => {
  //   const host = window.location.hostname;
  //   return host === 'www.ebi.ac.uk' ? 'https://www.ebi.ac.uk/pdbe/' : 'https://wwwdev.ebi.ac.uk/pdbe/';
  // });

  public readonly baseUrl = signal<string>('https://www.ebi.ac.uk/pdbe/');

  private _snackBar = inject(MatSnackBar);
  private clipboard = inject(Clipboard);

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

    const first = `${this.baseUrl()}entry/search/index/?searchParams=`;

    return first + encodedURL;
  }

  public generateSortedQueryURL(ligandId: string, queryLabel: string) {
    const queryArray = [{ value: ligandId as string, condition1: 'AND', condition2: 'Equals' }];
    const resultState = { tabIndex: 0, paginationIndex: 1, perPage: 10, sortBy: 'release_date desc' };

    const payload = { [queryLabel]: queryArray, resultState: resultState };

    const urlStringObject = JSON.stringify(payload);

    const encodedURL = encodeURIComponent(urlStringObject);

    const first = `${this.baseUrl()}entry/search/index/?searchParams=`;

    return first + encodedURL;
  }

  public generateQueryURLForExperimentalMethod(complexId: string, experimentalMethod: string) {
    const experimentalMethodQuery = { value: experimentalMethod, condition1: 'AND', condition2: 'Equal to' };
    const complexIdQuery = { value: complexId, condition1: 'AND', condition2: 'Equal to' };
    const resultState = { tabIndex: 0, paginationIndex: 1, perPage: 10, sortBy: 'Sort by' };

    const payload = { q_experimental_method: [experimentalMethodQuery], q_complex_id: [complexIdQuery], resultState: resultState };

    const urlStringObject = JSON.stringify(payload);

    const encodedURL = encodeURIComponent(urlStringObject);

    const first = `${this.baseUrl()}entry/search/index/?searchParams=`;

    return first + encodedURL;
  }

  public generateQueryURLForComplexLigand(complexId: string, ligandId: string) {
    const ligandIdQuery = { value: ligandId, condition1: 'AND', condition2: 'Equal to' };
    const complexIdQuery = { value: complexId, condition1: 'AND', condition2: 'Equal to' };
    const resultState = { tabIndex: 0, paginationIndex: 1, perPage: 10, sortBy: 'Sort by' };

    const payload = { q_compound_id: [ligandIdQuery], q_complex_id: [complexIdQuery], resultState: resultState };

    const urlStringObject = JSON.stringify(payload);

    const encodedURL = encodeURIComponent(urlStringObject);

    const first = `${this.baseUrl()}entry/search/index/?searchParams=`;

    return first + encodedURL;
  }

  public cleanUpIds(pdbids: string): any[] {
    return pdbids
      .split(/,| |;|\t|\r?\n/)
      .map(Function.prototype.call, String.prototype.trim)
      .filter((n) => n)
      .filter(this.onlyUnique);
  }

  private onlyUnique(value: any, index: any, self: string | any[]): boolean {
    return self.indexOf(value) === index;
  }

  public downloadFile(content: any, fileName: string, mimeType: string): boolean {
    const a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (content) {
      if (URL && 'download' in a) {
        // html5 A[download]
        a.href = URL.createObjectURL(
          new Blob([content], {
            type: mimeType,
          })
        );
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
      } else {
        location.href = `data:application/octet-stream,${encodeURIComponent(content)}`;

        return true;
      }
    }
    return false;
  }

  public copy(value: string): void {
    const result = this.clipboard.copy(value);
    if (result) {
      this.openSnackBar('Copied to clipboard successfully', 'Dismiss');
    }
  }

  public openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  public readonly currentlyActive = signal<string>('');

  public setCurrentActive(activeSection: string) {
    this.currentlyActive.set(activeSection);
  }

  public redirectToSearchTerm(value: string, target = '_self'): void {
    const trimmedValue = value.trim();
    const hrefArray = window.location.href.split('/');
    const removedString = hrefArray.pop();
    if (removedString?.includes('?from=complex')) {
      hrefArray.push('complexes');
    }
    hrefArray.push(trimmedValue);
    const href = hrefArray.join('/');
    window.open(href, target);
  }

  //TODO: Update this method for redirection from latest release page
  public redirectToHomepageSearchTerm(value: string): void {
    const trimmedValue = value.trim();
    const hrefLink = window.location.href;
    const href = hrefLink + 'chemicalCompound/show/' + trimmedValue;
    window.open(href, '_self');
  }

  private sortByArrayOrderComparator(lhs: string, rhs: string, sortOrder: any[]) {
    return sortOrder.indexOf(lhs) - sortOrder.indexOf(rhs);
  }

  public breakArrayIntoChunks(array: any[], chunkSize: number): any[][] {
    const chunks: any[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  public isNotEmptyObject(obj: any): boolean {
    return obj && Object.keys(obj).length > 0;
  }

  public escapeValue(value: string): string {
    // If the field value has a space, colon, quotation mark or forward slash
    // in it, wrap it in quotes, unless it is a range query or it is already
    // wrapped in quotes.
    if (window.location.href.indexOf('text:') < 0) {
      if (value.match(/[ :\/"]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
        return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      }
    } else {
      // else if it is a text search, don't put quotes around the search term when there is a space
      if (value.match(/[:\/"]/) && !value.match(/[\[\{]\S+ TO \S+[\]\}]/) && !value.match(/^["\(].*["\)]$/)) {
        return '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
      }
    }
    return value;
  }

  public getLoopCount(totalRecs: number): number[] {
    const loopCount = new Array(Math.ceil(totalRecs / 10));
    return loopCount;
  }

  public sortByArrayOrder(arrayToBeSorted: any[], sortOrder: any[]) {
    return arrayToBeSorted ? [...arrayToBeSorted].sort((a, b) => this.sortByArrayOrderComparator(a.resource, b.resource, sortOrder)) : [];
  }

  public sortArrayObjectByArrayOrder(arrayToBeSorted: any[], sortOrder: string[], keyValue: string): any[] {
    return arrayToBeSorted ? [...arrayToBeSorted].sort((a, b) => this.sortByArrayOrderComparator(a[keyValue], b[keyValue], sortOrder)) : [];
  }
}
