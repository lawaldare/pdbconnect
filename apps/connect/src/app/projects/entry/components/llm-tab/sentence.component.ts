import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community/';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: ` <span [innerHTML]="getHighlightedSentence"></span> `,
})
export class SentenceRendererComponent implements ICellRendererAngularComp {
  // Init Cell Value
  public value!: string;
  public exactWord!: string;
  agInit(params: ICellRendererParams): void {
    this.refresh(params);
  }

  get getHighlightedSentence() {
    const escaped = this.exactWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex chars
    const regex = new RegExp(escaped, 'g'); // global match
    return this.value.replace(regex, `<strong>${this.exactWord}</strong>`);
  }

  // Return Cell Value
  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.exactWord = params.data.exact;
    return true;
  }
}
