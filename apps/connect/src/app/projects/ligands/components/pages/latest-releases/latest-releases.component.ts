import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerLogoMenuConfig, ligandHomePageSeaderSearchConfig } from '../../../ligand.constant';
import { HeaderLogoMenuConfig } from '@pdbc/core';

@Component({
  selector: 'pdbc-latest-releases',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent],
  templateUrl: './latest-releases.component.html',
  styleUrl: './latest-releases.component.scss',
})
export class LatestReleasesComponent {
  public readonly headerLogoMenuConfig = { ...headerLogoMenuConfig, isHomePage: true } as HeaderLogoMenuConfig;
  public readonly headerSearchConfig = { ...ligandHomePageSeaderSearchConfig, backgroundColor: 'rgba(8, 95, 92, 0.80)' };
}
