import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, delay, map } from 'rxjs';
import { ComplexData } from '../models/complex-structure.model';

@Injectable({
  providedIn: 'root',
})
export class ComplexAPIService {
  private readonly http = inject(HttpClient);

  private readonly AggregatedApiUrl = `${environment.pdbeBaseUrl}aggregated-api/`;

  public getSummaryForComplexData(complexId: string): Observable<ComplexData> {
    return this.http.get<ComplexData>(`${this.AggregatedApiUrl}complex/details/${complexId}?id_type=pdb_complex_id`).pipe(
      map((response: any) => {
        return {
          ...response[complexId][0],
          complexId: complexId,
        };
      })
    );
  }

  public getLigandsForComplexPages(complexId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}complex/bound_molecules_summary/${complexId}`).pipe(map((response: any) => response[complexId]));
  }

  public getPublications(pdbIds: string): Observable<any> {
    return this.http.post<any>(`${this.AggregatedApiUrl}pdb/entry/publications`, pdbIds);
  }
}
