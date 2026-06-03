/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-aggregated-view-search',
  templateUrl: './aggregated-view-search.component.html',
  imports: [CommonModule, FormsModule],
})
export class AggregatedViewSearchComponent {
  public uniprot_id = '';

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public goToProteinPage(): void {
    if (this.isBrowser) {
      window.open('https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + this.uniprot_id);
    }
  }
}
