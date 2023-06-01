/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface HeaderProps {
  [name: string]: string | number | (string | number)[];
}

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  constructor(private http: HttpClient) {}

  getApiData(apiUrl: string, isInternal?: boolean): Observable<any> {
    // Get the token & create headers
    const headerProps = {} as HeaderProps;
    if (isInternal) {
      headerProps['X-Source'] = 'alphafold';
    }
    const headers = new HttpHeaders(headerProps);
    return this.http.get(apiUrl, { headers }).pipe(
      tap((data) => {
        // data['url'] = apiurl;
        return data;
      }),
      catchError(this.handleError(apiUrl))
    );
  }

  private handleError(apiUrl = 'API request') {
    return (error: HttpErrorResponse): Observable<any> => {
      const err = [apiUrl, error.status];
      return of(err);
    };
  }
}
