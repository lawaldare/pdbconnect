import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular';

export interface CustomHeaderParams extends IHeaderParams {
  customHeader: string;
  customTooltip: string;
}

/**
 * Subcomponent when table headers require subtitles
 */
@Component({
  selector: 'pdbc-table-header-with-tooltip',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <div class="info-row-header">
      <span>{{ headerText }}</span>
      <img src="{{ helpLogoSrc }}" class="icon" alt="help icon" matTooltipClass="entry-pgs-tooltip" [matTooltip]="tooltipContent" matTooltipPosition="below" />
    </div>
  `,
  styles: [
    `
      .info-row-header {
        display: flex;
        align-items: center;

        img {
          height: 15px;
          cursor: pointer;
          margin-left: 2px;
        }
      }
    `,
  ],
})
export class TableHeaderWithTooltipComponent implements IHeaderAngularComp {
  // params come from headerComponentParams in column-definition-objects
  private params!: CustomHeaderParams; // Use the custom interface
  public headerText = '';
  public tooltipContent = '';
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  agInit(params: CustomHeaderParams): void {
    this.params = params;
    this.headerText = params.customHeader;
    this.tooltipContent = params.customTooltip;
  }

  refresh(): boolean {
    return false;
  }
}
