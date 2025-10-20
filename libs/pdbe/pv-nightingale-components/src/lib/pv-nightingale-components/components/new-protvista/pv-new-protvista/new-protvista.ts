import { NewProtvistaTrackData } from './track-data.model';
import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';
export class NewProtvistaVisualisation {
  private containerId: string;
  private containerElement: HTMLElement | null;
  private data: any[];
  private sequence: string;
  private sequenceLength: number;
  private handleBarImgSrc = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjE5Ij4KICAgIDxyZWN0IHg9IjEiIHk9IjAiIHdpZHRoPSI2cHgiIGhlaWdodD0iMThweCIgc3R5bGU9ImZpbGw6IGRhcmtncmV5OyBzdHJva2U6IGJsYWNrOyBzdHJva2Utd2lkdGg6IDFweDsiPjwvcmVjdD4KPC9zdmc+`;

  private onZoomEvt: EventListener | null = null;

  constructor(containerId: string, sequence: string, data: any[]) {
    this.containerId = containerId;
    this.data = data;
    console.log('containerId');
    console.log(containerId);
    console.log('data');
    console.log(data);
    const containerElement = document.getElementById(this.containerId);
    if (containerElement === null) {
      throw 'Invalid container for visualisation';
    }
    this.containerElement = containerElement;
    console.log('this.containerElement');
    console.log(this.containerElement);
    this.sequence = sequence;
    this.sequenceLength = sequence.length;
    this.start();
  }

  public renderStickyHeaderContent() {
    // TODO: sequence [fixedHighlight]="selectionHighlight()"
    // TODO: Create middle element where this is appended to and is .remove() on destroy
    return `
      <div class="pv-track-row">
        <div class="pv-track-col small"></div>
        <div class="pv-track-col pv-track-container">
          <nightingale-navigation length="${this.sequenceLength}" height="30" margin-left="0" margin-right="10" use-ctrl-to-zoom></nightingale-navigation>
          <div style="position: relative; width: 100%">
            <div class="navigation-zoom-hint">
              Use handle bars <img src="${this.handleBarImgSrc}" /> or <kbd>Ctrl</kbd> + <kbd>Scroll</kbd> to zoom in/out of tracks
            </div>
            <nightingale-sequence
              length="${this.sequenceLength}"
              sequence="${this.sequence}"
              height="26"
              margin-left="0"
              margin-right="10"
              use-ctrl-to-zoom
            ></nightingale-sequence>
          </div>
        </div>
      </div>
    `;
  }

  public bindStickyHeaderContentEvents() {
    this.onZoomEvt = (event: Event) => {
      // 1 - Sanity checks for valid target
      if (!event.target) return;
      const target = event.target as HTMLElement;
      // ... target tag name
      if (!target || !target.tagName.startsWith('NIGHTINGALE-')) return;
      // ... target event data
      const customEvent = event as CustomEvent<any>;
      const detail = customEvent.detail;
      if (!detail) return;

      // 5 - If event is Nightingale zoom event (has display-start display-end inside event.detail)
      if (detail['display-start'] && detail['display-end']) {
        const start = parseInt(detail['display-start']);
        const end = parseInt(detail['display-end']);

        const zoomHint = this.containerElement?.querySelector('.navigation-zoom-hint');
        if (zoomHint) (zoomHint as HTMLDivElement).style.display = '';
        if (zoomHint && (start !== 1 || end !== this.sequenceLength)) {
          (zoomHint as HTMLDivElement).style.display = 'none';
        }
      }
    };
    document.addEventListener('change', this.onZoomEvt);
  }

  public bindTrackData(trackName: string, trackData: any) {
    const track = this.containerElement?.querySelector(`#${trackName}-track`);
    if (track) (track as any).data = trackData;
  }

  public renderTrackCanvas(trackId: string, trackName: string, isCustomData: boolean) {
    // [fixedHighlight]="selectionHighlight()" and many more
    return `
    <div class="pv-track-row">
      <div class="collapsible">
        <div class="pv-track-row non-header-track track collapsed" style="align-content: flex-start">
          <div class="pv-track-label-col hoverable not-empty">
            <span class="expand-icon">▸</span> ${trackName}
          </div>
          <div class="pv-track-container">
            <nightingale-track-canvas-patched
              id="${trackId}-track"
              length="${this.sequenceLength}"
              height="40"
              margin-left="0"
              margin-right="10"
              layout="non-overlapping"
              highlight-color="#FFEB3B66"
              highlight-event="onmouseover"
              class="${isCustomData ? 'custom-row' : ''}"
              use-ctrl-to-zoom
            ></nightingale-track-canvas-patched>
          </div>
          <div class="pv-track-container placeholder" style="display: none;"></div>
        </div>
        <div class="pv-expanded-tracks" style="display: none;">
         <!-- TODO: Add expanded subtracks here-- >
        </div>
      </div>
    </div>
    `;
  }

  // TODO:
  // 2 - Add expand/collapse mode
  // 3 - Add tooltips
  // 4 - Add Conservation, Variation tracks
  // 5 - Add Fixed Highlights
  // 6 - Add Custom Data
  // 7 - Add AFdb mode

  public render() {
    // TODO: (scroll)="onPvScroll($event)"
    if (this.containerElement === null) return;
    this.containerElement.innerHTML = `
      <nightingale-manager>
        <div class="pv-protvista elements-container">
          <div id="pv-header-controls" class="always-on-top">
            ${this.renderStickyHeaderContent()}
          </div>
          <div id="pv-scrollable" class="scrollable">
            ${this.renderTrackCanvas('uniprot', 'UniProt', false)}
          </div>
        </div> 
      </nightingale-manager>
    `;
    this.bindStickyHeaderContentEvents();
    this.bindTrackData('uniprot', this.data);

    // const featuresData = [
    //   {
    //     accession: 'feature1',
    //     start: 1,
    //     end: 2,
    //     color: 'blue',
    //   },
    //   {
    //     accession: 'feature1',
    //     start: 49,
    //     end: 50,
    //     color: 'red',
    //   },
    //   {
    //     accession: 'feature1',
    //     start: 10,
    //     end: 20,
    //     color: '#342ea2',
    //   },
    //   {
    //     accession: 'feature2',
    //     locations: [{ fragments: [{ start: 30, end: 45 }] }],
    //     color: '#A42ea2',
    //   },
    //   {
    //     accession: 'feature3',
    //     locations: [
    //       {
    //         fragments: [{ start: 15, end: 15 }],
    //       },
    //       { fragments: [{ start: 18, end: 18 }] },
    //     ],
    //     color: '#A4Aea2',
    //   },
    //   {
    //     accession: 'feature4',
    //     locations: [
    //       {
    //         fragments: [
    //           { start: 20, end: 23 },
    //           { start: 26, end: 32 },
    //         ],
    //       },
    //     ],
    //   },
    // ];
    // (document.getElementById('track-simple') as any).data = featuresData;
  }

  public async start() {
    this.render();
  }

  public destroy() {
    console.log('destroy');
    if (this.onZoomEvt) document.removeEventListener('change', this.onZoomEvt);
  }
}
