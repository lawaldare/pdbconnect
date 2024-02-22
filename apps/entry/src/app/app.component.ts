import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';

@Component({
  standalone: true,
  imports: [PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pdb-entry-pages';
}
