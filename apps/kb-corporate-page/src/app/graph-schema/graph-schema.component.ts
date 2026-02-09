/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';

declare const $: any;

@Component({
  selector: 'pdbc-graph-schema',
  templateUrl: './graph-schema.component.html',
  imports: [CommonModule, HeaderSearchComponent, NavTabsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      ::ng-deep graph-schema-explorer {
        #search-term.search.form {
          width: 85% !important;
        }

        span.reset {
          top: 6px !important;
        }
      }
    `,
  ],
})
export class GraphSchemaComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    const welcomeNoteComponent = document.getElementById('welcome-note');
    const schemaComponent = document.getElementById('schema-component');
    if (welcomeNoteComponent && schemaComponent) {
      schemaComponent.setAttribute('data-welcome-note', welcomeNoteComponent.innerHTML);
    }
  }

  ngAfterViewInit() {
    $(document).foundation();
    $(document).foundationExtendEBI();
  }
}
