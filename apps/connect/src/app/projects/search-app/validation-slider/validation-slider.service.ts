import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class ValidationSliderService {
  advancedSearchForm: any;
  private http = inject(HttpClient); // Inject HttpClient into the constructor

  getValidationData(pdbId: string): Observable<any> {
    const url = '//www.ebi.ac.uk/pdbe/api/validation/summary_quality_scores/entry/';
    return this.http.get(url + '' + pdbId).pipe(map((response) => response));
  }
}
