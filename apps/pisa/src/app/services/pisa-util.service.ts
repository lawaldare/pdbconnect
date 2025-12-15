import { Injectable, signal } from '@angular/core';

export type PageView = 'INITIAL' | 'PROCESS' | 'ERROR';
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

  public saveDataInSessionStorage(payload: any, storageId: string): void {
    sessionStorage.setItem(storageId, JSON.stringify(payload));
  }

  public removeDataInSessionStorage(storageId: string): void {
    sessionStorage.removeItem(storageId);
  }

  public getDataInSessionStorage(storageId: string): any | null {
    const payload = sessionStorage.getItem(storageId);
    return payload ? JSON.parse(payload) : null;
  }

  private _currentTabName = signal<string>('summary');
  public currentTabName = this._currentTabName.asReadonly();

  public updateCurrentTabName(tabName: string): void {
    this._currentTabName.set(tabName);
  }
}
