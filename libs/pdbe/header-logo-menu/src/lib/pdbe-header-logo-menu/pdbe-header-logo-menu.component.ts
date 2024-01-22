import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';

@Component({
  selector: 'pdbc-pdbe-header-logo-menu',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  templateUrl: './pdbe-header-logo-menu.component.html',
  styleUrls: ['./pdbe-header-logo-menu.component.scss'],
})
export class PdbeHeaderLogoMenuComponent {
  @Input() backgroundColor = '';
  @Input() logoType = '';
  @Input() urls: { name: string; path: string }[] = [];
  @Input() menuHighlightColor = '';
  headerLogoSrc = '';
  collapsedMenu = true;

  ngOnInit() {
    if (this.logoType === 'PDBe') {
      this.headerLogoSrc = '/assets/images/PDBe-letterhead-white-RGB_2013.png';
    } else if (this.logoType === 'PDBe-KB') {
      this.headerLogoSrc = '/assets/images/PDBE-KB_logo_2019_white_text.png';
    }
  }

  getHeaderLogoClass() {
    if (this.logoType === 'PDBe') {
      return 'pdbe-header-logo-img';
    } else if (this.logoType === 'PDBe-KB') {
      return 'pdbe-kb-header-logo-img';
    }
    return '';
  }

  getCollapsedClass(isCollapsedDefault: boolean) {
    if (isCollapsedDefault && this.collapsedMenu) {
      return 'collapsed';
    } else if (isCollapsedDefault && !this.collapsedMenu) {
      return 'expanded';
    } else if (!isCollapsedDefault && this.collapsedMenu) {
      return 'expanded';
    }
    return 'collapsed';
  }

  invertCollapseState() {
    this.collapsedMenu = !this.collapsedMenu;
  }
}
