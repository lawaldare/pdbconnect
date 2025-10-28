import { BehaviorSubject } from 'rxjs';
import { NewProtvistaFixedHighlights } from '../../new-protvista-fixed-highlights';
import { NewProtvistaTooltip } from '../../new-protvista-tooltip';
import { updateHeatmapXScale } from '../../rendering/others/render-heatmap-scale';
import { NewProtvistaDialogEvent } from '../../track-data.model';
import { ProtvistaGenericBinding } from '../abstract/generic-obj.bind';

export class ProtvistaActBtnsBinding extends ProtvistaGenericBinding {
  constructor(
    private tooltip: NewProtvistaTooltip,
    private highlights: NewProtvistaFixedHighlights
  ) {
    super();
  }

  override bind(
    container: HTMLElement,
    sequenceLength: number,
    eventStreams: {
      addCustomTrack$?: BehaviorSubject<NewProtvistaDialogEvent | null>;
      editCustomTracks$?: BehaviorSubject<NewProtvistaDialogEvent | null>;
      openSearchHighlight$?: BehaviorSubject<NewProtvistaDialogEvent | null>;
    }
  ) {
    /** Reset button binding */
    const resetBtn = container.querySelector<HTMLElement>(`#pv-reset-btn`);
    if (resetBtn) {
      const resetHandler = (_event: Event) => {
        // Zoom reset by emitting event to nightingale navigation
        const nightingaleNavigation = container.querySelector('nightingale-navigation');
        if (nightingaleNavigation) {
          const eventObj = new CustomEvent('change', {
            detail: {
              'display-start': 1,
              'display-end': sequenceLength,
              cancelMe: true,
            },
            bubbles: true,
            cancelable: true,
          });
          nightingaleNavigation.dispatchEvent(eventObj);
        }

        // hide tooltips
        this.tooltip.hideHoverTooltip();
        this.tooltip.hidePinnedTooltip();

        // remove pinned tooltip highlight
        this.highlights.fixedTooltipSelection = '';

        // remove user added (search) highlights
        this.highlights.searchSelections = [];

        // refresh highlights on screen
        this.highlights.createHighlightText();
        this.highlights.triggerFixedHighlight();

        // update heatmap xscale if exists
        const heatmaps = container.querySelectorAll<any>('.sequence-heatmap-vis');
        if (!heatmaps.length) return;
        for (const heatmapTrack of Array.from(heatmaps)) {
          const trackId = heatmapTrack.getAttribute('id').split('-heatmap-track')[0];
          const xScaleSvg = container.querySelector(`#${trackId}-heatmap-xscale`);
          if (xScaleSvg) updateHeatmapXScale(trackId, [1, sequenceLength]);
        }
      };
      resetBtn.addEventListener('click', resetHandler);
      this.elementListeners.push({ element: resetBtn, handlers: { type: 'click', listener: resetHandler } });
    }

    /** Search/Highlight button binding */
    const searchHighlightBtn = container.querySelector<HTMLElement>(`#pv-search-highlight-btn`);
    if (searchHighlightBtn) {
      const searchHighlightHandler = (_event: Event) => {
        const rect = searchHighlightBtn.getBoundingClientRect();

        // Bottom-right coordinates relative to viewport
        const coords = {
          x: rect.right,
          y: rect.bottom,
          width: rect.width,
          height: rect.height,
        };

        // // Emit event to open Search/Highlight modal (Angular/Page side)
        // const eventObj = new CustomEvent('PDBe.NewProtvista.OpenSearchHighlight', {
        //   detail: {
        //     open: true,
        //     position: coords, // include the position
        //   },
        //   bubbles: true,
        //   cancelable: true,
        // });
        // document.dispatchEvent(eventObj);
        eventStreams.openSearchHighlight$?.next({ open: true, position: coords });
      };
      searchHighlightBtn.addEventListener('click', searchHighlightHandler);
      this.elementListeners.push({ element: searchHighlightBtn, handlers: { type: 'click', listener: searchHighlightHandler } });
    }

    /** Edit Track button binding */
    const editCustomBtn = container.querySelector<HTMLElement>(`#pv-edit-custom-btn`);
    if (editCustomBtn) {
      const editCustomHandler = (_event: Event) => {
        const rect = editCustomBtn.getBoundingClientRect();

        // Bottom-right coordinates relative to viewport
        const coords = {
          x: rect.right,
          y: rect.bottom,
          width: rect.width,
          height: rect.height,
        };

        // // Emit event to open Edit modal (Angular/Page side)
        // const eventObj = new CustomEvent('PDBe.NewProtvista.OpenEditTrack', {
        //   detail: {
        //     open: true,
        //     position: coords, // include the position
        //   },
        //   bubbles: true,
        //   cancelable: true,
        // });
        // document.dispatchEvent(eventObj);
        eventStreams.editCustomTracks$?.next({ open: true, position: coords });
      };
      editCustomBtn.addEventListener('click', editCustomHandler);
      this.elementListeners.push({ element: editCustomBtn, handlers: { type: 'click', listener: editCustomHandler } });
    }
    super.bind(container, sequenceLength);

    /** Add Track button binding */
    const addCustomBtn = container.querySelector<HTMLElement>(`#pv-add-custom-btn`);
    if (addCustomBtn) {
      const addCustomHandler = (_event: Event) => {
        const rect = addCustomBtn.getBoundingClientRect();

        // Bottom-right coordinates relative to viewport
        const coords = {
          x: rect.right,
          y: rect.bottom,
          width: rect.width,
          height: rect.height,
        };

        // // Emit event to open Edit modal (Angular/Page side)
        // const eventObj = new CustomEvent('PDBe.NewProtvista.OpenAddTrack', {
        //   detail: {
        //     open: true,
        //     position: coords, // include the position
        //   },
        //   bubbles: true,
        //   cancelable: true,
        // });
        // document.dispatchEvent(eventObj);
        eventStreams.addCustomTrack$?.next({ open: true, position: coords });
      };
      addCustomBtn.addEventListener('click', addCustomHandler);
      this.elementListeners.push({ element: addCustomBtn, handlers: { type: 'click', listener: addCustomHandler } });
    }
  }
}
