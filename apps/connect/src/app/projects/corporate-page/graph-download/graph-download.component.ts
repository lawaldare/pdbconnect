import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';

@Component({
  selector: 'pdbc-graph-download',
  templateUrl: './graph-download.component.html',
  styles: [
    `
      ol {
        line-height: 1.5;
      }
    `,
  ],
  imports: [CommonModule, HeaderComponent, HeaderSearchComponent, NavTabsComponent],
})
export class GraphDownloadComponent {}
