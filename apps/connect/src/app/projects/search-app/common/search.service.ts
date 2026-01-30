import { Injectable } from '@angular/core';
// import { Router, ActivatedRoute }   from '@angular/router';
import { Location } from '@angular/common';
import { pdbeUrl } from '../app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  filterCards: any[];

  //constructor(private location: Location, private route: ActivatedRoute, private router: Router, private http: Http) {
  constructor(
    private location: Location,
    private http: HttpClient
  ) {
    this.filterCards = [];
  }

  public getLigandEntity(pdbId: string, compoundId: string): Observable<string> {
    return this.http.get<string>(`https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/${pdbId}`).pipe(
      map((resp: any) => {
        const molecules = resp[pdbId];
        for (const molecule of molecules) {
          if (molecule.chem_comp_ids && molecule.chem_comp_ids.includes(compoundId)) {
            return molecule.entity_id;
          }
        }
      })
    );
  }

  public getMoleculeInChains(pdbId: string, entityId: string): Observable<string> {
    return this.http.get<string>(`https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/${pdbId}`).pipe(
      map((resp: any) => {
        const molecules = resp[pdbId];
        for (const molecule of molecules) {
          if (molecule.entity_id === Number(entityId)) {
            return molecule.in_chains[0];
          }
        }
      })
    );
  }

  querySolr(managarName: string, url: string, downloadQueryData?: any): Observable<any> {
    return this.http.get(url).pipe(
      map((resp: any) => {
        resp['queryUrl'] = url;
        resp['managerName'] = managarName;
        resp['downloadQueryData'] = downloadQueryData;
        return resp;
      }),
      catchError((error) => {
        // TODO: add real error handling
        const resp = {
          managarName: managarName,
          error: 'Server request failed! Please reload the page!',
        };
        // return Observable.of<any>(resp);
        return of(resp);
      })
    );
  }

  resetFilterCards(): void {
    this.filterCards = [];
  }

  getFilterCards(): any[] {
    return this.filterCards;
  }
  removeFilterCard(index: any): any[] {
    return this.filterCards.splice(index, 1);
  }

  addFilterCards(card: any): void {
    this.filterCards.push(card);
  }

  getValidationSliderDataFromApi(ids: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };

    const validationApiUrl = 'https://www.ebi.ac.uk/pdbe/api/validation/summary_quality_scores/entry/';
    return this.http.post(validationApiUrl, ids, options).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getValidationSliderDataFromSolr(pdbidsArr: string[]): Observable<any> {
    const validationSolrUrl = 'https://www.ebi.ac.uk/pdbe/search/pdb/select?';
    const fieldList =
      'fl=pdb_id,data_quality,model_quality,experiment_data_available,experimental_method,entry_organism_scientific_name,assembly_composition,struct_asym_id,compound_id,bound_compound_id,overall_quality';
    const groupSearchBy = '&group=true&group.field=pdb_id&rows=1000';
    const responceFormat = '&wt=json';
    const pidForQuery = '&q=pdb_id:(' + pdbidsArr.join(' OR ') + ')';
    const searchUrl = validationSolrUrl + fieldList + groupSearchBy + responceFormat + pidForQuery;
    return this.http.get(searchUrl).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getGalleryImages(id: string): Observable<any> {
    const imagesApiUrl = pdbeUrl + 'static/entry/' + id + '.json';
    return this.http.get(imagesApiUrl).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.error(errMsg);
    return Promise.reject(errMsg);
  }

  //Method to clean/encode special characters in the URL
  fixedEncodeURIComponent(str: string) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  getPdbByIdenticalSeq(seq: string): Observable<any> {
    const coreUrl = 'http://www.ebi.ac.uk/pdbe/search/carb/select';

    let seqSolrUrl =
      coreUrl +
      '?group=true&group.field=pdb_id&group.ngroups=true&json.nl=map&fl=pdb_id,data_quality,model_quality,experiment_data_available,experimental_method,entry_organism_scientific_name,assembly_composition,struct_asym_id,compound_id&rows=100000&start=0&wt=json';
    seqSolrUrl += '&q=molecule_sequence:*' + seq + '*';
    return this.http.get(seqSolrUrl).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
}
