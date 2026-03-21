/* eslint-disable @angular-eslint/prefer-inject */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class HeaderSearchComponent {
  public uniprot_id = '';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public goToProteinPage(): void {
    if (this.uniprot_id && this.isBrowser) {
      window.open('https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + this.uniprot_id);
    }
  }
}
