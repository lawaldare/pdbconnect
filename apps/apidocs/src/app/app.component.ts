import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';
import { PdbeApiPage } from './pages/pdbe-api/pdbe-api-page.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, PdbeHeaderLogoMenuComponent, VfEbiHeaderComponent, VfEbiFooterComponent],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'PDBe RESTful API Documentation';

  public readonly headerLogoMenuConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [
      { name: 'Home', path: 'https://www.ebi.ac.uk/pdbe/', openInNewTab: false },
      { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
      { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation', openInNewTab: true },
      { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training', openInNewTab: true },
    ],
    menuHighlightColor: '#0a5032',
  };
}
