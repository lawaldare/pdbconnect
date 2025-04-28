import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbOverviewTabComponent } from '../mb-overview-tab/mb-overview-tab.component';
import { MbMolstarTabComponent } from '../mb-molstar-tab/mb-molstar-tab.component';
import { MbCitationTabComponent } from '../mb-citation-tab/mb-citation-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MobileFacade } from '../mobile.facade';

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

  private readonly mbFacade = inject(MobileFacade);

  public readonly mbTabNames = MobileTabNames;

  public readonly mbTabs = [
    {
      id: MobileTabNames.Overview,
      name: 'Overview',
    },
    {
      id: MobileTabNames.Molstar,
      name: '3D view',
    },
    {
      id: MobileTabNames.Citation,
      name: 'Citations',
    },
  ];

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const tabId = params['activeTab'] ?? MobileTabNames.Overview;
      this.selectFooterTab(tabId);
    });
  }

  public selectFooterTab(tabId: MobileTabName) {
    this.activeTab.set(tabId);
    this.mbFacade.updateSelectedMobileTabName(tabId);
    this.router.navigate([], {
      queryParams: { activeTab: tabId },
      queryParamsHandling: 'merge',
    });
    window.scrollTo(0, 0);
    window.scrollTo({ behavior: 'smooth' });
  }
}
