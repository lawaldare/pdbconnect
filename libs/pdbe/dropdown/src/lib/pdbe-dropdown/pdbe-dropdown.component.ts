import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownService } from './pdbe-dropdown.service';

@Component({
  selector: 'pdbc-pdbe-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-dropdown.component.html',
  styleUrls: ['./pdbe-dropdown.component.scss'],
})
export class PdbeDropdownComponent implements OnInit, OnDestroy {
  @Input() dropdownText = '';
  @Input() dropdownWidth = '154px';
  @Input() options: { name: string; url: string; downloadable: boolean }[] = [];
  @Input() optionsWidth = '197px';
  @Input() optionsMaxHeight = '392px';
  @Input() autoCloseOtherDropdowns = true;

  @Input() elementId = 'default';
  expandedStatus = false;
  @Output() dropdownClicked: EventEmitter<string> = new EventEmitter();

  constructor(private dropdownService: DropdownService) {
    // component listens for changes in currently clicked element id and closes itself
    // if id of new element is clicked
    this.dropdownService.getCurrentDropdownValue().subscribe((newValue) => {
      if (this.autoCloseOtherDropdowns && this.elementId !== newValue) {
        this.closeDropdown();
      }
    });
  }

  ngOnInit(): void {
    // element id is registered if on click it should close others
    if (this.autoCloseOtherDropdowns) {
      this.elementId = this.dropdownService.registerComponent();
    }
  }

  ngOnDestroy(): void {
    // element id is registered, remove it from service
    if (this.autoCloseOtherDropdowns) {
      this.dropdownService.unregisterComponent(this.elementId);
    }
  }

  closeDropdown() {
    this.expandedStatus = false;
  }

  clicked() {
    this.dropdownClicked.emit(this.elementId);
    if (this.autoCloseOtherDropdowns) {
      // when clicked element sends it's id to help icon siblings to close
      this.dropdownService.setCurrentDropdownValue(this.elementId);
    }
  }
}
