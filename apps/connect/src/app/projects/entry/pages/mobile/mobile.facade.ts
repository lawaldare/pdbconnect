/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ElementRef, inject, Injectable, NgZone, QueryList, signal, Type } from '@angular/core';
import { MobileTabNames } from './mobile-main/mobile-main.component';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';
import Clarity from '@microsoft/clarity';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MobileTabChips } from './mb-molstar-tab/mb-molstar-tab.component';
import { MOBILE_COMPONENT_MAP } from './mobile-component-map';

type MobileTabName = 'overview' | 'molstar' | 'citation';

@Injectable({
  providedIn: 'root',
})
export class MobileFacade {
  private readonly router = inject(Router);

  private bottomSheet = inject(MatBottomSheet);
  private readonly zone = inject(NgZone);

  private _activePage = signal<string>('overview');
  public activePage = this._activePage.asReadonly();

  private _selectedTabName = signal<string>('');
  public selectedTabName = this._selectedTabName.asReadonly();

  private _selectedPageName$ = new BehaviorSubject<MobileTabNames>(MobileTabNames.Overview);
  public selectedPageName = this._selectedPageName$.asObservable();

  private _selectedComponent = signal<Type<any> | null>(null);
  public selectedComponent = this._selectedComponent.asReadonly();

  private _macromoleculeTitle = signal<string>('Macromolecule');
  public macromoleculeTitle = this._macromoleculeTitle.asReadonly();

  private _ligandTitle = signal<string>('Ligands');
  public ligandTitle = this._ligandTitle.asReadonly();

  private _domainTitle = signal<string>('Domains');
  public domainTitle = this._domainTitle.asReadonly();

  public molstarViewInstance = signal<any>(undefined);

  public updateSelectedTabName(tabName: string) {
    this._selectedTabName.set(tabName);
  }

  public updateSelectedPageName(tabName: string) {
    this._selectedPageName$.next(tabName as MobileTabNames);
  }

  public updateActivePage(page: MobileTabName) {
    this._activePage.set(page);
  }

  public updateSelectedComponent(component: Type<any> | null) {
    this._selectedComponent.set(component);
  }

  public updateSelectedMacromoleculeTitle(title: string) {
    this._macromoleculeTitle.set(title);
  }

  public updateSelectedLigandTitle(title: string) {
    this._ligandTitle.set(title);
  }

  public updateSelectedDomainTitle(title: string) {
    this._domainTitle.set(title);
  }

  public selectPage(pageId: MobileTabName) {
    // this.activeTab.set(tabId);
    this.updateActivePage(pageId);
    this.router.navigate([], {
      queryParams: { activeTab: pageId },
      queryParamsHandling: 'merge',
    });
    window.scrollTo(0, 0);
    window.scrollTo({ behavior: 'smooth' });
    Clarity.event('mobile-footer-tab-change');
    Clarity.event(`mobile-footer-tab-access-${pageId}`);
  }

  public onTabClick(chip: { label: string; id: string }, chipElements: QueryList<ElementRef<HTMLElement>>): void {
    if (chip.id === this.selectedTabName()) {
      this.updateSelectedTabName('');
    } else {
      this.updateSelectedTabName(chip.id);
      // scrolls into view horizontally on mobile without anti pattern
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        const chipElement = chipElements.find((el) => el.nativeElement.dataset['id'] === chip.id);
        chipElement?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }
    const selectedComponent = MOBILE_COMPONENT_MAP[this.selectedTabName() as MobileTabChips] || null;
    this.updateSelectedComponent(selectedComponent);

    if (this.selectedComponent() !== null) {
      const componentInstance = this.selectedComponent() as Type<any>;
      this.bottomSheet.open(componentInstance, {
        height: '40%',
        hasBackdrop: false,
        panelClass: 'custom-bottom-sheet',
      });
    } else {
      this.bottomSheet.dismiss();
    }
  }
}
