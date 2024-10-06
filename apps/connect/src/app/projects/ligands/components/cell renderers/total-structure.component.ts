import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { Chain } from '../../data-models/structure.model';
import { LigandInteractingChainsNumberPipe } from '../../pipes/ligandInteractingChainsNumber.pipe';
import { GoogleAnalyticsService } from '@pdbc/core';

export interface TotalStructureCellRendererParams extends ICellRendererParams {
  value: Chain[];
  onValueClicked: (params: TotalStructureCellRendererParams) => void;
}

@Component({
  standalone: true,
  template: `<a href="#" (click)="openTotalDialog($event)">{{ total }}</a>`,
  providers: [LigandInteractingChainsNumberPipe],
})
export class TotalStructureRendererComponent implements ICellRendererAngularComp {
  params!: TotalStructureCellRendererParams;
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);
  private readonly chainPipe = inject(LigandInteractingChainsNumberPipe);

  // Init Cell Value
  public value!: Chain[];
  public total!: number;
  onValueClicked!: () => void;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.params = params as TotalStructureCellRendererParams;
    this.value = params.data.interacting_chains;
    this.total = this.chainPipe.transform(this.value);
    return true;
  }

  openTotalDialog(event: Event): void {
    event.preventDefault();
    this.params.onValueClicked(this.params);
    this.googleAnalyticsService.logClickEvents('click_total_structure', 'Structure', 'click_number_of_structures', this.params.value.length.toString());
  }
}
