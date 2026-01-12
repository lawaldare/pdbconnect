import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-aggregated-view-search',
  templateUrl: './aggregated-view-search.component.html',
  imports: [CommonModule, FormsModule],
})
export class AggregatedViewSearchComponent {
  public uniprot_id = '';
  goToProteinPage() {
    window.open('https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + this.uniprot_id);
  }
}
