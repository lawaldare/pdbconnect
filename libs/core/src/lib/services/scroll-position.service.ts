import { ApplicationRef, inject, Injectable, NgZone } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  private zone = inject(NgZone);
  private appRef = inject(ApplicationRef);

  private scrollPositions: { [tabName: string]: number } = {};

  private setScrollPosition(tabName: string, position: number): void {
    this.scrollPositions[tabName] = position;
  }

  private getScrollPosition(tabName: string): number {
    return this.scrollPositions[tabName] || 0;
  }

  public handleScrollPosition(tabGroup: MatTabGroup, currentTabIndex: number): void {
    const tabs = tabGroup?._tabs.toArray();
    const currentTab = tabs[currentTabIndex];

    const previousTabIndex = tabGroup?.selectedIndex ?? 0;
    const previousTab = tabs[previousTabIndex];

    this.setScrollPosition(previousTab.textLabel, window.pageYOffset);

    this.zone.onStable.pipe(take(1)).subscribe(() => {
      const savedPosition = this.getScrollPosition(currentTab.textLabel);
      window.scrollTo({ top: savedPosition, behavior: 'auto' });
    });
  }
}
