import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  // constructor() {}

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

    const first = 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=';

    return first + encodedURL;
  }

  public generateSortedQueryURL(ligandId: string, queryLabel: string) {
    const queryArray = [{ value: ligandId as string, condition1: 'AND', condition2: 'Equals' }];
    const resultState = { tabIndex: 0, paginationIndex: 1, perPage: 10, sortBy: 'release_date desc' };

    const payload = { [queryLabel]: queryArray, resultState: resultState };

    const urlStringObject = JSON.stringify(payload);

    const encodedURL = encodeURIComponent(urlStringObject);

    const first = 'https://www.ebi.ac.uk/pdbe/entry/search/index/?searchParams=';

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

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  public readonly currentlyActive = signal<string>('');

  public setCurrentActive(activeSection: string) {
    this.currentlyActive.set(activeSection);
  }

  public redirectToSearchTerm(value: string): void {
    const trimmedValue = value.trim();
    const hrefArray = window.location.href.split('/');
    hrefArray.pop();
    hrefArray.push(trimmedValue);
    const href = hrefArray.join('/');
    window.open(href, '_self');
  }

  //TODO: Update this method for redirection from latest release page
  public redirectToHomepageSearchTerm(value: string): void {
    const trimmedValue = value.trim();
    const hrefLink = window.location.href;
    const href = hrefLink + 'chemicalCompound/show/' + trimmedValue;
    console.log(href);
    window.open(href, '_self');
  }

  public sortByArrayOrder(arrayToBeSorted: any[], sortOrder: any[]) {
    return arrayToBeSorted ? [...arrayToBeSorted].sort((a, b) => this.sortByArrayOrderComparator(a.resource, b.resource, sortOrder)) : [];
  }

  private sortByArrayOrderComparator(lhs: string, rhs: string, sortOrder: any[]) {
    return sortOrder.indexOf(lhs) - sortOrder.indexOf(rhs);
  }
}
