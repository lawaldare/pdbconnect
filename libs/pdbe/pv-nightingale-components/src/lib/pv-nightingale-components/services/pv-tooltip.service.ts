import { Injectable, Renderer2 } from '@angular/core';
import { PvFixedHighlightService } from './pv-fixed-highlight.service';

@Injectable({ providedIn: 'root' })
export class PvTooltipService {
  public tooltipElement: HTMLDivElement | null = null;
  private pinnedTooltipElement: HTMLDivElement | null = null;
  private pinnedTooltipInitialTop = 0;
  private pinnedTooltipInitialLeft = 0;
  private tooltipVisible = false;
  private tooltipFadeOutTimeout: number | null = null;
  private pinnedTooltipFadeOutTimeout: number | null = null;
  private lastScrollTop = 0;

  private relativeElement: HTMLElement | null = null;
  private container: HTMLElement | null = null;
  private scrollContainer: HTMLElement | null = null;
  private renderer!: Renderer2;

  private highlightService?: PvFixedHighlightService;

  private messageToHighlight: { [key: string]: string } = {};

  /**
   * Function should be called when this service is injected on the Angular component containing
   * Nightingale functionality. Used to set the Renderer2 instance required for DOM operations.
   * @param renderer Renderer2 from Angular
   */
  setRenderer(renderer: Renderer2) {
    this.renderer = renderer;
  }

  /**
   * Injects the fixed highlight service to allow tooltip selections to trigger highlights
   * @param highlightService PvFixedHighlightService
   */
  setHighlightService(highlightService: PvFixedHighlightService) {
    this.highlightService = highlightService;
  }

  /**
   * Sets the parent container element with position: relative
   * @param container HTMLElement to serve as the tooltip container
   */
  setRelativeElement(relativeElement: HTMLElement) {
    this.relativeElement = relativeElement;
  }
  /**
   * Sets the parent container element where tooltips will be appended
   * @param container HTMLElement to serve as the tooltip container
   */
  setContainer(container: HTMLElement) {
    this.container = container;
  }

  /**
   * Sets the scrollable container, used for positioning tooltips on scroll
   * @param container HTMLElement to track scrolling for tooltip adjustment
   */
  setScrollContainer(container: HTMLElement) {
    this.scrollContainer = container;
  }

  /**
   * Displays a temporary manual tooltip anchored to a target element.
   * Will automatically hide when mouse leaves the target element.
   * Implementation is tied to Nightingale hover and click event handling (Hover has highlight data, Click has not)
   *
   * @param target The DOM element triggering the tooltip
   * @param message Tooltip content as HTML string
   * @param highlight Highlight string (e.g., "12:15") to be mapped to Tooltip content (message) so pinned
   * tooltips (see: showPinnedTooltip) are possible
   * @param coords Optional absolute screen coordinates for custom tooltip position
   */
  showManualTooltip(target: HTMLElement, message: string, highlight: string, coords: { x: number; y: number }) {
    if (!this.container) return;
    if (!this.tooltipElement) {
      this.tooltipElement = this.renderer.createElement('div');
      this.tooltipElement!.classList.add('manual-tooltip');
      this.container!.appendChild(this.tooltipElement!);
    }

    if (this.tooltipVisible && this.tooltipElement!.innerHTML === message) return;

    if (this.tooltipFadeOutTimeout) {
      clearTimeout(this.tooltipFadeOutTimeout);
      this.tooltipFadeOutTimeout = null;
    }

    this.tooltipElement!.innerHTML = message;
    this.tooltipElement!.style.opacity = '0';

    const { coordX, coordY } = this.getTooltipCoords(coords);

    Object.assign(this.tooltipElement!.style, {
      position: 'absolute',
      top: `${coordY}px`,
      left: `${coordX}px`,
      zIndex: '2',
      pointerEvents: 'none',
      transition: 'opacity 0.15s ease-in-out',
    });

    requestAnimationFrame(() => {
      if (this.tooltipElement) this.tooltipElement.style.opacity = '1';
      this.tooltipVisible = true;
    });

    target.addEventListener('mouseleave', () => this.hideManualTooltip());

    this.messageToHighlight[message] = highlight;
  }

