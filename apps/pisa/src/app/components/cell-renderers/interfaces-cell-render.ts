import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';

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
      }
    `,
  ],
})
export class InterfacesCellRenderer implements ICellRendererAngularComp {
  // Init Cell Value
  public interfaces!: any[];
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    this.interfaces = params.value;
    return true;
  }

  public openInterface(interfaceId: number) {
    console.log(`Opening interface ${interfaceId}`);
  }
}
