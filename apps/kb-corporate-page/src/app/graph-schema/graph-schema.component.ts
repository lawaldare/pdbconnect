/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';

declare const $: any;

@Component({
  selector: 'pdbc-graph-schema',
  templateUrl: './graph-schema.component.html',
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [],
})
export class GraphSchemaComponent implements OnInit, AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const welcomeNoteComponent = document.getElementById('welcome-note');
      const schemaComponent = document.getElementById('schema-component');

      if (welcomeNoteComponent && schemaComponent) {
        schemaComponent.setAttribute('data-welcome-note', welcomeNoteComponent.innerHTML);
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const host = document.querySelector('graph-schema-explorer') as any;
        const root = host?.shadowRoot;
        const menu = root?.querySelector('menu-list') as any;
        const menuRoot = menu?.shadowRoot;

        const input = menuRoot?.querySelector('#search-term') as HTMLInputElement;
        const reset = menuRoot?.querySelector('.reset') as HTMLElement;

        if (input) input.style.width = '85%';
        if (reset) reset.style.top = '6px';
      }, 500);

      $(document).foundation();
      $(document).foundationExtendEBI();
    }
  }
}
