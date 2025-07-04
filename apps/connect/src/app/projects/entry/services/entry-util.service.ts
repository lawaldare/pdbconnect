import { Injectable, signal } from '@angular/core';

export interface Error {
  title: string;
  message: string;
}

export type EntryPageView = 'LOADING' | 'SUCCESS' | 'ERROR' | 'OTHER';

@Injectable({
  providedIn: 'root',
})
export class EntryUtilService {
  private _errorStatusCode = signal<number>(404);
  public errorStatusCode = this._errorStatusCode.asReadonly();

  private _entryPageView = signal<EntryPageView>('LOADING');
  public entryPageView = this._entryPageView.asReadonly();

  public setError(errorStatusCode: number) {
    this._errorStatusCode.set(errorStatusCode);
  }

  public setEntryStatus(status: EntryPageView) {
    this._entryPageView.set(status);
  }
}
