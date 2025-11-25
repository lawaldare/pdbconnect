/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { annotationsTooltips, resourceUrls } from '../../../entry-constant';
import { RichTooltipDirective } from '@pdbc/rich-tooltip';
import { TruncateTextDirective } from '../../../directives/truncate-text.directive';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { Filter, TableNames } from '../../../store/data-processing/models/other-models';
import { EntryActions } from '../../../store/entry.actions';
import { MacromoleculeUICard } from '../../../store/data-processing/macromolecule-processing';
import { LigandOrModUICard } from '../../../store/data-processing/ligand-processing';
import { DomainUICard } from '../../../store/data-processing/domain-processing';
import { AssemblyUICard } from '../../../store/data-processing/assembly-processing';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '@pdbc/core';
@Component({
  selector: 'pdbc-interactive-tables',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RichTooltipDirective, TruncateTextDirective, MaterialModule],
  templateUrl: './interactive-tables.component.html',
  styleUrl: './interactive-tables.component.scss',
})
export class InteractiveTablesComponent implements OnInit {
  public readonly tabName = input.required<TableNames>();

  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly globalStore = inject(Store<EntryStoreState>);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly resourceUrls = resourceUrls;
  public readonly annotationsTooltips: any = annotationsTooltips;

  public selectedRowCard = signal<any>({});
  public selectedFilter = signal<Filter>({} as Filter);
  public startNumber = signal<number>(1);

  public assembliesFiltersObs = this.globalStore.select(EntrySelectors.procAssembliesFilters);
  public assembliesCardsObs = this.globalStore.select(EntrySelectors.procAssembliesCards);

  public macromoleculesFiltersObs = this.globalStore.select(EntrySelectors.procMacromoleculesFilters);
  public macromoleculesCardsObs = this.globalStore.select(EntrySelectors.procMacromoleculesCards);

  public ligandsAndModsFiltersObs = this.globalStore.select(EntrySelectors.procLigandsFilters);
  public ligandsAndModsCardsObs = this.globalStore.select(EntrySelectors.procLigandsCards);

  public domainsFiltersObs = this.globalStore.select(EntrySelectors.procDomainsFilters);
  public domainsCardsObs = this.globalStore.select(EntrySelectors.procDomainsCards);

  public llmCardsObs = this.globalStore.select(EntrySelectors.procLLMCards);

  public filters = signal<Filter[]>([]);
  public originalRowCards = signal<any>([]);
  public rowCards = signal<any>([]);

  ngOnInit(): void {
    if (this.tabName() === 'Macromolecules') {
      this.globalStore.dispatch(EntryActions.getProcMacromoleculesCards());
      this.macromoleculesCardsObs.subscribe((macromoleculesCards) => {
        if (macromoleculesCards !== undefined) this.setCards(macromoleculesCards);
      });

      this.globalStore.dispatch(EntryActions.getProcMacromoleculesFilters());
      this.macromoleculesFiltersObs.subscribe((macromoleculesFilters) => {
        if (macromoleculesFilters !== undefined) this.setFilters(macromoleculesFilters);
      });
    } else if (this.tabName() === 'Ligands') {
      this.globalStore.dispatch(EntryActions.getProcLigandsCards());
      this.ligandsAndModsCardsObs.subscribe((ligandsAndModsCards) => {
        if (ligandsAndModsCards !== undefined) this.setCards(ligandsAndModsCards);
      });

      this.globalStore.dispatch(EntryActions.getProcLigandsFilters());
      this.ligandsAndModsFiltersObs.subscribe((ligandsAndModsFilters) => {
        if (ligandsAndModsFilters !== undefined) this.setFilters(ligandsAndModsFilters);
      });
    } else if (this.tabName() === 'Domains') {
      this.globalStore.dispatch(EntryActions.getProcDomainsCards());
      this.domainsCardsObs.subscribe((domainsCards) => {
        if (domainsCards !== undefined) this.setCards(domainsCards);
      });

      this.globalStore.dispatch(EntryActions.getProcDomainsFilters());
      this.domainsFiltersObs.subscribe((domainsFilters) => {
        if (domainsFilters !== undefined) this.setFilters(domainsFilters);
      });
    } else if (this.tabName() === 'Complexes') {
      this.globalStore.dispatch(EntryActions.getProcAssembliesCards());
      this.assembliesCardsObs.subscribe((assembliesCards) => {
        if (assembliesCards !== undefined) this.setCards(assembliesCards);
      });

      this.globalStore.dispatch(EntryActions.getProcAssembliesFilters());
      this.assembliesFiltersObs.subscribe((assembliesFilters) => {
        if (assembliesFilters !== undefined) this.setFilters(assembliesFilters);
      });
    } else if (this.tabName() === 'LLM') {
      this.globalStore.dispatch(EntryActions.getProcLLMCards());
      this.llmCardsObs.subscribe((llmCards) => {
        if (llmCards !== undefined) this.setCards(llmCards);
      });
    }
    this.setSelectedAssemblyFromComplexPage();
  }

