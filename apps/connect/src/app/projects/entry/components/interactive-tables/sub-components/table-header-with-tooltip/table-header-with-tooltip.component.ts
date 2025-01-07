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
  template: `<span class="entry-pgs-tooltip-hover" matTooltipClass="entry-pgs-tooltip" [matTooltip]="tooltipContent" matTooltipPosition="below">
    {{ headerText }}
  </span>`,
  styles: [``],
})
export class TableHeaderWithTooltipComponent implements IHeaderAngularComp {
  // params come from headerComponentParams in column-definition-objects
  private params!: CustomHeaderParams; // Use the custom interface
  public headerText = '';
  public tooltipContent = '';

  agInit(params: CustomHeaderParams): void {
    this.params = params;
    this.headerText = params.customHeader;
    this.tooltipContent = params.customTooltip;
  }

  refresh(): boolean {
    return false;
  }
}
