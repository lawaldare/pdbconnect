import { inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable()
export class DownloadService {
  private readonly location = inject(Location);
  private readonly http = inject(HttpClient);

  downloadFile(url: string): Observable<any> {
    // Process the file downloaded
    return this.http
      .get(url, {
        responseType: 'blob',
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          const resp = { error: 'Server request failed!' };
          return of(resp);
        })
      );

    // .subscribe(res => {
    //     // this.saveFile(res.blob(), filename);
    // });
  }

  saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
  };

  downloadFilesInfo(pdbId: string): Observable<any> {
    return this.http.get('https://www.ebi.ac.uk/pdbe/api/pdb/entry/files/' + pdbId).pipe(
      map((response) => response),
      catchError((error) => {
        const resp = { error: 'Server request failed!' };
        return of(resp);
      })
    );
  }
}
