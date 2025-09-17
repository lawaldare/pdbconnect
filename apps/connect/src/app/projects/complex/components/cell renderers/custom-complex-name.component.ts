import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule, UtilService } from '@pdbc/core';
import { ComplexInteraction } from '../../models/complex-structure.model';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <span style="display:block; margin-bottom: 5px;">
      <a role="button" (click)="openComplexPage(data.pdb_complex_id)">
        {{ data.pdb_complex_id }}
        <i class="icon icon-link icon-common" style="margin-left: 5px;"></i>
      </a>
    </span>

    @if (data.name) {
      <span matTooltipClass="complex-name-tooltip" [matTooltip]="data.name" matTooltipPosition="above"
        >{{ data.name.length > 30 ? data.name.slice(0, 30) + '...' : data.name }}
      </span>
    }
  `,
})
export class ComplexNameRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  private readonly util = inject(UtilService);
  public data!: ComplexInteraction;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId, '_blank');
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.data = params.data;
    return true;
  }
}
