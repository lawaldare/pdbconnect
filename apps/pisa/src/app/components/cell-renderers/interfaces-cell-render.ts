import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { PisaActions } from '../../store/pisa.actions';
import { PisaUtilService } from '../../services/pisa-util.service';

@Component({
  standalone: true,
  template: `
    @for (interface of interfaces; track interface.interface_id; let islast = $last) {
      <span (click)="openInterface(interface.interface_id)">{{ interface.interface_id }}</span> {{ islast ? '' : ',' }}
    }
  `,
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
export class InterfacesCellRenderer implements ICellRendererAngularComp {
  private pisaStore = inject(Store);
  private pisaUtilService = inject(PisaUtilService);

  // Init Cell Value
  public interfaces!: any[];
  private rowData!: any;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    this.interfaces = params.value;
    this.rowData = params.data;
    return true;
  }

  public openInterface(interfaceId: string) {
    this.pisaStore.dispatch(PisaActions.getInterfaceResultForInterfaceId({ interfaceId }));
    this.pisaStore.dispatch(PisaActions.setSelectedComplexDataOnComplexesTab({ selectedComplexData: this.rowData }));
    this.pisaUtilService.setComplexesTabView('SINGLE_INTERFACE');
  }
}
