import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InteractionsApiService {
  private readonly http = inject(HttpClient);

  fetchCompoundAtoms(ligandId: string): Observable<any> {
    const atomsUrl = `https://ftp.ebi.ac.uk/pub/databases/msd/pdbechem_v2/ccd/${ligandId.charAt(0)}/${ligandId}/${ligandId}.cif`;
    return this.http.get(atomsUrl, { responseType: 'text' });
  }
}
