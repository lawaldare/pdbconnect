import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { GoogleAnalyticsService } from '@pdbc/core';
import { isPlatformBrowser } from '@angular/common';

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
  private readonly platformId = inject(PLATFORM_ID);

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

  public openLigandPage(ligandId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      const href = `http://localhost:4200/chemicalCompound/show/${ligandId}`;
      window.open(href, '_blank');
    } else {
      const hrefArray = window.location.href.split('/');
      hrefArray.pop();
      const href = hrefArray.join('/') + `/chemicalCompound/show/${ligandId}`;
      window.open(href, '_blank');
    }
  }
}
