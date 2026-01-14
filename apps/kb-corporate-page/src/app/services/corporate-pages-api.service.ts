/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CorporatePagesApiService {
  private readonly http = inject(HttpClient);
  private readonly releaseDataUrl = 'assets/data/latest_release_data.json';
  private readonly partnersDescriptionUrl = 'assets/data/partners_descriptions.json';

  public getReleaseData(): Observable<any> {
    return this.http.get(this.releaseDataUrl);
  }

  public getPartnersDescriptionData(): Observable<any> {
    return this.http.get(this.partnersDescriptionUrl);
  }
}
