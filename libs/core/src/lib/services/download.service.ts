import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { EMPTY, Observable, throwError } from 'rxjs';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UtilService } from './util.service';
import { downloadParams, fdsTypeDict } from '../constants/download.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export enum DownloadType {
  Structures = 'structures',
  Molecules = 'molecules',
  Residues = 'residues',
}

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private fdstype = signal('');
  private hashedUrl = signal('');
  private fdsConfig = signal<Record<string, string[]>>({});
  private readonly downloadParams = downloadParams;
  private readonly fdsTypeDict = fdsTypeDict;

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    // eslint-disable-next-line @typescript-eslint/prefer-as-const
    responseType: 'json' as 'json',
  };

  private readonly http = inject(HttpClient);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  public errorEntryText = signal('');
  public errorEntryTextForStructures = signal('');
  public errorEntryTextForMolecules = signal('');
  public errorEntryTextForResidues = signal('');
  public isLoadingEntry = signal(false);
  public isLoadingEntryForStructures = signal(false);
  public isLoadingEntryForMolecules = signal(false);
  public isLoadingEntryForResidues = signal(false);
  private downloadType = signal<DownloadType>(DownloadType.Structures);

  public initiateDownload(apiUrl: string, apiType: string, pdbids: string, chosenFormat: string, downloadType: DownloadType): void {
    this.downloadType.set(downloadType);
    this.updateLoading(downloadType, true);
    this.isLoadingEntry.set(true);
    const correctIds = this.utilService.cleanUpIds(pdbids);
    this.fdsConfig.set({ ids: correctIds });
    this.getDownloadParams(apiUrl, apiType, chosenFormat);
  }

  private getDownloadParams(apiUrl: string, apiType: string, chosenFormat: string): void {
    this.fdstype.set(this.fdsTypeDict[chosenFormat]);
    if (chosenFormat in this.downloadParams) {
      for (const key in this.downloadParams[chosenFormat]) {
        const value = this.downloadParams[chosenFormat][key];
        this.fdsConfig()[key] = value;
      }
    }
    this.postFile(apiUrl, apiType, chosenFormat);
  }

  private postFile(apiUrl: string, apiType: string, chosenFormat: string): void {
    this.postFileDownloadServer(apiUrl, apiType, this.fdstype(), this.fdsConfig())
      .pipe(
        map((response) => {
          this.errorEntryText.set('');
          this.errorEntryTextForStructures.set('');
          this.errorEntryTextForMolecules.set('');
          this.errorEntryTextForResidues.set('');
          this.hashedUrl.set(response.url.replace('http:', 'https:'));
          this.getFile(apiType, chosenFormat);
        }),
        catchError((error) => {
          this.showErrorText(error);
          this.updateErrorText(this.downloadType(), error);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private getFile(apiType: string, chosenFormat: string): void {
    this.getFileDownloadServer(this.hashedUrl())
      .pipe(
        map((response) => {
          if (response.status == '200') {
            setTimeout(() => {
              this.utilService.downloadFile(response.body, `${chosenFormat}.tar.gz`, 'application/tar+gzip');
              this.updateLoading(this.downloadType(), false);
              this.isLoadingEntry.set(false);
            }, 1000);
          } else if (response.status == '202') {
            setTimeout(() => {
              this.getFile(apiType, chosenFormat);
            }, 500);
          } else {
            const errorText = `Error: The download server returns non 200/202 status: ${response.status}`;
            this.showErrorText(errorText);
            this.updateErrorText(this.downloadType(), errorText);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private postFileDownloadServer(apiUrl: string, apiType: string, fdsType: string, fdsConfig: Record<string, string[]>): Observable<any> {
    return this.http.post<any>(`${apiUrl}/${apiType}/${fdsType}`, fdsConfig, this.httpOptions).pipe(
      catchError((err) => {
        let errMsg = `${err.status}, ${err.statusText}`;
        if (err.status == 422) {
          errMsg = `${err.status}, ${err.statusText}. ${err.error.detail[0].msg}`;
        }
        return throwError(() => new Error(errMsg));
      })
    );
  }

  private getFileDownloadServer(hashedurl: string): Observable<any> {
    return this.http
      .get<any>(hashedurl, {
        observe: 'response',
        responseType: 'blob' as 'json',
      })
      .pipe(
        tap((data) => {
          return data;
        }),
        catchError(this.handleError(hashedurl))
      );
  }

  private handleError(fdsConfig: string) {
    return (error: Response): Observable<any> => {
      console.error(fdsConfig);
      const errMsg = `Error: ${error.status}, ${error.statusText}`;
      return throwError(() => new Error(errMsg));
    };
  }

  public showErrorText(text: string): void {
    this.errorEntryText.set(text);
    this.isLoadingEntry.set(false);
    this.updateLoading(this.downloadType(), false);
    setTimeout(() => {
      this.errorEntryText.set('');
    }, 3000);
  }

  private updateLoading(downloadType: DownloadType, update: boolean) {
    if (downloadType === DownloadType.Structures) {
      this.isLoadingEntryForStructures = signal(update);
      return;
    }
    if (downloadType === DownloadType.Molecules) {
      this.isLoadingEntryForMolecules = signal(update);
      return;
    }

    if (downloadType === DownloadType.Residues) {
      this.isLoadingEntryForResidues = signal(update);
      return;
    }
  }

  public updateErrorText(downloadType: DownloadType, text: string) {
    if (downloadType === DownloadType.Structures) {
      this.errorEntryTextForStructures = signal(text);
      setTimeout(() => {
        this.errorEntryTextForStructures.set('');
      }, 3000);
      return;
    }
    if (downloadType === DownloadType.Molecules) {
      this.errorEntryTextForMolecules = signal(text);
      setTimeout(() => {
        this.errorEntryTextForMolecules.set('');
      }, 3000);
      return;
    }

    if (downloadType === DownloadType.Residues) {
      this.errorEntryTextForResidues = signal(text);
      setTimeout(() => {
        this.errorEntryTextForResidues.set('');
      }, 3000);
      return;
    }
  }
}
