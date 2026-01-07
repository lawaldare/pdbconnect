/* eslint-disable @angular-eslint/directive-selector */
import { Directive, OnDestroy, Input, HostListener, ElementRef } from '@angular/core';
import { TooltipService } from './tooltip.component';

@Directive({
  selector: '[my-tooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input() tooltipTitle = '';
  @Input() tooltipImage = '';
  @Input() pdbeKbId = '';
  @Input() hideLoader = false;
  @Input() isCarbImage = false;
  private id!: string;

  constructor(
    private tooltipService: TooltipService,
    private element: ElementRef
  ) {}

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(e: any): void {
    this.id = Math.random().toString();

    this.tooltipService.components.push({
      id: this.id,
      ref: this.element,
      title: this.tooltipTitle,
      image: this.tooltipImage,
      posDetails: e,
      pdbeKbId: this.pdbeKbId,
      hideLoader: this.hideLoader,
      isCarbImage: this.isCarbImage,
    });
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.destroy();
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  destroy(): void {
    const idx = this.tooltipService.components.findIndex((t) => {
      return t.id === this.id;
    });

    this.tooltipService.components.splice(idx, 1);
  }
}
