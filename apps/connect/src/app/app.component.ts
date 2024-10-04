import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';

declare const gtag: any;
@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _router: Router) {
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      window.scrollTo(0, 0);
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
