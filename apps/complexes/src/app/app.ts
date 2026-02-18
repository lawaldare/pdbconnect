import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { ScriptLoaderService, UtilService } from '@pdbc/core';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';

declare const gtag: any;

@Component({
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly _router = inject(Router);
  private utilService = inject(UtilService);
  private scriptLoader = inject(ScriptLoaderService);

  constructor() {
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo(0, 0);
      // window.location.reload();
      this.utilService.setCurrentActive('');
      gtag('js', new Date());
      gtag('config', environment.googleAnalyticsTag, { debug_mode: true });
    });
  }

  async ngOnInit(): Promise<void> {
    this.init();

    const hostname = document.location.hostname;

    const path = hostname === 'localhost' ? './assets/pdb-ligand-env-component-3.0.0-min.js' : 'complexes/assets/pdb-ligand-env-component-3.0.0-min.js';

    await this.scriptLoader.loadScript(path, true);
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
      gtag('js', new Date());
      gtag('config', '${environment.googleAnalyticsTag}');
    `);
    gtagEl.appendChild(gtagBody);
    document.body.appendChild(gtagEl);
  }
}
