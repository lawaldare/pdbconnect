import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from '@pdbc/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tab-pagination-section',
  templateUrl: './tab-pagination-section.component.html',
  styleUrls: ['./tab-pagination-section.component.scss'],
  imports: [CommonModule, MaterialModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabPaginationSectionComponent {
  @Input() countLabel = 'Results';
  @Input() showSort = true;
  @Input() paginationData: any;
  @Output() paginationDataChange = new EventEmitter<any>();
  perPageOptions = [
    { label: '10 /page', value: 10 },
    { label: '20 /page', value: 20 },
    { label: '50 /page', value: 50 },
    { label: '100 /page', value: 100 },
  ];

  @Output()
  selectedPage: EventEmitter<any> = new EventEmitter();

  @Output()
  sortBy: EventEmitter<any> = new EventEmitter();

  constructor(private _sanitizer: DomSanitizer) {}

  paginateTo(pageIndex: any, source: any) {
    this.selectedPage.emit({ pageIndex: pageIndex, source: source });
  }

  sortByFn(sortByValue: any) {
    this.sortBy.emit({ sortByValue: sortByValue });
  }

  getTitle() {
    let title = '';
    const ppVal = typeof this.paginationData.perPage == 'string' ? parseInt(this.paginationData.perPage) : this.paginationData.perPage;
    if (this.paginationData.currentPage == this.paginationData.totalPages) {
      const from1 = (this.paginationData.currentPage - 1) * ppVal + 1;
      const to1 = this.paginationData.totalRecords;
      title = this.countLabel + ' ' + from1 + ' to ' + to1 + ' of ' + this.paginationData.totalRecords;
    } else {
      const from2 = (this.paginationData.currentPage - 1) * ppVal + 1;
      const to2 = (this.paginationData.currentPage - 1) * ppVal + ppVal;
      title = this.countLabel + ' ' + from2 + ' to ' + to2 + ' of ' + this.paginationData.totalRecords;
    }

    return this._sanitizer.bypassSecurityTrustHtml(title);
  }
}
