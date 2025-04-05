import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbOverviewTabComponent } from '../mb-overview-tab/mb-overview-tab.component';
import { MbMolstarTabComponent } from '../mb-molstar-tab/mb-molstar-tab.component';
import { MbCitationTabComponent } from '../mb-citation-tab/mb-citation-tab.component';
import { ActivatedRoute, Router } from '@angular/router';

export enum MobileTabNames {
  Overview = 'overview',
  Molstar = 'molstar',
  Citation = 'citation',
}

type MobileTabName = 'overview' | 'molstar' | 'citation';

@Component({
  selector: 'pdbc-mobile-main',
  imports: [CommonModule, MbOverviewTabComponent, MbMolstarTabComponent, MbCitationTabComponent],
  templateUrl: './mobile-main.component.html',
  styleUrl: './mobile-main.component.scss',
})
export class MobileMainComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public activeTab = signal<string>('overview');

  public readonly mbTabNames = MobileTabNames;

  public readonly mbTabs = [
    {
      id: MobileTabNames.Overview,
      name: 'Overview',
    },
    {
      id: MobileTabNames.Molstar,
      name: 'Molstar',
    },
    {
      id: MobileTabNames.Citation,
      name: 'Citation',
    },
  ];

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const tabId = params['activeTab'];
      this.selectFooterTab(tabId);
    });
  }

  public selectFooterTab(tabId: MobileTabName) {
    console.log(tabId);
    this.activeTab.set(tabId);
    this.router.navigate([], {
      queryParams: { activeTab: tabId },
      queryParamsHandling: 'merge',
    });
  }
}
