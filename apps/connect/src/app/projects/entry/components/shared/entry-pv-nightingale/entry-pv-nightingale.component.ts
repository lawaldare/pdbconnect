import { AfterViewInit, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, HostListener, inject, input, Renderer2, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, firstValueFrom, forkJoin, of, take } from 'rxjs';
import '@nightingale-elements/nightingale-manager';
import '@nightingale-elements/nightingale-navigation';
import '@nightingale-elements/nightingale-sequence';
import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';
import { MaterialModule } from '@pdbc/core';

import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';
import {
  APIConservationData,
  APITrackData,
  APITrackFragment,
  APITrackItem,
  APIVariationData,
  ConservationTrackBlockComponent,
  MapCustomDataPanelComponent,
  PanelResidueDatum,
  PvFixedHighlightService,
  PvTooltipService,
  SearchResiduePanelComponent,
  TrackBlockComponent,
  VariationTrackBlockComponent,
} from '@pdbe-lib/pv-nightingale-components';
import { PvDataApiService } from '../../../services/entry-pv-nightingale-api.service';

import { processPdbEntityDataToTracks } from './pv-entry-api-processing';
import { handleBarSrc, PAUL_TOL_COLORBLIND_SCALE } from '../../../entry-constant';
import { PDBMolstarEvent } from './event-models/pdbe-molstar-events.model';
import { PDBTopolViewerEvent } from './event-models/pdbe-topol-events.model';

/**
 * Helper to decode rawHTML from API endpoints (tooltipContent)
 */
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html.replace(/'/g, `"`);
  return txt.value;
}

/**
 * Test cases: 1trn modification, 4v99 high chains; 3jb9 high residues, 102l mutations, 1cbs no variation, 7v08
 */

// list of endpoints for simple tracks for entryId + entityId
const PDBE_ENTITY_TRACK_ENDPOINTS = ['uniprot_mapping', 'chains', 'domains', 'rfam', 'secondary_structure', 'binding_sites', 'interfaces', 'annotations'];

@Component({
  selector: 'pdbc-entry-pg-protvista',
  imports: [
    CommonModule,
    MatCheckbox,
    MatRadioButton,
    MaterialModule,
    SearchResiduePanelComponent,
    MapCustomDataPanelComponent,
    TrackBlockComponent,
    ConservationTrackBlockComponent,
    VariationTrackBlockComponent,
  ],
  templateUrl: './entry-pv-nightingale.component.html',
  styleUrl: './entry-pv-nightingale.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [PvFixedHighlightService],
})
export class EntryPgProtvistaComponent implements AfterViewInit {
  // Component inputs (can be bound from parent)
  public readonly entryId = input<string>('1trn');
  public readonly entityId = input<string>('1');
  public readonly chainId = input<string | undefined>(undefined);
  // to enable Mol*/TopologyViewer events sync
  public readonly externalInteractivity = input<boolean>(false);

  // Debounce timer to prevent excessive component refreshes on entityId changes
  private entityIdDebounceTimer: any;

