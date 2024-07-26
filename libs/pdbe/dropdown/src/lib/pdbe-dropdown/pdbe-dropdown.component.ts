import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
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
  @Input() options: { name: string; url: string; downloadable: boolean }[] = [];
  @Input() elementId = 'default';

  private autoCloseOtherDropdowns = true;
  public expandedStatus = signal(false);

  @Output() dropdownClicked: EventEmitter<string> = new EventEmitter();

  constructor(private dropdownService: DropdownService) {
    // component listens for changes in currently clicked element id and closes itself
    // if id of new element is clicked
    this.dropdownService.getCurrentDropdownValue().subscribe((newValue) => {
      if (this.autoCloseOtherDropdowns && this.elementId !== newValue) {
        this.expandedStatus.set(false);
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

  public toggleDropdown() {
    this.expandedStatus.update((value) => !value);
    if (this.autoCloseOtherDropdowns) {
      this.dropdownService.setCurrentDropdownValue(this.elementId);
    }
  }
}
