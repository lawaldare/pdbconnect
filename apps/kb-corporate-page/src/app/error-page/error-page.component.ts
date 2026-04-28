/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
declare const gtag: any;

@Component({
  selector: 'pdbc-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss'],
  imports: [CommonModule, HeaderComponent, NavTabsComponent],
})
export class ErrorPageComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gtag('event', 'missing_page', { event_category: 'missing_page', event_label: 'missing_page', value: undefined });
    }
  }
}
