/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { RouterModule } from '@angular/router';
import { SeoService } from '../services/seo.service';
import { SEO_CONFIG } from '../corporate-page.constant';

declare const $: any;

@Component({
  selector: 'pdbc-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent, RouterModule],
})
export class ServicesPageComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private seo = inject(SeoService);

  scroll(elId: string) {
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).foundation();
      $(document).foundationExtendEBI();
    }
    this.seo.update(SEO_CONFIG.services);
  }
}
