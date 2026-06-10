import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { GoogleAnalyticsService } from '@pdbc/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  template: `
    @if (value) {
      <a [href]="environment.baseUrl + 'pdbe/entry/pdb/' + value + '?activeTab=assemblies'" target="_blank" (click)="setRedirect()">
        {{ value }}_{{ assemblyId }}
        <!-- <i class="icon icon-link icon-common" style="margin-left: 5px;"></i> -->
      </a>
    } @else {
      <p>Unmapped</p>
    }
  `,
})
export class ComplexPageExternalLinkRendererComponent implements ICellRendererAngularComp {
  private readonly gAS = inject(GoogleAnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);

  public environment = environment;

  // Init Cell Value
  public value!: string;
  public assemblyId!: number;
  private tab!: string;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  // Return Cell Value
  refresh(params: any): boolean {
    this.assemblyId = params.data.assembly_id;
    this.value = params.value;
    this.tab = params.tab;
    return true;
  }

  setRedirect() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('assemblyId', String(this.assemblyId));
    this.gAS.logPageEvents('cp_go_to_ep', {
      tab: this.tab,
    });
  }
}
