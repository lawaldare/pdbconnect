import { Directive, ElementRef, HostListener, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { RichTooltipComponent } from './rich-tooltip.component';

@Directive({
  selector: '[pdbcRichTooltip]',
  standalone: true,
})
export class RichTooltipDirective implements OnDestroy {
  @Input('pdbcRichTooltip') tooltipHtml = '';

  private overlayRef: OverlayRef | null = null;
  private hideTimeoutId: any = null;
  private tooltipElement: HTMLElement | null = null;

  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('mouseenter')
  show() {
    if (this.overlayRef) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([{ originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -3 }]);

    this.overlayRef = this.overlay.create({ positionStrategy });
    const tooltipPortal = new ComponentPortal(RichTooltipComponent, this.viewContainerRef);
    const tooltipRef = this.overlayRef.attach(tooltipPortal);
    tooltipRef.instance.content = this.tooltipHtml;

    this.tooltipElement = this.overlayRef.overlayElement;

    this.tooltipElement.addEventListener('mouseenter', this.clearHideTimeout);
    this.tooltipElement.addEventListener('mouseleave', this.delayedHide);
  }

  @HostListener('mouseleave')
  delayedHide = () => {
    this.hideTimeoutId = setTimeout(() => this.hide(), 200); // 300ms delay
  };

  clearHideTimeout = () => {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  };

  hide() {
    if (this.overlayRef) {
      this.tooltipElement?.removeEventListener('mouseenter', this.clearHideTimeout);
      this.tooltipElement?.removeEventListener('mouseleave', this.delayedHide);

      this.overlayRef.dispose();
      this.overlayRef = null;
      this.tooltipElement = null;
    }
  }

  ngOnDestroy() {
    this.hide();
  }
}
