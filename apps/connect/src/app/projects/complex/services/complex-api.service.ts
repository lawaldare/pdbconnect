/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';

@Injectable({
  providedIn: 'root',
})
export class ComplexAPIService {
  private readonly http = inject(HttpClient);

  private readonly AggregatedApiUrl = `${environment.baseUrl}pdbe/api/v2/`;

  public getSummaryForComplexData(complexId: string, idType = 'pdb_complex_id'): Observable<ComplexData> {
    return this.http.get<ComplexData>(`${this.AggregatedApiUrl}complex/details/${complexId}?id_type=${idType}`).pipe(
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

  public getComplexIdHistory(complexId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}complex/id_history/${complexId}`).pipe(
      map((response: any) => {
        return response[complexId];
      })
    );
  }

  public getComplexSummaryStats(pdbId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}pdb/entry/complex_summary_stats/${pdbId}`).pipe(map((response: any) => response[pdbId]));
  }

  public getPisaAssembliesParams(complexId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}complex/pisa_assemblies_params/${complexId}`).pipe(map((response: any) => response[complexId]));
  }

  public getPublications(pdbIds: string): Observable<any> {
    return this.http.post<any>(`${this.AggregatedApiUrl}pdb/entry/publications`, pdbIds);
  }

  public getInteractions(complexId: string): Observable<ComplexInteraction[]> {
    return this.http
      .get<Record<string, ComplexInteraction[]>>(`${this.AggregatedApiUrl}complex/interactions/${complexId}`)
      .pipe(map((response: any) => response[complexId]));
  }
}
