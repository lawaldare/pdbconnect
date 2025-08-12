import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject, signal } from '@angular/core';
import { UtilService } from '@pdbc/core';
import { ValueLabel } from '../../../data-classes/data-models-and-definitions/other-models';

@Component({
  standalone: true,
  template: `
    @switch (data().label) {
      @case ('Source organism') {
        <em
          ><a [href]="util.generateQueryURL(value, 'q_organism_name')" target="_blank" style="font-size:14px">
            {{ value }}
            <!-- <i class="icon icon-search" style="margin-left: 5px; color:#3b6fb6"></i> -->
          </a></em
        >
      }
      @case ('Expression system') {
        <span
          ><em>{{ value }}</em></span
        >
      }

      @case ('Spacegroup name') {
        <span [innerHTML]="value"></span>
      }

      @default {
        <span>{{ value }}</span>
      }
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
