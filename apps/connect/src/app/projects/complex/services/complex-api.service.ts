import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { ComplexData } from '../models/complex-structure.model';

@Injectable({
  providedIn: 'root',
})
export class ComplexAPIService {
  private readonly http = inject(HttpClient);

  private readonly AggregatedApiUrl = `${environment.pdbeBaseUrl}aggregated-api/`;

  public getSummaryForComplexData(complexId: string): Observable<ComplexData> {
    return this.http
      .get<ComplexData>(`${this.AggregatedApiUrl}complex/details/${complexId}?id_type=pdb_complex_id`)
      .pipe(map((response: any) => response[complexId][0]));
  }
}
