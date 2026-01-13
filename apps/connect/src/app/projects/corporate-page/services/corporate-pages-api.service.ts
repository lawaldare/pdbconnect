import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CorporatePagesApiService {
  private readonly http = inject(HttpClient);
  private readonly releaseDataUrl = 'assets/corporate-page/data/latest_release_data.json';

  public getReleaseData(): Observable<any> {
    return this.http.get(this.releaseDataUrl);
  }
}
