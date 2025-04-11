/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed, DestroyRef, inject, Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MobileFacade {
  private _selectedTabName = signal<string>('');
  public selectedTabName = this._selectedTabName.asReadonly();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  public updateSelectedTabName(tabName: string) {
    this._selectedTabName.set(tabName);
  }

  public updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }
}
