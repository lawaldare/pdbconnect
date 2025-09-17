/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { getDomainChainDropdownOptions, getDomainSequenceDetails } from '../../helpers/processed-data-to-controls';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { EntryPgProtvistaComponent, FixedSelectionInput } from '../shared/entry-pv-nightingale/entry-pv-nightingale.component';
import { GoogleAnalyticsService, PopupWindowService, UtilService } from '@pdbc/core';
import { entryDomainsTooltips, resourceUrls, tourIds } from '../../entry-constant';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, take, timer } from 'rxjs';
import { createAuthAlternateNumbering, generateSeqViewerDomainAnnotation, getNonObserved } from '../../helpers/procesing-for-smart-seq-viewer';
import { EntryActions } from '../../store/entry.actions';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { drawSelectionInMolstar, Molstar370DefaultParams, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';
import { SequenceDetail } from '../../store/data-processing/models/other-models';
import { VisualisationInteractivityService } from '../../services/vis-interactivity-service';
import { Molecule } from '../../data-models/molecule.model';
import { ProcessedDomain } from '../../store/data-processing/models/processed-entities.model';
import { TutorialTourService } from '../../services/tutorial-tour.service';

@Component({
  selector: 'pdbc-domains-tab',
  standalone: true,
  imports: [
    CommonModule,
    EntryDropdownComponent,
    EntryPgProtvistaComponent,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    HelpIconWithTooltipComponent,
    SmartSeqViewerComponent,
    MolstarComponent,
  ],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent implements AfterViewInit {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly gAS = inject(GoogleAnalyticsService);
  public readonly visInteractivity = inject(VisualisationInteractivityService);
  public readonly popService = inject(PopupWindowService);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

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
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

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

  public readonly configForMolstar = computed(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: preferredAssemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      landscape: true,
      subscribeEvents: true,
      granularity: 'residue',
      hideControls: true,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'uniform',
          colorParams: { value: 0xfefefe },
        },
      },
    };

    return configForMolstar;
  });

  public sequenceDetails = signal<SequenceDetail[]>([]);

  public readonly resourceUrls = resourceUrls;
  public readonly entryDomainsTooltips = entryDomainsTooltips;

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

  public readonly tutorialTourService = inject(TutorialTourService);
  private processedDomainsWithMacrols = toSignal(this.globalStore.select(EntrySelectors.processedDomainsWithMacromols));
  public hasLoadedDomains = computed(() => this.processedDomainsWithMacrols() !== undefined);
  public hasDomains = computed(() => {
    const rows = this.processedDomains();
    const procWithMacro = this.processedDomainsWithMacrols();
    if (procWithMacro === undefined) return false;
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tutorialTourService.hasDomains.set(this.hasDomains());
      const agreed = this.tutorialTourService.getCookie(tourIds.domains);
      if (!agreed && this.hasDomains()) {
        this.isBannerCookies.set(true);
      }
    }, 500);
  }

  public startDomainsTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.domainTabTourSteps);
  }

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

    // get chainId
    const chainId = this.dropdownSelected?.split('Chain ')[1];

    // get macromolecule
    const macromoleculesOfDomain = this.macromolecules()!.filter((eachMacromolecule) => domain.moleculeNames[0] === eachMacromolecule.molecule_name[0]);

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

  public onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // reset alt sequences
    this.altSequences.set([]);

    const domain = this.currentDomainsDatum();
    if (!domain) return;

    // get chainId
    const chainId = this.dropdownSelected?.split('Chain ')[1];

    // get macromolecule
    const chainsOfDomain = domain.additionalData.boundaries.map((bd) => bd.chain).filter((v, i, arr) => arr.indexOf(v) === i);

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
    this.gAS.logEntryPageEvents('ep_copy_seq', {
      tab: 'domains',
    });
  }

  public selectionData?: QueryParam[];

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
    this.selectionData = molstarSelection.map((eachSelection) => {
      return {
        ...eachSelection,
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
  }
}
