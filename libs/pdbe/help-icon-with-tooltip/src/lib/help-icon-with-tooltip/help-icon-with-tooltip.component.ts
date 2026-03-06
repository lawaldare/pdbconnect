import { Component, input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPipe, MaterialModule } from '@pdbc/core';

@Component({
  selector: 'lib-help-icon-with-tooltip',
  imports: [CommonModule, MaterialModule, AssetPipe],
  templateUrl: './help-icon-with-tooltip.component.html',
  styleUrl: './help-icon-with-tooltip.component.scss',
})
export class HelpIconWithTooltipComponent implements OnChanges {
  public tooltipText = input.required<string>();
  public iconPath = input<string>();
  public path = '/assets/images/help_outline_24px.svg';

  ngOnChanges(): void {
    if (this.iconPath()) {
      this.path = this.iconPath() ?? this.path;
    }
  }
}
