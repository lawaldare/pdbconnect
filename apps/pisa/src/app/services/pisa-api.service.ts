import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EMPTY, expand, filter, map, Observable, switchMap, take, throwIfEmpty, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PisaApiService {
  private BASE_API = `${environment.baseUrl}pdbe/pdbe-kb/pisa/api/`;
  private readonly POLL_MS = 3000;
  private readonly MAX_POLLS = 200; // ~90s

  private readonly http = inject(HttpClient);

  public submitJobFile(file: Blob, meta: { ligand_position: string; asis: boolean; exclude_ligands: string[]; fileName: string }): Observable<any> {
    let params = new HttpParams();

    if (Array.isArray(meta.exclude_ligands) && meta.exclude_ligands.length > 0) {
      meta.exclude_ligands.forEach((ligand) => (params = params.append('exclude_ligands', ligand)));
    }

    params = params.set('asis', String(meta.asis));
    params = params.set('ligand_position', String(meta.ligand_position));

    const form = new FormData();
    // give a filename; FastAPI doesn’t require it but it helps
    form.append('file', file, meta.fileName);

    // Send file as raw body
    return this.http.post<any>(`${this.BASE_API}submit`, form, { params });
  }

  public getAssemblyResults(jobId: string): Observable<any> {
    const request$ = () => {
      const params = new HttpParams().set('file_format', 'json').set('_ts', Date.now().toString()); // prevent cached 202/400

      return this.http.get<any>(`${this.BASE_API}results/complexes/${jobId}`, {
        params,
        observe: 'response',
      });
    };

    return request$().pipe(
      expand((res: HttpResponse<any>) => (res.status === 202 ? timer(this.POLL_MS).pipe(switchMap(() => request$())) : EMPTY)),
      take(this.MAX_POLLS),
      filter((res) => res.status === 200),
      take(1),
      map((res) => res.body),
      throwIfEmpty(() => new Error('Timed out waiting for assembly results'))
    );
  }

  public getInterfaceResults(jobId: string): Observable<any> {
    const request$ = () => {
      const params = new HttpParams().set('file_format', 'json').set('_ts', Date.now().toString()); // prevent cached 202/400

      return this.http.get<any>(`${this.BASE_API}results/interface_summary/${jobId}`, {
        params,
        observe: 'response',
      });
    };

    return request$().pipe(
      expand((res: HttpResponse<any>) => (res.status === 202 ? timer(this.POLL_MS).pipe(switchMap(() => request$())) : EMPTY)),
      take(this.MAX_POLLS),
      filter((res) => res.status === 200),
      take(1),
      map((res) => res.body),
      throwIfEmpty(() => new Error('Timed out waiting for interface results'))
    );
  }

  public getInterfaceResultForInterfaceId(jobId: string, interfaceId: string): Observable<any> {
    const params = new HttpParams().set('file_format', 'json');
    return this.http.get<any>(`${this.BASE_API}results/interface/${jobId}/${interfaceId}`, { params });
  }

  public getExtendedInterfaceResultForInterfaceId(jobId: string): Observable<any> {
    const params = new HttpParams().set('file_format', 'json');
    return this.http.get<any>(`${this.BASE_API}results/ancillary/components/${jobId}`, { params });
  }
}
