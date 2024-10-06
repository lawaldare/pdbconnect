import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { GoogleAnalyticsService } from '@pdbc/core';

@Component({
  standalone: true,
  template: `
    @if(value){
    <a
      [href]="'https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + value"
      target="_blank"
      (click)="googleAnalyticsService.logClickEvents('click_pdbe_kb_link', 'Protein Data', 'click_pdbe_kb_link', value)"
    >
      {{ value }}
      <i class="icon icon-link icon-common" style="margin-left: 5px;"></i>
    </a>
    } @else {
    <p>Unmapped</p>
    }
  `,
})
export class PDBIdChainRendererComponent implements ICellRendererAngularComp {
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

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
