// tab-nav.component.ts
import { Component, inject, Input } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-overview-tab-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-nav-menu.component.html',
})
export class OverviewMolstarTabNavComponent {
  public stateManagement = inject(OverviewStateManagementService);

  public tabsConfig = this.stateManagement.tabsConfig;
  public currentTab = this.stateManagement.currentTab;
  public tabsStates = this.stateManagement.tabsStates;
}
