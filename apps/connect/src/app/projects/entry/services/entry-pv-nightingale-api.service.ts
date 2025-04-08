import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIConservationData, APITrackData, APIVariationData } from '@pdbe-lib/pv-nightingale-components';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PvDataApiService {
  private readonly http = inject(HttpClient);

  /**
   * Endpoints list for entryId + entityId
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/uniprot_mapping/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/chains/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/domains/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/rfam/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/secondary_structure/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/binding_sites/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/interfaces/${entryId}/${entityId}
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/annotations/${entryId}/${entityId}
   */
  public getPdbeEntityTrackData(entryId: string, entityId: string, endpoint: string): Observable<Record<string, APITrackData>> {
    const url = `${environment.pdbeBaseUrl}graph-api/pdbe_pages/protvista/${endpoint}/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url);
  }
  public getPdbeConservationTrackData(entryId: string, entityId: string) {
    const url = `${environment.pdbeBaseUrl}graph-api/pdb/sequence_conservation/${entryId}/${entityId}`;
    return this.http.get<APIConservationData>(url);
  }
  public getPdbeVariationTrackData(entryId: string, entityId: string) {
    const url = `${environment.pdbeBaseUrl}graph-api/pdbe_pages/protvista/variation/${entryId}/${entityId}`;
    return this.http.get<APIVariationData>(url);
  }
}
