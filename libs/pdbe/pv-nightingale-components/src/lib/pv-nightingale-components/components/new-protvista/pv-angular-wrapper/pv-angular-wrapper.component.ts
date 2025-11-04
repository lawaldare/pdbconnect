import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, input, OnDestroy, output, ViewChild } from '@angular/core';
// import { NewProtvistaTrackData } from '../pv-new-protvista/track-data.model';
// import { NewProtvistaVisualisation } from '../pv-new-protvista/new-protvista-core';
import { ScriptLoaderService } from '@pdbc/core';
// import { getColorByType } from '@nightingale-elements/nightingale-track';
// import { drawRange, drawSymbol, drawUnknown } from './draw-shapes';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';
// import { patchTrackCanvas } from './patch-track-canvas';
import { deepClone } from './deep-clone';
import { NewProtvistaColourEvent, NewProtvistaDialogEvent } from '../pv-new-protvista/track-data.model';

// import '@nightingale-elements/nightingale-manager';
// import '@nightingale-elements/nightingale-navigation';
// import '@nightingale-elements/nightingale-sequence';
// import '@nightingale-elements/nightingale-track-canvas';
// import '@nightingale-elements/nightingale-scrollbox';
// import '@nightingale-elements/nightingale-linegraph-track';
// import '@nightingale-elements/nightingale-conservation-track';
// import '@nightingale-elements/nightingale-variation';

@Component({
  selector: 'lib-pv-angular-wrapper',
  imports: [CommonModule],
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

  // Instance reference to cleanup
  // private afterViewInit = false;
  private visInstance?: any;

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
          this.customTrackControls()
        );
        await this.visInstance.start();

        if (this.visInstance) {
          this.subs.add(this.visInstance.addCustomTrack$.pipe(distinctUntilChanged()).subscribe((evt: any) => this.addCustomTrackEvent.emit(evt)));

          this.subs.add(this.visInstance.editCustomTracks$.pipe(distinctUntilChanged()).subscribe((evt: any) => this.editCustomTracksEvent.emit(evt)));

          this.subs.add(this.visInstance.openSearchHighlight$.pipe(distinctUntilChanged()).subscribe((evt: any) => this.openSearchHighlightEvent.emit(evt)));

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
        await this.scriptLoader.loadScript(`https://cdn.jsdelivr.net/npm/@nightingale-elements/${componentName}@5.6.0/+esm`, true);
        await customElements.whenDefined(componentName);
        // nightingale-track-canvas has one function patched to support old protvista endpoints
      }
      if (componentName === 'nightingale-track-canvas' && customElements.get('nightingale-track-canvas-patched') === undefined) patchTrackCanvas();
    }
    this.hasLoadedNightingale = true;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.visInstance?.destroy();
    this.visInstance = undefined;
  }
}
