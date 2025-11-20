import { Injectable, signal } from '@angular/core';

export type PageView = 'INITIAL' | 'PROCESS';
export type LoadingView = 'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR_LOADING';

@Injectable({
  providedIn: 'root',
})
export class PisaUtilService {
  private _pageView = signal<PageView>('INITIAL');
  public pageView = this._pageView.asReadonly();

  private _loadingView = signal<LoadingView>('INITIAL');
  public loadingView = this._loadingView.asReadonly();

  public setPageView(view: PageView) {
    this._pageView.set(view);
  }

  public setLoadingView(view: LoadingView) {
    this._loadingView.set(view);
  }
}
