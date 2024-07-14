import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { HeaderLogoMenuConfig, PDBE_HEADER_LOGO_SRC, PDBE_KB_HEADER_LOGO_SRC } from '@pdbc/core';

@Component({
  selector: 'pdbc-pdbe-header-logo-menu',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  templateUrl: './pdbe-header-logo-menu.component.html',
  styleUrls: ['./pdbe-header-logo-menu.component.scss'],
})
export class PdbeHeaderLogoMenuComponent implements OnInit {
  @Input() headerConfig!: HeaderLogoMenuConfig;
  public headerLogoSrc = '';
  public isMobile = signal(false);

  ngOnInit() {
    this.headerLogoSrc = this.headerConfig.logoType === 'PDBE' ? PDBE_HEADER_LOGO_SRC : PDBE_KB_HEADER_LOGO_SRC;
  }

  public get getHeaderLogoClass(): string {
    return this.headerConfig.logoType === 'PDBE' ? 'pdbe-header-logo-img' : 'pdbe-kb-header-logo-img';
  }

  public showMobileMenu(): void {
    this.isMobile.update((value) => !value);
  }

  // getCollapsedClass(isCollapsedDefault: boolean) {
  //   if (isCollapsedDefault && this.collapsedMenu) {
  //     return 'collapsed';
  //   } else if (isCollapsedDefault && !this.collapsedMenu) {
  //     return 'expanded';
  //   } else if (!isCollapsedDefault && this.collapsedMenu) {
  //     return 'expanded';
  //   }
  //   return 'collapsed';
  // }

  // invertCollapseState() {
  //   this.collapsedMenu = !this.collapsedMenu;
  // }
}
