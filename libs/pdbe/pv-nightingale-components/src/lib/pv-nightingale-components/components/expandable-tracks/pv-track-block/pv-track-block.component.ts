import { Component, Input, ElementRef, Renderer2, signal, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';
import '@pdbe-nightingale-track-canvas';
import '@nightingale-elements/nightingale-scrollbox';
import { NightingaleScrollbox, NightingaleScrollboxItem } from '@nightingale-elements/nightingale-scrollbox';
import { PvTooltipService } from '../../../services/pv-tooltip.service';
import { interval, map, filter, Subscription, take } from 'rxjs';
import { PvFixedHighlightService } from '../../../services/pv-fixed-highlight.service';

/**
 * Observation: styles need to be global for this component because of Nightingale constraints
 * (unless we use ng-deep somehow)
 */
@Component({
  selector: 'lib-pv-track-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pv-track-block.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackBlockComponent implements OnDestroy {
  @Input() trackName!: string;
  @Input() subtracks: NightingaleFeature[] = [];
  @Input() tooltips: { [key: string]: string } = {};
  @Input() sequenceLength?: number;
  @Input() isCustomData = false;

  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private tooltipService = inject(PvTooltipService);
  private highlightService = inject(PvFixedHighlightService);
  public readonly selectionHighlight = this.highlightService.selectionHighlight;

  private subtrackRenderSub?: Subscription;

  readonly isExpanded = signal(false);
  readonly scrollboxTopOffset = signal('0px');

  /**
   * Toggle expansion state of the track block.
   * During expansion rendering is done via raw HTML set as text in function generateSubTrackCanvasString
   * This is required due to https://www.npmjs.com/package/@nightingale-elements/nightingale-scrollbox implementation
   *
   * After expansion checkSubtracksRenderedAndBindData is called with a rxjs subscription to await until tracks are rendered and then:
   * 1. Bind correct data to each track (Nightingale constraint see: https://www.npmjs.com/package/@nightingale-elements/nightingale-scrollbox implementation)
   * 2. Create hoverable track names using createTooltipForSubTrackCanvas and tooltipService
   */
  toggleExpanded(): void {
    const next = !this.isExpanded();
    this.isExpanded.set(next);

    if (next && this.subtracks?.length > 0) {
      this.checkSubtracksRenderedAndBindData();
    }
  }

  /**
   * Wait until all subtrack scrollbox-items are rendered, then bind Nightingale data and setup tooltips.
   */
  checkSubtracksRenderedAndBindData(): void {
    if (this.subtrackRenderSub) {
      this.subtrackRenderSub.unsubscribe();
    }

    const expectedCount = this.subtracks.length;

    this.subtrackRenderSub = interval(50)
      .pipe(
        map(() => Array.from(document.querySelectorAll(`nightingale-scrollbox-item[name="${this.trackName}"]`))),
        filter((elements) => elements.length === expectedCount),
        take(1)
      )
      .subscribe(async () => {
        await customElements.whenDefined('nightingale-track-canvas');

        for (let j = 0; j < this.subtracks.length; j++) {
          const el = document.getElementById(`${this.trackName}-subtrack-${j}`) as NightingaleScrollboxItem<NightingaleFeature[]>;
          el.data = [this.subtracks[j]];
        }

        const scrollboxId = `${this.trackName}scrollbox`;
        const scrollbox = document.getElementById(scrollboxId) as NightingaleScrollbox<NightingaleFeature[]>;
        scrollbox.onEnter(async (item) => {
          if (item.data) {
            for (const track of Array.from(item.getElementsByTagName('nightingale-track-canvas'))) {
              (track as any).data = item.data;
            }
          }
        });

        const elements = this.elementRef.nativeElement.querySelectorAll('.dynamic-track');
        elements.forEach((el: HTMLElement) => {
          const name = el.getAttribute('name');
          if (name && name.includes(this.trackName)) {
            this.createTooltipForSubTrackCanvas(this.trackName, name);
          }
        });

        this.subtrackRenderSub?.unsubscribe();
        this.subtrackRenderSub = undefined;

        this.highlightService.triggerDynamicFixedHighlight();
      });
  }

  /**
   * Generate raw HTML string for a subtrack block, to be injected using [innerHTML]
   * (Nightingale constraint see: https://www.npmjs.com/package/@nightingale-elements/nightingale-scrollbox implementation)
   */
  generateSubTrackCanvasString(trackName: string, index: number, subtrack: NightingaleFeature): string {
    return `
        <div class="pv-track-row non-header-track">
          <div class="pv-track-label-col hoverable subtrack dynamic-track" name="${trackName}-${subtrack.accession}"></div>
          <nightingale-track-canvas
            id="cv-${trackName}-subtrack-${index}"
            class="with-fixed-highlight"
            length="${this.sequenceLength}"
            width="581"
            height="40"
            margin-left="0"
            margin-right="10"
            layout="non-overlapping"
            highlight-color="#FFEB3B66"
            highlight-event="onmouseover"
            use-ctrl-to-zoom
          ></nightingale-track-canvas>
        </div>
      `;
  }

  /**
   * Returns inline SVG markup for a loading spinner.
   * (Nightingale constraint see: https://www.npmjs.com/package/@nightingale-elements/nightingale-scrollbox implementation)
   */
  getLoadingSpinner(): string {
    return `
          <svg class="spinner" viewBox="0 0 200 200">
            <style>
              .spinner-path {
                stroke-dasharray: 339 226;
                stroke-dashoffset: 0;
                animation: spinner linear infinite 2s;
              }
              @keyframes spinner {
                0% { stroke-dashoffset: 565; }
                100% { stroke-dashoffset: 0; }
              }
            </style>
            <path
              class="spinner-path"
              fill="transparent"
              stroke="#72B260"
              stroke-width="20"
              d="M 100 10 A 90 90 0 1 1 100 190 A 90 90 0 1 1 100 10"
            ></path>
          </svg>
        `;
  }

  /**
   * Creates a tooltip icon (🛈) with the corresponding tooltip message
   * and appends it next to the track label using Angular Renderer2
   */
  createTooltipForSubTrackCanvas(trackName: string, nameAttribute: string) {
    const p = this.renderer.createElement('p');
    const span = this.renderer.createElement('span');
    this.renderer.addClass(span, 'pdbe-pv-colname-tooltip');

    const text = this.renderer.createText(nameAttribute.split(`${trackName}-`)[1] + ' ');
    this.renderer.appendChild(span, text);

    const img = this.renderer.createElement('img');
    this.renderer.setAttribute(img, 'src', '/assets/images/help_outline_24px.svg');
    this.renderer.addClass(img, 'icon');

    const tooltipContent = this.isCustomData ? `Custom data track: ${nameAttribute.split(`${trackName}-`)[1]}` : this.tooltips[nameAttribute];

    this.renderer.listen(img, 'mouseenter', () => {
      this.tooltipService.showManualTooltip(img, tooltipContent, '');
    });

    this.renderer.appendChild(span, img);
    this.renderer.appendChild(p, span);

    const container = this.elementRef.nativeElement.querySelector(`[name="${nameAttribute}"]`);
    this.renderer.appendChild(container, p);
  }

  /**
   * Lifecycle hook to clean up observable subscriptions when component is destroyed.
   */
  ngOnDestroy(): void {
    this.subtrackRenderSub?.unsubscribe();
  }
}
