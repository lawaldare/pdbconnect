import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { DataLayerService, GoogleAnalyticsService } from '@pdbc/core';

declare const gtag: any;
@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  // constructor(router: Router, private dataLayerService: DataLayerService) {
  //   const navEndEvent$ = router.events.pipe(filter((e) => e instanceof NavigationEnd));
  //   navEndEvent$.subscribe((e: NavigationEnd) => {
  //     window.scrollTo(0, 0);
  //     // gtag('config', environment.googleAnalyticsTag, { page_path: e.urlAfterRedirects });
  //     this.dataLayerService.logPageView(e.url);
  //   });
  //   const headerScript = document.createElement('script');
  //   headerScript.async = true;
  //   headerScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsTag;
  //   document.head.prepend(headerScript);
  // }

  constructor(private _router: Router) {
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      gtag('js', new Date());
      gtag('config', environment.googleAnalyticsTag, { debug_mode: true });
    });
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsTag}`;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    const gtagEl = document.createElement('script');
    const gtagBody = document.createTextNode(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
    `);
    gtagEl.appendChild(gtagBody);
    document.body.appendChild(gtagEl);
  }
}
