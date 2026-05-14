/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, PopupWindowService, UtilService } from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { FixedSelectionInput, ProtvistaWrapperComponent } from '@pdbe-lib/pv-nightingale-components';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { ComponentExpressionT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { Molecule } from '../../data-models/molecule.model';
import { DEFAULT_DOMAIN_HIGHLIGHT_COLOR, entryDomainsTooltips, resourceUrls, symmOperatorTooltip } from '../../entry-constant';
import { Dropdown, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams, QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import { createAuthAlternateNumbering, generateSeqViewerDomainAnnotation, getNonObserved } from '../../helpers/procesing-for-smart-seq-viewer';
import { getCleanSelectionName, getDomainChainDropdownOptions, getDomainSequenceDetail } from '../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { SequenceDetail } from '../../store/data-processing/models/other-models';
import { ProcessedDomain } from '../../store/data-processing/models/processed-entities.model';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { PvDataProcessingFacade } from '../shared/entry-pv-nightingale/pv-entry-api.facade';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';

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
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly processedDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomains));

  public readonly tabDataLoaded = computed(() => this.processedDomains() !== undefined);
  public selectedChains?: string;

  public dropdown = new Dropdown<{ authAsymId: string; molstarSelection: QueryParamForHelpers[]; inPrefAssembly: boolean; symmOperators: string[] }>();
  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>();

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);

  public inPrefAssembly = computed(() => {
    const domain = this.currentDomainsDatum();
    if (!domain) return true;
    return domain.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  });

  public inPrefAssemblyForChain = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No chain selected -> true (no warning to display)

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined); // TODO: to computed?
  public protvistaDomainSelection = signal<FixedSelectionInput | undefined>(undefined);
  public backgroundAnnotation = computed<SmartSequenceAnnotation | undefined>(() => {
    const domain = this.currentDomainsDatum();
    if (!domain) return undefined;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (!chainId) return undefined;
    return generateSeqViewerDomainAnnotation(this.entryId() ?? '', domain, chainId);
  });

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.visInteractivity.currentMolstarComponent = this._molstarComponent;
      this.molstarReady.set(true);
    }
  }
  private molstarFirstRenderFinished = computed(() => this.molstarReady() && this._molstarComponent!.firstLoadFinished());

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

  private readonly preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForChain() ? this.preferredAssemblyId() : undefined));

  public readonly configForMolstar = computed(() => EntryPageTabsCommonMolstarParams);

  private authAsymIdToMacromolecule = computed(() => {
    const out: { [authAsymId: string]: Molecule } = {};
    for (const macromolecule of this.macromolecules() ?? []) {
      for (const authAsymId of macromolecule.in_chains) {
        out[authAsymId] = macromolecule;
      }
    }
    return out;
  });

  public sequenceDetail = computed<SequenceDetail | undefined>(() => {
    const domain = this.currentDomainsDatum();
    if (!domain) return undefined;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (!chainId) return undefined;
    const macromolecule = this.authAsymIdToMacromolecule()?.[chainId];
    if (!macromolecule) return undefined;

    return getDomainSequenceDetail(this.entryId() ?? '', macromolecule, domain, chainId);
  });

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

    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });
  }

  private readonly mvsSnapshotSpec$ = new BehaviorSubject<SnapshotSpec | undefined>(undefined);

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

  async triggerDomainUpdateSideEffects(domain: ProcessedDomain) {
    // reset alt sequences
    this.altSequences.set([]);

    // refreshes dropdown options on new macromolecule
    this.updateDropdownOptions(domain);
    this.updateSymmetryDropdownOptions();

    // get chainId
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return;

    // get author numbering
    this.getAuthorNumberingForChain(chainId);

    // update visualisations with data
    this.renderVisualisations(domain, chainId);
  }

  private updateDropdownOptions(domain: ProcessedDomain) {
    const options = getDomainChainDropdownOptions(domain);
    type DropdownOption = DomainsTabComponent['dropdown']['options'][number]; // TODO: @adam type like this in all tabs
    this.dropdown.updateOptions(
      Object.keys(options).map((name, idx): DropdownOption => {
        const authAsymId = domain.additionalData.selections[idx][0].auth_asym_id;
        if (authAsymId === undefined) throw new Error('authAsymId is undefined');
        return {
          name: name,
          url: `domain-${idx + 1}`,
          downloadable: false,
          data: {
            authAsymId,
            molstarSelection: options[name],
            inPrefAssembly: domain.additionalData.selectionsInPrefAssembly[idx],
            symmOperators: domain.symmOpListForSegments[idx],
          },
        };
      })
    );
  }

  private updateSymmetryDropdownOptions() {
    const segmentSymmOperators = this.dropdown.selectedOption()?.data.symmOperators ?? [];
    type SymmetryDropdownOption = DomainsTabComponent['symmetryDropdown']['options'][number];
    this.symmetryDropdown.updateOptions(
      segmentSymmOperators.map(
        (op, idx): SymmetryDropdownOption => ({
          name: op,
          url: `domain-0-symop-${idx + 1}`,
          downloadable: false,
          data: { instanceId: op !== 'All' ? op : undefined },
        })
      )
    );
  }

  private getAuthorNumberingForChain(chainId: string) {
    this.globalStore.dispatch(
      EntryActions.getResidueListing({
        chainId: chainId,
      })
    );
  }

  public async onDropdownSelect(event: string) {
    this.dropdown.select(event);
    this.updateSymmetryDropdownOptions();

    // reset alt sequences
    this.altSequences.set([]);

    const domain = this.currentDomainsDatum();
    if (!domain) return;

    // get chainId
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return;

    // get macromolecules for domain
    const chainsOfDomainSegments = domain.additionalData.boundaries.map((bd) => bd.chain);
    const chainsOfDomain = chainsOfDomainSegments.filter((v, i, arr) => arr.indexOf(v) === i);
    const macromoleculesOfDomain = this.macromolecules()!.filter((eachMacromolecule) => {
      const chainsOfMacromolecule = eachMacromolecule.in_chains;
      return chainsOfDomain.some((ch) => chainsOfMacromolecule.includes(ch));
    });

    // get author numbering for chain
    this.getAuthorNumberingForChain(chainId);

    this.renderVisualisations(domain, chainId);
  }

  public onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);

    const instance_id = this.selectedInstanceId();
    this.visInteractivity.selectedSymOpInstanceId.set(instance_id);

    const domain = this.currentDomainsDatum();
    if (!domain) return;
    const chainId = this.dropdown.selectedOption()?.data.authAsymId;
    if (chainId === undefined) return;
    this.renderVisualisations(domain, chainId);
  }

  private renderVisualisations(domain: ProcessedDomain, chainId: string) {
    this.renderInMolstar(domain);
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

  public getCleanSelectionName = getCleanSelectionName;

  private async renderInMolstar(domain: ProcessedDomain) {
    this.mvsSnapshotSpec$.next(this.getMvsSnapshotSpec(domain));
  }

  private getMvsSnapshotSpec(domain: ProcessedDomain): SnapshotSpec | undefined {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const assemblyId = this.displayedAssemblyId();
    const instanceId = this.selectedInstanceId();

    return {
      name: 'Domain',
      kind: 'pdbconnect_domains',
      params: {
        entry: entryId,
        assemblyId,
        domains: [
          {
            name: domain.additionalData.accession,
            color: DEFAULT_DOMAIN_HIGHLIGHT_COLOR,
            selector: domain.additionalData.boundaries.map(
              (segment) =>
                ({
                  auth_asym_id: segment.chain,
                  beg_label_seq_id: segment.start,
                  end_label_seq_id: segment.end,
                  instance_id: instanceId,
                }) satisfies ComponentExpressionT
            ),
          },
        ],
        focus: true,
        volumeStreaming: true,
      },
    };
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
        color: DEFAULT_DOMAIN_HIGHLIGHT_COLOR,
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
