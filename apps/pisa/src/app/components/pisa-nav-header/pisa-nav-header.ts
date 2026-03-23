/* eslint-disable @angular-eslint/component-selector */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PisaUtilService } from '../../services/pisa-util.service';

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
  public readonly pdbeLogoSrc = this.pisaUtilService.getPisaAssetUrl('assets/images/PDBe-letterhead-white-RGB_2013.webp');
  public readonly pisaLogoSrc = this.pisaUtilService.getPisaAssetUrl('assets/images/pisa-logo.png');

  public readonly headerConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [{ name: 'API', path: 'https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/#/', openInNewTab: true }],
    menuHighlightColor: '#0a5032',
  };

  public isMobile = signal(false);

  public showMobileMenu(): void {
    this.isMobile.update((value) => !value);
  }

  public onStartButtonClick(): void {
    const hostname = document.location.hostname;
    const domain = window.location.origin;
    if (hostname === 'localhost') {
      window.open(domain, '_self');
    } else {
      const href = domain + '/pdbe/pisa/';
      window.open(href, '_self');
    }
  }
}
