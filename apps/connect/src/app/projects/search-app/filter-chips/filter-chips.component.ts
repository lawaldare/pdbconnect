import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SearchService } from '../common/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  imports: [CommonModule, MaterialModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterChipsComponent {
  @Input() filtercards: any;
  @Output() filtercardsChange = new EventEmitter<any>();

  @Output()
  refine: EventEmitter<string> = new EventEmitter();

  @Output()
  filterChipsClick: EventEmitter<string> = new EventEmitter();

  constructor(private searchService: SearchService) {}

  getTooltip(filterField: any) {
    let label = filterField.label;
    const labelArr = label.split('_');
    if (labelArr[0] == 'q') {
      labelArr.shift();
      label = labelArr.join(' ').replace(/^\w/, (c: string) => c.toUpperCase());
    }
    let tt = label + ' ' + filterField.relation + ' ';

    if (filterField.relation == '= range' || filterField.relation == '!= range') {
      if (filterField.type == 'date') {
        tt += new Date(filterField.selectedValue).toLocaleDateString('en-GB') + ' - ' + new Date(filterField.rangeValue2).toLocaleDateString('en-GB');
      } else {
        tt += filterField.selectedValue + ' - ' + filterField.rangeValue2;
      }
    } else {
      if (filterField.type == 'date') {
        tt += new Date(filterField.selectedValue).toLocaleDateString('en-GB');
      } else {
        tt += filterField.selectedValue;
      }
    }

    if (filterField.condition == 'IGNORE') {
      tt = label + ' filter is ignored for the current search.';
    }

    return tt;
  }

  getFilterText(field: { relation: string; type: string; selectedValue: string | number | Date; rangeValue2: string | number | Date; label: any }) {
    let textVal: any = 'Filter';
    if (field.relation == '= range' || field.relation == '!= range') {
      if (field.type == 'date') {
        textVal = new Date(field.selectedValue).toLocaleDateString('en-GB') + ' - ' + new Date(field.rangeValue2).toLocaleDateString('en-GB');
      } else {
        textVal = field.selectedValue + ' - ' + field.rangeValue2;
      }
    } else {
      if (field.type == 'date') {
        textVal = new Date(field.selectedValue).toLocaleDateString('en-GB');
      } else {
        textVal = field.selectedValue;
      }
    }
    let label = field.label;
    const labelArr = label.split('_');
    if (labelArr[0] == 'q') {
      labelArr.shift();
      label = labelArr.join(' ').replace(/^\w/, (c: string) => c.toUpperCase());
    }
    return label + ' : ' + textVal;
  }

  removeCard(index: number): void {
    //remove the card from filter cards array
    this.searchService.removeFilterCard(index);
    this.filtercards = this.searchService.getFilterCards().slice();

    this.refine.emit('refineSearch');
  }

  filterChipClicked(): void {
    this.filterChipsClick.emit('openDialog');
  }
}
