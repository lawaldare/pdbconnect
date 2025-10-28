import { type Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';
import { NewProtvistaFixedHighlights } from '../../new-protvista-fixed-highlights';
import { ProtvistaHelpTooltipsBinding } from '../after-render-binders/help-tooltip-icons.binding';
import { generateSubTrackCanvasString } from '../../rendering/templates-rendering/subtrack-in-scrollbox-html';
import { getLoadingDataHTML } from '../../rendering/templates-rendering/loading-data-track-html';
import { scaleLinear } from 'd3';
import { NewProtvistaTooltip } from '../../new-protvista-tooltip';
import { ProtvistaDocMouseTracking } from '../after-render-binders/doc-mouse-track.binding';
import { ColourIn3DButtonBinding } from '../after-render-binders/colour-in-3d-btn.binding';
import { BehaviorSubject } from 'rxjs';
import { NewProtvistaColourEvent } from '../../track-data.model';

export class SetTracksDataBinding {
  constructor(
    private helpTooltipsBinder: ProtvistaHelpTooltipsBinding,
    private highlights: NewProtvistaFixedHighlights,
    private tooltip: NewProtvistaTooltip,
    private mouseTracker: ProtvistaDocMouseTracking,
    public colour3DBtnBinder?: ColourIn3DButtonBinding,
    public colourBy3DEventStream?: BehaviorSubject<NewProtvistaColourEvent | null>
  ) {}

  /**
   * Assigns data to a given Nightingale track and its scrollbox.
   */
  public setTrackCanvasData(
    container: HTMLElement,
    trackName: string,
    trackId: string,
    parentData: any,
    trackData: NightingaleFeature[],
    tooltipsData: { [key: string]: string },
    isNested: boolean,
    isCustomData: boolean,
    extraMarginLeft: number,
    extraMarginRight: number
  ): void {
    // 1 Assign data to main track
    const track = container.querySelector(`#${trackId}-track`);
    if (track) (track as any).data = trackData;

    // 2 Populate scrollbox subtracks if they exist
    const scrollBox = container.querySelector(`#${trackId}-scrollbox`);
    if (!scrollBox) return;

    const has3DControls = parentData.colourIn3DControl ? parentData.colourIn3DControl : false;
    const trackHeight = parentData.trackHeight !== undefined ? parentData.trackHeight : 40;
    for (let j = 0; j < trackData.length; j++) {
      const subtrack = trackData[j];
      const scrollBoxItem = document.createElement('nightingale-scrollbox-item');
      scrollBoxItem.id = `${trackId}-subtrack-${j}`;
      scrollBoxItem.setAttribute(
        'content-visible',
        generateSubTrackCanvasString(
          trackName,
          trackId,
          j,
          trackHeight,
          subtrack,
          isNested,
          isCustomData,
          (track as any)?.length ?? 0,
          extraMarginLeft,
          extraMarginRight,
          has3DControls
        )
      );
      scrollBoxItem.setAttribute('content-hidden', getLoadingDataHTML((subtrack as any).label));
      scrollBoxItem.setAttribute('name', trackId);
      scrollBoxItem.setAttribute('idx', `${j}`);
      scrollBox.appendChild(scrollBoxItem);

      // Assign subtrack data
      (scrollBoxItem as any).data = [subtrack];
    }

    // 3 Handle lazy-load behavior (triggered when item enters scrollbox viewport)
    if ((scrollBox as any).onEnter) {
      (scrollBox as any).onEnter(async (item: any) => {
        if (item.data) {
          for (const trackEl of Array.from(item.getElementsByTagName('nightingale-track-canvas-patched'))) {
            (trackEl as any).data = item.data;
          }
        }
        this.helpTooltipsBinder.bind(container, tooltipsData);
        if (this.colour3DBtnBinder && this.colourBy3DEventStream) this.colour3DBtnBinder.bind(container, this.colourBy3DEventStream);
        this.highlights.triggerFixedHighlight();
      });
    }
  }

  /**
   * Assigns data to a specific Nightingale Coloured Sequence track.
   */
  public setTrackColouredSequenceData(container: HTMLElement, trackId: string, trackData: string) {
    // 1 - Assign data to main coloured sequence track
    const track = container.querySelector(`#${trackId}-coloured-seq-track`);
    if (track) (track as any).sequence = trackData;
  }

  /**
   * Assigns data to a specific Nightingale Coloured Sequence track.
   */
  public async setTrackHeatmapSequenceData(
    container: HTMLElement,
    trackId: string,
    trackData: any,
    xDomain: number[],
    yDomain: string[],
    checkpoints: number[],
    colours: string[],
    trackTooltipFn: (d: any) => string
  ) {
    // 1 - Assign data to main coloured sequence track
    const track = container.querySelector<any>(`#${trackId}-heatmap-track`);
    if (!track) return;

    // Assign data
    track.setHeatmapData(xDomain, yDomain, trackData);
    const colorScale = scaleLinear(checkpoints, colours);

    // Wait for Lit render
    await track.updateComplete;
    // Apply heatmap color scale
    track.heatmapInstance.setColor((d: any) => colorScale(d.score));
    // Set our tooltips from hover events
    track.heatmapInstance.events.hover.subscribe((d: any) => {
      if (d.cell) {
        const tooltipContent = trackTooltipFn(d);
        const coords = { x: this.mouseTracker.latestMouseX, y: this.mouseTracker.latestMouseY };
        this.tooltip.showHoverTooltip(track, tooltipContent, coords, false);
      } else if (d.cell === undefined) {
        this.tooltip.hideHoverTooltip();
      }
    });
    // Set our pinned tooltips from click events
    track.heatmapInstance.events.select.subscribe((d: any) => {
      if (d.cell) {
        const tooltipContent = trackTooltipFn(d);
        const coords = { x: this.mouseTracker.latestMouseX, y: this.mouseTracker.latestMouseY };
        this.tooltip.showPinnedTooltip(track, tooltipContent, coords, false);
        this.highlights.fixedTooltipSelection = `${d.cell.x}:${d.cell.x}`;
        this.highlights.createHighlightText();
        this.highlights.triggerFixedHighlight();
      }
    });
  }

  /**
   * Assigns data to a specific Nightingale Conservation track.
   */
  public setTrackConservationData(container: HTMLElement, trackId: string, trackData: any, lineTrackData: any) {
    // 1 - Assign data to main conservation track
    const track = container.querySelector(`#${trackId}-conservation-track`);
    if (track) (track as any).data = trackData;

    // 2 - Assign data to line graph
    const lineTrack = container.querySelector(`#pdbe-pv-conservation-count`);
    if (lineTrack) (lineTrack as any).data = lineTrackData;
  }

  /**
   * Assigns data to a specific Nightingale Variation track.
   */
  public setTrackVariationData(container: HTMLElement, trackId: string, trackData: any, lineTrackData: any) {
    // 1 - Assign data to main conservation track
    const track = container.querySelector(`#${trackId}-variation-track`);
    if (track) (track as any).data = trackData;

    // 2 - Assign data to line graph
    const lineTrack = container.querySelector(`#pdbe-pv-variation-count`);
    if (lineTrack) (lineTrack as any).data = lineTrackData;
  }
}
