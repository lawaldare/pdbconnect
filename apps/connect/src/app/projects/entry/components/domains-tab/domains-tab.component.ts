/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { getCleanMoleculeName, getCleanSelectionName, getDomainChainDropdownOptions, getDomainSequenceDetails } from '../../helpers/processed-data-to-controls';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, PopupWindowService, UtilService } from '@pdbc/core';
import { entryDomainsTooltips, resourceUrls, symmOperatorTooltip } from '../../entry-constant';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { combineLatest, debounceTime, distinctUntilChanged, filter, first, firstValueFrom, take, timer } from 'rxjs';
import { createAuthAlternateNumbering, generateSeqViewerDomainAnnotation, getNonObserved } from '../../helpers/procesing-for-smart-seq-viewer';
import { EntryActions } from '../../store/entry.actions';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { drawSelectionInMolstar, Molstar370DefaultParams, QueryParamForHelpers, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';
import { SequenceDetail } from '../../store/data-processing/models/other-models';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { Molecule } from '../../data-models/molecule.model';
import { ProcessedDomain } from '../../store/data-processing/models/processed-entities.model';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { PvDataProcessingFacade } from '../shared/entry-pv-nightingale/pv-entry-api.facade';
import { FixedSelectionInput, ProtvistaWrapperComponent } from '@pdbe-lib/pv-nightingale-components';
@Component({
  selector: 'pdbc-domains-tab',
  standalone: true,
  imports: [
    CommonModule,
    EntryDropdownComponent,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    HelpIconWithTooltipComponent,
    SmartSeqViewerComponent,
    MolstarComponent,
    ProtvistaWrapperComponent,
  ],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly gAS = inject(GoogleAnalyticsService);
  public readonly visInteractivity = inject(VisualisationInteractivityService);
  public readonly popService = inject(PopupWindowService);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  private protvistaDataFacade = inject(PvDataProcessingFacade);
  public macromolSequence = this.protvistaDataFacade.sequence;
  public loadingStatus = this.protvistaDataFacade.loadingStatus;

  public readonly currentDomainsFeatureId = signal<string | undefined>(undefined);
  public readonly currentDomainsFeature = signal<any[] | undefined>(undefined);
  public readonly protvistaTooltips = computed(() => this.protvistaDataFacade.tooltips());
  public readonly protvistaData = computed(() => {
    const domainsByResource = this.protvistaDataFacade.domainsByResource();
    const domainResourcesList = this.protvistaDataFacade.domainResourcesList();
    const mergedDomainsList = domainsByResource.flat();

    const biophysicalResourcesList = this.protvistaDataFacade.biophysicalResourcesList();
    const biophysicalByResource = this.protvistaDataFacade.biophysicalByResource();
    const mergedBiophysicalList = biophysicalByResource.flat();

    const currentDomainsFeatureId = this.currentDomainsFeatureId();
    const currentDomainsFeature = this.currentDomainsFeature();

    return [
      {
        id: currentDomainsFeatureId,
        type: 'TrackCanvas',
        name: 'Current Domain',
        data: currentDomainsFeature,
        status: 'ready-has-data',
        isSticky: true,
        isCustomData: true,
        isExpandable: false,
        isCustomFixed: true,
      },
      {
        id: 'uniprot',
        type: 'TrackCanvas',
        name: 'UniProt',
        data: this.protvistaDataFacade.uniprotTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['uniprot'],
        // colourIn3DControl: true,
      },
      {
        id: 'validation',
        type: 'TrackCanvas',
        name: 'Validation',
        data: this.protvistaDataFacade.validationTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['validation'],
      },
      {
        id: 'secondary',
        type: 'TrackCanvas',
        name: 'Secondary structure',
        data: this.protvistaDataFacade.secStrTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['secondary'],
      },
      {
        id: 'binding',
        type: 'TrackCanvas',
        name: 'Ligand binding sites',
        data: this.protvistaDataFacade.ligandBindingTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['binding'],
      },
      {
        id: 'interfaces',
        type: 'TrackCanvas',
        name: 'Interaction interfaces',
        data: this.protvistaDataFacade.interfacesTracks(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['interfaces'],
      },
      {
        id: 'domains',
        type: 'NestedTrackCanvas',
        name: 'Domains',
        data: mergedDomainsList,
        childData: domainsByResource.map((data, i) => {
          const rawId = domainResourcesList[i];
          const sanitizedId = rawId
            .toLowerCase()
            .replace(/\s+/g, '') // remove all whitespace
            .replace(/[^a-z0-9]/g, ''); // remove anything not a–z or 0–9

          return {
            id: `${sanitizedId}_${i}`,
            name: domainResourcesList[i],
            data,
            status: this.protvistaDataFacade.loadingStatusPerTrack()['domains'],
            // colourIn3DControl: true,
          };
        }),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['domains'],
      },
      {
        id: 'biophysical',
        type: 'NestedTrackCanvas',
        name: 'Biophysical parameters',
        data: mergedBiophysicalList,
        childData: biophysicalByResource.map((data, i) => {
          const rawId = biophysicalResourcesList[i];
          const sanitizedId = rawId
            .toLowerCase()
            .replace(/\s+/g, '_') // remove all whitespace
            .replace(/[^a-z0-9]/g, ''); // remove anything not a–z or 0–9

          return {
            id: `${sanitizedId}_${i}`,
            name: biophysicalResourcesList[i],
            data,
            status: this.protvistaDataFacade.loadingStatusPerTrack()['secondary'],
          };
        }),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['secondary'],
      },
      {
        id: 'conservation',
        type: 'TrackConservation',
        name: 'Conservation',
        data: this.protvistaDataFacade.originalConservationData(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['conservation'],
      },
      {
        id: 'variation',
        type: 'TrackVariation',
        name: 'Variation',
        data: this.protvistaDataFacade.originalVariationData(),
        status: this.protvistaDataFacade.loadingStatusPerTrack()['variation'],
      },
    ];
  });

  public readonly isSidebarDisplayed = signal<boolean>(true);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly residueListingObs = this.globalStore.select(EntrySelectors.residueListing);
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly processedDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomains));

  public readonly tabDataLoaded = computed(() => this.processedDomains() !== undefined);
  public selectedChains?: string;

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {};

  public symmetryDropdownSelected?: string;
  public symmetryDropdownOptions: DownloadOption[] = [];

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);
  public protvistaDomainSelection = signal<FixedSelectionInput | undefined>(undefined);
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.visInteractivity.currentMolstarComponent = this._molstarComponent;
      this.molstarReady.set(true);
    }
  }

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public readonly fastNetworkOrForceLoad = computed(() => {
    const isSlow = this.slowNetwork();
    const forceLoad = this.compCommunication.forceLoad();
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public inPrefAssembly = signal(true);
  public inPrefAssemblyForChain = signal(true);

  public readonly configForMolstar = computed(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();
    const inPrefAssemblyForChain = this.inPrefAssemblyForChain();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';
    const assemblyId = inPrefAssemblyForChain ? preferredAssemblyId : undefined;

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId,
      subscribeEvents: true,
      granularity: 'residue',
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'uniform',
          colorParams: { value: 0xfefefe },
        },
      },
      sequencePanel: true,
    };

    return configForMolstar;
  });
  public readonly configForMolstar$ = toObservable(this.configForMolstar);

  public sequenceDetails = signal<SequenceDetail[]>([]);

  public readonly resourceUrls = resourceUrls;
  public readonly entryDomainsTooltips = entryDomainsTooltips;
  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public readonly selectedDomainIdx = toSignal(this.compCommunication.domainSelection$);

  public readonly domainTableRows = computed(() => {
    const rows = this.processedDomains();
    if (rows === undefined) return [];
    return rows;
  });

  public currentDomainsDatum = signal<ProcessedDomain | undefined>(undefined);
  public altSequences = signal<AlternativeNumbering[]>([]);
  public nonObserved = signal<number[] | undefined>(undefined);

  constructor() {
    combineLatest([this.compCommunication.domainSelection$.pipe(debounceTime(50), distinctUntilChanged()), toObservable(this.domainTableRows)])
      .pipe(
        // Wait until table rows are non-empty and index is valid
        filter(([idx, rows]) => idx !== undefined && idx !== null && rows.length > 0)
      )
      .subscribe(([idx, rows]) => {
        const datum = rows[idx!];
        if (datum) {
          this.currentDomainsDatum.set(datum);
          this.triggerDomainUpdateSideEffects(datum);
        }
      });

    this.residueListingObs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((residueListing) => {
      if (!residueListing) this.altSequences.set([]);
      const authNumbering = createAuthAlternateNumbering(residueListing);
      this.altSequences.set([authNumbering]);

      const nonObservedResidues = getNonObserved(residueListing);
      this.nonObserved.set(nonObservedResidues);
    });
  }

  @ViewChild('popoutWrapper') popoutWrapper!: ElementRef;

  public readonly tutorialTourService = inject(EntryPageTutorialTourService);
  private processedDomainsWithMacrols = toSignal(this.globalStore.select(EntrySelectors.processedDomainsWithMacromols));
  public hasLoadedDomains = computed(() => this.processedDomainsWithMacrols() !== undefined);
  public hasDomains = computed(() => {
    const rows = this.processedDomains();
    const procWithMacro = this.processedDomainsWithMacrols();
    if (procWithMacro === undefined) return false;
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.popoutWrapper, 'molstar');
    }
  }

  private async updateConfigAssemblyAndSyncMolstar(domain: ProcessedDomain, chainId: string) {
    // await until molstar first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready === true),
        first()
      )
    );
    // check if domain segments are in pref assembly based on chainId
    const inPrefAssemblyForChain = this.inPrefAssemblyForChain();
    const chainsOfDomainSegments = domain.additionalData.boundaries.map((bd) => bd.chain);
    // get list of segments for selected chain by idx
    const chainSegmentsIdx = chainsOfDomainSegments.map((chainStr, chainIdx) => (chainStr === chainId ? chainIdx : -1)).filter((idx) => idx !== -1);
    // check whether all segments in preferred assembly
    const allSegmentsInPrefAssembly = chainSegmentsIdx.every((idx) => domain.additionalData.selectionsInPrefAssembly[idx] === true);
    const changedDisplayedAssembly = inPrefAssemblyForChain !== allSegmentsInPrefAssembly;

    // setting inPrefAssemblyForChain may trigger update on configForMolstar
    this.inPrefAssemblyForChain.set(allSegmentsInPrefAssembly);

    // ... if this update is triggered
    if (changedDisplayedAssembly) {
      // wait until configForMolstar recomputes with new assembly/moleculeId
      const oldCfg = await firstValueFrom(this.configForMolstar$.pipe(take(1)));

      const newCfg = await firstValueFrom(
        this.configForMolstar$.pipe(
          filter((cfg) => cfg !== undefined && cfg !== oldCfg),
          take(1)
        )
      );

      // 2. Wait for MolstarComponent to APPLY the new config
      await firstValueFrom(
        this._molstarComponent!.configUpdated.pipe(
          filter((cfg) => JSON.stringify(cfg) === JSON.stringify(newCfg)),
          take(1)
        )
      );
    }
  }

  async triggerDomainUpdateSideEffects(domain: ProcessedDomain) {
    // reset alt sequences
    this.altSequences.set([]);

    // refreshes dropdown options on new macromolecule
    this.updateDropdownOptions(domain);
    this.updateSymmetryDropdownOptions(domain);

    // get chainId
    const chainId = this.dropdownSelected?.split('Chain ')[1].split(' <img')[0];

    // check whether chain is in pref assembly, molstar config needs update and wait for it
    await this.updateConfigAssemblyAndSyncMolstar(domain, chainId);
    // check whether any segment not in pref assembly for this domain
    const allDomainInPrefAssembly = domain.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true);
    this.inPrefAssembly.set(allDomainInPrefAssembly);

    // get macromolecule
    const macromoleculesOfDomain = this.macromolecules()!.filter((eachMacromolecule) => domain.moleculeNames[0] === getCleanMoleculeName(eachMacromolecule));

    // get author numbering
    this.getAuthorNumberingForChain(chainId);

    // updates background annotations for smart sequence viewer
    this.updateBackgroundAnnotation(domain, chainId);

    // updates sequence details
    this.updateSequenceDetails(domain, macromoleculesOfDomain, chainId);

    // update visualisations with data
    this.renderVisualisations(domain, chainId);
  }

  private updateDropdownOptions(domain: ProcessedDomain) {
    this.dropdownOptionsToMolstar = getDomainChainDropdownOptions(domain);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `domain-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];
  }

  private updateSymmetryDropdownOptions(domain: ProcessedDomain) {
    // update for symmetry operations dropdown
    const idxOfSelection = Object.keys(this.dropdownOptionsToMolstar).indexOf(this.dropdownSelected);
    const segmentSymmOperators = idxOfSelection > -1 ? domain.symmOpListForSegments[idxOfSelection] : undefined;

    if (segmentSymmOperators) {
      this.symmetryDropdownOptions = segmentSymmOperators.map((op, idx) => {
        return {
          name: op,
          url: `domain-0-symop-${idx + 1}`,
          downloadable: false,
        };
      });
      this.symmetryDropdownSelected = this.symmetryDropdownOptions.length > 0 ? this.symmetryDropdownOptions[0].name : undefined;
    } else {
      this.symmetryDropdownSelected = undefined;
      this.symmetryDropdownOptions = [];
    }
  }

  private getAuthorNumberingForChain(chainId: string) {
    this.globalStore.dispatch(
      EntryActions.getResidueListing({
        chainId: chainId,
      })
    );
  }

  private updateBackgroundAnnotation(domain: ProcessedDomain, chainId: string) {
    this.backgroundAnnotation.set(undefined);

    const annotation = generateSeqViewerDomainAnnotation(this.entryId() ?? '', domain, chainId);

    this.backgroundAnnotation.set(annotation);
  }

  private updateSequenceDetails(domain: ProcessedDomain, macromoleculesOfDomain: Molecule[], chainId: string) {
    // update displayed domain sequence
    this.sequenceDetails.set(getDomainSequenceDetails(this.entryId() ?? '', macromoleculesOfDomain, domain, chainId));
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // reset alt sequences
    this.altSequences.set([]);

    const domain = this.currentDomainsDatum();
    if (!domain) return;
    this.updateSymmetryDropdownOptions(domain);

    // get chainId
    const chainId = this.dropdownSelected?.split('Chain ')[1].split(' <img')[0];

    // check whether chain is in pref assembly, molstar config needs update and wait for it
    await this.updateConfigAssemblyAndSyncMolstar(domain, chainId);

    // get macromolecules for domain
    const chainsOfDomainSegments = domain.additionalData.boundaries.map((bd) => bd.chain);
    const chainsOfDomain = chainsOfDomainSegments.filter((v, i, arr) => arr.indexOf(v) === i);
    const macromoleculesOfDomain = this.macromolecules()!.filter((eachMacromolecule) => {
      const chainsOfMacromolecule = eachMacromolecule.in_chains;
      return chainsOfDomain.some((ch) => chainsOfMacromolecule.includes(ch));
    });

    // get author numbering for chain
    this.getAuthorNumberingForChain(chainId);

    // updates background annotations for smart sequence viewer
    this.updateBackgroundAnnotation(domain, chainId);

    // updates sequence details
    this.updateSequenceDetails(domain, macromoleculesOfDomain, chainId);

    this.renderVisualisations(domain, chainId);
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdownSelected = event;

    const instance_id = this.symmetryDropdownSelected && this.symmetryDropdownSelected !== 'All' ? this.symmetryDropdownSelected : undefined;
    this.visInteractivity.selectedSymOpInstanceId.set(instance_id);

    const domain = this.currentDomainsDatum();
    if (!domain) return;
    const chainId = this.dropdownSelected?.split('Chain ')[1].split(' <img')[0];
    await this.renderVisualisations(domain, chainId);
  }

  private renderVisualisations(domain: ProcessedDomain, chainId: string) {
    this.renderInMolstar(domain, chainId);
    this.initOrRefreshProtvista(domain, chainId);
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
    this.gAS.logPageEvents('ep_copy_seq', {
      tab: 'domains',
    });
  }

  public selectionData?: QueryParamForHelpers[];

  public getCleanSelectionName = getCleanSelectionName;

  private async renderInMolstar(domain: ProcessedDomain, chainId: string) {
    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const domainColor = '#B5CB93'; // domain.molstarColorHex;

    const instance_id = this.symmetryDropdownSelected && this.symmetryDropdownSelected !== 'All' ? this.symmetryDropdownSelected : undefined;
    this.selectionData = molstarSelection.map((eachSelection) => {
      return {
        ...eachSelection,
        instance_id,
        color: domainColor,
        focus: true,
      };
    });
    this.visInteractivity.currentSelectionData.set(this.selectionData);

    const durationMs = this._molstarComponent ? 1200 : 0;
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
  }

  private initOrRefreshProtvista(domain: ProcessedDomain, chainId: string) {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    const segmentsForChainId = domain.additionalData.boundaries.filter((boundary) => boundary.chain === chainId);

    const segments = segmentsForChainId
      .map((boundary) => {
        return `${boundary.start}-${boundary.end}`;
      })
      .join(',');

    const entityId = segmentsForChainId[0].entity;

    this.currentSelectionEntityId.set(`${entityId}`);
    this.currentSelectionChainId.set(chainId);
    this.visInteractivity.currentSelectionEntityId.set(`${entityId}`);
    this.visInteractivity.currentSelectionChainId.set(chainId);
    this.protvistaDomainSelection.set({
      trackName: 'Current Domain',
      trackSegments: segments,
      trackTooltip: 'Current Domain',
    });

    const fragments = segmentsForChainId.map((boundary) => {
      return { tooltipContent: `Custom data: ${boundary.start} - ${boundary.end}`, start: boundary.start, end: boundary.end };
    });

    const segmentsName = segmentsForChainId
      .map((boundary) => {
        return `${boundary.start}-${boundary.end}`;
      })
      .join('_');

    this.currentDomainsFeatureId.set(`fixed-custom-${entityId}-${chainId}-${segmentsName}`);
    this.currentDomainsFeature.set([
      {
        accession: 'custom-domain',
        color: '#D0DFBB',
        locations: [{ fragments }],
        label: 'Custom data',
      },
    ]);
    this.protvistaDataFacade.processNewData(`${entityId}`, false);
  }
  openedAddCustomTrack() {
    this.gAS.logPageEvents('ep_map_data', {
      tab: this.compCommunication.currentTabName() ?? '',
    });
  }
}
