import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'lib-help-icon-with-tooltip',
  imports: [CommonModule, MaterialModule],
  templateUrl: './help-icon-with-tooltip.component.html',
  styleUrl: './help-icon-with-tooltip.component.scss',
})
export class HelpIconWithTooltipComponent {
  public tooltipText = input.required<string>();
}
