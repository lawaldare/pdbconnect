import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import * as appSettings from '../app.settings';
import { SearchService } from '../common/search.service';
import { MatDialog } from '@angular/material/dialog';
import { TooltipDialogComponent } from '../tooltip-dialog/tooltip-dialog.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from '../md-autocompleter';
declare const gtag: any;

@Component({
  selector: 'pdbc-filter-cards',
  templateUrl: './filter-cards.component.html',
  styleUrls: ['./filter-cards.component.css'],
  imports: [CommonModule, MaterialModule, FormsModule, Ng2CompleterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterCardsComponent implements OnInit, OnChanges {
  @Input() filtercards: any;
  @Output() filtercardsChange = new EventEmitter<any>();

  @Output()
  deletion: EventEmitter<string> = new EventEmitter();

  pdbeUrl: string;
  highlightNewCard!: boolean;

  inptMinVal = {
    int: 0,
    float: 0.0,
  };

  constructor(
    private searchService: SearchService,
    public dialog: MatDialog
  ) {
    this.pdbeUrl = appSettings.pdbeUrl;
  }

  ngOnInit() {
    this.highlightNewCard = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (changes['filtercards'] && !changes['filtercards'].firstChange) {
      this.highlightNewCard = true;
    }
  }

  removeCard(cardIndex: number): void {
    //remove the card from filter cards array
    // this.searchService.removeFilterCard(cardIndex);
    this.filtercards.splice(cardIndex, 1);

    this.highlightNewCard = false;

    this.deletion.emit('' + cardIndex);

    gtag('event', 'search_form_field_removed');
  }

  cleanQueryValue(term: any) {
    //Escape round brackets
    // term = term.replace(/\(/g, '\\\(').replace(/\)/g, '\\\)');
    // console.log(term)
    return term;
  }

  getTitle(fieldLabel: any) {
    let label = fieldLabel;
    const labelArr = label.split('_');
    if (labelArr[0] == 'q') {
      labelArr.shift();
      label = labelArr.join(' ').replace(/^\w/, (c: string) => c.toUpperCase());
    }
    return label;
  }

  openTooltipDialog(searchField: any, description: any) {
    this.dialog.open(TooltipDialogComponent, {
      disableClose: false,
      panelClass: 'tooltip-dialog',
      backdropClass: 'tooltip-backdrop',
      data: {
        searchField: searchField,
        description: description,
      },
    });
    // Capture Google Analytics event
    gtag('event', 'search_form_field_info_clicked');
  }

  recordTooltipAction() {
    gtag('event', 'search_form_field_info_mouseover');
  }

  recordConditionaction(type: string) {
    gtag('event', 'search_form_' + type);
  }
}
