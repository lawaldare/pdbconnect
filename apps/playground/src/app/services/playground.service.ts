import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService {
  private BASE_API = 'https://www.ebi.ac.uk/pdbe/api/pdb/entry/';

  private readonly http = inject(HttpClient);

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

  public getXMLImages(pubmedId: string): Observable<any> {
    return this.http.get<any>(`https://www.ebi.ac.uk/pdbe/static/pubmed-files/${pubmedId}/images`);
  }

  public getEntryEcmSummary(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}summary/${entryId}`).pipe(
      map((data) => {
        const datum = data[entryId][0];
        const apiDate = datum.release_date;
        const formattedApiDate = `${apiDate.substring(4, 6)}/${apiDate.substring(6)}/${apiDate.substring(0, 4)}`;
        const dateObj = new Date(Date.parse(formattedApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
        return {
          entryTitle: datum.title!,
          entryAuthors: datum.entry_authors!.join(' '),
          releaseDate: dateObj,
        };
      })
    );
  }

  public getEntryEcmMolecules(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}molecules/${entryId}`);
  }

  public getEntryEcmExperiment(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}experiment/${entryId}`).pipe(
      map((data) => {
        const datum = data[entryId][0];
        return {
          experimentalMethod: datum.experimental_method,
          resolutionValue: datum.resolution,
        };
      })
    );
  }

  public getEntryEcmPublication(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}publications/${entryId}`).pipe(
      map((data) => {
        const datum = data[entryId][0];
        const authorList: string[] = [];
        for (const authorData of datum.author_list) {
          authorList.push(authorData.full_name!);
        }
        if (datum.journal_info.pdb_abbreviation! !== 'To be published') {
          return {
            publicationTitle: datum.title,
            publicationAuthors: authorList,
            publicationJournal: datum.journal_info.pdb_abbreviation!,
            publicationVolume: datum.journal_info.volume!,
            publicationPages: datum.journal_info.pages!,
            publicationYear: datum.journal_info.year!,
            publicationPMID: datum.pubmed_id!,
            publicationDOI: datum.doi!,
            pdbEntryDOI: `10.2210/pdb${entryId}/pdb`,
          };
        }
        return {
          publicationTitle: 'To be published',
          pdbEntryDOI: `10.2210/pdb${entryId}/pdb`,
        };
      })
    );
  }
}
