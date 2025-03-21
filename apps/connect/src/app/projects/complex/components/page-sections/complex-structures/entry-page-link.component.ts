import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    @if (value) {
      <a [href]="'https://wwwdev.ebi.ac.uk/pdbe/connect/entry/pdb/' + value" target="_blank">
        {{ value }}
        <i class="icon icon-link icon-common" style="margin-left: 5px;"></i>
      </a>
    } @else {
      <p>Unmapped</p>
    }
  `,
})
export class EntryPageExternalLinkRendererComponent implements ICellRendererAngularComp {
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
