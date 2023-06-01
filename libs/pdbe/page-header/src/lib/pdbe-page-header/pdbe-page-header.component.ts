import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VfEbiHeaderComponent } from '@vf-lib/ebi-header';
import { VfNavComponent, MenuItem } from '@vf-lib/nav';

import { PdbeHeroBannerComponent } from '@pdbe-lib/hero-banner';

interface Example {
  label: string;
  url: string;
}

@Component({
  selector: 'pdbc-pdbe-page-header',
  standalone: true,
  imports: [CommonModule, VfEbiHeaderComponent, VfNavComponent, PdbeHeroBannerComponent],
  templateUrl: './pdbe-page-header.component.html',
  styleUrls: ['./pdbe-page-header.component.scss'],
})
export class PdbePageHeaderComponent {
  @Input() heading = 'EMBL-EBI';
  @Input() logo?: string;
  @Input() subheading = 'Unleashing the potential of big data in biology';
  @Input() url?: string;
  @Input() menuItems?: MenuItem[];

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
