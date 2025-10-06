import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    @if (value) {
      <a [href]="'https://wwwdev.ebi.ac.uk/pdbe/entry/pdb/' + value + '?activeTab=assemblies'" target="_blank" (click)="setRedirect()">
        {{ value }}
        <i class="icon icon-link icon-common" style="margin-left: 5px;"></i>
      </a>
    } @else {
      <p>Unmapped</p>
    }
  `,
})
export class ComplexPageExternalLinkRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;
  public assemblyId!: number;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.assemblyId = params.data.assembly_id;
    this.value = params.value;
    return true;
  }

  setRedirect() {
    localStorage.setItem('assemblyId', String(this.assemblyId));
  }
}
