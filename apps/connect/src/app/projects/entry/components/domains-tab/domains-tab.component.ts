/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import {
  DomainsBoundaries,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesRowData,
} from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarOverviewForTopPage } from '../../helpers/molstar/molstar-overview-for-top-page';
import { getDomainChainsAsString } from '../../helpers/processed-data-to-controls';
import { DomainsFacade } from './domains.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { EntryPgProtvistaComponent, FixedSelectionInput } from '../shared/entry-pv-nightingale/entry-pv-nightingale.component';
import { UtilService } from '@pdbc/core';
import { entryDomainsTooltips, resourceUrls } from '../../entry-constant';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarStateService } from '../../services/molstar-state.service';
import { ActionQueueService } from '../../services/action-queue.service';

// these types are used by this file and the facade and related to sequence rendering
export type BoundsByEntityId = {
  [key: number]: DomainsBoundaries[];
};

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
  imports: [CommonModule, EntryPgProtvistaComponent, InteractiveTablesComponent, NgxSkeletonLoaderModule, HelpIconWithTooltipComponent],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent {
  public domainsFacade = inject(DomainsFacade);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly utilService = inject(UtilService);
  public molstarVisualisation = inject(MolstarOverviewForTopPage);
  public readonly molstarState = inject(MolstarStateService);
  private readonly actionQueue = inject(ActionQueueService);

  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public selectedChains?: string;
  public currentProtvistaEntity = signal<string | undefined>(undefined);
  public currentProtvistaChain = signal<string | undefined>(undefined);
  public protvistaDomainSelection = signal<FixedSelectionInput | undefined>(undefined);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));

  public sequenceDetails: SequenceDetail[] = [];

  public readonly resourceUrls = resourceUrls;
  public readonly entryDomainsTooltips = entryDomainsTooltips;

  public readonly selectedDomainIdx = toSignal(this.compCommunication.domainSelection$);

  public readonly domainTableRows = computed(() => {
    const isLoaded = this.compCommunication.hasProcessedDomains();
    if (!isLoaded) return [];
    return this.compCommunication.processedDomainsAsList;
  });

  private previousDatumIdx?: number;
  public currentDomainsDatum = computed(() => {
    const selectedIdx = this.selectedDomainIdx() ?? 0;
    const rows = this.domainTableRows();
    const datum = rows[selectedIdx];
    if (!datum) return;

    if (selectedIdx === this.previousDatumIdx) return datum;
    this.previousDatumIdx = selectedIdx;

    if (datum) {
      this.triggerDomainUpdateSideEffects(datum);
    }
    return datum;
  });

  async triggerDomainUpdateSideEffects(domain: DomainsRowData) {
    // update unique chains inside object
    const mappedDatum = domain.additionalData.boundaries.map((b: any) => b.chain);
    const uniqueChains = [...new Set(mappedDatum)];
    domain.mappedboundaries = uniqueChains;
    this.selectedChains = getDomainChainsAsString(domain);

    // update displayed domain sequence
    this.sequenceDetails = this.domainsFacade.getDomainSequenceDetails(this.entryId() ?? '', this.macromolecules() ?? [], domain);

    // update visualisations with data
    await this.renderInMolstar(domain);
    this.initOrRefreshProtvista(domain);
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private async renderInMolstar(domain: DomainsRowData) {
    this.actionQueue.addAction(
      `renderMolstarForDomains-${domain.domain}_${domain.segmentsAsText}`,
      async () => {
        await this.molstarState.renderMolstarForDomains(domain);
      },
      false // skippable
    );
  }

  private initOrRefreshProtvista(domain: DomainsRowData) {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    const entityId = domain.additionalData.boundaries[0].entity;
    let chainId: string | undefined = undefined;

    // if a domain is composed of single chain, we set it for Protvista
    const chains = (domain as DomainsRowData).additionalData.boundaries.map((boundary) => boundary.chain);
    const allSame = chains.every((chain) => chain === chains[0]);
    if (allSame) chainId = chains[0];

    const segments = domain.additionalData.boundaries
      .filter((boundary) => boundary.chain === chainId)
      .map((boundary) => {
        return `${boundary.start}-${boundary.end}`;
      })
      .join(',');

    this.currentProtvistaEntity.set(`${entityId}`);
    this.currentProtvistaChain.set(chainId);
    this.protvistaDomainSelection.set({
      trackName: 'Current Domain',
      trackSegments: segments,
      trackTooltip: 'Current Domain',
    });
  }
}
