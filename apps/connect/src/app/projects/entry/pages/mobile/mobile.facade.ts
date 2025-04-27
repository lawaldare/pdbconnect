/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, Injectable, signal, Type } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';

@Injectable({
  providedIn: 'root',
})
export class MobileFacade {
  public readonly signals = inject(ComponentCommunicationService);

  private _selectedTabName = signal<string>('');
  public selectedTabName = this._selectedTabName.asReadonly();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  private _macromoleculeTitle = signal<string>('Macromolecule');
  public macromoleculeTitle = this._macromoleculeTitle.asReadonly();

  private _ligandTitle = signal<string>('Ligands');
  public ligandTitle = this._ligandTitle.asReadonly();

  private _domainTitle = signal<string>('Ligands');
  public domainTitle = this._domainTitle.asReadonly();

  public molstarViewInstance = signal<any>(undefined);

  public updateSelectedTabName(tabName: string) {
    this._selectedTabName.set(tabName);
  }

  public updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }

  public updateSelectedTitle(title: string) {
    this._macromoleculeTitle.set(title);
  }

  public updateSelectedLigandTitle(title: string) {
    this._ligandTitle.set(title);
  }

  public updateSelectedDomainTitle(title: string) {
    this._domainTitle.set(title);
  }
}
