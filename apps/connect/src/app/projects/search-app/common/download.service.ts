import { Injectable } from "@angular/core";
import { Location } from "@angular/common";
import { saveAs } from "file-saver/FileSaver";
import * as appSettings from "../app.settings";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, of } from "rxjs";

@Injectable()
export class DownloadService {
  constructor(private location: Location, private http: HttpClient) {}

  downloadFile(url: string): Observable<any> {
    // Process the file downloaded
    return this.http
      .get(url, {
        responseType: "blob",
      })
      .pipe(
        map((response) => response),
        catchError((error) => {
          let resp = { error: "Server request failed!" };
          return of(resp);
        })
      );

    // .subscribe(res => {
    //     // this.saveFile(res.blob(), filename);
    // });
  }

  saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  downloadFilesInfo(pdbId: string): Observable<any> {
    return this.http
      .get("https://www.ebi.ac.uk/pdbe/api/pdb/entry/files/" + pdbId)
      .pipe(
        map((response) => response),
        catchError((error) => {
          let resp = { error: "Server request failed!" };
          return of(resp);
        })
      );
  }
}
