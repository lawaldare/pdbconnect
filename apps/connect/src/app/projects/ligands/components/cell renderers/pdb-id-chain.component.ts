import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject, Signal } from '@angular/core';
import { GoogleAnalyticsService } from '@pdbc/core';

@Component({
  standalone: true,
  template: `
    @if(value){ @if(ligandId().startsWith('CLC') || ligandId().startsWith('PRD')){ @let id = value.split('_')[0]; @let href = 'https://www.ebi.ac.uk/pdbe/entry/pdb/'
    + id;
    <a [href]="href" target="_blank" (click)="googleAnalyticsService.logClickEvents('click_pdbe_kb_link', 'Protein Data', 'click_pdbe_kb_link', value)">
      {{ value }}
    </a>
    } @else { @let id = value.split('_')[0]; @let href = 'https://www.ebi.ac.uk/pdbe/entry/pdb/' + id + '/bound/' + ligandId();
    <a [href]="href" target="_blank" (click)="googleAnalyticsService.logClickEvents('click_pdbe_kb_link', 'Protein Data', 'click_pdbe_kb_link', value)">
      {{ value }}
    </a>
    }
    <i class="icon icon-link icon-common" style="margin-left: 5px;"></i>
    } @else {
    <p>Unmapped</p>
    }
  `,
})
export class PDBIdChainRendererComponent implements ICellRendererAngularComp {
  public readonly googleAnalyticsService = inject(GoogleAnalyticsService);

  // Init Cell Value
  public value!: string;
  public ligandId!: Signal<string>;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    console.log(params);
    this.value = params.value;
    this.ligandId = params.ligandId;
    return true;
  }
}
