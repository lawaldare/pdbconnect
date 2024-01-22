// import { Injectable } from '@angular/core';
// import {HttpClient} from '@angular/common/http';
// import {Observable, lastValueFrom, of} from 'rxjs';
// import {catchError, map} from 'rxjs/operators';

// @Injectable()
// export class SolrAutocompleteService {

//   constructor(private http: HttpClient) { }

//   async search(term: string, config: any): Promise<any[]> {
//     let apiurl = `${config.searchUrl}?${config.additionalParams}&${config.group}&fl=${config.fields}&sort=${config.sort}&group.limit=${config.groupLimit}&q=value:${term}*~10`
    
//     // make ajax call
//     const searchAjax$ = this.http.get(apiurl)
//     .pipe(
//       map(
//         (data: any) => {
//           return data.grouped.category.groups;
//         }
//       ),
//       catchError(this.handleError(apiurl))
//     )
//     const searchAjaxResults = await lastValueFrom(searchAjax$);
//     return searchAjaxResults;
//   }

//    async searchMore(term: string, fqVal: string, config: any): Promise<any> {
//     let apiurl = `${config.searchUrl}?${config.additionalParams}&${config.group}&fl=${config.fields}&sort=${config.sort}&group.limit=-1&q=value:${term}*~10&fq=var_name:${fqVal}`
   
//     const searchAjax$ = this.http.get(apiurl)
//     .pipe(
//       map(
//         (data: any) => {
//         return data.grouped.category.groups as any[]
//         }
//       ),
//       catchError(this.handleError(apiurl))
//     );
//     const searchAjaxResults = await lastValueFrom(searchAjax$);
//     return searchAjaxResults;
//    }

//    /**
//    * Handle Http operation that failed.
//    * Let the app continue.
//    * @param operation - name of the operation that failed
//    */
//   private handleError(apiUrl = 'API request') {
//     return (error: any): Observable<any> => {
//       return of([]);
//     };
//   }

// }