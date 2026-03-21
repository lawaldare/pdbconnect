/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';

declare const $: any;

@Component({
  selector: 'pdbc-join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.scss'],
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent],
})
export class JoinPageComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  public scrollById(elId: string) {
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
  }
}
