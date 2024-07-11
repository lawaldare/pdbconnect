import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {
  private BASE_API = 'https://www.ebi.ac.uk/pdbe/api/pdb/entry/';

  constructor(private http: HttpClient) {}

  public getPrimaryPublicationAbstract(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}publications/${entryId}`).pipe(map((data) => data[entryId][0]));
  }
  public getArticleCitingPDBEntry(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}related_publications/${entryId}`).pipe(
      map((data) => {
        return {
          citedThePublication: data[entryId]['cited_by'],
          uniprotPublications: data[entryId]['uniprot_publications'],
          metionedButNotCited: data[entryId]['appears_without_citation'],
        };
      })
    );
  }
}
