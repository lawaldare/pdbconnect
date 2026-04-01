import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { APIConservationData, APITrackData, APIVariationData } from '@pdbe-lib/pv-nightingale-components';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PvDataApiService {
  private readonly http = inject(HttpClient);
  private readonly isLocalhost = window?.location?.hostname === 'localhost';

  private readonly BaseAPI = `https://www.ebi.ac.uk/pdbe/graph-api/`; // TODO remove
  private readonly AggregatedApiUrl = `${environment.baseUrl}pdbe/api/v2/`;

  private buildUrl(endpoint: string, entryId: string, entityId: string): string {
    const baseUrl = this.isLocalhost ? this.BaseAPI : this.AggregatedApiUrl;
    let urlPath = this.isLocalhost ? 'pdbe_pages/protvista/' : 'pdb/entry/protvista/';
    if (endpoint === 'sequence_conservation') urlPath = 'pdb/';
    return `${baseUrl}${urlPath}${endpoint}/${entryId}/${entityId}`;
  }

  private handleTrackDataResponse(entryId: string) {
    return (source: Observable<Record<string, APITrackData>>) =>
      source.pipe(
        map((data) => data[entryId]),
        catchError((error) => {
          if (error?.status === 404) {
            return of({ empty: true } as unknown as APITrackData);
          }
          return throwError(() => error);
        })
      );
  }

  /**
   * Endpoints list for entryId + entityId
   * UniprotMapping
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/uniprot_mapping/${entryId}/${entityId}
   * Chains
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/chains/${entryId}/${entityId}
   * Domains
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/domains/${entryId}/${entityId}
   * Rfam
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/rfam/${entryId}/${entityId}
   * SecondaryStructure
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/secondary_structure/${entryId}/${entityId}
   * BindingSites
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/binding_sites/${entryId}/${entityId}
   * Interfaces
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/interfaces/${entryId}/${entityId}
   * Annotations
   * https://www${appUrlEnv}.ebi.ac.uk/pdbe/graph-api/pdbe_pages/protvista/annotations/${entryId}/${entityId}
   */

  public getPdbeEntityUniprotMappingTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('uniprot_mapping', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntityChainsTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('chains', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntityDomainsTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('domains', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntityRfamTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('rfam', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntitySecondaryStructureTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('secondary_structure', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntityBindingSitesTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('binding_sites', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntityInterfacesTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('interfaces', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeEntityAnnotationsTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = this.buildUrl('annotations', entryId, entityId);
    return this.http.get<Record<string, APITrackData>>(url).pipe(this.handleTrackDataResponse(entryId));
  }

  public getPdbeConservationTrackData(entryId: string, entityId: string) {
    const url = this.buildUrl('sequence_conservation', entryId, entityId);
    return this.http.get<APIConservationData>(url).pipe(
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APIConservationData);
        }
        return throwError(() => error);
      })
    );
  }

  public getPdbeVariationTrackData(entryId: string, entityId: string) {
    const url = `${this.BaseAPI}pdbe_pages/protvista/variation/${entryId}/${entityId}`;
    // const url = this.buildUrl('variation', entryId, entityId);
    return this.http.get<APIVariationData>(url).pipe(
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APIVariationData);
        }
        return throwError(() => error);
      })
    );
  }
}
