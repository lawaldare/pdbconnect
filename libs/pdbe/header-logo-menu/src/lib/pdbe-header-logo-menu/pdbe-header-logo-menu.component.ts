import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
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
  public pisaLogoSrc = '';

  public isMobile = signal(false);

  public links!: Link[];

  ngOnInit() {
    if (this.headerConfig.isLigandPage || this.headerConfig.isComplexPage) {
      this.headerLogoSrc = this.headerConfig.logoPath ?? '';
    } else {
      this.headerLogoSrc = this.headerConfig.logoType === 'PDBe' ? PDBE_HEADER_LOGO_SRC : PDBE_KB_HEADER_LOGO_SRC;
    }
    this.links = this.headerConfig.urls || [];
    this.pisaLogoSrc = this.assetUrl(PDBE_HEADER_LOGO_SRC);
  }

  private assetUrl(path: string): string {
    const raw = (path ?? '').trim();
    if (!raw) return raw;

    // Absolute URL
    if (/^https?:\/\//i.test(raw)) return raw;

    // Normalize leading slashes for consistent checks
    const p = raw.replace(/^\/+/, ''); // removes one or many leading '/'

    // If caller already included the mount, return as absolute (prevents doubling)
    if (p === 'pdbe/pisa' || p.startsWith('pdbe/pisa/')) {
      return `/${p}`;
    }

    // Otherwise prefix with base href
    const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
    const base = baseHref === '/' ? '' : baseHref.replace(/\/$/, '');

    return `${base}/${p}`;
  }

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
