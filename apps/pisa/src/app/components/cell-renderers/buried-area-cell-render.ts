import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';
import { MaterialModule } from '@pdbc/core';

@Component({
  standalone: true,
  template: `
    <section>
      <mat-progress-bar mode="determinate" [value]="value"></mat-progress-bar>
      <span>{{ rowData }}</span>
    </section>
  `,
  imports: [MaterialModule],
  styles: [
    `
      section {
        display: flex;
        align-items: center;
      }

      mat-progress-bar {
        width: 30px !important;
        margin-right: 2px !important;
      }
    `,
  ],
})
export class BuriedAreaCellRenderer implements ICellRendererAngularComp {
  // Init Cell Value
  public rowData!: any;
  public value!: number;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    const value = params.data.bsa / params.data.asa;
    this.value = Math.round(value * 100);
    this.rowData = `${this.value}%`;
    return true;
  }
}
