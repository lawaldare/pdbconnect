import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pdbc-pdbe-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-dropdown.component.html',
  styleUrls: ['./pdbe-dropdown.component.scss'],
})
export class PdbeDropdownComponent {
  @Input() dropdownText = '';
  @Input() options: { name: string; url: string; downloadable: boolean }[] = [];
  @Input() optionsWidth = '197px';
  @Input() optionsMaxHeight = '392px';

  @Input() elementId = 'default';
  expandedStatus = false;
  @Output() dropdownClicked: EventEmitter<string> = new EventEmitter();

  closeDropdown() {
    this.expandedStatus = false;
  }

  clicked() {
    this.dropdownClicked.emit(this.elementId);
  }
}
