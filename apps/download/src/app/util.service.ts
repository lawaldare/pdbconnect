/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public cleanUpIds(pdbids: string): string[] {
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
}
