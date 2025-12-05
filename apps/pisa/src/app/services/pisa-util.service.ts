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

  public saveAssemblyPayload(payload: any): void {
    sessionStorage.setItem('pisa-assembly-payload', JSON.stringify(payload));
  }

  public removeAssemblyPayload(): void {
    sessionStorage.removeItem('pisa-assembly-payload');
  }

  public getAssemblyPayload(): any | null {
    const payload = sessionStorage.getItem('pisa-assembly-payload');
    return payload ? JSON.parse(payload) : null;
  }
}
