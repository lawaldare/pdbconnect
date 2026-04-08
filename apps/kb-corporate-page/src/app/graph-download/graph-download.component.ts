/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { SeoService } from '../services/seo.service';
import { SEO_CONFIG } from '../corporate-page.constant';

declare const $: any;

@Component({
  selector: 'pdbc-graph-download',
  templateUrl: './graph-download.component.html',
  styles: [
    `
      ol {
        line-height: 1.5;
      }
    `,
  ],
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent],
})
export class GraphDownloadComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private seo = inject(SeoService);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).foundation();
      $(document).foundationExtendEBI();
    }
    this.seo.update(SEO_CONFIG.graph);
  }
}
