import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderLogoMenuConfig, PDBE_HEADER_LOGO_SRC, PDBE_KB_HEADER_LOGO_SRC } from '@pdbc/core';

@Component({
  selector: 'pdbc-pdbe-header-logo-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-header-logo-menu.component.html',
  styleUrls: ['./pdbe-header-logo-menu.component.scss'],
})
export class PdbeHeaderLogoMenuComponent implements OnInit {
  @Input() headerConfig!: HeaderLogoMenuConfig;
  public headerLogoSrc = '';
  public isMobile = signal(false);

  public readonly links = [
    { name: 'Services', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services' },
    { name: 'Documentation', path: 'https://www.ebi.ac.uk/pdbe/documentation' },
    { name: 'Training', path: 'https://www.ebi.ac.uk/pdbe/pdbe-training' },
  ];

  ngOnInit() {
    this.headerLogoSrc = this.headerConfig.logoType === 'PDBe' ? PDBE_HEADER_LOGO_SRC : PDBE_KB_HEADER_LOGO_SRC;
  }

  public get getHeaderLogoClass(): string {
    return this.headerConfig.logoType === 'PDBe' ? 'pdbe-header-logo-img' : 'pdbe-kb-header-logo-img';
  }

  public showMobileMenu(): void {
    this.isMobile.update((value) => !value);
  }
}
