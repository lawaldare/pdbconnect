/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { ScriptLoaderService, StyleLoaderService, UtilService } from '@pdbc/core';
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
    private stylesLoader: StyleLoaderService,
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
    await this.scriptLoader.loadScript('https://d3js.org/d3.v6.min.js');

    const pathName = window.location.pathname;
    if (pathName.includes(`/pdbe-srv/pdbechem/`)) {
      this.runAbsolutePath();
      return;
    }

    if (pathName.includes(`/pdbe-kb/`)) {
      this.runAbsolutePath();
      return;
    }

    // ligand env component is always imported
    await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-2.0.0-min.js', true);

    // import topology viewer only for localhost and route has `/pdb/`
    // OR outside localhost && route has `pdbe/entry/pdb`
    if ((this.isLocalhost && pathName.includes(`/pdb/`)) || (!this.isLocalhost && pathName.includes(`pdbe/entry/pdb`))) {
      await this.scriptLoader.loadScript('https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-plugin-2.0.0.js');
      await this.stylesLoader.loadStyle('./assets/entry-styles/extra/extra.css');
      await this.stylesLoader.loadStyle('./assets/entry-styles/topology-viewer/pdbe-topology-style.css');
      await this.stylesLoader.loadStyle('./assets/entry-styles/protvista/new-protvista.css');
      await this.stylesLoader.loadStyle('https://cdn.jsdelivr.net/npm/pdbe-molstar@3.7.0/build/pdbe-molstar-light.css');
    }

    // Heatmap components is only imported for Ligand pages (route has chemicalCompound)
    if (pathName.includes(`/chemicalCompound/`)) {
      await this.scriptLoader.loadScript('./assets/heatmap-components-v0.2.min.js', true);
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

  private async runAbsolutePath() {
    await this.scriptLoader.loadScript(this.assetPathService.setAbsolutePath('assets/pdb-ligand-env-component-2.0.0-min.js'), true);
    await this.scriptLoader.loadScript(this.assetPathService.setAbsolutePath('assets/heatmap-components-v0.2.min.js'), true);
  }
}
