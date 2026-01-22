import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { MaterialModule } from '@pdbc/core';
import { PisaUtilService } from '../../services/pisa-util.service';

@Component({
  standalone: true,
  template: ` <span (click)="onClickSeeDetails()">See details</span> `,
  imports: [MaterialModule],
  styles: [
    `
      span {
        color: #3b6fb6;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        line-height: 27.2px;
        cursor: pointer;
      }
    `,
  ],
})
export class InterfaceTabelActionCellRenderer implements ICellRendererAngularComp {
  private pisaUtilService = inject(PisaUtilService);

  public rowData!: any;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  refresh(params: any): boolean {
    this.rowData = params.data;
    return true;
  }

  public onClickSeeDetails() {
    console.log('See details clicked for row:', this.rowData);
    // this.pisaUtilService.setInterfacesTabView('SINGLE_INTERFACE');
  }
}
