import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { HeaderSearchComponent } from '../header-search/header-search.component';
import { HeaderComponent } from '../header/header.component';
import { NavTabsComponent } from '../nav-tabs/nav-tabs.component';
declare const $: any;

@Component({
  selector: 'pdbc-graph-schema',
  templateUrl: './graph-schema.component.html',
  imports: [CommonModule, HeaderComponent, HeaderSearchComponent, NavTabsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
