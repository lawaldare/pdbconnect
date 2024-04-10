import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-pdbe-link-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-link-button.component.html',
  styleUrls: ['./pdbe-link-button.component.scss'],
})
export class PdbeLinkButtonComponent {
  @Input() label = '';
  @Input() url?: string;
  @Input() fontStyle = '';
  @Input() toEmitOnClick?: string;
  @Input() fontColor = '';
  @Input() hoverColor = '';
  @Input() visitedColor = '';
  @Input() focusBorderColor = '';
  @Input() activeFontWeight = 400;
  @Input() mobileIconName = '';
  @Input() whiteSpace = 'nowrap';
  @Output() linkButtonEvent = new EventEmitter<string>();

  // Communicate with parent using:
  // https://angular.io/guide/inputs-outputs#sending-data-to-a-parent-component
  clickedLinkButton() {
    // console.log("clicked!")
    this.linkButtonEvent.emit(this.toEmitOnClick!);
  }
}
