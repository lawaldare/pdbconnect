import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-header-search',
  templateUrl: './header-search.component.html',
  styleUrls: ['./header-search.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class HeaderSearchComponent {
  public uniprot_id = '';

  goToProteinPage() {
    if (this.uniprot_id && this.uniprot_id != '') {
      window.open('https://www.ebi.ac.uk/pdbe/pdbe-kb/proteins/' + this.uniprot_id);
    }
  }
}
