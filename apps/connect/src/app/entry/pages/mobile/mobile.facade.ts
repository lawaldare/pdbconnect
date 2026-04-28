/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, Injectable, NgZone, signal, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import Clarity from '@microsoft/clarity';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MobileTabName, MobileTabNames } from './mobile-tab.model';

@Injectable({
  providedIn: 'root',
})
export class MobileFacade {
  private readonly router = inject(Router);

  private bottomSheet = inject(MatBottomSheet);
  private readonly zone = inject(NgZone);

  private _activePage = signal<string>('overview');
  public activePage = this._activePage.asReadonly();

  // private _selectedTabName = signal<string>('');
  // public selectedTabName = this._selectedTabName.asReadonly();

  private _selectedPageName$ = new BehaviorSubject<MobileTabNames>(MobileTabNames.Overview);
  public selectedPageName = this._selectedPageName$.asObservable();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  // private _macromoleculeTitle = signal<string>('Macromolecule');
  // public macromoleculeTitle = this._macromoleculeTitle.asReadonly();

  // private _ligandTitle = signal<string>('Ligands');
  // public ligandTitle = this._ligandTitle.asReadonly();

  // private _domainTitle = signal<string>('Domains');
  // public domainTitle = this._domainTitle.asReadonly();

  public molstarViewInstance = signal<any>(undefined);

  // public updateSelectedTabName(tabName: string) {
  //   this._selectedTabName.set(tabName);
  // }

  public updateSelectedPageName(tabName: string) {
    this._selectedPageName$.next(tabName as MobileTabNames);
  }

  public updateActivePage(page: MobileTabName) {
    this._activePage.set(page);
  }

  public updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }

  // public updateSelectedMacromoleculeTitle(title: string) {
  //   this._macromoleculeTitle.set(title);
  // }

  // public updateSelectedLigandTitle(title: string) {
  //   this._ligandTitle.set(title);
  // }

  // public updateSelectedDomainTitle(title: string) {
  //   this._domainTitle.set(title);
  // }

  public selectPage(pageId: MobileTabName, sectionId?: string) {
    // this.activeTab.set(tabId);
    this.updateActivePage(pageId);

    const queryParams: any = { activeTab: pageId };
    if (sectionId) {
      queryParams.sectionId = sectionId;
    } else {
      queryParams.sectionId = null;
    }

    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
    window.scrollTo(0, 0);
    window.scrollTo({ behavior: 'smooth' });
    if ((window as any).clarity) {
      Clarity.event('mobile-footer-tab-change');
      Clarity.event(`mobile-footer-tab-access-${pageId}`);
    }
  }
}
