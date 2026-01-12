import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HeaderComponent } from '../header/header.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
declare const $: any;

@Component({
  selector: 'pdbc-join-page',
  templateUrl: './join-page.component.html',
  styleUrls: ['./join-page.component.css'],
  imports: [CommonModule, HeaderComponent, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent],
})
export class JoinPageComponent implements AfterViewInit {
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
