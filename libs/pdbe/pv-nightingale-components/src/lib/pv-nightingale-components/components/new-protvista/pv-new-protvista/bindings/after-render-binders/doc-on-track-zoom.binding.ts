import { NewProtvistaFixedHighlights } from '../../new-protvista-fixed-highlights';
import { NewProtvistaTooltip } from '../../new-protvista-tooltip';
import { updateHeatmapXScale } from '../../rendering/others/render-heatmap-scale';
import { ProtvistaGenericBinding } from '../abstract/generic-obj.bind';

export class ProtvistaOnTrackZoom extends ProtvistaGenericBinding {
  constructor(
    private tooltip: NewProtvistaTooltip,
    private highlights: NewProtvistaFixedHighlights
  ) {
    super();
  }

  private normalizeZoomValue(value: any): number {
    const num = Number(value);
    if (Number.isNaN(num)) return 0;

    // If it's within 0.001 of an integer, round it
    const nearest = Math.round(num);
    return Math.abs(num - nearest) < 1e-3 ? nearest : num;
  }

  private adjustHeatmapXScale(container: HTMLElement, start: number, end: number) {
    const heatmaps = container.querySelectorAll<any>('.sequence-heatmap-vis');
    if (!heatmaps.length) return;

    for (const heatmapTrack of Array.from(heatmaps)) {
      const trackId = heatmapTrack.getAttribute('id').split('-heatmap-track')[0];
      const xScaleSvg = container.querySelector(`#${trackId}-heatmap-xscale`);
      if (xScaleSvg) updateHeatmapXScale(trackId, [start, end]);
    }
  }

  override bind(container: HTMLElement, sequenceLength: number) {
    const onZoomEvt = (event: Event) => {
      if (!event.target) return;
      const target = event.target as HTMLElement;

      // Only handle events from Nightingale web components
      if (!target.tagName.startsWith('NIGHTINGALE-')) return;

      const customEvent = event as CustomEvent<any>;
      const detail = customEvent.detail;
      if (!detail) return;
      if (detail.cancelMe) return;

      // Handle zoom changes (display-start / display-end)
      if (detail['display-start'] && detail['display-end']) {
        // hide tooltips
        this.tooltip.hideHoverTooltip();
        this.tooltip.hidePinnedTooltip();

        // remove pinned tooltip highlight
        this.highlights.fixedTooltipSelection = '';
        this.highlights.createHighlightText();
        this.highlights.triggerFixedHighlight();

        // calculate whether to show zoomHint
        const start = this.normalizeZoomValue(detail['display-start']);
        const end = this.normalizeZoomValue(detail['display-end']);

        const zoomHint = container.querySelector('.navigation-zoom-hint') as HTMLDivElement | null;
        if (!zoomHint) return;
        const hasZoom = start !== 1 || end !== sequenceLength;
        zoomHint.style.display = hasZoom ? 'none' : '';

        // show reset button if zoom on
        const resetBtn = container.querySelector<HTMLElement>('#pv-reset-btn');
        if (resetBtn && hasZoom) resetBtn.style.display = '';
        else if (resetBtn) resetBtn.style.display = 'none';

        // adjust heatmap scale if exists
        this.adjustHeatmapXScale(container, start, end);
      }
    };
    document.addEventListener('change', onZoomEvt);
    this.elementListeners.push({ element: undefined, handlers: { type: 'change', listener: onZoomEvt } });
  }
}
