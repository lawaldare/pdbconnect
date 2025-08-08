import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <span #highlightContainer [innerHTML]="getHighlightedSentence"></span> <br />
    @if (this.pmcId) {
      <a [href]="getSentenceLink" target="_blank"> View in article <i class="icon icon-link icon-common" style="margin-left: 5px;"></i></a>
    }
  `,
})
export class SentenceRendererComponent implements ICellRendererAngularComp, AfterViewInit {
  // Init Cell Value
  public value!: string;
  public exactWord!: string;
  public pmcId?: string;
  public pdbResidue!: number;

  @ViewChild('highlightContainer', { static: false }) highlightContainer!: ElementRef;

  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  ngAfterViewInit() {
    // Attach click listener to any <strong> inside
    const strongEl = this.highlightContainer.nativeElement.querySelector('strong');
    if (strongEl) {
      strongEl.style.cursor = 'pointer';
      strongEl.addEventListener('click', () => {
        this.onStrongClick();
      });
    }
  }

  onStrongClick() {
    const eventObj = new CustomEvent('to-seq-viewer-click', {
      detail: {
        eventData: {
          residueNumber: this.pdbResidue,
          entityId: 'ignore',
          chainId: 'ignore',
          unselect: 'ignore',
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj);

    const eventObj2 = new CustomEvent('to-molstar-click', {
      detail: {
        eventData: {
          residueNumber: this.pdbResidue,
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj2);
  }

  get getHighlightedSentence() {
    const escaped = this.exactWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    return this.value.replace(regex, `<strong class="clickable-strong">${this.exactWord}</strong>`);
  }

  private strictEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/-/g, '%2D')
      .replace(/_/g, '%5F') // if needed
      .replace(/\./g, '%2E'); // etc. if more strictness needed
  }

  get getSentenceLink() {
    const value = this.value;
    const word = this.exactWord;

    // Escape regex chars in the exactWord
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Find all matches of the exact word
    const regex = new RegExp(escapedWord, 'g');
    const match = regex.exec(value);
    if (!match) return `https://pmc.ncbi.nlm.nih.gov/articles/${this.pmcId}/`;

    const startIndex = match.index;
    const endIndex = startIndex + word.length;

    // --- Extend left until '(' (unless right next to word) ---
    let left = startIndex - 1;
    while (left >= 0) {
      const char = value[left];
      if (char === '(' || char === ')') {
        // Stop if '(' is NOT immediately next to the word
        if (left < startIndex - 1) break;
      }
      left--;
    }

    // --- Extend right until ')' (unless right next to word) ---
    let right = endIndex;
    while (right < value.length) {
      const char = value[right];
      if (char === '(' || char === ')') {
        // Stop if ')' is NOT immediately next to the word
        if (right > endIndex) break;
      }
      right++;
    }

    // Extract substring (trim for cleanliness)
    const context = value.slice(left + 1, right).trim();

    // Encode for URL safety (if used as parameter/query)
    const encodedContext = this.strictEncode(context);
    return `https://pmc.ncbi.nlm.nih.gov/articles/${this.pmcId}/#:~:text=${encodedContext}`;
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.exactWord = params.data.exact;
    this.pdbResidue = params.data.pdbResidue;
    if (params.data.pmcId) this.pmcId = params.data.pmcId;
    return true;
  }
}
