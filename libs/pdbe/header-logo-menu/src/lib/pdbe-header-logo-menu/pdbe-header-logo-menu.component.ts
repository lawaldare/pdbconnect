import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderLogoMenuConfig, PDBE_HEADER_LOGO_SRC, PDBE_KB_HEADER_LOGO_SRC, PISA_LOGO_PATH } from '@pdbc/core';

export interface Link {
  name: string;
  path: string;
  openInNewTab: boolean;
}

@Component({
  selector: 'pdbc-pdbe-header-logo-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-header-logo-menu.component.html',
  styleUrls: ['./pdbe-header-logo-menu.component.scss'],
})
export class PdbeHeaderLogoMenuComponent implements OnInit {
  @Input() headerConfig!: HeaderLogoMenuConfig;
  @Output() startButtonClicked = new EventEmitter<void>();

  public headerLogoSrc = '';
  public pisaLogoSrc = '';
  // public pisaLogoSrc = PISA_LOGO_PATH;
  // public pisaLogoSrc = `${window.location.origin}/pdbe/pisa/assets/images/PDBe-letterhead-white-RGB_2013.webp`;

  public isMobile = signal(false);
  // public isComplexPage = signal(this.headerConfig.isComplexPage ?? false);

  public links!: Link[];

  ngOnInit() {
    this.headerLogoSrc = this.headerConfig.logoType === 'PDBe' ? PDBE_HEADER_LOGO_SRC : PDBE_KB_HEADER_LOGO_SRC;
    this.links = this.headerConfig.urls || [];

    this.pisaLogoSrc = this.assetUrl('assets/images/PDBe-letterhead-white-RGB_2013.webp');
  }

  private assetUrl(path: string): string {
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';

    const base = baseHref === '/' ? '' : baseHref.replace(/\/$/, '');
    const cleanPath = path.replace(/^\/+/, '');

    return `${base}/${cleanPath}`;
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

  public onStartButtonClick(): void {
    this.startButtonClicked.emit();
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
