// tab-nav.component.ts
import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-overview-tab-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-nav-menu.component.html',
})
export class OverviewMolstarTabNavComponent implements OnInit {
  public stateManagement = inject(OverviewStateManagementService);

  public tabsConfig = this.stateManagement.tabsConfig;
  public currentTab = this.stateManagement.currentTab;
  public tabsStates = this.stateManagement.tabsStates;

  ngOnInit(): void {
    const tabsConfig = this.stateManagement.tabsConfig();
    const currentTab = this.stateManagement.currentTab();
    const tabsStates = this.stateManagement.tabsStates();
    console.log({ tabsConfig, currentTab, tabsStates });
  }

  onTabClick(tabName: string) {
    const tabsConfig = this.stateManagement.tabsConfig();
    const currentTab = this.stateManagement.currentTab();
    const tabsStates = this.stateManagement.tabsStates();
    console.log({ tabsConfig, currentTab, tabsStates });
    this.stateManagement.switchCurrentTab(tabName);
  }
}
