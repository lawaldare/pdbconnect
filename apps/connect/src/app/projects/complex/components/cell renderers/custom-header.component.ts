import { NgClass } from '@angular/common';
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
      <p class="customHeaderLabel">{{ params.displayName }}</p>
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
        <div #menuButton class="customHeaderMenuButton" (click)="onMenuClicked()">
          <!-- <i class="icon icon-common icon-search"></i> -->
          <span class="ag-icon ag-icon-filter" unselectable="on" role="presentation"></span>
        </div>
      }
      @if (params.enableSorting) {
        <div #sortIconButton class="customHeaderMenuButton" (click)="onSortIconClicked()">
          <!-- <i class="icon icon-common icon-sort-amount-{{ sortingState() }}"></i> -->
          <span class="ag-icon ag-icon-{{ sortingState() }}" unselectable="on" role="presentation"></span>
        </div>
      }
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
        margin-right: 5px;
      }
    `,
  ],
})
export class CustomHeaderComponent implements IHeaderAngularComp {
  public params!: IHeaderParams & ICustomHeaderParams;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  @ViewChild('menuButton', { read: ElementRef }) public menuButton!: ElementRef;
  @ViewChild('sortIconButton', { read: ElementRef }) public sortIconButton!: ElementRef;

  public sortingState = signal<string>('asc');

  agInit(params: IHeaderParams & ICustomHeaderParams): void {
    this.params = params;
  }

  onMenuClicked() {
    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  onSortIconClicked() {
    if (this.sortingState() === 'desc') {
      this.sortingState.set('asc');
      this.params.setSort('asc');
    } else {
      this.sortingState.set('desc');
      this.params.setSort('desc');
    }
  }

  refresh(params: IHeaderParams) {
    return false;
  }
}
