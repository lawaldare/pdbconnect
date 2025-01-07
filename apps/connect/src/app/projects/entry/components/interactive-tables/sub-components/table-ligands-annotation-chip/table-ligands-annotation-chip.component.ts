import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

/**
 * Component for rendering Unnanotated, Modification, Drug-like, Reactant-like ligand chips
 * inside ligand tables
 */
@Component({
  selector: 'pdbc-table-ligands-annotation-chip',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: ` <span
    class="entry-pgs-tooltip-hover tbl-col-ligands-annotation tbl-col-ligands-chip"
    matTooltipClass="entry-pgs-tooltip"
    [matTooltip]="params.chipTooltip"
    matTooltipPosition="below"
    [ngStyle]="{ background: params.bgColor }"
  >
    {{ params.chipText }}
  </span>`,
  styles: [
    `
      span {
      }
    `,
  ],
})
export class TableLigandsAnnotationChipComponent implements ICellRendererAngularComp {
  // params come from cellRendererParams in column-definition-objects
  public params!: { chipTooltip: string; chipText: string; bgColor: string };

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
}
