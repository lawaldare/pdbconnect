import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';

@Component({
  selector: 'pdbc-summary',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  sourceOrganism = 'Saccharomyces cerevisiae BY4741';
  experimentType = 'Electron Microscopy';
  resolutionValue = '2.36Å resolution';
  releasedData = '15 Mar 2023';
  publicationTitle = 'rRNA methylation by Spb1 regulates the GTPase activity of Nog2 during 60S ribosomal subunit assembly';
  publicationOrEntryAuthors = ['Sekulski K', 'Cruz VE', 'Weirich CS', 'Erzberger JP'];
  publicationJournal = 'Nat Commun';
  publicationVolume = '14';
  publicationPage = '1207';
  publicationYear = '(2023)';
  publicationPMID = '36864048';
  pdbEntryDOI = '10.2210/pdb1cbs/pdb';
  emdbEntry = 'EMD-26941';

  getComma(idx: number) {
    if (idx + 1 < this.publicationOrEntryAuthors.length) {
      return ',';
    }
    return '';
  }
}
