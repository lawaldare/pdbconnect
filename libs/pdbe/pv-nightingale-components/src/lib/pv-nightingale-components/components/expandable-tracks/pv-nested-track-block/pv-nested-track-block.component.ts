import { Component, Input, ElementRef, Renderer2, signal, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';

// Prevent tree-shaking of Nightingale web components
import * as NightingaleTrackCanvas from '@pdbe-nightingale-track-canvas';
import * as NightingaleScrollBox from '@nightingale-elements/nightingale-scrollbox';

// Dummy references to prevent tree-shaking
const _nestedTrackBlockRefs = [NightingaleTrackCanvas, NightingaleScrollBox];

import { PvTooltipService } from '../../../services/pv-tooltip.service';
import { Subscription } from 'rxjs';
import { PvFixedHighlightService } from '../../../services/pv-fixed-highlight.service';
import { TrackBlockComponent } from '../pv-track-block/pv-track-block.component';

/**
 * Observation: styles need to be global for this component because of Nightingale constraints
 * (unless we use ng-deep somehow)
 */
@Component({
  selector: 'lib-pv-nested-track-block',
  standalone: true,
  imports: [CommonModule, TrackBlockComponent],
  templateUrl: './pv-nested-track-block.component.html',
  styleUrl: './pv-nested-track-block.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NestedTrackBlockComponent implements OnDestroy {
  @Input() trackName!: string;
  // @Input() subtracks: NightingaleFeature[] = [];

  @Input() subtrackNames!: string[];
  private _subtracks: NightingaleFeature[][] = [];

  @Input()
  set subtracks(value: NightingaleFeature[][]) {
    this._subtracks = value ?? [];
    this.mutableSubtracks.set(this._subtracks.map((v) => [...v]));
    this.allMutableSubtracks.set(this._subtracks.flat().map((v) => ({ ...v })));
  }

  get subtracks(): NightingaleFeature[][] {
    return this._subtracks;
  }

  public mutableSubtracks = signal<NightingaleFeature[][]>([]);
  public allMutableSubtracks = signal<NightingaleFeature[]>([]);

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
  readonly isSubExpanded = signal(false);
  readonly scrollboxTopOffset = signal('0px');

  @ViewChildren(TrackBlockComponent)
  trackBlockComponents!: QueryList<TrackBlockComponent>;

  private latestMouseX = 0;
  private latestMouseY = 0;
  // z-index: 3;
  // background: white;
  constructor() {
    document.addEventListener('mousemove', (event: MouseEvent) => {
      this.latestMouseX = event.clientX;
      this.latestMouseY = event.clientY;
    });
  }

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
      // Wait until view updated
      setTimeout(() => {
        this.trackBlockComponents.forEach((block) => {
          block.checkSubtracksRenderedAndBindData();
        });
      });
    }
  }

  /**
   * Wait until all subtrack scrollbox-items are rendered, then bind Nightingale data and setup tooltips.
  //  */
  // checkSubtracksRenderedAndBindData(): void {
  //   if (this.subtrackRenderSub) {
  //     this.subtrackRenderSub.unsubscribe();
  //   }

  //   const expectedCount = this.subtracks.length;

  //   this.subtrackRenderSub = interval(50)
  //     .pipe(
  //       map(() => Array.from(document.querySelectorAll(`nightingale-scrollbox-item[name="${this.trackName}"]`))),
  //       filter((elements) => elements.length === expectedCount),
  //       take(1)
  //     )
  //     .subscribe(async () => {
  //       await customElements.whenDefined('nightingale-track-canvas');

  //       for (let j = 0; j < this.subtracks.length; j++) {
  //         const el = document.getElementById(`${this.trackName}-subtrack-${j}`) as NightingaleScrollboxItem<NightingaleFeature[]>;
  //         el.data = [this.subtracks[j]];
  //       }

  //       const scrollboxId = `${this.trackName}scrollbox`;
  //       const scrollbox = document.getElementById(scrollboxId) as NightingaleScrollbox<NightingaleFeature[]>;
  //       scrollbox.onEnter(async (item) => {
  //         if (item.data) {
  //           for (const track of Array.from(item.getElementsByTagName('nightingale-track-canvas'))) {
  //             (track as any).data = item.data;
  //           }
  //         }
  //       });

  //       const elements = this.elementRef.nativeElement.querySelectorAll('.dynamic-track');
  //       elements.forEach((el: HTMLElement) => {
  //         const name = el.getAttribute('name');
  //         if (name && name.includes(this.trackName)) {
  //           this.createTooltipForSubTrackCanvas(this.trackName, name);
  //         }
  //       });

  //       this.subtrackRenderSub?.unsubscribe();
  //       this.subtrackRenderSub = undefined;

  //       this.highlightService.triggerDynamicFixedHighlight();
  //     });
  // }

  // /**
  //  * Creates a tooltip icon (🛈) with the corresponding tooltip message
  //  * and appends it next to the track label using Angular Renderer2
  //  */
  // createTooltipForSubTrackCanvas(trackName: string, nameAttribute: string) {
  //   const p = this.renderer.createElement('p');
  //   const span = this.renderer.createElement('span');
  //   this.renderer.addClass(span, 'pdbe-pv-colname-tooltip');

  //   const text = this.renderer.createText(nameAttribute.split(`${trackName}-`)[1] + ' ');
  //   this.renderer.appendChild(span, text);

  //   const img = this.renderer.createElement('img');
  //   this.renderer.setAttribute(img, 'src', '/assets/images/help_outline_24px.svg');
  //   this.renderer.addClass(img, 'icon');

  //   const tooltipId = nameAttribute;
  //   const tooltipContent = this.isCustomData ? `Custom data track: ${nameAttribute.split(`${trackName}-`)[1]}` : this.tooltips[tooltipId];

  //   this.renderer.listen(img, 'mouseenter', () => {
  //     this.tooltipService.showManualTooltip(img, tooltipContent, '', { x: this.latestMouseX, y: this.latestMouseY });
  //   });

  //   this.renderer.appendChild(span, img);
  //   this.renderer.appendChild(p, span);

  //   const container = this.elementRef.nativeElement.querySelector(`[name="${nameAttribute}"]`);
  //   this.renderer.appendChild(container, p);
  // }

  /**
   * Lifecycle hook to clean up observable subscriptions when component is destroyed.
   */
  ngOnDestroy(): void {
    this.subtrackRenderSub?.unsubscribe();
  }
}
