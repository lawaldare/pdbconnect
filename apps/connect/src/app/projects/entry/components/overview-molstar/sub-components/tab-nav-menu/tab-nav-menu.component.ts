// tab-nav.component.ts
import { Component, inject, Input } from '@angular/core';
import { OverviewStateManagementService } from '../../state-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-overview-tab-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-nav-menu.component.html',
  styleUrl: './tab-nav-menu.component.scss',
})
export class OverviewMolstarTabNavComponent {
  public tabsConfig = [
    {
      id: 'Assembly',
      width: '101px',
    },
    {
      id: 'Macromolecules',
      width: '151px',
    },
    {
      id: 'Ligands',
      width: '88px',
    },
    {
      id: 'Domains',
      width: '96px',
    },
    {
      id: 'Modifications',
      width: '118px',
    },
  ];

  public stateManagement = inject(OverviewStateManagementService);

  public currentTab = this.stateManagement.currentTab;
  public tabsStates = this.stateManagement.tabsStates;
}
