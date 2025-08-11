import {
  AfterViewInit,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  NgZone,
  Renderer2,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, filter, Subject, take, tap } from 'rxjs';
import * as NightingaleManager from '@nightingale-elements/nightingale-manager';
import * as NightingaleSequence from '@nightingale-elements/nightingale-sequence';
import * as NightingaleNavigation from '@nightingale-elements/nightingale-navigation';

// Necessary lines added to avoid tree shaking of Nightingale components
const _nightingaleRefs = [NightingaleManager, NightingaleSequence, NightingaleNavigation];

import { Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';
import { MaterialModule } from '@pdbc/core';

import {
  APIConservationData,
  APITrackData,
  APITrackFragment,
  APIVariationData,
  ConservationTrackBlockComponent,
  MapCustomDataPanelComponent,
  NestedTrackBlockComponent,
  PanelResidueDatum,
  PvFixedHighlightService,
  PvTooltipService,
  SearchResiduePanelComponent,
  TrackBlockComponent,
  VariationTrackBlockComponent,
} from '@pdbe-lib/pv-nightingale-components';

import { extractAllTooltips, extractBiophysicalResources, extractDomainResources, extractOtherTracks, sequenceToPanelData } from './pv-entry-api-processing';
import { handleBarSrc, PAUL_TOL_COLORBLIND_SCALE } from '../../../entry-constant';
import { PDBMolstarEvent } from './event-models/pdbe-molstar-events.model';
import { PDBTopolViewerEvent } from './event-models/pdbe-topol-events.model';
import { EntryActions } from '../../../store/entry.actions';
import { EntrySelectors } from '../../../store/entry.selectors';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

/**
 * Helper to decode rawHTML from API endpoints (tooltipContent)
 */
function decodeHtml(html: string): string {
  const txt = document.createElement('textarea');
  txt.innerHTML = html.replace(/'/g, `"`);
  return txt.value;
}

/**
 * Test cases:
 *
 * 1trn modification,
 * 4v99 high chains;
 * 3jb9 high residues;
 * 102l mutations;
 * 1cbs no variation;
 * 7v08 multiple entities with RNA;
 */
export interface FixedSelectionInput {
  trackName: string;
  trackSegments: string; // e.g. "10-20,25-25,50-51"
  trackTooltip: string;
}

@Component({
  selector: 'pdbc-entry-pg-protvista',
  imports: [
    CommonModule,
    MaterialModule,
    SearchResiduePanelComponent,
    MapCustomDataPanelComponent,
    TrackBlockComponent,
    NestedTrackBlockComponent,
    ConservationTrackBlockComponent,
    VariationTrackBlockComponent,
    NgxSkeletonLoaderModule,
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
  // for protein specific parsing
  public readonly isNucleic = input<boolean>(false);
  // for fixed tracks on top
  public readonly fixedSelectionInput = input<FixedSelectionInput | undefined>(undefined);

  // Inject required Angular services / extra dynamic manipulation
  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private zone = inject(NgZone);

  // State boolean variables indicating API loading and sequence loading
  public readonly loadedTracksAPIData = signal<boolean>(false);
  public readonly loadedConservationAPIData = signal<boolean>(false);
  public readonly loadedVariationAPIData = signal<boolean>(false);
  public readonly sequenceIsLoaded = signal<boolean>(false);

  public readonly loadingStatus = computed(() => {
    if (this.invalidVisualisation()) {
      return 'invalid';
    }
    if (!this.loadedTracksAPIData() || !this.loadedConservationAPIData() || !this.loadedVariationAPIData()) {
      return 'loading';
    }
    return 'ready';
  });

  public loadedAllData() {
    return this.loadedTracksAPIData() && this.loadedVariationAPIData() && this.loadedConservationAPIData();
  }

  // all Nightingale tracks require sequence and/or sequence length
  public sequence?: string;
  public sequenceLength?: number;

  // most API data gets converted into track names and lists (TrackBlockComponent)
  public uniprotTracks = signal<NightingaleFeature[] | null>([]);
  public validationTracks = signal<NightingaleFeature[] | null>([]);
  public rfamTracks = signal<NightingaleFeature[] | null>([]);
  public secStrTracks = signal<NightingaleFeature[] | null>([]);
  public ligandBindingTracks = signal<NightingaleFeature[] | null>([]);
  public interfacesTracks = signal<NightingaleFeature[] | null>([]);

  readonly trackBlocks = computed(() => [
    { name: 'UniProt', data: this.uniprotTracks() },
    { name: 'Validation', data: this.validationTracks() },
    { name: 'Secondary structure', data: this.secStrTracks() },
    { name: 'Ligand binding sites', data: this.ligandBindingTracks() },
    { name: 'Interaction interfaces', data: this.interfacesTracks() },
  ]);

  // this also includes custom data from the user
  public customTrackData: NightingaleFeature[] = [];

  // or fixed selections from input
  public fixedSelectionData = signal<NightingaleFeature[] | null>(null);

  // some API data gets converted into nested track names and lists (NestedTrackBlockComponent)
  public domainResourcesList = signal<string[]>([]);
  public domainsByResource = signal<NightingaleFeature[][]>([]);

  public biophysicalResourcesList = signal<string[]>([]);
  public biophysicalByResource = signal<NightingaleFeature[][]>([]);

  readonly trackNestedBlocks = computed(() => {
    const domainsTrackName = this.isNucleic() ? 'Families' : 'Domains';
    return [
      { name: domainsTrackName, dataNames: this.domainResourcesList(), data: this.domainsByResource() },
      { name: 'Biophysical parameters', dataNames: this.biophysicalResourcesList(), data: this.biophysicalByResource() },
    ];
  });

  // storage
  private readonly globalStore = inject(Store<EntryStoreState>);

  private readonly trackUniprotMapping$ = this.globalStore.select(EntrySelectors.entityPvUniprot);
  private readonly trackChains$ = this.globalStore.select(EntrySelectors.entityPvChains);
  private readonly trackDomains$ = this.globalStore.select(EntrySelectors.entityPvDomains);
  private readonly trackRfam$ = this.globalStore.select(EntrySelectors.entityPvRfam);
  private readonly trackSecondaryStructure$ = this.globalStore.select(EntrySelectors.entityPvSecondaryStructure);
  private readonly trackBindingSites$ = this.globalStore.select(EntrySelectors.entityPvBindingSites);
  private readonly trackInterfaces$ = this.globalStore.select(EntrySelectors.entityPvInterfaces);
  private readonly trackAnnotations$ = this.globalStore.select(EntrySelectors.entityPvAnnotations);
  private readonly trackConservation$ = this.globalStore.select(EntrySelectors.entityPvConservation);
  private readonly trackVariation$ = this.globalStore.select(EntrySelectors.entityPvVariation);

  public readonly dataIsParsed = signal<boolean>(false);
  public invalidVisualisation = signal<boolean>(false);
  private readonly trackCoreProcessed$ = new Subject<void>();

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

      this.globalStore.dispatch(EntryActions.clearEntityProtvistaData());

      // wait for DOM to stabilize before reload
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.resetVisualization();
      });
    });

    effect(() => {
      const fixedInput = this.fixedSelectionInput();
      this.setupFixedSelectionTrack();
    });
  }

  setupFixedSelectionTrack() {
    const fixedInput = this.fixedSelectionInput();
    if (!fixedInput) {
      this.fixedSelectionData.set(null);
      return;
    }

    const features: NightingaleFeature[] = [];

    const { trackName, trackSegments, trackTooltip } = fixedInput;

    const fragments = trackSegments.split(',').map((segment) => {
      const [startStr, endStr] = segment.trim().split('-');
      const start = parseInt(startStr);
      const end = endStr ? parseInt(endStr) : start;

      return {
        start,
        end,
        tooltipContent: trackTooltip,
      };
    });

    features.push({
      accession: trackName,
      tooltipContent: trackTooltip,
      locations: [{ fragments }],
      color: '#B5CB93', // optional: you can also allow FixedSelectionInput to provide color if needed
    });

    this.fixedSelectionData.set(features);
  }

  setupTooltipServices() {
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
  }

  getProtvistaData(entityId: string) {
    // 1 - Dispatch all protvista track fetches
    this.globalStore.dispatch(EntryActions.getEntryProtvistaUniprotMapping({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaChains({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaDomains({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaRfam({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaSecondaryStructure({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaBindingSites({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaInterfaces({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaAnnotations({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaConservation({ entityId }));
    this.globalStore.dispatch(EntryActions.getEntryProtvistaVariation({ entityId }));
    this.dataIsParsed.set(false);
  }

  allTracksReadyCheck(
    uniprot: APITrackData | null | undefined,
    chains: APITrackData | null | undefined,
    domains: APITrackData | null | undefined,
    rfam: APITrackData | null | undefined,
    secondary: APITrackData | null | undefined,
    binding: APITrackData | null | undefined,
    interfaces: APITrackData | null | undefined,
    annotations: APITrackData | null | undefined
  ) {
    const allDefined =
      uniprot !== undefined &&
      chains !== undefined &&
      domains !== undefined &&
      rfam !== undefined &&
      secondary !== undefined &&
      binding !== undefined &&
      interfaces !== undefined &&
      annotations !== undefined;

    if (allDefined === false) return false;
    const allContainData =
      (uniprot === null || Object.keys(uniprot).length > 0) &&
      (chains === null || Object.keys(chains).length > 0) &&
      (domains === null || Object.keys(domains).length > 0) &&
      (rfam === null || Object.keys(rfam).length > 0) &&
      (secondary === null || Object.keys(secondary).length > 0) &&
      (binding === null || Object.keys(binding).length > 0) &&
      (interfaces === null || Object.keys(interfaces).length > 0) &&
      (annotations === null || Object.keys(annotations).length > 0);
    return allContainData;
  }

  processProtvistaData() {
    combineLatest([
      this.trackUniprotMapping$,
      this.trackChains$,
      this.trackDomains$,
      this.trackRfam$,
      this.trackSecondaryStructure$,
      this.trackBindingSites$,
      this.trackInterfaces$,
      this.trackAnnotations$,
    ])
      .pipe(
        tap(([uniprot, chains, domains, rfam, secondary, binding, interfaces, annotations]) => {
          // detect whether all data sources return undefined, null or an error (at least one needed)
          const trackSources = [uniprot, chains, domains, rfam, secondary, binding, interfaces, annotations];
          const allAreNull = trackSources.every((track) => track === null);
          const allEmpty = trackSources.every((resp) => {
            const anyResp = resp as any;
            return anyResp.empty === true;
          });
          if (allAreNull || allEmpty) {
            this.invalidVisualisation.set(true);
          }
        }),
        filter(([uniprot, chains, domains, rfam, secondary, binding, interfaces, annotations]) =>
          this.allTracksReadyCheck(uniprot, chains, domains, rfam, secondary, binding, interfaces, annotations)
        ),
        take(1) // only once
      )
      .subscribe(([uniprot, chains, domains, rfam, secondary, binding, interfaces, annotations]) => {
        const uniprotData = (uniprot as any)?.empty ? null : uniprot;
        const chainsData = (chains as any)?.empty ? null : chains;
        const domainsData = (domains as any)?.empty ? null : domains;
        const rfamData = (rfam as any)?.empty ? null : rfam;
        const secondaryData = (secondary as any)?.empty ? null : secondary;
        const bindingData = (binding as any)?.empty ? null : binding;
        const interfacesData = (interfaces as any)?.empty ? null : interfaces;
        const annotationsData = (annotations as any)?.empty ? null : annotations;

        // At this point everything is loaded → safe to process
        const trackDataArray: (APITrackData | null)[] = [uniprotData, chainsData, domainsData, rfamData, secondaryData, bindingData, interfacesData, annotationsData];

        this.setSequenceFromTrackData(trackDataArray);

        const uniprotTracks = extractOtherTracks('UniProt', uniprotData);
        this.uniprotTracks.set(uniprotTracks);

        const validationTracks = extractOtherTracks('Validation', chainsData);
        this.validationTracks.set(validationTracks);

        const secStrTracks = extractOtherTracks('Secondary structure', secondaryData);
        this.secStrTracks.set(secStrTracks);

        const ligandBindingTracks = extractOtherTracks('Ligand binding sites', bindingData);
        this.ligandBindingTracks.set(ligandBindingTracks);

        const interfacesTracks = extractOtherTracks('Interaction interfaces', interfacesData);
        this.interfacesTracks.set(interfacesTracks);

        const tooltips = extractAllTooltips(trackDataArray);
        const panelResidueData = sequenceToPanelData(this.sequence!, uniprotTracks || undefined, this.isNucleic());

        for (const [k, v] of Object.entries(tooltips)) {
          this.tooltips[k] = v;
        }
        this.panelResidueData = panelResidueData;

        if (domainsData || rfamData) {
          const domainsProcessed = extractDomainResources(domainsData, rfamData);
          this.domainResourcesList.set(domainsProcessed.domainResourcesList);
          this.domainsByResource.set(domainsProcessed.domainsByResource);
        } else {
          this.domainResourcesList.set([]);
          this.domainsByResource.set([]);
        }

        if (secondaryData) {
          const biophysicalProcessed = extractBiophysicalResources(secondaryData);
          this.biophysicalResourcesList.set(biophysicalProcessed.biophysicalResourcesList);
          this.biophysicalByResource.set(biophysicalProcessed.biophysicalByResource);
        } else {
          this.biophysicalResourcesList.set([]);
          this.biophysicalByResource.set([]);
        }

        this.loadedTracksAPIData.set(true);
        this.trackCoreProcessed$.next(); // signal that core data is processed
      });

    combineLatest([this.trackCoreProcessed$, this.trackConservation$, this.trackVariation$]).subscribe(([_, conservationData, variationData]) => {
      let preProcessedConservationData: APIConservationData | undefined = conservationData;
      if (Object.keys(conservationData).length === 0) preProcessedConservationData = undefined;
      this.originalConservationData.set(preProcessedConservationData);
      this.loadedConservationAPIData.set(true);

      let preProcessedVariationData: APIVariationData | undefined = variationData;
      if (Object.keys(variationData).length === 0) preProcessedVariationData = undefined;
      this.originalVariationData.set(preProcessedVariationData);
      this.loadedVariationAPIData.set(true);
    });
  }

  reloadVisualisation() {
    this.setupFixedSelectionTrack();
    this.setupTooltipServices();
    const entityId = this.entityId();
    this.getProtvistaData(entityId);
    this.processProtvistaData();
  }

  async ngAfterViewInit() {
    this.reloadVisualisation();
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
      // left was previously calculated based on button position
      // const left = btnRect.left - hostRect.left;

      const top = 0; // fixed to very top of host (absolute position)
      const left = 70;

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
      // left was previously calculated based on button position
      // const left = btnRect.left - hostRect.left;

      const top = 0; // fixed to very top of host (absolute position)
      const left = 70;

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
    this.uniprotTracks.set([]);
    this.validationTracks.set([]);
    this.rfamTracks.set([]);
    this.secStrTracks.set([]);
    this.ligandBindingTracks.set([]);
    this.interfacesTracks.set([]);
    this.domainResourcesList.set([]);
    this.domainsByResource.set([]);
    this.biophysicalResourcesList.set([]);
    this.biophysicalByResource.set([]);

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
    // setTimeout(() => {
    this.reloadVisualisation();
    // }, 100);
  }

  setSequenceFromTrackData(trackDataArray: (APITrackData | null)[]) {
    const allAreNull = trackDataArray.every((track) => track === null);
    if (allAreNull) {
      console.warn('Missing enough data to start Nightingale components');
      return;
    }

    // 1 - Extract sequence from all track records (skip nulls)
    const seqs = trackDataArray.filter((eachTrackDatum) => eachTrackDatum !== null).map((eachTrackDatum) => eachTrackDatum.sequence);

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

  // @HostListener('document:PDB.litemol.mouseover', ['$event'])
  @HostListener('document:smartSeqViewerMouseover', ['$event'])
  @HostListener('document:PDB.topologyViewer.mouseover', ['$event'])
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
    } else if (event.type === 'smartSeqViewerMouseover') {
      const customEvent = event as CustomEvent;
      const eventData = customEvent.detail?.eventData;
      eventEntryId = this.entryId();
      eventEntityId = eventData?.entityId;
      eventChainId = eventData?.chainId;
      eventResNumber = eventData?.residueNumber;
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

  @HostListener('document:smartSeqViewerMouseout', ['$event'])
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

  @HostListener('smartSeqViewerSelect', ['$event'])
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
    } else if (event.type === 'smartSeqViewerSelect') {
      const eventData = (event as any).eventData;
      eventEntryId = this.entryId();
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
    const idxOfResidue = selectedResidues.indexOf(`Index: ${eventResNumber}`);
    if (idxOfResidue === -1) selectedResidues.push(`Index: ${eventResNumber}`);
    // ... or remove from selection list if unselection
    else selectedResidues.splice(idxOfResidue, 1);
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

    const eventObj2 = new CustomEvent('new-protvista-click', {
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
    document.dispatchEvent(eventObj2);
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

        // 2.5 - Use fragment or feature color if available
        // (but only for ranges with more than 1 residue)
        if (fragment.color && fragment.start !== fragment.end) {
          color = fragment.color;
        }
        if (!color && feature.color && fragment.start !== fragment.end) {
          color = feature.color;
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
