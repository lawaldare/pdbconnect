/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */

import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { ScriptLoaderService, UtilService } from '@pdbc/core';
import { LigandsAssetPathService } from './projects/ligands/services/assets-path.service';

declare const gtag: any;
@Component({
  standalone: true,
  imports: [VfEbiHeaderComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private _router: Router,
    private utilService: UtilService,
    private scriptLoader: ScriptLoaderService,
    private assetPathService: LigandsAssetPathService
  ) {
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      window.scrollTo(0, 0);
      // window.location.reload();
      this.utilService.setCurrentActive('');
      gtag('js', new Date());
      gtag('config', environment.googleAnalyticsTag, { debug_mode: true });
    });
  }

  private readonly isLocalhost = window?.location?.hostname === 'localhost';

  async ngOnInit(): Promise<void> {
    this.init();

    // d3 js is currently always imported
    // await this.scriptLoader.loadScript('https://d3js.org/d3.v5.min.js');

    const pathName = window.location.pathname;
    if (pathName.includes(`/pdbe-srv/pdbechem/`)) {
      this.runAbsolutePath(pathName);
      return;
    }

    if (pathName.includes(`/pdbe-kb/`)) {
      this.runAbsolutePath(pathName);
      return;
    }

    // import topology viewer only for localhost and route has `/pdb/`
    // OR outside localhost && route has `pdbe/entry/pdb`
    if ((this.isLocalhost && pathName.includes(`/pdb/`)) || (!this.isLocalhost && pathName.includes(`pdbe/entry/pdb`))) {
      // await this.scriptLoader.loadScript('https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-plugin-2.0.0.js');
    } else {
      // ligand env component is always imported for other pages
      await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-3.0.0-min.js', true);
    }
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
