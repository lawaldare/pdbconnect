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
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      window.scrollTo(0, 0);
      // window.location.reload();
      this.utilService.setCurrentActive('');
      gtag('js', new Date());
      gtag('config', environment.googleAnalyticsTag, { debug_mode: true });
    });
  }

  async ngOnInit(): Promise<void> {
    this.init();
    await this.scriptLoader.loadScript('https://d3js.org/d3.v6.min.js');
    await this.scriptLoader.loadScript('https://www.ebi.ac.uk/pdbe/pdb-component-library/js/pdb-topology-viewer-plugin-2.0.0.js');
    const pathName = window.location.pathname;
    if (pathName.includes(`/pdbe-srv/pdbechem/`)) {
      await this.runAbsolutePath();
      return;
    }

    if (pathName.includes(`/pdbe-kb/complexes/`)) {
      await this.runAbsolutePath();
      return;
    }

    await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-2.0.0-min.js', true);
    await this.scriptLoader.loadScript('./assets/heatmap-components-v0.2.js', true);
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
    await this.scriptLoader.loadScript(this.assetPathService.setAbsolutePath('assets/heatmap-components-v0.2.js'), true);
  }
}
