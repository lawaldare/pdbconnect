import { Component, ChangeDetectorRef, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { PdbeSecondaryButtonStyleDatum, PdbeKbSecondaryButtonStyleDatum, PdbeButtonComponent } from '@pdbe-lib/button';
import { PdbeLinkButtonComponent } from '@pdbe-lib/link-button';
import { PdbeChipsStyleDatum, PdbeKbChipsStyleDatum, PdbeChipsComponent } from '@pdbe-lib/chips';

interface Example {
  label: string;
  url: string;
}


@Component({
  selector: 'pdbc-pdbe-header-search',
  standalone: true,
  imports: [CommonModule, PdbeButtonComponent, PdbeLinkButtonComponent, PdbeChipsComponent],
  templateUrl: './pdbe-header-search.component.html',
  styleUrls: ['./pdbe-header-search.component.scss'],
})
export class PdbeHeaderSearchComponent implements OnInit {
  // Input Parameters
  @Input() backgroundColor = '';
  @Input() hasAdvancedSearch = true;
  @Input() buttonText = 'Search';
  @Input() examples?: Example[];
  @Input() loadingText = 'Loading';
  @Input() panelOpen = false;
  @Input() placeholder = 'Search for protein, gene or organism';
  @Input() suggestions?: string[];

  @Input() searchButtonChipsType = '';
  searchButtonStyle?: PdbeSecondaryButtonStyleDatum | PdbeKbSecondaryButtonStyleDatum;
  searchChipsStyle?: PdbeChipsStyleDatum | PdbeKbChipsStyleDatum;

  // Output Emitters
  @Output() searchKeyword: EventEmitter<string> = new EventEmitter();
  @Output() selectedIndex: EventEmitter<number> = new EventEmitter();
  @Output() searchCleared: EventEmitter<boolean> = new EventEmitter();

  // Globals
  showClearIcon = false;
  searchTermStream = new Subject<string>();

  constructor(public changeDetectorRef: ChangeDetectorRef, private el: ElementRef) {}

  ngOnInit() {
    // Here we set the pdb search button parameters according if it's PDBe or PDBe-KB search
    // Classes that contain these values can be found on the pdbe-button component model files
    if (this.searchButtonChipsType === "PDBe") {
      this.searchButtonStyle = new PdbeSecondaryButtonStyleDatum();
      this.searchButtonStyle!.label = "Search";
      this.searchButtonStyle!.paddingSize = "Big";
      this.searchButtonStyle!.mobileIconName = "search";
      this.searchChipsStyle = new PdbeChipsStyleDatum();
    } else if (this.searchButtonChipsType === "PDBe-KB") {
      this.searchButtonStyle = new PdbeKbSecondaryButtonStyleDatum();
      this.searchButtonStyle.label = "Search";
      this.searchButtonStyle.paddingSize = "Big";
      this.searchButtonStyle.mobileIconName = "search";
      this.searchChipsStyle = new PdbeKbChipsStyleDatum();
    }
    this.searchTermStream
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged(),
        filter((query: string) => {
          if (query?.length > 0) {
            this.showClearIcon = true;
          } else {
            this.showClearIcon = false;
          }

          if (query?.length > 2) {
            return true;
          } else {
            this.panelOpen = false;
            this.changeDetectorRef.detectChanges();
            return false;
          }
        })
      ) // ignore if next search term is same as previous
      .subscribe((term) => {
        this.loadingText = 'Loading...';
        this.panelOpen = term ? true : false;

        this.searchKeyword.emit(term);
      });
  }

  search(term: string): void {
    this.changeDetectorRef.detectChanges();
    this.searchTermStream.next(term);
  }

  openSearch(term: string): void {
    console.log(term);
  }

  clearSearch() {
    this.searchTermStream.next('');
    const inputEle = this.el.nativeElement.querySelector('.pdbeAutoCompleteSearchBox');
    inputEle.value = '';
    inputEle.focus();
    this.searchCleared.emit(true);
  }

  selectSuggestion(index: number) {
    this.selectedIndex.emit(index);
  }
}
