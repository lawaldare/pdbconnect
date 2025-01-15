import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
      @if(params.showHelpIcon) {
      <img src="{{ helpLogoSrc }}" class="icon" matTooltipClass="complex-name-tooltip" [matTooltip]="params.tooltipText" matTooltipPosition="below" alt="help icon" />
      } @if(params.enableFilterButton){
      <div #menuButton class="customHeaderMenuButton" (click)="onMenuClicked()">
        <i class="icon icon-common icon-search"></i>
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

  agInit(params: IHeaderParams & ICustomHeaderParams): void {
    this.params = params;
  }

  onMenuClicked() {
    this.params.showColumnMenu(this.menuButton.nativeElement);
  }

  refresh(params: IHeaderParams) {
    return false;
  }
}
