import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PdbeHelpIconComponent } from '@pdbe-lib/help-icon';

@Component({
  selector: 'pdbc-summary-alt-one',
  standalone: true,
  imports: [CommonModule, PdbeLinkButtonComponent, PdbeHelpIconComponent],
  templateUrl: './summary-alt-one.component.html',
  styleUrl: './summary-alt-one.component.scss',
})
export class SummaryAltOneComponent implements OnInit {
  @Input() entryId = '1cbs';
  @Input() entryTitle = 'CRYSTAL STRUCTURE OF CELLULAR RETINOIC-ACID-BINDING PROTEINS I AND II IN COMPLEX WITH ALL-TRANS-RETINOIC ACID AND A SYNTHETIC RETINOID';

  @Input() complexName?: string;
  @Input() complexId?: string;

  @Input() sourceOrganisms = ['Saccharomyces cerevisiae BY4741'];

  @Input() polymericEntitiesList: string[] = [];
  @Input() smallMoleculesList: { text: string; nested: boolean }[] = [];

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
  @Input() publicationDOI? = '10.1016/s0969-2126(94)00125-1';
  pdbEntryDOI = '10.2210/pdb1cbs/pdb';

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
