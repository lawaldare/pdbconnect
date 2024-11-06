import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerLogoMenuConfig, ligandHomePageSeaderSearchConfig, quickLinks } from '../../../ligand.constant';
import { HeaderLogoMenuConfig } from '@pdbc/core';
import { KeyFeaturesComponent } from '../../page-sections/key-features/key-features.component';
import { FaqsComponent } from '../../page-sections/faqs/faqs.component';
import { UseCasesComponent } from '../../page-sections/use-cases/use-cases.component';

@Component({
  selector: 'pdbc-ligand-homepage',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent, KeyFeaturesComponent, FaqsComponent, UseCasesComponent],
  templateUrl: './ligand-homepage.component.html',
  styleUrl: './ligand-homepage.component.scss',
})
export class LigandHomepageComponent {
  public readonly headerLogoMenuConfig = { ...headerLogoMenuConfig, isHomePage: true } as HeaderLogoMenuConfig;
  public readonly headerSearchConfig = ligandHomePageSeaderSearchConfig;
  public readonly links = signal<{ label: string; url: string }[]>(quickLinks);
}
