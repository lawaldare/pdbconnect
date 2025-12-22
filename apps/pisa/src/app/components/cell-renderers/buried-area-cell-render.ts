import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PisaActions } from '../../store/pisa.actions';
import { PisaUtilService } from '../../services/pisa-util.service';

@Component({
  standalone: true,
  template: ` <span>{{ rowData }}</span> `,
  styles: [
    `
      span {
        color: var(--Blue-600, #3b6fb6);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 27.2px; /* 170% */
        index: 99;
      }
    `,
  ],
})
export class BuriedAreaCellRenderer implements ICellRendererAngularComp {
  // Init Cell Value
  public rowData!: any;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    const value = params.data.bsa / params.data.asa;
    this.rowData = `${(value * 100).toFixed(2)}%`;
    return true;
  }
}
