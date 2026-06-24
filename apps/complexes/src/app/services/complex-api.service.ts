/* eslint-disable @typescript-eslint/no-explicit-any */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map, shareReplay, timeout } from 'rxjs';
import { ComplexData, ComplexInteraction } from '../models/complex-structure.model';
import { Depiction } from '../models/structure.model';

@Injectable({
  providedIn: 'root',
})
export class ComplexAPIService {
  private readonly http = inject(HttpClient);

  private readonly AggregatedApiUrl = `${environment.baseUrl}pdbe/api/v2/`;
  private readonly StaticFilesApiUrl = `${environment.baseUrl}pdbe/static/files/pdbechem_v2/`;
  private readonly DEFAULT_TIMEOUT = 10000; // 10 seconds

  fetchDepiction(ligandId: string): Observable<Depiction> {
    const depictionUrl = `${this.StaticFilesApiUrl}${ligandId}/annotation`;
    return this.http.get<Depiction>(depictionUrl).pipe(shareReplay(1));
  }

  public getSummaryForComplexData(complexId: string, idType = 'pdb_complex_id'): Observable<ComplexData> {
    return this.http.get<ComplexData>(`${this.AggregatedApiUrl}complex/details/${complexId}?id_type=${idType}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      map((response: any) => {
        return {
          ...response[complexId][0],
          complexId: complexId,
        };
      })
    );
  }

  public getLigandsForComplexPages(complexId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}complex/bound_molecules_summary/${complexId}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      map((response: any) => response[complexId])
    );
  }

  public getComplexIdHistory(complexId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}omplex/id_history/${complexId}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      map((response: any) => {
        return response[complexId];
      })
    );
  }

  public getComplexSummaryStats(pdbId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}pdb/entry/complex_summary_stats/${pdbId}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      map((response: any) => response[pdbId])
    );
  }

  public getPisaAssembliesParams(complexId: string): Observable<any> {
    return this.http.get<any>(`${this.AggregatedApiUrl}complex/pisa_assemblies_params/${complexId}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      map((response: any) => response[complexId])
    );
  }

  public getPublications(pdbIds: string): Observable<any> {
    return this.http.post<any>(`${this.AggregatedApiUrl}pdb/entry/publications`, pdbIds).pipe(timeout(this.DEFAULT_TIMEOUT));
  }

  public getInteractions(complexId: string): Observable<ComplexInteraction[]> {
    return this.http.get<Record<string, ComplexInteraction[]>>(`${this.AggregatedApiUrl}complex/interactions/${complexId}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      map((response: any) => response[complexId])
    );
  }
}
