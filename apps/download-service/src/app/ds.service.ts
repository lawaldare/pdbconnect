import { Injectable, inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    // eslint-disable-next-line @typescript-eslint/prefer-as-const
    responseType: 'json' as 'json',
  };

  private readonly http = inject(HttpClient);

  private readonly fileDownloadUrl = environment.downloadAPIUrl;

  public postFileDownloadServer(apiType: string, fdsType: string, fdsConfig: Record<string, string[]>): Observable<any> {
    return this.http.post<any>(`${this.fileDownloadUrl}/${apiType}/${fdsType}`, fdsConfig, this.httpOptions).pipe(
      catchError((err) => {
        let errMsg = `${err.status}, ${err.statusText}`;
        if (err.status == 422) {
          errMsg = `${err.status}, ${err.statusText}. ${err.error.detail[0].msg}`;
        }
        return throwError(() => new Error(errMsg));
      })
    );
  }

  public getFileDownloadServer(hashedurl: string): Observable<any> {
    return this.http
      .get<any>(hashedurl, {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .pipe(
        tap((data) => {
          return data;
        }),
        catchError(this.handleError(hashedurl))
      );
  }

  private handleError(fdsConfig: string) {
    return (error: Response): Observable<any> => {
      console.error(fdsConfig);
      const errMsg = `Error: ${error.status}, ${error.statusText}`;
      return throwError(() => new Error(errMsg));
    };
  }
}
