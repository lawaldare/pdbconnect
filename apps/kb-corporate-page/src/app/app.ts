/* eslint-disable @angular-eslint/prefer-inject */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { isPlatformBrowser } from '@angular/common';

declare const gtag: any;

@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  public readonly gaTag = computed(() => environment.gaTag ?? 'G-6EJJZ57S1H');
  private readonly router = inject(Router);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.isBrowser) {
        window.scrollTo(0, 0);
        gtag('js', new Date());
        gtag('config', environment.gaTag, { debug_mode: true });
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.init();
    }
  }

  onActivate(event: any) {
    if (this.isBrowser) {
      document.body.scrollTop = 0;
    }
  }

  private init(): void {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.gaTag}`;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    const gtagEl = document.createElement('script');
    const gtagBody = document.createTextNode(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${environment.gaTag}');
    `);
    gtagEl.appendChild(gtagBody);
    document.body.appendChild(gtagEl);
  }
}
