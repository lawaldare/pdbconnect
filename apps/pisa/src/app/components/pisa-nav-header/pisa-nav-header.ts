/* eslint-disable @angular-eslint/component-selector */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PDBE_HEADER_LOGO_SRC } from '@pdbc/core';

export interface Link {
  name: string;
  path: string;
  openInNewTab: boolean;
}

@Component({
  selector: 'pisa-nav-header',
  imports: [CommonModule],
  templateUrl: './pisa-nav-header.html',
  styleUrls: ['./pisa-nav-header.scss'],
})
export class PisaNavHeaderComponent {
  public readonly pisaUtilService = inject(PisaUtilService);
  public readonly pdbeLogoSrc = this.pisaUtilService.getPisaAssetUrl(PDBE_HEADER_LOGO_SRC);
  public readonly pisaLogoSrc = this.pisaUtilService.getPisaAssetUrl('assets/images/pisa-logo.png');

  public readonly headerConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [
      // { name: 'Data download', path: 'https://www.ebi.ac.uk/pdbe/', openInNewTab: true },
      // { name: 'FAQ', path: 'https://www.ebi.ac.uk/pdbe/pdbe-services', openInNewTab: true },
      { name: 'API', path: 'https://www.ebi.ac.uk/pdbe/documentation', openInNewTab: true },
    ],
    menuHighlightColor: '#0a5032',
  };

  public isMobile = signal(false);

  public showMobileMenu(): void {
    this.isMobile.update((value) => !value);
  }

  public onStartButtonClick(): void {
    const href = window.location.href;
    const hrefLink = href.split('/').slice(0, -1).join('/');
    window.open(hrefLink, '_self');
  }
}
