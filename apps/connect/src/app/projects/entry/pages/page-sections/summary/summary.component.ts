import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';

@Component({
  selector: 'pdbc-summary',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  @Input() entryId = '1cbs';
  @Input() sourceOrganisms = ['Saccharomyces cerevisiae BY4741'];
  @Input() experimentType = 'Electron Microscopy';
  @Input() resolutionValue? = '2.36Å resolution';
  @Input() releasedData = '15 Mar 2023';
  @Input() publicationTitle = 'rRNA methylation by Spb1 regulates the GTPase activity of Nog2 during 60S ribosomal subunit assembly';
  @Input() publicationOrEntryAuthors = ['Sekulski K', 'Cruz VE', 'Weirich CS', 'Erzberger JP'];
  @Input() publicationJournal = 'Nat Commun';
  @Input() publicationVolume? = '14';
  @Input() publicationPage? = '1207';
  @Input() publicationYear? = '(2023)';
  @Input() publicationPMID? = '36864048';
  pdbEntryDOI = '10.2210/pdb1cbs/pdb';
  @Input() emdbEntries = ['EMD-26941'];

  ngOnInit(): void {
    this.pdbEntryDOI = `10.2210/pdb${this.entryId}/pdb`;
  }

  getComma(idx: number) {
    if (idx + 1 < this.publicationOrEntryAuthors.length) {
      return ',';
    }
    return '';
  }
}
