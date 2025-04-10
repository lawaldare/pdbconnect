import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileHeaderLogoMenuConfig } from '@pdbc/core';
import { SearchAppComponent } from '@pdbc/search-app';

@Component({
  selector: 'lib-mobile-header',
  imports: [CommonModule, SearchAppComponent],
  templateUrl: './mobile-header.component.html',
  styleUrl: './mobile-header.component.scss',
})
export class MobileHeaderComponent {
  public headerConfig = input.required<MobileHeaderLogoMenuConfig>();

  public areLinksShowed = signal(false);

  public readonly apiSearchConfig = {
    additionalParams: 'rows=20000&json.nl=map&wt=json',
    fields: 'value,num_pdb_entries,var_name',
    group: 'group=true&group.field=category',
    groupLimit: '25',
    redirectOnClick: true,
    resultBoxAlign: 'left',
    searchUrl: 'https://www.ebi.ac.uk/pdbe/search/pdb-autocomplete/select',
    sort: 'category+asc,num_pdb_entries+desc',
    view: 'entries',
    env: '',
  };

  public pdbeSearchConfig = {
    examples: ['1trn', '1cbs', '7v08', '4v99', '4aqd'],
    // backgroundColor: '#007B53',
    hasAdvancedSearch: true,
    buttonText: 'Search',
    placeholderText: 'View PDBe entry by PDB entry ID',
    type: 'PDBe',
  };

  public showMobileMenu(): void {
    this.areLinksShowed.update((value) => !value);
  }
}
