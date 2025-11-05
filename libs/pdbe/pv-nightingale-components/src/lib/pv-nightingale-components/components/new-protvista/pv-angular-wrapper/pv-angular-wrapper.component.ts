import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, input, OnDestroy, output, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '@pdbc/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
import { deepClone } from './deep-clone';
import { NewProtvistaColourEvent, NewProtvistaDialogEvent } from '../pv-new-protvista/track-data.model';
import { NewProtvistaVisualisation } from '../pv-new-protvista/new-protvista-core';
import { PvZoomResiduesModalComponent } from '../../action-modals/zoom-annotations/zoom-annotations.component';
import { PvAddCustomTracksModalComponent } from '../../action-modals/add-annotations/add-annotations.component';
import { PvEditCustomTracksModalComponent } from '../../action-modals/edit-annotations/edit-annotations.component';
import { patchLigandsSequence } from './patch-ligands-sequence';

const PAUL_TOL_COLORBLIND_SCALE: string[] = ['#332288', '#117733', '#44AA99', '#88CCEE', '#DDCC77', '#CC6677', '#AA4499', '#882255'];
@Component({
  selector: 'lib-pv-angular-wrapper',
  imports: [CommonModule, PvZoomResiduesModalComponent, PvAddCustomTracksModalComponent, PvEditCustomTracksModalComponent],
  templateUrl: './pv-angular-wrapper.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './pv-angular-wrapper.component.scss',
})
export class ProtvistaWrapperComponent implements AfterViewInit, OnDestroy {
  private scriptLoader = inject(ScriptLoaderService);
  @ViewChild('containerElement', { read: ElementRef }) public containerElement!: ElementRef;

  // External inputs (read-only)
  public readonly containerId = input<string>('');
  public readonly sequence = input<string>('');
  public readonly entryId = input<string>('');
  public readonly entityId = input<string>('');
  public readonly chainId = input<string>('');
  public readonly maxHeight = input<string>('500px'); // must be in pixels or none
  public readonly data = input<any[]>([]);
  public readonly tooltips = input<{ [key: string]: string }>({});
  public readonly externalEvents = input<boolean>(true);
  public readonly customTrackControls = input<string>('');
  public readonly ligandsSeqMode = input<boolean>(false);

  // As observables
  private containerId$ = toObservable(this.containerId);
  private sequence$ = toObservable(this.sequence);
  private entryId$ = toObservable(this.entryId);
  private entityId$ = toObservable(this.entityId);
  private chainId$ = toObservable(this.chainId);
  private data$ = toObservable(this.data);
  private tooltips$ = toObservable(this.tooltips);

  // External outputs
  public addCustomTrackEvent = output<NewProtvistaDialogEvent | null>();
  public editCustomTracksEvent = output<NewProtvistaDialogEvent | null>();
  public openSearchHighlightEvent = output<NewProtvistaDialogEvent | null>();
  public colourIn3DEvent = output<NewProtvistaColourEvent | null>();

  /**
   * For EP: dialogues managed by this component
   */
  public isAddDialogOpen = false;
  public isEditDialogOpen = false;
  public isZoomDialogOpen = false;
  public seqLength?: number;
  public customTracks: any[] = [];
  public customRawData: { trackName: string; residueRanges: string }[] = [];
  private customTrackCounter = 0;

  public closeAddTrackDialog() {
    this.isAddDialogOpen = false;
  }

  public closeZoomDialog() {
    this.isZoomDialogOpen = false;
  }

  public closeEditTrackDialog() {
    this.isEditDialogOpen = false;
  }

