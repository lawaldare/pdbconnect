import { Injectable } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionService {
  private scrollPositions: { [tabName: string]: number } = {};

  private setScrollPosition(tabName: string, position: number): void {
    this.scrollPositions[tabName] = position;
  }

  private getScrollPosition(tabName: string): number {
    return this.scrollPositions[tabName] || 0;
  }

  public handleScrollPosition(tabGroup: MatTabGroup, currentTabIndex: number): void {
    const tabs = tabGroup._tabs.toArray();
    const currentTab = tabs[currentTabIndex];

    const previousTabIndex = tabGroup.selectedIndex ?? 0;
    const previousTab = tabs[previousTabIndex];

    this.setScrollPosition(previousTab.textLabel, window.pageYOffset);

    setTimeout(() => {
      const savedPosition = this.getScrollPosition(currentTab.textLabel);
      window.scrollTo(0, savedPosition);
    }, 50);
  }
}
