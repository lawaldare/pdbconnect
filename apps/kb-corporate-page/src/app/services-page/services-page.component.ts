import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HeaderComponent } from '../header/header.component';
import { HomeBookmarksComponent } from '../home-bookmarks/home-bookmarks.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';

@Component({
  selector: 'pdbc-services-page',
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss'],
  imports: [CommonModule, HeaderComponent, HeaderSearchComponent, NavTabsComponent, HomeBookmarksComponent],
})
export class ServicesPageComponent {
  scroll(elId: string) {
    const el = document.getElementById(elId);
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
