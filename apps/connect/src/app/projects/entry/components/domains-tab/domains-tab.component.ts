/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { DomainsRowData, MacromoleculesRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { getDomainChainDropdownOptions } from '../../helpers/processed-data-to-controls';
import { DomainsFacade } from './domains.facade';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { EntryPgProtvistaComponent, FixedSelectionInput } from '../shared/entry-pv-nightingale/entry-pv-nightingale.component';
import { PopupWindowService, UtilService } from '@pdbc/core';
import { entryDomainsTooltips, resourceUrls } from '../../entry-constant';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { AlternativeNumbering, SmartSequenceAnnotation, SmartSeqViewerComponent } from '@pdbe-lib/smart-seq-viewer';
import { combineLatest, debounceTime, distinctUntilChanged, filter, firstValueFrom, take, timer } from 'rxjs';
import { createAuthAlternateNumbering } from '../../helpers/procesing-for-smart-seq-viewer';
import { EntryActions } from '../../store/entry.actions';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { MolstarComponent, MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { Color } from 'molstar/lib/mol-util/color';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { domainMolstarSelObjToQueryParam } from '../../helpers/temp-mol-sel-obj-to-queryparam';
import { PARENT_COMPONENT_TOKEN } from '../../directives/visualisation-interactivity.directive';
import { drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';

// these types are used by this file and the facade and related to sequence rendering
export interface SequenceDetail {
  title: string;
  fullSequence: string;
  segments: {
    sequence: string;
    color?: string;
  }[];
}

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
  providers: [{ provide: PARENT_COMPONENT_TOKEN, useExisting: DomainsTabComponent }],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent {
  public domainsFacade = inject(DomainsFacade);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly popService = inject(PopupWindowService);
  private readonly utilService = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public selectedChains?: string;

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};

  public currentSelectionEntityId = signal<string | undefined>(undefined);
  public currentSelectionChainId = signal<string | undefined>(undefined);
  public protvistaDomainSelection = signal<FixedSelectionInput | undefined>(undefined);
  public backgroundAnnotation = signal<SmartSequenceAnnotation | undefined>(undefined);

  private molstarReady = signal(false);
  public _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.molstarReady.set(true);
    }
  }

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public readonly configForMolstar = computed<InitParams | undefined>(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar: InitParams = {
      ...DefaultParams,
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
          colorParams: { value: Color(0xfefefe) },
        },
      },
    };

    return configForMolstar;
  });

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly residueListingObs = this.globalStore.select(EntrySelectors.residueListing);
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));

  public sequenceDetails = signal<SequenceDetail[]>([]);

  public readonly resourceUrls = resourceUrls;
  public readonly entryDomainsTooltips = entryDomainsTooltips;

  public readonly selectedDomainIdx = toSignal(this.compCommunication.domainSelection$);

  public readonly domainTableRows = computed(() => {
    const isLoaded = this.compCommunication.hasProcessedDomains();
    if (!isLoaded) return [];
    return this.compCommunication.processedDomainsAsList;
  });

  public currentDomainsDatum = signal<DomainsRowData | undefined>(undefined);
  public altSequences = signal<AlternativeNumbering[]>([]);

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
    });
  }

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;

  popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.molstarContainer, 'molstar');
    }
  }

  async triggerDomainUpdateSideEffects(domain: DomainsRowData) {
    // reset alt sequences
    this.altSequences.set([]);

    // refreshes dropdown options on new macromolecule
    this.updateDropdownOptions(domain);

    // get chainId
    const chainId = this.dropdownSelected?.split('Chain ')[1];

    // get macromolecule
    const macromoleculesOfDomain = this.compCommunication.processedMacromolecules.filter(
      (eachMacromolecule) => domain.moleculeNames[0] === eachMacromolecule.name.molecule
    );

    // get author numbering
    this.getAuthorNumberingForChain(chainId);

    // updates background annotations for smart sequence viewer
    this.updateBackgroundAnnotation(domain, chainId);

    // updates sequence details
    this.updateSequenceDetails(domain, macromoleculesOfDomain, chainId);

    // update visualisations with data
    this.renderVisualisations(domain, chainId);
  }

  private updateDropdownOptions(domain: DomainsRowData) {
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

  private updateBackgroundAnnotation(domain: DomainsRowData, chainId: string) {
    this.backgroundAnnotation.set(undefined);

    const annotation = this.domainsFacade.generateSeqViewerDomainAnnotation(this.entryId() ?? '', domain, chainId);

    this.backgroundAnnotation.set(annotation);
  }

  private updateSequenceDetails(domain: DomainsRowData, macromoleculesOfDomain: MacromoleculesRowData[], chainId: string) {
    // update displayed domain sequence
    this.sequenceDetails.set(this.domainsFacade.getDomainSequenceDetails(this.entryId() ?? '', macromoleculesOfDomain, domain, chainId));
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

    const macromoleculesOfDomain = this.compCommunication.processedMacromolecules.filter((eachMacromolecule) => {
      const chainsOfMacromolecule = eachMacromolecule.additionalData.molecule.in_chains;
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

  private renderVisualisations(domain: DomainsRowData, chainId: string) {
    this.renderInMolstar(domain, chainId);
    this.initOrRefreshProtvista(domain, chainId);
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  public selectionData?: QueryParam[];

  private async renderInMolstar(domain: DomainsRowData, chainId: string) {
    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    const domainColor = '#B5CB93'; // domain.molstarColorHex;
    this.selectionData = domainMolstarSelObjToQueryParam(domain, true, domainColor);

    const durationMs = this._molstarComponent ? 1200 : 0;
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
  }

  private initOrRefreshProtvista(domain: DomainsRowData, chainId: string) {
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
    this.protvistaDomainSelection.set({
      trackName: 'Current Domain',
      trackSegments: segments,
      trackTooltip: 'Current Domain',
    });
  }
}