  private setSelectedAssemblyFromComplexPage(): void {
    if (localStorage['assemblyId']) {
      const assemblyId = localStorage.getItem('assemblyId');
      const card = this.rowCards().find((c: any) => c.assemblyId === assemblyId);
      if (card) {
        this.onCardClick(card, 'id');
        setTimeout(() => {
          localStorage.removeItem('assemblyId');
        }, 5000);
      }
    }
  }

  private setCards(cards: AssemblyUICard[] | LigandOrModUICard[] | MacromoleculeUICard[] | DomainUICard[]) {
    this.originalRowCards.set([...cards]);
    this.rowCards.set([...cards]);
    this.route.queryParams.subscribe((params) => {
      const value = Object.values(params)[1];

      let activeCard: any = null;
      let activeIndex = 0;

      if (value) {
        switch (this.tabName()) {
          case 'Complexes':
            activeCard = this.rowCards().find((c: any) => c.assemblyId == value);
            activeIndex = this.rowCards().findIndex((c: any) => c.assemblyId == value);
            break;
          case 'Macromolecules':
            activeCard = this.rowCards().find((c: any) => c.entityId == value);
            activeIndex = this.rowCards().findIndex((c: any) => c.entityId == value);
            break;
          case 'Ligands':
            activeCard = this.rowCards().find((c: any) => c.chemCompId == value);
            activeIndex = this.rowCards().findIndex((c: any) => c.chemCompId == value);
            break;
          case 'Domains':
            activeCard = this.rowCards().find((c: any) => c.index == value);
            activeIndex = this.rowCards().findIndex((c: any) => c.index == value);
            break;
          case 'LLM':
            activeCard = this.rowCards().find((c: any) => c.entityId == value);
            activeIndex = this.rowCards().findIndex((c: any) => c.entityId == value);
            break;
          default:
            console.warn('No tab name found');
            break;
        }

        this.selectedRowCard.set(activeCard);
        this.loadSelectionFromTable(activeIndex);
      } else {
        this.selectedRowCard.set(this.rowCards()[0]);
        this.loadSelectionFromTable(0);
      }
    });
  }

  private setFilters(filters: Filter[]) {
    this.filters.set(filters);
    this.selectedFilter.set(this.filters()[0]);
  }

  public onCardClick(card: any, queryParam: string): void {
    let queryParamValue = '';

    switch (this.tabName()) {
      case 'Complexes':
        queryParamValue = card.assemblyId;
        break;
      case 'Macromolecules':
        queryParamValue = card.entityId;
        break;
      case 'Ligands':
        queryParamValue = card.chemCompId;
        break;
      case 'Domains':
        queryParamValue = card.index;
        break;
      case 'LLM':
        queryParamValue = card.entityId;
        break;
      default:
        console.warn('No tab name found');
        break;
    }

    const activeTab = this.tabName().toLowerCase();

    this.router.navigate([], {
      queryParams: { activeTab, [queryParam]: queryParamValue },
      queryParamsHandling: '',
    });

    this.selectedRowCard.set(card);
    this.loadSelectionFromTable(card.index);
  }

  onChangePage(num: number): void {
    const p = (num - 1) * 10;
    this.startNumber.set(num);
    this.selectedRowCard.set(this.rowCards()[p]);
    this.loadSelectionFromTable(this.rowCards()[p].index);
  }

  public loadSelectionFromTable(rowIdx: number) {
    if (this.tabName() === 'Complexes') this.compCommunication.assemblySelection$.next(rowIdx);
    if (this.tabName() === 'Macromolecules') this.compCommunication.macromoleculeSelection$.next(rowIdx);
    if (this.tabName() === 'Ligands') this.compCommunication.ligandSelection$.next(rowIdx);
    if (this.tabName() === 'Domains') this.compCommunication.domainSelection$.next(rowIdx);
    if (this.tabName() === 'LLM') this.compCommunication.llmSelection$.next(rowIdx);
  }

  public applyFilter(obj: any, tabName: string): void {
    // function enables triggering external table filters
    this.selectedFilter.set(obj);
    this.startNumber.set(1);

    if (tabName === 'Macromolecules') {
      const filteredCards = [...this.originalRowCards()].filter((card) => obj.types.includes((<MacromoleculeUICard>card).molType));
      this.rowCards.update(() => [...filteredCards]);
    }

    if (tabName === 'Ligands') {
      const filteredCards = [...this.originalRowCards()].filter((card) => obj.types.includes((<LigandOrModUICard>card).molType));
      this.rowCards.update(() => [...filteredCards]);
    }

    if (tabName === 'Domains') {
      const filteredCards = [...this.originalRowCards()].filter((card) => obj.types.includes((<DomainUICard>card).resource));
      this.rowCards.update(() => [...filteredCards]);
    }

    this.selectedRowCard.set(this.rowCards()[0]);
    this.loadSelectionFromTable(this.rowCards()[0].index);
  }
}
