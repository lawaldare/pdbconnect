import { Component, OnInit, inject, computed, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderJumbotronComponent } from '../header-jumbotron/header-jumbotron.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { KeyFeaturesListComponent } from '../key-features-list/key-features-list.component';
import { FaqsListComponent } from '../faqs-list/faqs-list.component';
import { CorporatePagesBioschemasService } from '../services/corporate-pages.bioschemas';
import { CorporatePagesApiService } from '../services/corporate-pages-api.service';
import { SeoService } from '../services/seo.service';
import { SEO_CONFIG } from '../corporate-page.constant';

declare const $: any;

@Component({
  selector: 'pdbc-app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [CommonModule, RouterModule, HeaderJumbotronComponent, NavTabsComponent, HomeBookmarksComponent, KeyFeaturesListComponent, FaqsListComponent],
})
export class HomePageComponent implements OnInit, AfterViewInit {
  private readonly bioschemasService = inject(CorporatePagesBioschemasService);
  private readonly cpApiService = inject(CorporatePagesApiService);
  private platformId = inject(PLATFORM_ID);
  public readonly realeaseData = toSignal(this.cpApiService.getReleaseData());
  public releaseDate = computed(() => {
    const data = this.realeaseData();
    if (data) {
      return data['date'];
    }
    return '';
  });
  public releaseHeader = computed(() => {
    const data = this.realeaseData();
    if (data) {
      return data['header'];
    }
    return '';
  });
  public releaseDescriptions = computed(() => {
    const data = this.realeaseData();
    if (data) {
      return data['descriptions'];
    }
    return [];
  });
  public releaseLink = computed(() => {
    const data = this.realeaseData();
    if (data) {
      return data['link'];
    }
    return '';
  });
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.bioschemasService.buildBioschemasJSON();
    this.seo.update(SEO_CONFIG.home);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      $(document).foundation();
      $(document).foundationExtendEBI();
    }
  }
}
