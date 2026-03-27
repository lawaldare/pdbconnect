import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { ScriptLoaderService, UtilService } from '@pdbc/core';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { LigandsAssetPathService } from './services/assets-path.service';

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
  private assetPathService = inject(LigandsAssetPathService);

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

    const pathName = window.location.pathname;
    if (pathName.includes(`/pdbe-srv/pdbechem/`)) {
      this.runAbsolutePath(pathName);
      return;
    }

    await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-3.0.0-min.js', true);
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

  private async runAbsolutePath(pathName: string) {
    await this.scriptLoader.loadScript(this.assetPathService.setAbsolutePath('assets/pdb-ligand-env-component-3.0.0-min.js'), true);
  }
}
