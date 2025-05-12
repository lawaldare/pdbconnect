import { Component, Input } from '@angular/core';

@Component({
  selector: 'pdbc-rich-tooltip',
  standalone: true,
  template: `
    <div class="rich-tooltip-content">
      @if (content) {
        <div [innerHTML]="content"></div>
      }
    </div>
  `,
  styles: [
    `
      .rich-tooltip-content {
        background-color: #fff;
        color: #1a1c1a;
        font-size: 16px;
        line-height: 27px;
        padding: 10px;
        box-shadow:
          0 5px 5px -3px rgb(0 0 0 / 20%),
          0 8px 10px 1px rgb(0 0 0 / 14%),
          0 3px 14px 2px rgb(0 0 0 / 12%);
        border-radius: 4px;
        max-width: 400px;
      }
    `,
  ],
})
export class RichTooltipComponent {
  @Input({ required: true }) content = '';
}
