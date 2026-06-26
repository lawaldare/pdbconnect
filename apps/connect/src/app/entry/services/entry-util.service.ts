import { Injectable, signal } from '@angular/core';

export interface Error {
  title: string;
  message: string;
}

export type PageView = 'LOADING' | 'SUCCESS' | 'ERROR' | 'OTHER';

@Injectable({
  providedIn: 'root',
})
export class EntryUtilService {
  private _errorStatusCode = signal<number>(404);
  public errorStatusCode = this._errorStatusCode.asReadonly();

  private _pageView = signal<PageView>('LOADING');
  public pageView = this._pageView.asReadonly();

  public setError(errorStatusCode: number) {
    this._errorStatusCode.set(errorStatusCode);
  }

  public setPageView(view: PageView) {
    this._pageView.set(view);
  }
}
