import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject } from '@angular/core';
import { GoogleAnalyticsService } from '@pdbc/core';

@Component({
  standalone: true,
  templateUrl: './lr-uniprot-accession.component.html',
  styles: `

  .structure-image {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  `,
})
export class UniProtAccessionRendererComponent implements ICellRendererAngularComp {
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  // Init Cell Value
  public value!: any;
  public type!: string;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    this.type = params.type;
    if (this.type === 'pdbeentry') {
      if (typeof params.value === 'string') {
        this.value = [params.value];
      } else {
        this.value = params.value;
      }
    } else {
      this.value = params.value;
    }
    return true;
  }
}
