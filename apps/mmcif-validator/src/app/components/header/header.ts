/* eslint-disable @angular-eslint/component-selector */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Link {
  name: string;
  path: string;
  openInNewTab: boolean;
}

@Component({
  selector: 'header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  public readonly navLinks: Link[] = [
    { name: 'Github', path: 'https://github.com/PDBeurope/mmcif-validator', openInNewTab: true },
    { name: 'Help', path: 'https://github.com/PDBeurope/mmcif-validator', openInNewTab: true },
  ];

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
      const href = domain + '/pdbe/mmcif-validator/';
      window.open(href, '_self');
    }
  }
}
