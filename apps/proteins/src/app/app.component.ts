import { Component } from '@angular/core';
import { NxWelcomeComponent } from './nx-welcome.component';

//App Components
import { SummaryComponent } from '../app/pages/summary/summary.component';

//Lib Components
import { PdbePageHeaderComponent } from '@pdbe-lib/page-header';
import { VfEbiFooterComponent } from '@vf-lib/ebi-footer';

//App Services
import { AutocompleteService } from './services/autocomplete.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, PdbePageHeaderComponent, VfEbiFooterComponent, SummaryComponent],
  selector: 'pdbc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  suggestions: string[] = [];

  constructor(private autocomplete: AutocompleteService) {}

  searchKeywordFn(keyword: string): void {
    const url = `https://www.ebi.ac.uk/pdbe/search/pdb/select?rows=0&wt=json&echoParams=none&group=true&facet=true&group.field=pdb_id&group.facet=true&facet.field=q_complex_name&facet.contains.ignoreCase=true&facet.threads:-1&facet.contains=${keyword}&q=q_complex_name:*${keyword}*`;
    this.autocomplete.getApiData(url).subscribe(
      (res) => {
        this.suggestions = res.facet_counts.facet_fields.q_complex_name.filter((r: string, i: number) => i % 2 === 0);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  selectedIndexFn(index: number): void {
    console.log(`Selected Term: ${this.suggestions[index]}`);
    this.suggestions = [].slice();
  }

  searchClearedFn() {
    this.suggestions = [].slice();
  }
}
