import { computed, inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { APIConservationData, APITrackData, APIVariationData, PanelResidueDatum } from '@pdbe-lib/pv-nightingale-components';
import { EntryActions } from '../../../store/entry.actions';
import { combineLatest, filter, map, of, take } from 'rxjs';
import { extractBiophysicalResources, extractDomainResources, extractOtherTracks, extractTooltips, sequenceToPanelData } from './pv-entry-api-processing';
import { type Feature as NightingaleFeature } from '@nightingale-elements/nightingale-track';

@Injectable({
  providedIn: 'root',
})
export class PvDataProcessingFacade {
  // storage
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly trackUniprotMapping$ = this.globalStore.select(EntrySelectors.entityPvUniprot);
  private readonly trackChains$ = this.globalStore.select(EntrySelectors.entityPvChains);
  private readonly trackDomains$ = this.globalStore.select(EntrySelectors.entityPvDomains);
  private readonly trackRfam$ = this.globalStore.select(EntrySelectors.entityPvRfam);
  private readonly trackSecondaryStructure$ = this.globalStore.select(EntrySelectors.entityPvSecondaryStructure);
  private readonly trackBindingSites$ = this.globalStore.select(EntrySelectors.entityPvBindingSites);
  private readonly trackInterfaces$ = this.globalStore.select(EntrySelectors.entityPvInterfaces);
  // private readonly trackAnnotations$ = this.globalStore.select(EntrySelectors.entityPvAnnotations);
  private readonly trackConservation$ = this.globalStore.select(EntrySelectors.entityPvConservation);
  private readonly trackVariation$ = this.globalStore.select(EntrySelectors.entityPvVariation);

  // most API data gets converted into track names and lists
  public uniprotTracks = signal<NightingaleFeature[] | null>([]);
  public validationTracks = signal<NightingaleFeature[] | null>([]);
  public rfamTracks = signal<NightingaleFeature[] | null>([]);
  public secStrTracks = signal<NightingaleFeature[] | null>([]);
  public ligandBindingTracks = signal<NightingaleFeature[] | null>([]);
  public interfacesTracks = signal<NightingaleFeature[] | null>([]);
  // ... some API data gets converted into nested track names and lists
  public domainResourcesList = signal<string[]>([]);
  public domainsByResource = signal<NightingaleFeature[][]>([]);
  public biophysicalResourcesList = signal<string[]>([]);
  public biophysicalByResource = signal<NightingaleFeature[][]>([]);
  // ... some API data has it's own format and processing
  public originalConservationData = signal<APIConservationData | undefined>(undefined);
  public originalVariationData = signal<APIVariationData | undefined>(undefined);

  // some API data from tracks is saved in a tooltips dictionary
  public tooltips = signal<{ [key: string]: string }>({});

  // sequence and/or sequence length for Nightingale tracks
  public sequence = signal<string | undefined>(undefined);
  public sequenceLength?: number;
  // data for the modals
  public panelResidueData: PanelResidueDatum[] = [];

  // State boolean variables indicating API loading and sequence loading
  public readonly dataIsParsed = signal<boolean>(false);
  // state for all tracks, conservation, variation
  public readonly loadedAnyTracksAPIData = signal<boolean>(false);
  public readonly loadedConservationAPIData = signal<boolean>(false);
  public readonly loadedVariationAPIData = signal<boolean>(false);
  // state for sequence loading
  public readonly sequenceIsLoaded = signal<boolean>(false);
  // loading status per each track (used for aggregated states below)
  public readonly loadingStatusPerTrack = signal<{
    [key: string]: string;
  }>({
    uniprot: 'not-loaded',
    validation: 'not-loaded',
    domains: 'not-loaded',
    rfam: 'not-loaded',
    secondary: 'not-loaded',
    binding: 'not-loaded',
    interfaces: 'not-loaded',
    variation: 'not-loaded',
    conservation: 'not-loaded',
  });
  // aggregated state when all tracks loaded
  public readonly loadedAllTracksAPIData = computed(() => {
    const status = this.loadingStatusPerTrack();
    return Object.values(status).every((s) => s !== 'not-loaded');
  });
  // aggregated state when all tracks loaded with no data
  public readonly invalidVisualisation = computed(() => {
    if (!this.loadedAllTracksAPIData()) return false;
    const status = this.loadingStatusPerTrack();
    return Object.values(status).every((s) => s.startsWith('ready-empty'));
  });

  // aggregated state as string
  public readonly loadingStatus = computed(() => {
    if (this.invalidVisualisation()) {
      return 'invalid';
    }
    if (this.loadedAnyTracksAPIData() || this.loadedConservationAPIData() || this.loadedVariationAPIData()) {
      return 'any-tracks-loaded';
    }
    if (!this.loadedAnyTracksAPIData() && !this.loadedConservationAPIData() && !this.loadedVariationAPIData()) {
      return 'no-tracks-loaded';
    }
    return 'ready';
  });

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
  }

  checkTrackIsReady(track: APITrackData | null | undefined): boolean {
    // not ready yet → still undefined
    if (track === undefined) return false;

    // track is null → means “loaded but no data” → still considered ready
    if (track === null) return true;

    // empty object or flagged empty → treat as ready but no data
    if ((track as any).empty === true) return true;
    if (Object.keys(track).length === 0) return true;

    // otherwise has some data → ready
    return true;
  }

  setSequenceFromTrackData(trackData: APITrackData | null) {
    if (!trackData) return;
    // 3 - If not already set, update sequence and length (used by Nightingale)
    if (this.sequenceIsLoaded() === false) {
      const sequence = trackData.sequence;
      this.sequence.set(sequence);
      this.sequenceLength = this.sequence.length;
      this.sequenceIsLoaded.set(true);
    } else if (trackData.sequence !== this.sequence()) {
      console.warn('Unexpected: sequence is not equal for all track data. Using first track sequence');
    }
  }

  processProtvistaData(currentEntityId: string, isNucleic: boolean) {
    const clean = (data: APITrackData | null) => ((data as any)?.empty ? null : data);

    // --- UniProt
    this.trackUniprotMapping$
      .pipe(
        map((m) => m[currentEntityId]),
        filter((d) => this.checkTrackIsReady(d)),
        take(1) // only once
      )
      .subscribe((uniprot) => {
        const uniprotData = clean(uniprot);
        this.setSequenceFromTrackData(uniprotData);
        this.uniprotTracks.set(extractOtherTracks('UniProt', uniprotData));

        const tooltips = extractTooltips(uniprotData);
        this.tooltips.update((current) => ({ ...current, ...tooltips }));

        const sequence = this.sequence()!;
        const panelResidueData = sequenceToPanelData(sequence, this.uniprotTracks() || undefined, isNucleic);
        this.panelResidueData = panelResidueData;

        const hasData = uniprotData === null ? 'empty' : 'has-data';
        this.loadingStatusPerTrack.update((state) => ({ ...state, uniprot: `ready-${hasData}` }));
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Validation (chains)
    this.trackChains$
      .pipe(
        map((m) => m[currentEntityId]),
        filter((d) => this.checkTrackIsReady(d)),
        take(1)
      )
      .subscribe((chains) => {
        const chainsData = clean(chains);
        this.setSequenceFromTrackData(chainsData);
        this.validationTracks.set(extractOtherTracks('Validation', chainsData));

        const tooltips = extractTooltips(chainsData);
        this.tooltips.update((current) => ({ ...current, ...tooltips }));

        const hasData = chainsData === null ? 'empty' : 'has-data';
        this.loadingStatusPerTrack.update((state) => ({ ...state, validation: `ready-${hasData}` }));
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Domains + Rfam (nested block)
    combineLatest([
      this.trackDomains$,
      isNucleic ? this.trackRfam$ : of({} as any), // if not nucleic, emit empty object once
    ])
      .pipe(
        map(([domainsMap, rfamMap]) => {
          const domains = domainsMap[currentEntityId];
          const rfam = isNucleic ? rfamMap[currentEntityId] : null;
          return { domains, rfam };
        }),
        filter(({ domains, rfam }) => (isNucleic ? this.checkTrackIsReady(domains) && this.checkTrackIsReady(rfam) : this.checkTrackIsReady(domains))),
        take(1)
      )
      .subscribe(({ domains, rfam }) => {
        const domainsData = clean(domains);
        const rfamData = isNucleic ? clean(rfam) : null;
        this.setSequenceFromTrackData(domainsData);
        this.setSequenceFromTrackData(rfamData);

        if (domainsData || rfamData) {
          const processed = extractDomainResources(domainsData, rfamData);
          this.domainResourcesList.set(processed.domainResourcesList);
          this.domainsByResource.set(processed.domainsByResource);
        } else {
          this.domainResourcesList.set([]);
          this.domainsByResource.set([]);
        }
        if (domainsData) {
          const tooltipsDomains = extractTooltips(domainsData);
          this.tooltips.update((current) => ({ ...current, ...tooltipsDomains }));
        }
        if (rfamData) {
          const tooltipsRfam = extractTooltips(rfamData);
          this.tooltips.update((current) => ({ ...current, ...tooltipsRfam }));
        }

        const hasDataDomains = domainsData === null ? 'empty' : 'has-data';
        const hasDataRfam = rfamData === null ? 'empty' : 'has-data';
        this.loadingStatusPerTrack.update((state) => ({ ...state, domains: `ready-${hasDataDomains}` }));
        this.loadingStatusPerTrack.update((state) => ({ ...state, rfam: `ready-${hasDataRfam}` }));
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Secondary structure
    this.trackSecondaryStructure$
      .pipe(
        map((m) => m[currentEntityId]),
        filter((d) => this.checkTrackIsReady(d)),
        take(1)
      )
      .subscribe((sec) => {
        const secondaryData = clean(sec);
        this.setSequenceFromTrackData(secondaryData);
        const secTracks = extractOtherTracks('Secondary structure', secondaryData);
        this.secStrTracks.set(secTracks);

        if (secondaryData) {
          const biophysical = extractBiophysicalResources(secondaryData);
          this.biophysicalResourcesList.set(biophysical.biophysicalResourcesList);
          this.biophysicalByResource.set(biophysical.biophysicalByResource);
        } else {
          this.biophysicalResourcesList.set([]);
          this.biophysicalByResource.set([]);
        }
        // TODO: split secondary vs biophysical
        const hasData = secondaryData === null ? 'empty' : 'has-data';
        this.loadingStatusPerTrack.update((state) => ({ ...state, secondary: `ready-${hasData}` }));

        const tooltips = extractTooltips(secondaryData);
        this.tooltips.update((current) => ({ ...current, ...tooltips }));
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Binding sites
    this.trackBindingSites$
      .pipe(
        map((m) => m[currentEntityId]),
        filter((d) => this.checkTrackIsReady(d)),
        take(1)
      )
      .subscribe((binding) => {
        const bindingData = clean(binding);
        this.setSequenceFromTrackData(bindingData);
        this.ligandBindingTracks.set(extractOtherTracks('Ligand binding sites', bindingData));

        const tooltips = extractTooltips(bindingData);
        this.tooltips.update((current) => ({ ...current, ...tooltips }));

        const hasData = bindingData === null ? 'empty' : 'has-data';
        this.loadingStatusPerTrack.update((state) => ({ ...state, binding: `ready-${hasData}` }));
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Interfaces
    this.trackInterfaces$
      .pipe(
        map((m) => m[currentEntityId]),
        filter((d) => this.checkTrackIsReady(d)),
        take(1)
      )
      .subscribe((interfaces) => {
        const interfacesData = clean(interfaces);
        this.setSequenceFromTrackData(interfacesData);
        this.interfacesTracks.set(extractOtherTracks('Interaction interfaces', interfacesData));

        const tooltips = extractTooltips(interfacesData);
        this.tooltips.update((current) => ({ ...current, ...tooltips }));

        const hasData = interfacesData === null ? 'empty' : 'has-data';
        this.loadingStatusPerTrack.update((state) => ({ ...state, interfaces: `ready-${hasData}` }));
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Annotations
    // this.trackAnnotations$
    //   .pipe(
    //     map(m => m[currentEntityId]),
    //     filter(d => this.checkTrackIsReady(d)),
    //     take(1)
    //   )
    //   .subscribe(annotations => {
    //     const annotationsData = clean(annotations);
    //     this.setSequenceFromTrackData(annotationsData);

    //     const tooltips = extractTooltips(annotationsData);
    //     for (const [k, v] of Object.entries(tooltips)) this.tooltips[k] = v;
    //   });

    // --- Variation
    this.trackVariation$
      .pipe(
        filter((variationMap) => Object.keys(variationMap).length > 0),
        take(1)
      ) // only once
      .subscribe((variationMap) => {
        let preProcessedVariationData: APIVariationData | undefined = undefined;
        let processVarData = true;
        if (!variationMap[`${currentEntityId}`]) {
          processVarData = false;
        }
        if (processVarData && (variationMap[`${currentEntityId}`] as any).empty) {
          processVarData = false;
        }
        if (processVarData) preProcessedVariationData = variationMap[currentEntityId];
        this.originalVariationData.set(preProcessedVariationData);

        const hasData = preProcessedVariationData !== undefined ? 'has-data' : 'empty';
        this.loadingStatusPerTrack.update((state) => ({ ...state, variation: `ready-${hasData}` }));
        this.loadedVariationAPIData.set(true);
        if (this.loadedAnyTracksAPIData() === false) {
          this.loadedAnyTracksAPIData.set(true);
        }
      });

    // --- Conservation
    this.trackConservation$
      .pipe(
        filter((conservationMap) => Object.keys(conservationMap).length > 0),
        take(1)
      ) // only once
      .subscribe((conservationMap) => {
        let preProcessedConservationData: APIConservationData | undefined = undefined;
        let processConsData = true;
        if (!conservationMap[`${currentEntityId}`]) {
          processConsData = false;
        }
        if (processConsData && (conservationMap[`${currentEntityId}`] as any).empty) {
          processConsData = false;
        }
        if (processConsData) preProcessedConservationData = conservationMap[currentEntityId];
        this.originalConservationData.set(preProcessedConservationData);

        const hasData = preProcessedConservationData !== undefined ? 'has-data' : 'empty';
        this.loadingStatusPerTrack.update((state) => ({ ...state, conservation: `ready-${hasData}` }));
        this.loadedConservationAPIData.set(true);
      });
  }

  processNewData(entityId: string, isNucleic: boolean) {
    // 1 - Reset per-track loading statuses
    this.loadingStatusPerTrack.set({
      uniprot: 'not-loaded',
      validation: 'not-loaded',
      domains: 'not-loaded',
      rfam: 'not-loaded',
      secondary: 'not-loaded',
      binding: 'not-loaded',
      interfaces: 'not-loaded',
      variation: 'not-loaded',
      conservation: 'not-loaded',
    });

    // 2 - Reset all API-loaded flags
    this.loadedConservationAPIData.set(false);
    this.loadedVariationAPIData.set(false);
    this.sequenceIsLoaded.set(false);
    this.dataIsParsed.set(false);

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

    this.sequence.set(undefined);
    this.sequenceLength = undefined;
    this.tooltips.set({});
    const aaProbsTooltip = 'The amino acid probabilities are calculated using HMM profiles based on multiple sequence alignments. Click to see more details...';
    this.tooltips.update((current) => ({ ...current, ...{ 'aa-probs': aaProbsTooltip } }));
    this.panelResidueData = [];

    // 3 - Clear original conservation/variation signal data
    this.originalVariationData.set(undefined);
    this.originalConservationData.set(undefined);

    // 4 - Retrieve new data
    this.getProtvistaData(entityId);
    this.processProtvistaData(entityId, isNucleic);
  }
}
