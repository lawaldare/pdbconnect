import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryStatus, StatusCode } from '../../data-models/status.model';
import { AuthorsStringDirective } from '../../directives/author-string.directive';

@Component({
  selector: 'pdbc-entry-main-alternative',
  imports: [CommonModule, AuthorsStringDirective],
  templateUrl: './entry-main-alternative.component.html',
  styleUrl: './entry-main-alternative.component.scss',
})
export class EntryMainAlternativeComponent {
  public entryStatus = input.required<EntryStatus>();

  private readonly statusPageContent: Record<StatusCode, { title: string; content: string }> = {
    WDRN: {
      title: 'Unreleased deposition has been withdrawn (WDRN)',
      content: 'This entry was withdrawn before release and will not be available in the wwPDB PDB archive.',
    },
    HPUB: {
      title: 'Processing complete, entry on hold until publication (HPUB)',
      content:
        'This entry has been processed and approved by the authors. It is presently on hold and will be released upon notification of publication of the manuscript describing this structure.',
    },
    OBS: {
      title: 'This entry has been obsoleted (OBS)',
      content: `This entry has been superseded by entry 8vrx.`,
    },
    AUTH: {
      title: 'Processed, waiting for author review and approval (AUTH)',
      content: 'This entry has been processed and is presently awaiting review and approval by the authors.',
    },
    HOLD: {
      title: 'Processing complete, entry on hold (HOLD)',
      content: 'This entry is on hold and will not be released until publication or a longer period of time (up to one year) as requested by the author.',
    },
    POLC: {
      title: 'Processing stalled, waiting for a policy decision (POLC)',
      content: 'This entry has been deposited but processing is halted pending a policy decision by wwPDB.',
    },
    AUCO: {
      title: 'Author corrections pending review (AUCO)',
      content: 'This entry has has been deposited and is being processed. Currently, corrections from the authors are awaiting review.',
    },
    REFI: {
      title: 'Re-refined entry, processing pending availability of primary publication (REFI)',
      content:
        'This entry is a re-refinement based on experimental data obtained from a previously released PDB entry. It will not be processed until a publication is available that describes the re-refinement.',
    },
    PROC: {
      title: 'To be processed (PROC)',
      content: 'This entry is currently being processed by the wwPDB.',
    },
    WAIT: {
      title: 'Processing started, waiting for author input to continue processing (WAIT)',
      content: 'This entry has has been deposited and is being processed. Currently, corrections from the authors are awaiting review.',
    },
    REPL: {
      title: 'Author sent new coordinates, entry to be reprocessed (REPL)',
      content: 'This entry will be reprocessed as the authors have submitted replacement coordinates.',
    },
    REL: {
      title: '',
      content: '',
    },
    INITIAL: {
      title: '',
      content: '',
    },
  };

  public status = computed(() => {
    const code = this.entryStatus().status_code;
    const content = this.statusPageContent[code];
    return {
      ...this.entryStatus(),
      pageTitle: content?.title,
      pageContent:
        this.entryStatus().status_code === 'OBS'
          ? `
      This entry has been superseded by entry <a href="https://www.ebi.ac.uk/pdbe/entry/pdb/${this.entryStatus().superceded_by[0]}" target="_blank">${
              this.entryStatus().superceded_by[0]
            }</a>.
      `
          : content?.content,
    };
  });
}
