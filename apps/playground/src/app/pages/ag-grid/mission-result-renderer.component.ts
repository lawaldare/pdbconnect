import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'pdbe-mission-result-renderer',
  standalone: true,
  template: `
    <span>
      @if (value) {
      <img [alt]="value" [src]="'https://www.ag-grid.com/example-assets/icons/' + value + '.png'" [height]="30" />
      }
    </span>
  `,
  styles: ['img { width: auto; height: auto; } span {display: flex; height: 100%; justify-content: center; align-items: center} '],
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MissionResultRenderer implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;
  agInit(params: ICellRendererParams): void {
    this.value = params.value ? 'tick-in-circle' : 'cross-in-circle';
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
