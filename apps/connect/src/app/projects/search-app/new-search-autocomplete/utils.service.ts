/* eslint-disable no-useless-escape */
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
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

  public sortArrayStringByArrayOrder(arrayToBeSorted: string[], sortOrder: string[]): string[] {
    return arrayToBeSorted ? [...arrayToBeSorted].sort((a, b) => this.sortByArrayOrderComparator(a, b, sortOrder)) : [];
  }

  public sortArrayObjectByArrayOrder(arrayToBeSorted: any[], sortOrder: string[], keyValue: string): any[] {
    return arrayToBeSorted ? [...arrayToBeSorted].sort((a, b) => this.sortByArrayOrderComparator(a[keyValue], b[keyValue], sortOrder)) : [];
  }

  private sortByArrayOrderComparator(lhs: string, rhs: string, sortOrder: string[]): number {
    return sortOrder.indexOf(lhs) - sortOrder.indexOf(rhs);
  }

  private _searchText = signal<string>('');
  public searchText = this._searchText.asReadonly();

  public setSearchText(text: string) {
    this._searchText.set(text);
  }
}
