import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SolrAutocompleteService } from './solr-autocomplete-service';

/**
 * TODO:
 *
 * 1. On search header keydown, send @Input variable to here
 * 2. Use https://angular.io/guide/lifecycle-hooks#onchanges
 * to listen to changes to this @Input variable and trigger
 * solr autocomplete service.
 * 3. conditional rendering is based on suggestions list
 * 4. migrate popup rendering code
 */

@Component({
  selector: 'pdbc-pdbe-search-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-search-autocomplete.component.html',
  styleUrls: ['./pdbe-search-autocomplete.component.scss'],
  providers: [],
})
export class PdbeSearchAutocompleteComponent {}
