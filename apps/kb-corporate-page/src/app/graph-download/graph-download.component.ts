/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
import { RouterModule } from '@angular/router';

declare const $: any;

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
  imports: [CommonModule, RouterModule, HeaderSearchComponent, NavTabsComponent],
})
export class GraphDownloadComponent implements AfterViewInit {
  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
