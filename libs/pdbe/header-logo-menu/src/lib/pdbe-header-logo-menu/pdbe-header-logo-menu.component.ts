import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetPipe, HeaderLogoMenuConfig, PDBE_HEADER_LOGO_SRC, PDBE_KB_HEADER_LOGO_SRC } from '@pdbc/core';

export interface Link {
  name: string;
  path: string;
  openInNewTab: boolean;
}

@Component({
  selector: 'pdbc-pdbe-header-logo-menu',
  standalone: true,
  imports: [CommonModule, AssetPipe],
  templateUrl: './pdbe-header-logo-menu.component.html',
  styleUrls: ['./pdbe-header-logo-menu.component.scss'],
})
export class PdbeHeaderLogoMenuComponent implements OnInit {
  @Input() headerConfig!: HeaderLogoMenuConfig;
  public headerLogoSrc = '';
  public isMobile = signal(false);
  // public isComplexPage = signal(this.headerConfig.isComplexPage ?? false);

  public links!: Link[];

  ngOnInit() {
    if (this.headerConfig.isLigandPage || this.headerConfig.isComplexPage) {
      this.headerLogoSrc = this.headerConfig.logoPath ?? '';
    } else {
      this.headerLogoSrc = this.headerConfig.logoType === 'PDBe' ? PDBE_HEADER_LOGO_SRC : PDBE_KB_HEADER_LOGO_SRC;
    }
    this.links = this.headerConfig.urls || [];
  }

  // ngAfterViewInit(): void {
  //   const fromOption = {
  //     y: -100,
  //   };

  //   const toOption = {
  //     y: 0,
  //     duration: 3,
  //     ease: 'bounce',
  //   };

  //   gsap.fromTo('img', fromOption, toOption);
  // }

  public get getHeaderLogoClass(): string {
    return this.headerConfig.logoType === 'PDBe' ? 'pdbe-header-logo-img' : 'pdbe-kb-header-logo-img';
  }

  public showMobileMenu(): void {
    this.isMobile.update((value) => !value);
  }

  public openHomepageNavLinks(link: Link): void {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      window.open(link.path, link.openInNewTab ? '_blank' : '_self');
    } else {
      const href = window.location.href;
      const hrefLink = href.split('/').slice(0, -1).join('/') + link.path;
      window.open(hrefLink, link.openInNewTab ? '_blank' : '_self');
    }
  }
}
