import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MbOverviewTabComponent } from '../mb-overview-tab/mb-overview-tab.component';
import { MbMolstarTabComponent } from '../mb-molstar-tab/mb-molstar-tab.component';
import { MbCitationTabComponent } from '../mb-citation-tab/mb-citation-tab.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MobileFacade } from '../mobile.facade';
import Clarity from '@microsoft/clarity';
import { EntryUtilService } from '../../../services/entry-util.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ErrorPageComponent } from '../../../../../error-page/error-page.component';
import { MobileTabNames, MobileTabName } from '../mobile-tab.model';
import { GoogleAnalyticsService } from '@pdbc/core';

@Component({
  selector: 'pdbc-mobile-main',
  imports: [CommonModule, MbOverviewTabComponent, MbMolstarTabComponent, MbCitationTabComponent, NgxSkeletonLoaderModule, ErrorPageComponent],
  templateUrl: './mobile-main.component.html',
  styleUrl: './mobile-main.component.scss',
})
export class MobileMainComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public activeTab = signal<string>('overview');

  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly util = inject(EntryUtilService);

  public entryPageView = this.util.entryPageView;

  private readonly mbFacade = inject(MobileFacade);

  public readonly activePage = this.mbFacade.activePage;

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
      const tabId = params['activeTab'];
      const tabIndex = this.mbTabs.findIndex((tab) => tab.id === tabId);
      if (tabIndex >= 0) {
        // this.activeTab.set(tabId);
        this.mbFacade.updateActivePage(tabId);
        this.mbFacade.updateSelectedPageName(tabId);
      }
      this.gAS.logEntryPageEvents('ep_mobile_3d_access', {
        tab: tabId,
      });
    });
  }

  public selectFooterTab(tabId: MobileTabName) {
    this.activeTab.set(tabId);
    this.mbFacade.updateActivePage(tabId);
    this.router.navigate([], {
      queryParams: { activeTab: tabId },
      queryParamsHandling: 'merge',
    });
    window.scrollTo(0, 0);
    window.scrollTo({ behavior: 'smooth' });
    if ((window as any).clarity) {
      Clarity.event('mobile-footer-tab-change');
      Clarity.event(`mobile-footer-tab-access-${tabId}`);
    }
  }
}
