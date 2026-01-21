import { Injectable, signal } from '@angular/core';
import { GridApi } from 'ag-grid-community';

export type PageView = 'INITIAL' | 'PROCESS' | 'ERROR';
export type LoadingView = 'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR_LOADING';
export type TabView = 'INITIAL' | 'SINGLE_INTERFACE' | 'ERROR';

@Injectable({
  providedIn: 'root',
})
export class PisaUtilService {
  private _pageView = signal<PageView>('INITIAL');
  public pageView = this._pageView.asReadonly();

  private _loadingView = signal<LoadingView>('INITIAL');
  public loadingView = this._loadingView.asReadonly();

  private _complexesTabView = signal<TabView>('INITIAL');
  public complexesTabView = this._complexesTabView.asReadonly();

  private _interfacesTabView = signal<TabView>('INITIAL');
  public interfacesTabView = this._interfacesTabView.asReadonly();

  public setPageView(view: PageView) {
    this._pageView.set(view);
  }

  public setComplexesTabView(view: TabView) {
    this._complexesTabView.set(view);
  }

  public setInterfacesTabView(view: TabView) {
    this._interfacesTabView.set(view);
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

  private _currentGridAPI = signal<GridApi | null>(null);
  public currentGridAPI = this._currentGridAPI.asReadonly();

  public setCurrentGridAPI(gridApi: GridApi): void {
    this._currentGridAPI.set(gridApi);
  }
}
