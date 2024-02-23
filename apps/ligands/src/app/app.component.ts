import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';

@Component({
  standalone: true,
  imports: [PdbeHeaderLogoMenuComponent, VfEbiFooterComponent, RouterModule],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pdb-ligand-pages';
}
