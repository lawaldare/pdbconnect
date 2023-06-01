import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PdbeHeaderSearchComponent } from '@pdbe-lib/header-search';

interface Example {
  label: string;
  url: string;
}

@Component({
  selector: 'pdbc-pdbe-hero-banner',
  standalone: true,
  imports: [CommonModule, PdbeHeaderSearchComponent],
  templateUrl: './pdbe-hero-banner.component.html',
  styleUrls: ['./pdbe-hero-banner.component.scss'],
})
export class PdbeHeroBannerComponent {
  @Input() heading = 'EMBL-EBI';
  @Input() logo?: string;
  @Input() subheading = 'Unleashing the potential of big data in biology';
  @Input() url?: string;

  //Header Search params
  @Input() searchBeta = true;
  @Input() searchButtonText = 'Search';
  @Input() examples?: Example[];
  @Input() loadingText = 'Loading';
  @Input() panelOpen = false;
  @Input() searchPlaceholder = 'Search for protein, gene or organism';
  @Input() searchSuggestions?: string[];

  // Output Emitters
  @Output() searchKeyword: EventEmitter<string> = new EventEmitter();
  @Output() selectedIndex: EventEmitter<number> = new EventEmitter();
  @Output() searchCleared: EventEmitter<boolean> = new EventEmitter();

  searchHandler(searchKeyword: string) {
    this.searchKeyword.emit(searchKeyword);
  }

  selectSuggestion(index: number) {
    this.selectedIndex.emit(index);
  }

  searchClearedFn(val: boolean) {
    this.searchCleared.emit(val);
  }
}
