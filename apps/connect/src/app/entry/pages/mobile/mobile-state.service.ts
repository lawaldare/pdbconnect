import { Injectable, signal, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MobileStateService {
  private _activePage = signal<string>('overview');
  public activePage = this._activePage.asReadonly();

  private _selectedTabName = signal<string>('');
  public selectedTabName = this._selectedTabName.asReadonly();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  updateActivePage(page: string) {
    this._activePage.set(page);
  }

  updateSelectedTabName(tabName: string) {
    this._selectedTabName.set(tabName);
  }

  updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }
}
