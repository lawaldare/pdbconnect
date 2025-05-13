import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject, signal } from '@angular/core';
import { ValueLabel } from '../experiments-validation.component';
import { UtilService } from '@pdbc/core';

@Component({
  standalone: true,
  template: `
    @if (data().label === 'Source organism') {
      <a [href]="util.generateQueryURL(value, 'q_organism_name')" target="_blank" style="font-size:14px">
        {{ value }}
        <i class="icon icon-link icon-search" style="margin-left: 5px; color:#3b6fb6"></i>
      </a>
    } @else if (data().label === 'Expression system') {
      <em>{{ value }}</em>
    } @else {
      {{ value }}
    }
  `,
})
export class ExperimentalInfoValueRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;
  public data = signal<ValueLabel>({} as ValueLabel);
  public readonly util = inject(UtilService);

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.data.set(params.data);
    this.value = params.value;
    return true;
  }
}
