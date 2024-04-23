import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataRetrievalService {
  constructor(private http: HttpClient) {}

  fetchUntypedData(dataRequestObjects: Array<{ name: string; url: string }>) {
    const endpointNames = dataRequestObjects.map((dataRequestObj) => dataRequestObj.name);
    const toForkJoin: Observable<any>[] = dataRequestObjects.map((dataRequestObj) => this.http.get<any>(dataRequestObj.url));

    return forkJoin(toForkJoin).pipe(
      map((data) => {
        const dataAsObj: any = {};
        for (let i = 0; i < data.length; i++) {
          const dataName = endpointNames[i];
          const datum = data[i];
          dataAsObj[dataName] = datum;
        }
        return dataAsObj as any;
      })
    );
  }
}
