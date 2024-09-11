import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComplexAPIService {
  private readonly http = inject(HttpClient);
  private readonly url = 'assets/sample_data.json';

  public getSummaryForComplexData(complexId: string) {
    return this.http.get(this.url);
  }
}
