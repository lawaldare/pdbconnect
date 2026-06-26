/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { PartnersMapComponent } from '../partners-map/partners-map.component';
import { PartnersPlotsComponent } from '../partners-plots/partners-plots.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CorporatePagesApiService } from '../services/corporate-pages-api.service';
import { SeoService } from '../services/seo.service';
import { SEO_CONFIG } from '../corporate-page.constant';

declare const $: any;

@Component({
  selector: 'pdbc-partners-page',
  templateUrl: './partners-page.component.html',
  styleUrls: ['./partners-page.component.scss'],
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent, PartnersMapComponent, PartnersPlotsComponent],
})
export class PartnersPageComponent implements AfterViewInit {
  private readonly cpApiService = inject(CorporatePagesApiService);
  public readonly partnersData = toSignal(this.cpApiService.getPartnersDescriptionData(), { initialValue: {} });
  private platformId = inject(PLATFORM_ID);
  private seo = inject(SeoService);

  public partnersCategories = computed(() => {
    const data = this.partnersData();
    return Object.keys(data);
  });
  public partnersCategoriesId = computed(() => {
    const data = this.partnersData();
    return Object.keys(data).map((each_category) => {
      return each_category.replace(/ /g, '-').toLowerCase();
    });
  });

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).foundation();
      $(document).foundationExtendEBI();
    }
    this.seo.update(SEO_CONFIG.partners);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  public scrollById(elId: string) {
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
