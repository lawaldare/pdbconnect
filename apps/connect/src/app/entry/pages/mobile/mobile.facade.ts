/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject, Injectable, signal, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import Clarity from '@microsoft/clarity';
import { MobileTabName, MobileTabNames } from './mobile-tab.model';

@Injectable({
  providedIn: 'root',
})
export class MobileFacade {
  private readonly router = inject(Router);

  private _activePage = signal<string>('overview');
  public activePage = this._activePage.asReadonly();

  private _selectedPageName$ = new BehaviorSubject<MobileTabNames>(MobileTabNames.Overview);
  public selectedPageName = this._selectedPageName$.asObservable();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  public molstarViewInstance = signal<any>(undefined);

  public updateSelectedPageName(tabName: string) {
    this._selectedPageName$.next(tabName as MobileTabNames);
  }

  public updateActivePage(page: MobileTabName) {
    this._activePage.set(page);
  }

  public updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }

  public selectPage(pageId: MobileTabName, sectionId?: string) {
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