  // Inject required Angular services / extra dynamic manipulation
  private apiService = inject(PvDataApiService);
  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);

  // State boolean variables indicating API loading and sequence loading
  public readonly loadedTracksAPIData = signal<boolean>(false);
  public readonly loadedConservationAPIData = signal<boolean>(false);
  public readonly loadedVariationAPIData = signal<boolean>(false);
  public readonly sequenceIsLoaded = signal<boolean>(false);

  public loadedAllData() {
    return this.loadedTracksAPIData() && this.loadedVariationAPIData() && this.loadedConservationAPIData();
  }

  // all Nightingale tracks require sequence and/or sequence length
  public sequence?: string;
  public sequenceLength?: number;

  // most API data gets converted into track names and list (TrackBlockComponent)
  public trackNames: string[] = [];
  public trackList: NightingaleFeature[][] = [];
  // this also includes custom data from the user
  public customTrackData: NightingaleFeature[] = [];

  // conservation API data has a special track and data types (ConservationTrackBlockComponent)
  // this data is set using signals for automatic processing and rendering on update
  public originalConservationData = signal<APIConservationData | undefined>(undefined);

  // variation API data has a special track and data types (VariationTrackBlockComponent)
  // this data is set using signals for automatic processing and rendering on update
  public originalVariationData = signal<APIVariationData | undefined>(undefined);

  // service for manual tooltip placement logic according to mouse position
  public tooltipService = inject(PvTooltipService);

  // for mouse tracking so absolute tooltips display properly. updated on constructor() by
  // mousemove, touchstart and touchmove events
  private latestMouseX = 0;
  private latestMouseY = 0;

  // API data from tracks is saved in tooltips dictionary since ...
  public tooltips: { [key: string]: string } = {};

  //
  private highlightService = inject(PvFixedHighlightService);
  public readonly selectionHighlight = this.highlightService.selectionHighlight;

  // template img srcs
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  public readonly handleBarSrc = handleBarSrc;

  // SearchResiduePanelComponent display (on/off) and absolute positioning
  public showSearchPanel = false;
  public searchPanelPosition = { top: 0, left: 0 };

  // MapCustomDataPanelComponent display (on/off) and absolute positioning
  public showMapPanel = false;
  public mapPanelPosition = { top: 0, left: 0 };

  public customRawTrackData = '';

  public showZoomHint = signal(true);

  // data for modals
  public selectedResidues: string[] = [];
  public panelResidueData: PanelResidueDatum[] = [];

  // height for the scrollable tracks div is automatically calculated from parent's total height - fixed header height
  public calculatedHeight = computed(() => {
    const header = document.getElementById('pv-header-controls');
    if (!header) return undefined;
    const headerHeight = header.getBoundingClientRect().height;
    const height = this.elementRef.nativeElement.parentNode.getBoundingClientRect().height;
    if (this.loadedTracksAPIData() && this.loadedVariationAPIData() && this.loadedConservationAPIData()) {
      return height - headerHeight;
    }
    return undefined;
  });

  constructor() {
    // 1 - mousemove, touchmove and touchstart here update latest mouse position for
    // positioning absolute tooltips when they are triggered
    document.addEventListener('mousemove', (event: MouseEvent) => {
      this.latestMouseX = event.clientX;
      this.latestMouseY = event.clientY;
    });

    document.addEventListener(
      'touchmove',
      (event: TouchEvent) => {
        if (event.touches.length > 0) {
          this.latestMouseX = event.touches[0].clientX;
          this.latestMouseY = event.touches[0].clientY;
        }
      },
      { passive: true }
    ); // 1.1 use passive to prevent scrolling jank

    document.addEventListener(
      'touchstart',
      (event: TouchEvent) => {
        if (event.touches.length > 0) {
          this.latestMouseX = event.touches[0].clientX;
          this.latestMouseY = event.touches[0].clientY;
        }
      },
      { passive: true }
    ); // 1.2 use passive to prevent scrolling jank

    // 2 - this effect allows the visualisation to auto reset on entityId change
    effect(() => {
      const current = this.entityId();
      clearTimeout(this.entityIdDebounceTimer);
      this.entityIdDebounceTimer = setTimeout(() => {
        if (current) this.resetVisualization();
      }, 50);
    });
  }

  async ngAfterViewInit() {
    // 1 - Setup highlight and tooltip services with this component's root element
    this.highlightService.setParentComponent(this.elementRef.nativeElement);
    this.tooltipService.setRelativeElement(this.elementRef.nativeElement);

    // 2 - Configure tooltipService with a container div inside the scrollable area
    const scrollContainer = document.getElementById('pv-scrollable');
    const tooltipContainer = document.getElementById('pv-tooltips-container');

    // 2.1 - Pass DOM references to tooltipService
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.tooltipService.setContainer(tooltipContainer!);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.tooltipService.setScrollContainer(scrollContainer!);
    this.tooltipService.setRenderer(this.renderer);
    this.tooltipService.setHighlightService(this.highlightService);

    // 3 - Load and render track data if required inputs are present
    if (this.entryId() && this.entityId()) {
      // 3.1 - Fetch PDBe track data (domains, chains, secondary structure, etc.)
      const trackDataArray = await this.fetchPdbeEntityData();

      // 3.2 - Extract sequence and sequenceLength from fetched data
      this.setSequenceFromTrackData(trackDataArray);

      // 3.3 - Convert API data to Nightingale-compatible structures
      const { trackNames, trackList, tooltips, panelResidueData } = processPdbEntityDataToTracks(this.entryId(), this.sequence!, trackDataArray);

      // 3.4 - Store processed data into component state
      this.trackNames = trackNames;
      this.trackList = trackList;
      for (const [k, v] of Object.entries(tooltips)) {
        this.tooltips[k] = v;
      }
      this.panelResidueData = panelResidueData;

      // 3.5 - Mark track API data as loaded to trigger downstream computed signals
      this.loadedTracksAPIData.set(true);
    }
  }

  openSearchPanel() {
    // 1 - Get reference to the search button and component's host bounding box
    const btn = document.getElementById('search-residue-btn');
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();

    // panel position was previously calculated based on mouse position relative to host (absolute position)
    // const top = this.latestMouseY - hostRect.top + 6;
    // const left = this.latestMouseX - hostRect.left ;

    // 2 - If the button exists, calculate panel position relative to host (absolute position)
    if (btn) {
      const btnRect = btn.getBoundingClientRect();
      // top was previously calculated based on button position
      // const top = btnRect.bottom - hostRect.top + 6;

      const top = 0; // fixed to very top of host (absolute position)
      const left = btnRect.left - hostRect.left;

      // 3 - Update panel position state
      this.searchPanelPosition = { top, left };
    }

    // 4 - Show search panel and hide map panel
    this.showSearchPanel = true;
    this.showMapPanel = false;
  }

  openMapPanel() {
    // 1 - Get reference to the map button and component's host bounding box
    const btn = document.getElementById('map-data-btn');
    const hostRect = this.elementRef.nativeElement.getBoundingClientRect();

    // panel position was previously calculated based on mouse position relative to host (absolute position)
    // const top = this.latestMouseY - hostRect.top + 6;
    // const left = this.latestMouseX - hostRect.left ;

    // 2 - If the button exists, calculate panel position relative to host
    if (btn) {
      const btnRect = btn.getBoundingClientRect();
      // top was previously calculated based on button position
      // const top = btnRect.bottom - hostRect.top + 16;

      const top = 0; // fixed to very top of host (absolute position)
      const left = btnRect.left - hostRect.left;

      // 3 - Update panel position state
      this.mapPanelPosition = { top, left };
    }

    // 4 - Show map panel and hide search panel
    this.showMapPanel = true;
    this.showSearchPanel = false;
  }

  resetVisualization() {
    // 1 - Reset all API-loaded signals to false
    this.loadedTracksAPIData.set(false);
    this.loadedConservationAPIData.set(false);
    this.loadedVariationAPIData.set(false);
    this.sequenceIsLoaded.set(false);

    // 2 - Clear all core data and state values
    this.trackNames = [];
    this.trackList = [];
    this.customTrackData = [];
    this.sequence = undefined;
    this.sequenceLength = undefined;

    // 3 - Clear original conservation/variation signal data
    this.originalVariationData.set(undefined);
    this.originalConservationData.set(undefined);

    // 4 - Reset selection/highlighting state
    this.selectedResidues = [];
    this.customRawTrackData = '';
    this.highlightService.setSearchSelections([]);
    this.highlightService.createSelectionHighlight();
    this.highlightService.triggerDynamicFixedHighlight();

    // 5 - Optional: immediately reload visualization after clearing state
    setTimeout(() => {
      this.ngAfterViewInit();
    }, 0);
  }

  /**
   * For PDBe Entity we:
   * 1 - retrieve all data from PDBE_ENTITY_TRACK_ENDPOINTS (this function)
   * 2 - convert data from these endpoints into new Nightingale required format (processPdbEntityDataToTracks)
   * 3 - retrieve data from Conservation and Variation endpoints when possible
   * 4 - return raw API response for track endpoints so step 2 can process them
   * @returns retrieved API data for PDBe Entity trackDataArray: (Record<string, TrackData> | null)[]
   */
  async fetchPdbeEntityData() {
    // 1 - Fetch track data from each endpoint using RxJS observables
    const observables = PDBE_ENTITY_TRACK_ENDPOINTS.map((endpoint) =>
      this.apiService.getPdbeEntityTrackData(this.entryId(), this.entityId(), endpoint).pipe(
        catchError((error) => {
          // console.error(`❌ Error fetching data for endpoint ${endpoint}:`, error);
          return of(null); // 1.1 Return a default/fallback value to keep forkJoin working
        }),
        take(1) // 1.2 take only the first response and unsubscribe
      )
    );

    // 2 - Setup conservation endpoint observable
    const conservationObservable = this.apiService.getPdbeConservationTrackData(this.entryId(), this.entityId()).pipe(
      catchError((error) => {
        // console.error(`❌ Error fetching Conservation data:`, error);
        this.loadedConservationAPIData.set(true); // 2.1 still mark as "loaded" to avoid blocking
        return of(null);
      }),
      take(1)
    );

    // 3 - Setup variation endpoint observable
    const variationObservable = this.apiService.getPdbeVariationTrackData(this.entryId(), this.entityId()).pipe(
      catchError((error) => {
        // console.error(`❌ Error fetching Variation data:`, error);
        this.loadedVariationAPIData.set(true);
        return of(null);
      }),
      take(1)
    );

    // 4 - Trigger conservation observable independently (no need to block)
    conservationObservable.subscribe((conservationData) => {
      if (conservationData) this.originalConservationData.set(conservationData);
      this.loadedConservationAPIData.set(true);
    });

    // 5 - Trigger variation observable independently (no need to block)
    variationObservable.subscribe(async (variationData) => {
      if (variationData) this.originalVariationData.set(variationData);
      this.loadedVariationAPIData.set(true);
    });

    // 6 - Wait for all track endpoints to resolve using forkJoin
    let trackDataArray: (Record<string, APITrackData> | null)[] = [];
    try {
      // 6.1 Use firstValueFrom to await forkJoin result
      trackDataArray = await firstValueFrom(forkJoin(observables));
    } catch (error) {
      // console.error('❌ Unexpected error while fetching track data:', error);
    }
    return trackDataArray;
  }

  setSequenceFromTrackData(trackDataArray: (Record<string, APITrackData> | null)[]) {
    // 1 - Extract sequence from all track records (skip nulls)
    const seqs = trackDataArray.filter((eachTrackDatum) => eachTrackDatum !== null).map((eachTrackDatum) => eachTrackDatum[this.entryId()].sequence);

    // 2 - Validate if all sequences are equal (warn if not)
    const allEqual = seqs.every((val, i, arr) => val === arr[0]);
    if (!allEqual) {
      console.warn('Unexpected: sequence is not equal for all track data. Using first track sequence');
    }

    // 3 - If not already set, update sequence and length (used by Nightingale)
    if (this.sequenceIsLoaded() === false) {
      const sequence = seqs[0];
      this.sequence = sequence;
      this.sequenceLength = this.sequence.length;
      this.sequenceIsLoaded.set(true);
    }
  }

  @HostListener('document:PDB.topologyViewer.mouseover', ['$event'])
  // @HostListener('document:PDB.litemol.mouseover', ['$event'])
  @HostListener('document:PDB.molstar.mouseover', ['$event'])
  handleExternalMouseoverEvents(event: Event) {
    // 1 - Early exit if external interactivity is disabled
    if (!this.externalInteractivity()) return;

    // 2 - Extract relevant event metadata based on event source
    let eventEntryId: string | undefined = undefined;
    let eventEntityId: string | undefined = undefined;
    let eventChainId: string | undefined = undefined;
    let eventResNumber: number | undefined = undefined;

    if (event.type === 'PDB.molstar.mouseover') {
      const eventData = (event as PDBMolstarEvent).eventData;
      eventEntryId = eventData.entry_id.toLowerCase();
      eventEntityId = eventData.entity_id;
      eventChainId = eventData.auth_asym_id;
      eventResNumber = eventData.residueNumber;
    } else if (event.type === 'PDB.topologyViewer.mouseover') {
      const eventData = (event as PDBTopolViewerEvent).eventData;
      eventEntryId = eventData.entryId.toLowerCase();
      eventEntityId = eventData.entityId;
      eventChainId = eventData.chainId;
      eventResNumber = eventData.residueNumber;
    }

    // 3 - Match event data to this component's entry/entity/chain
    if (this.entryId() !== eventEntryId) return;
    if (this.entityId() !== eventEntityId) return;
    if (this.chainId() && this.chainId() !== eventChainId) return;

    // 4 - Dispatch highlight change event to Nightingale navigation component
    const nightingaleNavigation = document.querySelector('nightingale-navigation');
    if (nightingaleNavigation) {
      const eventObj = new CustomEvent('change', {
        detail: {
          highlight: `${eventResNumber}:${eventResNumber}`,
          cancelMe: true,
        },
        bubbles: true,
        cancelable: true,
      });
      nightingaleNavigation.dispatchEvent(eventObj);
    }
  }

  @HostListener('document:PDB.molstar.mouseout', ['$event'])
  // @HostListener('document:PDB.litemol.mouseout', ['$event'])
  @HostListener('document:PDB.topologyViewer.mouseout', ['$event'])
  handleExternalMouseoutEvents(_event: Event) {
    // 1 - Early exit if external interactivity is disabled
    if (!this.externalInteractivity()) return;

    // 2 - Clear highlight on Nightingale navigation when external component unhovers
    const nightingaleNavigation = document.querySelector('nightingale-navigation');
    if (nightingaleNavigation) {
      const eventObj = new CustomEvent('change', {
        detail: {
          highlight: undefined,
          cancelMe: true,
        },
        bubbles: true,
        cancelable: true,
      });
      nightingaleNavigation.dispatchEvent(eventObj);
    }
  }

  @HostListener('document:PDB.topologyViewer.click', ['$event'])
  // @HostListener('document:PDB.litemol.click', ['$event'])
  @HostListener('document:PDB.molstar.click', ['$event'])
  handleExternalClickEvents(event: Event) {
    // 1 - Early exit if external interactivity is disabled
    if (!this.externalInteractivity()) return;

    // 2 - Extract relevant event metadata based on event source
    let eventEntryId: string | undefined = undefined;
    let eventEntityId: string | undefined = undefined;
    let eventChainId: string | undefined = undefined;
    let eventResNumber: number | undefined = undefined;

    if (event.type === 'PDB.molstar.click') {
      const eventData = (event as PDBMolstarEvent).eventData;
      eventEntryId = eventData.entry_id.toLowerCase();
      eventEntityId = eventData.entity_id;
      eventChainId = eventData.auth_asym_id;
      eventResNumber = eventData.residueNumber;
    } else if (event.type === 'PDB.topologyViewer.click') {
      const eventData = (event as PDBTopolViewerEvent).eventData;
      eventEntryId = eventData.entryId.toLowerCase();
      eventEntityId = eventData.entityId;
      eventChainId = eventData.chainId;
      eventResNumber = eventData.residueNumber;
    }

    // 3 - Match event data to this component's entry/entity/chain
    if (this.entryId() !== eventEntryId) return;
    if (this.entityId() !== eventEntityId) return;
    if (this.chainId() && this.chainId() !== eventChainId) return;

    // 4 - Add clicked residue index to selection list and apply highlight logic
    const selectedResidues = [...this.selectedResidues];
    selectedResidues.push(`Index: ${eventResNumber}`);
    this.onSelectedResiduesChange(selectedResidues);
  }

  /**
   * Dispatches a custom 'protvista-mouseover' event with residue range and context feature.
   * This allows external viewers (e.g. Mol*, Topology Viewer) to respond to internal mouseover highlights.
   */
  triggerExternalMouseOverEvents(start: number, end: number) {
    const eventObj = new CustomEvent('protvista-mouseover', {
      detail: {
        start: `${start}`,
        end: `${end}`,
        feature: {
          entityId: this.entityId(),
          chainId: this.chainId(),
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj);
  }

  /**
   * Dispatches a custom 'protvista-mouseout' event.
   * Used to notify external viewers to clear their highlights when mouse leaves a feature.
   */
  triggerExternalMouseOutEvents() {
    const eventObj = new CustomEvent('protvista-mouseout');
    document.dispatchEvent(eventObj);
  }

  /**
   * Dispatches a custom 'protvista-click' event with residue range, color and feature metadata.
   * Used to notify external viewers when a feature is clicked within this component.
   */
  triggerExternalClickEvents(start: number, end: number, feature: any, color?: string) {
    const eventObj = new CustomEvent('protvista-click', {
      detail: {
        start: `${start}`,
        end: `${end}`,
        color: color,
        feature: {
          entityId: this.entityId(),
          chainId: this.chainId(),
          ...feature, // Spread additional metadata from the feature sometimes used by external viewers such as PDBe Molstar
        },
      },
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(eventObj);
  }

  // on .scrollable scroll
  onPvScroll(event: Event) {
    // 1 - When scrollable tracks are scrolled, hide any hover-based tooltips (manual)
    this.tooltipService.hideManualTooltip();

    // 2 - reposition pinned (clicked) tooltips so they remain aligned to host (absolute positioned)
    if (!this.tooltipService.pinnedTooltipElement) return;
    // 2.1 - repositioning does NOT happen for tooltips of custom data tracks (fixed in host)
    const tooltipContent = this.tooltipService.pinnedTooltipElement.innerHTML;
    if (!tooltipContent.includes('Custom data track:')) {
      this.tooltipService.movePinnedTooltip();
    }
  }

  handleNightingaleZoom(start: number, end: number) {
    // 1 - Hide tooltips
    this.tooltipService.hideManualTooltip();
    this.tooltipService.hidePinnedTooltip();

    // 2 -  Hide zoom hint if full zoomed in
    if (start !== 1 || end !== this.sequenceLength) {
      this.showZoomHint.set(false);
    } else {
      this.showZoomHint.set(true);
    }
  }

  handleNightingaleMouseout() {
    // 1 - hide any hover-based tooltips (manual)
    this.tooltipService.hideManualTooltip();

    // 2 - If external interactivity is enabled, trigger mouseout events
    if (this.externalInteractivity()) {
      this.triggerExternalMouseOutEvents();
    }
  }

  handleNightingaleClick(target: HTMLElement, coords: number[], feature: any) {
    // 1 - Nightingale click events don't provide rich context,
    // so we use previously saved hover tooltip content (if available)
    // to identify the content to be shown on a pinned tooltip
    if (!this.tooltipService.tooltipElement) return;
    const tooltipContent = this.tooltipService.tooltipElement.innerHTML;
    this.tooltipService.showPinnedTooltip(target, tooltipContent, { x: coords[0], y: coords[1] });

    // 2 - If external interactivity is enabled, trigger external click events
    // Clicked range and color are determined based on track type
    if (this.externalInteractivity()) {
      let start = undefined;
      let end = undefined;
      let color = undefined;

      // 2.1 - If it's a custom track, extract color from feature
      if (tooltipContent.includes('Custom data track:')) {
        color = feature.color;
      }

      // 2.2 - Conservation track: use feature.position for start/end
      if (feature.probability) {
        start = feature.position;
        end = feature.position;
      }

      // 2.3 - Variation track: use feature.start
      else if (feature.variant) {
        start = feature.start;
        end = feature.start;
      }

      // 2.4 - Canvas track: locate fragment based on matching tooltip
      else if (feature.locations && feature.locations[0] && feature.locations[0].fragments) {
        const fragment = feature.locations[0]?.fragments.find((f: APITrackFragment) => decodeHtml(f.tooltipContent) === decodeHtml(tooltipContent));
        if (!fragment) return;
        start = fragment.start;
        end = fragment.end;

        // 2.5 - Use fragment color if available
        // (but only for ranges with more than 1 residue)
        if (fragment.color && fragment.start !== fragment.end) {
          color = fragment.color;
        }
      }

      // 2.6 - Dispatch protvista-click event to signal external components
      this.triggerExternalClickEvents(start, end, feature, color);
    }
    return;
  }

  handleNightingaleHover(target: HTMLElement, coords: number[], detail: any) {
    // 1 - Initialize state variables for highlight + tooltip rendering
    let startPos = undefined;
    let endPos = undefined;
    let highlightContent = undefined;
    let tooltipContent = undefined;

    const feature = detail.feature;

    // 2 - If conservation track (probability-based)
    if (feature.probability) {
      const probText = (feature.probability * 100.0).toFixed(2);
      tooltipContent = `Position: ${feature.position}<br>Amino acid: ${feature.aa}<br>Probability: ${probText}%`;
      highlightContent = `${feature.position}:${feature.position}`;
      startPos = feature.position;
      endPos = feature.position;
    }

    // 3 - If variation track
    else if (feature.variant && feature.tooltipContent) {
      tooltipContent = feature.tooltipContent;
      highlightContent = `${feature.start}:${feature.start}`;
      startPos = feature.start;
      endPos = feature.start;
    }

    // 4 - If canvas track
    else if (feature.locations && feature.locations[0] && feature.locations[0].fragments) {
      const highlight = detail.highlight;
      if (!highlight) return;

      startPos = parseInt(highlight.split(':')[0]);
      endPos = parseInt(highlight.split(':')[1]);

      // 4.1 Get the matching fragment based on highlight coordinates
      const fragment = feature.locations[0]?.fragments.find((f: APITrackFragment) => f.start === startPos! && f.end === endPos!);
      if (!fragment) return;

      tooltipContent = fragment.tooltipContent;
      highlightContent = highlight;
    }

    // 5 - Display hover tooltip if content is available
    if (tooltipContent && highlightContent) {
      this.tooltipService.showManualTooltip(target, tooltipContent, highlightContent, { x: coords[0], y: coords[1] });
    }

    // 6 - If external interactivity is enabled, trigger hover event
    if (this.externalInteractivity() && startPos && endPos) {
      this.triggerExternalMouseOverEvents(startPos, endPos);
    }
  }

  @HostListener('document:change', ['$event'])
  onNightingaleChangeEvent(event: Event) {
    // 1 - Sanity check for valid target
    if (!event.target) return;
    const target = event.target as HTMLElement;

    // 2 - Sanity check for valid component target (Nightingale based)
    if (!target || !target.tagName.startsWith('NIGHTINGALE-')) return;

    // 3 - Sanity check for detail data inside this custom event
    const customEvent = event as CustomEvent<any>;
    const detail = customEvent.detail;
    if (!detail) return;

    // 4 - Stop infinite event loops from happening by detecting whether
    // an event is triggered by this own component (triggerExternalMouseOverEvents)
    if (detail.cancelMe) return;

    // 5 - If event is Nightingale zoom event (has display-start display-end inside event.detail)
    if (detail['display-start'] && detail['display-end']) {
      const start = parseInt(detail['display-start']);
      const end = parseInt(detail['display-end']);
      this.handleNightingaleZoom(start, end);
      return;
    }

    // 6 - Other events should have a eventType inside event.detail
    const eventType = detail.eventType;
    if (!eventType) return;

    // 7 - If event is Nightingale mouseout
    if (eventType === 'mouseout') {
      this.handleNightingaleMouseout();
      return;
    }

    // 8 - Remaining events are Nightingale mouseover and click
    // which require mouse coordinates and event.detail.feature
    const coords = [this.latestMouseX, this.latestMouseY];
    const feature = detail.feature;
    if (!feature) return;

    // 9 - If event is Nightingale click
    if (eventType === 'click') {
      this.handleNightingaleClick(target, coords, feature);
    }

    // 10 - If event is Nightingale hover
    if (eventType === 'mouseover') {
      this.handleNightingaleHover(target, coords, detail);
    }
  }

  onSelectedResiduesChange(newSelection: string[]) {
    // 1 - Update selected residues from search panel or external interactivity
    this.selectedResidues = newSelection;

    // 2 - Convert selected strings (e.g. "Index: 15-20") to Nightingale highlight ranges (e.g. "15:20")
    const searchSelections = this.selectedResidues
      .map((entry) => {
        const indexPart = entry.split('|').find((part) => part.trim().startsWith('Index:'));
        if (!indexPart) return '';

        const indexRange = indexPart.replace('Index:', '').trim();
        const [start, end] = indexRange.split('-').map((v) => v.trim());

        return end ? `${start}:${end}` : `${start}:${start}`;
      })
      .filter(Boolean); // 2.1 - Filter out any invalid or empty results

    // 3 - Apply selections to highlighting service for visual feedback
    this.highlightService.setSearchSelections(searchSelections);
    this.highlightService.createSelectionHighlight();
    this.highlightService.triggerDynamicFixedHighlight();
  }

  onCustomRawTrackDataChange(newRawTrackData: string) {
    // 1 - Update local raw text input value
    this.customRawTrackData = newRawTrackData;

    // 2 - Parse multiline raw input into individual lines
    const lines = newRawTrackData.split('\n').map((l) => l.trim());
    const features: NightingaleFeature[] = [];

    // 3 - Variables to track current block of data
    let currentTrack = '';
    let currentResidues = '';
    let trackId = -1;
    let trackColor = '#333333';

    for (const line of lines) {
      if (line.startsWith('Track:')) {
        // 4 - Start of a new custom track; assign a new color from colorblind friendly scale
        currentTrack = line.replace('Track:', '').trim();
        trackId += 1;
        trackColor = PAUL_TOL_COLORBLIND_SCALE[trackId % PAUL_TOL_COLORBLIND_SCALE.length];
      } else if (line.startsWith('Residues:')) {
        // 5 - Parse residue ranges and convert to Nightingale fragment
        currentResidues = line.replace('Residues:', '').trim();

        const fragments = currentResidues.split(',').map((r) => {
          const [startStr, endStr] = r.trim().split('-');
          const start = parseInt(startStr);
          const end = endStr ? parseInt(endStr) : start;
          const tooltipContent = `Custom data track: ${currentTrack}<br>Residues: ${start} - ${end}`;
          return { start, end, tooltipContent };
        });

        // 6 - Add new feature to list
        const feature: NightingaleFeature = {
          accession: currentTrack,
          tooltipContent: `Custom data track: ${currentTrack}<br>Residues: ${currentResidues}`,
          locations: [{ fragments }],
          color: trackColor,
        };

        features.push(feature);

        // 7 - Reset for next block
        currentTrack = '';
        currentResidues = '';
      }
    }

    // 8 - Apply parsed feature data to Nightingale
    this.customTrackData = features;
  }
}