  public mapYourData(rawData: any) {
    this.customRawData.push(rawData);
    const trackName = rawData.trackName.length >= 15 ? rawData.trackName.slice(0, 15) + '...' : rawData.trackName;
    const trackId = this.customTrackCounter++;
    const trackColor = PAUL_TOL_COLORBLIND_SCALE[trackId % PAUL_TOL_COLORBLIND_SCALE.length];

    // TODO for datum of rawData
    const segments: string[] = rawData.residueRanges.split(',');
    const fragments = segments.map((segmentString: string) => {
      let start = segmentString.trim();
      let end = segmentString.trim();
      if (segmentString.includes('-')) {
        start = start.split('-')[0];
        end = end.split('-')[1];
      }
      const tooltipContent = `
        Track name: <b>${rawData.trackName}</b><br>
        Residues: <b>${segmentString}</b>
      `;
      return {
        start: parseInt(start),
        end: parseInt(end),
        tooltipContent,
      };
    });

    const trackData = {
      id: `custom-${trackId}`,
      type: 'TrackCanvas',
      name: trackName,
      status: 'ready-has-data',
      isSticky: true,
      isCustomData: true,
      isExpandable: true,
      colourIn3DControl: false,
      positionIndex: undefined,
      rawData,
      data: [
        {
          accession: `custom-track-${trackId}`,
          label: rawData.trackName,
          color: trackColor,
          locations: [
            {
              fragments,
            },
          ],
        },
      ],
    };
    this.customTracks.push(trackData);

    const eventObj = new CustomEvent('PDBe.NewProtvista.SetCustomData', {
      detail: {
        data: this.customTracks,
      },
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(eventObj);
    this.isAddDialogOpen = false;
  }

  public async zoomAndHighlightTrack(event: any) {
    if (!this.visInstance || !this.visInstance.containerElement) return;
    // first we wait untl nightingale navigation is rendered
    const nightingaleNavigation = this.visInstance.containerElement.querySelector('nightingale-navigation');
    if (!nightingaleNavigation) return;

    // we then just dispatch events to each and let them bubble
    if (event.type === 'highlight') {
      const eventObj = new CustomEvent('change', {
        detail: {
          highlight: `${event.start}:${event.end}`,
        },
        bubbles: true,
        cancelable: true,
      });
      nightingaleNavigation.dispatchEvent(eventObj);
    }
    if (event.type === 'zoom') {
      const eventObj = new CustomEvent('change', {
        detail: {
          'display-start': event.start,
          'display-end': event.end,
        },
        bubbles: true,
        cancelable: true,
      });
      nightingaleNavigation.dispatchEvent(eventObj);
      this.isZoomDialogOpen = false;
    }
  }

  public editAnnotationsTrack(event: any) {
    const updatedCustomTracks = event.customTracks;
    this.customTracks = updatedCustomTracks;
    // this.customTracks.push(trackData);

    const eventObj = new CustomEvent('PDBe.NewProtvista.SetCustomData', {
      detail: {
        data: this.customTracks,
      },
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(eventObj);
    this.isEditDialogOpen = false;
    //add logic to update the actual tracks and do testing with various scenarios
  }

  // Instance reference to cleanup
  // private afterViewInit = false;
  private visInstance?: NewProtvistaVisualisation;

  // Loaded components state
  private hasLoadedNightingale = false;

  private visIdentity$: any;

  private visStatuses$: any;

  private subs = new Subscription();

  private NewProtvistaVisualisation: any;

  async ngAfterViewInit(): Promise<void> {
    // this.afterViewInit = true;
    // await this.initVisualisation();
    // const isBrowser = this.platform.isBrowserPlatform();
    // if (!isBrowser) {
    //   // Skip dynamic imports during SSR build
    //   return;
    // }

    await this.loadComponents();
    this.hasLoadedNightingale = true; // make explicit

    let initialIdentityEmitted = false;

    this.visIdentity$ = combineLatest([
      this.containerId$,
      this.sequence$,
      this.entryId$,
      this.entityId$,
      this.chainId$,
      this.data$.pipe(map((d) => d.map((x) => x.id))), // just the IDs
    ]).pipe(
      map(([containerId, sequence, entryId, entityId, chainId, dataIds]) => ({
        containerId,
        sequence,
        entryId,
        entityId,
        chainId,
        dataIds,
      })),
      distinctUntilChanged(
        (a, b) =>
          a.containerId === b.containerId &&
          a.sequence === b.sequence &&
          a.entryId === b.entryId &&
          a.entityId === b.entityId &&
          a.chainId === b.chainId &&
          a.dataIds.join(',') === b.dataIds.join(',')
      )
    );

    this.visStatuses$ = combineLatest([
      this.data$.pipe(map((d) => d.map((x) => ({ id: x.id, status: x.status })))),
      this.tooltips$.pipe(
        map((t) => Object.keys(t).sort().join(',')) // just track keys to detect change
      ),
    ]).pipe(
      distinctUntilChanged(
        ([dataA, tooltipKeysA], [dataB, tooltipKeysB]) =>
          dataA.length === dataB.length && dataA.every((x, i) => x.id === dataB[i].id && x.status === dataB[i].status) && tooltipKeysA === tooltipKeysB
      ),
      map(([statuses]) => statuses)
    );

    // Full re-init on identity changes
    this.subs.add(
      this.visIdentity$.subscribe(async (identity: any) => {
        if (!this.hasLoadedNightingale) return;
        if (!initialIdentityEmitted) {
          initialIdentityEmitted = true;
        }
        // console.log('Recreating visualisation', identity);

        // destroy old one
        this.visInstance?.destroy();
        this.visInstance = undefined;
        this.seqLength = undefined;

        const deepCopyData = deepClone(this.data());
        const deepCopyTooltips = deepClone(this.tooltips());

        // create new one
        this.visInstance = new this.NewProtvistaVisualisation(
          identity.containerId,
          identity.sequence,
          deepCopyData,
          identity.entryId,
          identity.entityId,
          identity.chainId,
          deepCopyTooltips,
          this.maxHeight(), // must be in pixels or none
          this.externalEvents(),
          this.customTrackControls(),
          this.ligandsSeqMode()
        );
        if (this.ligandsSeqMode() === false) this.seqLength = identity.sequence.length;
        if (this.ligandsSeqMode() === true) this.seqLength = identity.sequence.split(',').length;
        await this.visInstance!.start();

        if (this.visInstance) {
          this.subs.add(
            this.visInstance.addCustomTrack$.pipe(distinctUntilChanged()).subscribe((evt: any) => {
              this.addCustomTrackEvent.emit(evt);
              if (evt === null) return;
              this.isAddDialogOpen = true;
            })
          );

          this.subs.add(
            this.visInstance.editCustomTracks$.pipe(distinctUntilChanged()).subscribe((evt: any) => {
              this.editCustomTracksEvent.emit(evt);
              if (evt === null) return;
              this.isEditDialogOpen = true;
            })
          );

          this.subs.add(
            this.visInstance.openSearchHighlight$.pipe(distinctUntilChanged()).subscribe((evt: any) => {
              this.openSearchHighlightEvent.emit(evt);
              if (evt === null) return;
              this.isZoomDialogOpen = true;
            })
          );

          this.subs.add(this.visInstance.colourIn3D$.pipe(distinctUntilChanged()).subscribe((evt: any) => this.colourIn3DEvent.emit(evt)));
        }
      })
    );

    // Lightweight refresh on status changes
    this.subs.add(
      this.visStatuses$.pipe(debounceTime(150)).subscribe(async (statuses: any) => {
        if (!this.visInstance) return;
        // console.log('Refreshing data status', statuses);
        const deepCopyData = JSON.parse(JSON.stringify(this.data()));
        const deepCopyTooltips = JSON.parse(JSON.stringify(this.tooltips()));
        await this.visInstance.reprocessData(deepCopyData, deepCopyTooltips);
      })
    );
  }

  private async loadComponents() {
    if (this.hasLoadedNightingale) return;

    const { patchTrackCanvas } = await import('./patch-track-canvas');
    const { NewProtvistaVisualisation } = await import('../pv-new-protvista/new-protvista-core');
    this.NewProtvistaVisualisation = NewProtvistaVisualisation;

    // add components to be loaded according to data
    const dataTypes = [...new Set(this.data().map((datum) => datum.type))];
    // always load manager, navigation, sequence
    let componentsToLoadList = ['nightingale-manager', 'nightingale-navigation', 'nightingale-sequence'];
    // if (dataTypes.includes('TrackCanvas') || dataTypes.includes('NestedTrackCanvas')) {
    componentsToLoadList.push('nightingale-track-canvas');
    componentsToLoadList.push('nightingale-scrollbox');
    // }
    if (dataTypes.includes('TrackConservation')) {
      componentsToLoadList.push('nightingale-conservation-track');
      componentsToLoadList.push('nightingale-linegraph-track');
    }
    if (dataTypes.includes('TrackVariation')) {
      componentsToLoadList.push('nightingale-variation');
      componentsToLoadList.push('nightingale-linegraph-track');
    }
    if (dataTypes.includes('TrackColouredSequence')) {
      componentsToLoadList.push('nightingale-colored-sequence');
    }
    if (dataTypes.includes('TrackHeatmapSequence')) {
      componentsToLoadList.push('nightingale-sequence-heatmap');
    }
    componentsToLoadList = [...new Set(componentsToLoadList)];

    // dynamically load components if not in customElements
    for (const componentName of componentsToLoadList) {
      if (customElements.get(componentName) === undefined) {
        const version = componentName.includes('sequence-heatmap') ? '5.6.2' : '5.6.0';
        await this.scriptLoader.loadScript(`https://cdn.jsdelivr.net/npm/@nightingale-elements/${componentName}@${version}/+esm`, true);
        await customElements.whenDefined(componentName);
        // nightingale-track-canvas has one function patched to support old protvista endpoints
      }
      // patch if atoms instead of residues for sequence viewer
      if (componentName === 'nightingale-sequence' && this.ligandsSeqMode() === true) patchLigandsSequence();
      // patch for pdbe protvista endpoints
      if (componentName === 'nightingale-track-canvas' && customElements.get('nightingale-track-canvas-patched') === undefined) patchTrackCanvas();
    }
    this.hasLoadedNightingale = true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.visInstance?.destroy();
    this.visInstance = undefined;
    this.seqLength = undefined;
  }
}
