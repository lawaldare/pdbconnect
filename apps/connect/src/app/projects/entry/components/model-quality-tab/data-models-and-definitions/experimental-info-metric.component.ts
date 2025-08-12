import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject, signal } from '@angular/core';
import { UtilService } from '@pdbc/core';
import { ValueLabel } from '../../../data-classes/data-models-and-definitions/other-models';

@Component({
  standalone: true,
  template: `
    @switch (data().label) {
      @case ('Temperature') {
        <span>{{ value }} [K]</span>
      }

      @case ('Wavelength') {
        <span>{{ value }}(s) [Å]</span>
      }

      @case ('Unit cell lengths') {
        <span>{{ value }} [Å]</span>
      }

      @case ('Unit cell angles') {
        <span>{{ value }} [°]</span>
      }

      @case ('Wilson b') {
        <span>Wilson B [Å²]</span>
      }

      @case ('Pseudo translation') {
        <span>Possible (pseudo-) translation</span>
      }

      @case ('Pseudo translation') {
        <span>Possible (pseudo-) translation</span>
      }

      @case ('Data scaling 1') {
        <span>Data scaling #1</span>
      }

      @case ('Data scaling 2') {
        <span>Data scaling #2</span>
      }

      @case ('Data scaling 3') {
        <span>Data scaling #3</span>
      }

      @case ('Low resolution limit') {
        <span>{{ value }} [Å]</span>
      }

      @case ('High resolution limit') {
        <span>{{ value }} [Å]</span>
      }

      @case ('Rmerge') {
        <span [innerHTML]="'R<sub>merge</sub>'"></span>
      }

      @case ('Rmeas') {
        <span [innerHTML]="'R<sub>meas</sub>'"></span>
      }

      @case ('Rpim') {
        <span [innerHTML]="'R<sub>pim</sub>'"></span>
      }

      @case ('I over sigma') {
        <span>I/σ(I)</span>
      }

      @case ('Completeness') {
        <span>{{ value }} [%]</span>
      }

      @case ('Cc half') {
        <span [innerHTML]="'CC<sub>1/2</sub>'"></span>
      }

      @case ('Resolution') {
        <span>{{ value }} [Å]</span>
      }

      @case ('Rwork') {
        <span [innerHTML]="'R<sub>work</sub>'"></span>
      }

      @case ('Rfree') {
        <span [innerHTML]="'R<sub>free</sub>'"></span>
      }

      @default {
        <span>{{ value }}</span>
      }
    }
  `,
})
export class ExperimentalInfoMetricRendererComponent implements ICellRendererAngularComp {
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
