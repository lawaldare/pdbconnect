import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { DataLayerService } from '@pdbc/core';

declare const gtag: (arg0: string, arg1: any, arg2: { page_path: string }) => void;
@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(router: Router, private dataLayerService: DataLayerService) {
    const navEndEvent$ = router.events.pipe(filter((e) => e instanceof NavigationEnd));
    navEndEvent$.subscribe((e: NavigationEnd) => {
      window.scrollTo(0, 0);
      // gtag('config', environment.googleAnalyticsTag, { page_path: e.urlAfterRedirects });
      this.dataLayerService.logPageView(e.url);
    });
    const headerScript = document.createElement('script');
    headerScript.async = true;
    headerScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsTag;
    document.head.prepend(headerScript);
  }
}
