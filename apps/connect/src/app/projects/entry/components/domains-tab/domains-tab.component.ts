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
import { EntryPgProtvistaComponent } from '../shared/entry-pv-nightingale/entry-pv-nightingale.component';
import { UtilService } from '@pdbc/core';
import { resourceUrls } from '../../entry-constant';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';

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
  imports: [CommonModule, EntryPgProtvistaComponent, InteractiveTablesComponent, NgxSkeletonLoaderModule],
  templateUrl: './domains-tab.component.html',
  styleUrl: './domains-tab.component.scss',
})
export class DomainsTabComponent {
  public domainsFacade = inject(DomainsFacade);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly utilService = inject(UtilService);
  public molstarVisualisation = inject(MolstarOverviewForTopPage);
  public molstarFirstRenderFinished = computed(() => this.compCommunication.molstarFirstRenderFinished());

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public selectedChains?: string;
  public currentProtvistaEntity = signal<string | undefined>(undefined);
  public currentProtvistaChain = signal<string | undefined>(undefined);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));

  public sequenceDetails: SequenceDetail[] = [];

  public readonly resourceUrls = resourceUrls;

  public readonly domainTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();

    if (isLoaded) {
      const tabData = this.compCommunication.getTabData('Domains');
      const datum = tabData.tableRows() as any[];
      // console.log('Domains table rows:', datum);
      return datum;
    }
    return [];
  });

  public currentDomainsDatum = computed(() => {
    let selectedIdx = this.compCommunication.tabState()['Domains'] ?? 0;
    if (selectedIdx === 'Main') selectedIdx = 0;
    return this.domainTableRows()[selectedIdx as number];
  });

  constructor() {
    effect(async () => {
      const molstarFirstRenderFinished = this.molstarFirstRenderFinished();

      const hasMacromoleculesData = Object.keys(this.compCommunication.tabTableData()).indexOf('Macromolecules') > -1;
      const hasLigandsData = Object.keys(this.compCommunication.tabTableData()).indexOf('Ligands') > -1;

      // do not render dashboard until molstar first page render is finished
      if (!molstarFirstRenderFinished) return;

      // do not render dashboard until data necessary to check molstar state not loaded
      if (!hasMacromoleculesData) return;
      if (!hasLigandsData) return;
      if (!this.currentDomainsDatum()) return;

      const datum = this.currentDomainsDatum();

      const mappedDatum = datum.additionalData.boundaries.map((b: any) => b.chain);
      const uniqueChains = [...new Set(mappedDatum)];
      datum.mappedboundaries = uniqueChains;
      // data processing facade is used to get selectedChains (displayed as text in template)
      // this.selectedChains = this.detailsDashboardFacade.getDomainChains(datum);
      this.selectedChains = getDomainChainsAsString(datum);
      // ...and sequence annotated with domain positions
      this.sequenceDetails = this.domainsFacade.getDomainSequenceDetails(this.entryId() ?? '', this.macromolecules() ?? [], datum);

      await this.renderInMolstar();
      this.initOrRefreshProtvista();
    });
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private async renderInMolstar() {
    const datum = this.currentDomainsDatum();

    const macromoleculesData = this.compCommunication.getTabData('Macromolecules').tableRows() as MacromoleculesRowData[];
    const ligandsRawData = this.compCommunication.getTabData('Ligands').tableRows() as LigandsRowData[];
    const ligandsData = ligandsRawData.filter((lig) => lig.type === 'ligand');
    const modificationsData = ligandsRawData.filter((lig) => lig.type === 'modification');

    // if Domains config not loaded, load it
    if (!this.molstarVisualisation.currentViewName.includes('Tab-Domains')) {
      await this.molstarVisualisation.checkDomainsReady();
      await this.molstarVisualisation.checkAndCreateComponents(macromoleculesData, ligandsData, modificationsData);
    }
    this.molstarVisualisation.currentViewName = `Tab-Domains/${datum.domain}_${datum.segmentsAsText}`;
    await this.molstarVisualisation.renderTabsDomains(datum.additionalData.selections[0]);
  }

  private initOrRefreshProtvista() {
    // stop if this dashboard does not have protvista (initially false and then set in onTableRowSelection according to tabName input)
    const datum = this.currentDomainsDatum();
    const entityId = datum.additionalData.boundaries[0].entity;
    let chainId: string | undefined = undefined;

    // if a domain is composed of single chain, we set it for Protvista
    const chains = (datum as DomainsRowData).additionalData.boundaries.map((boundary) => boundary.chain);
    const allSame = chains.every((chain) => chain === chains[0]);
    if (allSame) chainId = chains[0];

    this.currentProtvistaEntity.set(`${entityId}`);
    this.currentProtvistaChain.set(chainId);
  }
}
