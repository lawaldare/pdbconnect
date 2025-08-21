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
  private readonly BaseAPI = `https://www.ebi.ac.uk/pdbe/graph-api/`;

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
    const url = `${this.BaseAPI}pdbe_pages/protvista/uniprot_mapping/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntityChainsTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/chains/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntityDomainsTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/domains/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntityRfamTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/rfam/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntitySecondaryStructureTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/secondary_structure/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntityBindingSitesTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/binding_sites/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntityInterfacesTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/interfaces/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeEntityAnnotationsTrackData(entryId: string, entityId: string): Observable<APITrackData> {
    const url = `${this.BaseAPI}pdbe_pages/protvista/annotations/${entryId}/${entityId}`;
    return this.http.get<Record<string, APITrackData>>(url).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as APITrackData);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getPdbeConservationTrackData(entryId: string, entityId: string) {
    const url = `${this.BaseAPI}pdb/sequence_conservation/${entryId}/${entityId}`;
    return this.http.get<APIConservationData>(url);
  }

  public getPdbeVariationTrackData(entryId: string, entityId: string) {
    const url = `${this.BaseAPI}pdbe_pages/protvista/variation/${entryId}/${entityId}`;
    return this.http.get<APIVariationData>(url);
  }
}
