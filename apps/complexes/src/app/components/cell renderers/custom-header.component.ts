import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { MaterialModule } from '@pdbc/core';

import type { IHeaderAngularComp } from 'ag-grid-angular';
import type { IHeaderParams } from 'ag-grid-community';

export interface ICustomHeaderParams {
  showHelpIcon: boolean;
  tooltipText: string;
}

@Component({
  standalone: true,
  imports: [MaterialModule],
  template: `
    <div>
      <div data-ref="eHeaderCompWrapper" class="ag-header-cell-comp-wrapper" role="presentation">
        <div class="ag-cell-label-container" role="presentation">
          <div data-ref="eLabel" class="ag-header-cell-label" role="presentation">
            <span data-ref="eText" class="ag-header-cell-text">{{ params.displayName }}</span>
            @if (params.showHelpIcon) {
              <img
                src="{{ helpLogoSrc }}"
                class="icon"
                matTooltipClass="complex-name-tooltip"
                [matTooltip]="params.tooltipText"
                matTooltipPosition="below"
                alt="help icon"
              />
            }
            @if (params.enableFilterButton) {
              <span data-ref="eFilter" #menuButton class="ag-header-icon ag-header-label-icon ag-filter-icon" aria-hidden="true" (click)="onMenuClicked()">
                <span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span>
              </span>
            }
            <!--AG-SORT-INDICATOR-->
            @if (params.enableSorting) {
              <div #sortIconButton class="customHeaderMenuButton" (click)="onSortIconClicked()">
                <span class="ag-icon ag-icon-{{ iconType() }}" unselectable="on" role="presentation"></span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      p,
      .icon {
        cursor: pointer;
      }

      .ag-sort-indicator-container {
        cursor: pointer;
      }

      .hidden {
        visibility: hidden;
      }
    `,
  ],
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  public params!: IHeaderParams & ICustomHeaderParams;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;
  @ViewChild('sortIconButton', { read: ElementRef }) public sortIconButton!: ElementRef;

  public iconType = signal<string>('asc');
  public isSorted = signal<boolean>(false);

  private sortChangedListener = this.onSortChanged.bind(this);

  agInit(params: IHeaderParams & ICustomHeaderParams): void {
    this.params = params;
    this.updateSortIcon();

    this.params.column.addEventListener('sortChanged', this.sortChangedListener);
  }

  private onSortChanged() {
    this.updateSortIcon();
  }

  onMenuClicked() {
    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  onSortIconClicked() {
    if (this.iconType() === 'desc') {
      this.iconType.set('asc');
      this.params.setSort('asc');
    } else {
      this.iconType.set('desc');
      this.params.setSort('desc');
    }
  }

  updateSortIcon() {
    const sort = this.params.column.getSort();
    this.isSorted.set(!!sort);
  }

  refresh() {
    return false;
  }
}