  /**
   * Hides the temporary hover-based tooltip, triggering a fade-out animation.
   */
  hideManualTooltip() {
    if (!this.container) return;
    if (!this.tooltipElement || !this.tooltipVisible) return;

    this.tooltipElement.style.opacity = '0';
    this.tooltipVisible = false;

    this.tooltipFadeOutTimeout = window.setTimeout(() => {
      this.tooltipElement?.remove();
      this.tooltipElement = null;
    }, 150);
  }

  /**
   * Displays a persistent pinned tooltip, typically triggered on click.
   * Includes a close button and will trigger highlight rendering based on content.
   * Implementation is tied to Nightingale hover and click event handling (Hover has highlight data, Click has not)
   * Requires that the Angular Nightingale containing component has sticky and scrollable areas
   *
   * @param target The DOM element to position the tooltip near
   * @param message The tooltip content as HTML string. Allows parsing highlight data from messageToHighlight dictionary
   * set in showManualTooltip
   * @param coords Optional custom coordinates for positioning
   */
  showPinnedTooltip(target: HTMLElement, message: string, coords: { x: number; y: number }) {
    if (!this.container) return;
    this.pinnedTooltipElement?.remove();
    if (this.pinnedTooltipFadeOutTimeout) {
      clearTimeout(this.pinnedTooltipFadeOutTimeout);
      this.pinnedTooltipFadeOutTimeout = null;
    }

    const tooltip = this.renderer.createElement('div');
    tooltip.classList.add('manual-tooltip', 'pinned-tooltip');
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <button class="close-btn">✖</button>
      </div>
      ${message}
    `;

    const { coordX, coordY } = this.getTooltipCoords(coords);

    this.pinnedTooltipInitialTop = coordY;
    this.pinnedTooltipInitialLeft = coordX;
    this.lastScrollTop = this.scrollContainer!.scrollTop;

    Object.assign(tooltip.style, {
      position: 'absolute',
      top: `${coordY}px`,
      left: `${coordX}px`,
      zIndex: '1',
    });

    this.container!.appendChild(tooltip);
    this.pinnedTooltipElement = tooltip;

    const closeBtn = tooltip.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hidePinnedTooltip());
    }

    if (this.highlightService) {
      const highlight = this.messageToHighlight[message];
      this.highlightService.setFixedTooltipSelection(highlight);
      this.highlightService.createSelectionHighlight();
      this.highlightService.triggerDynamicFixedHighlight();
    }
  }

  /**
   * Refactored tooltip positioning function for both pinned and manual tooltip
   * taking into account the 'left' and 'top' positioning of the relative element
   * where the absolute tooltips are to be shown
   * @param coords mouse x and y coordinates for tooltip position to be calculated
   * @returns {coordX: number, coordY: number} to applied to tooltip
   */
  private getTooltipCoords(coords: { x: number; y: number }) {
    const hostRect = this.relativeElement!.getBoundingClientRect();

    let coordX = coords.x + 2 - hostRect.left;
    const coordY = coords.y + 2 - hostRect.top + 6;

    const tooltipWidth = this.tooltipElement!.offsetWidth;
    const containerWidth = this.scrollContainer!.clientWidth;

    if (coordX + tooltipWidth > containerWidth) {
      coordX = coordX - tooltipWidth - 10;
    }

    return { coordX, coordY };
  }

  /**
   * Updates the pinned tooltip's vertical position to follow the scroll position
   * Requires that the Angular Nightingale containing component has sticky and scrollable areas
   */
  movePinnedTooltip() {
    if (!this.container) return;
    if (!this.pinnedTooltipElement) return;

    const scrollTop = this.scrollContainer!.scrollTop;
    const scrollDelta = scrollTop - this.lastScrollTop;
    const newTop = this.pinnedTooltipInitialTop - scrollDelta;

    Object.assign(this.pinnedTooltipElement.style, {
      top: `${newTop}px`,
      left: `${this.pinnedTooltipInitialLeft}px`,
    });
  }

  /**
   * Removes the pinned tooltip with a fade-out effect and resets selection highlighting
   */
  hidePinnedTooltip() {
    if (!this.container) return;
    if (this.pinnedTooltipElement) {
      this.pinnedTooltipFadeOutTimeout = window.setTimeout(() => {
        this.pinnedTooltipElement!.remove();
        this.pinnedTooltipElement = null;

        if (this.highlightService) {
          this.highlightService.setFixedTooltipSelection('');
          this.highlightService.createSelectionHighlight();
          this.highlightService.triggerDynamicFixedHighlight();
        }
      }, 150);
    }
  }
}
