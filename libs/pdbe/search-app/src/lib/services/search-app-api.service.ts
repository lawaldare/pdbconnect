import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchAppAPIService {
  private readonly http = inject(HttpClient);

  search(term: string, config: any): Observable<any[]> {
    const url = `${config.searchUrl}?${config.additionalParams}&${config.group}&fl=${config.fields}&sort=${config.sort}&group.limit=${config.groupLimit}&q=value:${term}*~10`;
    return this.http.get(url).pipe(map((data: any) => data['grouped']['category']['groups']));
  }

  searchMore(term: string, fqVal: string, config: any): Observable<any[]> {
    const url = `${config.searchUrl}?${config.additionalParams}&${config.group}&fl=${config.fields}&sort=${config.sort}&group.limit=-1&q=value:${term}*~10&fq=var_name:${fqVal}`;
    return this.http.get(url).pipe(map((data: any) => data['grouped']['category']['groups']));
  }
}
