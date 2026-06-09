/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PdbeHeaderLogoMenuComponent } from '@pdbe-lib/header-logo-menu';
import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';
import { headerComplexLogoMenuConfig, headerSearchComplexConfig } from '../../complex.constant';

@Component({
  selector: 'pdbc-error-page',
  standalone: true,
  imports: [CommonModule, PdbeHeaderLogoMenuComponent, PdbeHeaderSearchComponent],
  template: ` <pdbc-pdbe-header-logo-menu [headerConfig]="headerSearchLogoMenuConfig" />
    <pdbc-pdbe-header-search [headerSearchConfig]="headerSearchConfig" />
    <div class="container">
      <h3>No results</h3>
      <p class="complex">
        We couldn’t find any matches for your search. <br />
        This may happen if you used a UniProt or Rfam accession, complex name or organism name, which are not yet supported.
      </p>
      <p class="complex">Please try searching again using one of the following valid identifiers:</p>
      <ul>
        <li>PDBe complex ID (for example, PDB-CPX-140202)</li>
        <li>PDB entry ID (for example, 7tpc)</li>
        <li>Complex Portal ID (for example, CPX-7043).</li>
      </ul>
    </div>`,
  styles: [
    `
      @import 'pdb_connect';

      p {
        color: #000;
        font-weight: 400;
        margin-bottom: 20px;
        margin-top: 15px !important;
      }

      h3 {
        color: #1a1c1a;
        font-size: 24px;
        font-weight: 500;
        line-height: 31.2px;
      }

      p.complex,
      li {
        color: #1a1c1a;
        font-size: 19px;
        font-weight: 400;
        line-height: 26.6px;
      }
    `,
  ],
})
export class ErrorPageComponent {
  public readonly headerSearchLogoMenuConfig = { ...headerComplexLogoMenuConfig, isComplexPage: true };
  public readonly headerSearchConfig = headerSearchComplexConfig;
}
