import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PisaApiService {
  private BASE_API = `${environment.baseUrl}pdbe/pdbe-kb/pisa/api/`;

  private readonly http = inject(HttpClient);

  public submitJob(payload: any): Observable<any> {
    let params = new HttpParams();
    const { ligand_position, file, exclude_ligands, asis } = payload;
    if (exclude_ligands && exclude_ligands.length > 0) {
      exclude_ligands.forEach((ligand: string) => (params = params.append('exclude_ligands', ligand)));
    }
    params = params.set('asis', asis);
    params = params.set('ligand_position', ligand_position);

    return this.http.post<any>(`${this.BASE_API}submit`, { file }, { params });
  }

  public getAssemblyResults(jobId: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('file_format', 'json');
    return this.http.get<any>(`${this.BASE_API}results/assembly/${jobId}`, { params });
  }
}
