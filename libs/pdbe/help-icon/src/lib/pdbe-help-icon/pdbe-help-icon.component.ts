import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpIconService } from './pdbe-help-icon.service';

@Component({
  selector: 'lib-pdbe-help-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pdbe-help-icon.component.html',
  styleUrl: './pdbe-help-icon.component.scss',
})
export class PdbeHelpIconComponent implements OnInit {
  @Input() tooltipTitle?: string;
  @Input() tooltipContent = 'Lorem ipsum';
  @Input() marginLeft = '2px';
  @Input() marginTop = '0px';
  @Input() autoCloseOtherTooltips = true;

  elementId = '';
  elementRef: ElementRef;
  clickedStatus = false;
  expandedStatus = false;

  @Output() tooltipClicked: EventEmitter<{ id: string; open: boolean }> = new EventEmitter();

  constructor(elementRef: ElementRef, private helpIconService: HelpIconService) {
    this.elementRef = elementRef;
    // component listens for changes in currently clicked element id and closes itself
    // if id of new element is clicked
    this.helpIconService.getCurrentHelpIconValue().subscribe((newValue) => {
      if (this.autoCloseOtherTooltips && this.elementId !== newValue) {
        this.closeTooltipClick();
      }
    });
  }

  ngOnInit(): void {
    // element id is registered if on click it should close others
    if (this.autoCloseOtherTooltips) {
      this.elementId = this.helpIconService.registerComponent();
    }
  }

  ngOnDestroy(): void {
    // element id is registered, remove it from service
    if (this.autoCloseOtherTooltips) {
      this.helpIconService.unregisterComponent(this.elementId);
    }
  }

  mouseenterTooltip() {
    // hover events only triggered if element not clicked yet
    if (this.clickedStatus) return;
    this.expandedStatus = true;
  }

  mouseoutTooltip() {
    // hover events only triggered if element not clicked yet
    if (this.clickedStatus) return;
    this.expandedStatus = false;
  }

  clickTooltip() {
    if (this.clickedStatus === false) {
      this.openTooltipClick();
    } else {
      this.closeTooltipClick();
    }
  }

  openTooltipClick() {
    this.tooltipClicked.emit({ id: this.elementId, open: true });
    this.clickedStatus = true;
    this.expandedStatus = true;
    if (this.autoCloseOtherTooltips) {
      // when clicked element sends it's id to help icon siblings to close
      this.helpIconService.setCurrentHelpIconValue(this.elementId);
    }
  }

  closeTooltipClick() {
    this.tooltipClicked.emit({ id: this.elementId, open: false });
    this.clickedStatus = false;
    this.expandedStatus = false;
  }

  checkTooltipPositionWidth() {
    const elem = this.elementRef.nativeElement;
    const elemLeft = elem.getBoundingClientRect().left;
    // taken from jquery
    const docWidth = Math.max(
      document.documentElement['clientWidth'],
      document.body['scrollWidth'],
      document.documentElement['scrollWidth'],
      document.body['offsetWidth'],
      document.documentElement['offsetWidth']
    );
    // if element position after 50% pos of page, true (right)
    return elemLeft > docWidth / 2;
  }
}
