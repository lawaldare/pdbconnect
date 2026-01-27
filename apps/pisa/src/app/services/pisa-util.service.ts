import { Injectable, signal } from '@angular/core';
import { GridApi } from 'ag-grid-community';

export type PageView = 'INITIAL' | 'PROCESS' | 'ERROR';
export type LoadingView = 'INITIAL' | 'LOADING' | 'LOADED' | 'ERROR_LOADING';
export type TabView = 'INITIAL' | 'SINGLE_INTERFACE' | 'ERROR';

import type { ParseFormatT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';

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

  private _currentInterfaceIdOnComplexesTab = signal<number>(1);
  public currentInterfaceIdOnComplexesTab = this._currentInterfaceIdOnComplexesTab.asReadonly();

  private _currentInterfaceIdOnInterfacesTab = signal<number>(1);
  public currentInterfaceIdOnInterfacesTab = this._currentInterfaceIdOnInterfacesTab.asReadonly();

  public currentFileType = signal<ParseFormatT>('mmcif');

  public setCurrentInterfaceIdOnComplexesTab(interfaceId: number) {
    this._currentInterfaceIdOnComplexesTab.set(interfaceId);
  }

  public setCurrentInterfaceIdOnInterfacesTab(interfaceId: number) {
    this._currentInterfaceIdOnInterfacesTab.set(interfaceId);
  }

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

  public async loadFileToGetContentType(jobId: string): Promise<void> {
    const url = `https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/model/${jobId}`;

    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('content-type') ?? '';
      const blob = await res.blob();
      if (!blob.size) throw new Error('Empty response');

      // Pick filename + infer format
      const filetype = contentType.includes('cif') ? `mmcif` : contentType.includes('pdb') ? `pdb` : contentType.includes('ent') ? `pdb` : `mmcif`;
      this.currentFileType.set(filetype);
    } catch (e) {
      console.error(e);
    }
  }

  public downloadJSON(data: any, name: string) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
