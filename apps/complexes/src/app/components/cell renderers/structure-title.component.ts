import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `<span matTooltipClass="complex-name-tooltip" [matTooltip]="value" matTooltipPosition="above">{{
    value.length > 30 ? value.slice(0, 30) + '...' : value
  }}</span>`,
})
export class TitleRendererComponent implements ICellRendererAngularComp {
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
