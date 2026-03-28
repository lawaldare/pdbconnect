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
  public readonly headerConfig = {
    backgroundColor: '#056643',
    logoType: 'PDBe',
    urls: [
      { name: 'Github', path: 'https://github.com/PDBeurope/mmcif-validator', openInNewTab: true },
      { name: 'Help', path: 'https://github.com/PDBeurope/mmcif-validator', openInNewTab: true },
    ],
    menuHighlightColor: '#0a5032',
  };

  public isMobile = signal(false);

  public showMobileMenu(): void {
    this.isMobile.update((value) => !value);
  }

  public onStartButtonClick(): void {
    const href = window.location.href;
    const hrefLink = href.split('/').slice(0, -2).join('/');
    console.log('hrefLink', hrefLink);
    window.open(hrefLink, '_self');
  }
}
