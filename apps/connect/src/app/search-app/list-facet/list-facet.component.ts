import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { MaterialModule } from '@pdbc/core';

declare const gtag: any;

@Component({
  selector: 'pdbc-list-facet',
  templateUrl: './list-facet.component.html',
  styleUrls: ['./list-facet.component.css'],
  imports: [CommonModule, MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFacetComponent implements OnChanges {
  @Input() listHeading!: string;
  @Input() listHeadingCount!: number;
  @Input() listData!: any[];
  @Input() isExpanded = false;

  @Output()
  itemClicked: EventEmitter<any> = new EventEmitter();
  showLoader = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['listData']) {
      this.showLoader = false;
    }
  }

  headingClick() {
    this.isExpanded = !this.isExpanded;
    const action = this.isExpanded ? 'expand' : 'collapse';
    gtag('event', 'filters_toggle_' + action);
  }

  facetClicked(selectedItem: any) {
    if (selectedItem.action && selectedItem.action == 'more') this.showLoader = true;
    this.itemClicked.emit(selectedItem);
  }
}
