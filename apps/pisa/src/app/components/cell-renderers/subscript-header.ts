/* eslint-disable @angular-eslint/component-selector */
// subscript-header.component.ts
import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

@Component({
  selector: 'pdbc-subscript-header',
  template: `<span class="ag-header-cell-text" [innerHTML]="html"></span>`,
})
export class SubscriptHeaderComponent implements IHeaderAngularComp {
  html = '';

  agInit(params: IHeaderParams & { html?: string }): void {
    this.html = params.html ?? params.displayName ?? '';
  }

  refresh(): boolean {
    return false;
  }
}
