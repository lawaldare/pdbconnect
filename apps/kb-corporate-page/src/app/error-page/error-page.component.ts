/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
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
  ngAfterViewInit(): void {
    gtag('event', 'missing_page', { event_category: 'missing_page', event_label: 'missing_page', value: undefined });
  }
}
