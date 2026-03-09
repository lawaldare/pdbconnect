/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { RouterModule } from '@angular/router';

declare const $: any;

@Component({
  selector: 'pdbc-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent, RouterModule],
})
export class ServicesPageComponent implements AfterViewInit {
  scroll(elId: string) {
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
