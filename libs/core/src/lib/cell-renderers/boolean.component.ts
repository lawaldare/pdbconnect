import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'lib-mission-result-renderer',
  standalone: true,
  template: ` <span :class="missionSpan"> @if(value){ TRUE } @else { FALSE } </span> `,
  styles: ['span {display: flex; height: 100%; justify-content: start; align-items: center} '],
})
export class BooleanRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
