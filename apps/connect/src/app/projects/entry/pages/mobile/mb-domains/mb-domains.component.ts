import { Component, computed, inject, OnInit, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { resourceUrls } from '../../../entry-constant';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, take, timer } from 'rxjs';
import { clearSelectionInMolstar, drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../../helpers/molstar-helpers';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import { MobileStateService } from '../mobile-state.service';
import { EntryActions } from '../../../store/entry.actions';
import { ProcessedDomain } from '../../../store/data-processing/models/processed-entities.model';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-domains',
  imports: [CommonModule],
  templateUrl: './mb-domains.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-domains.component.scss'],
})
export class MbDomainsComponent implements OnInit {
  private readonly state = inject(MobileStateService);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly processedDomainsObs$ = this.globalStore.select(EntrySelectors.processedDomains);
  public readonly processedDomains = toSignal(this.globalStore.select(EntrySelectors.processedDomains));

  public readonly resourceUrls = resourceUrls;

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;
  public selectedDomain = signal<any>({});
  public expanded = signal<boolean>(false);
  public title = this.state.domainTitle;

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;

  public readonly domainTableRows = computed(() => {
    const rows = this.processedDomains();
    if (rows === undefined) return [];
    return rows;
  });

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbDomainsComponent>) {
    this.processedDomainsObs$
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        filter((hasDom) => hasDom !== undefined)
      )
      .subscribe(async (hasDom) => {
        // Wait until mobileMolstarLoaded$ is true before proceeding
        await firstValueFrom(
          this.compCommunication.mobileMolstarLoaded$.pipe(
            filter((ready) => ready), // Proceed only when it's true
            take(1) // Take the first value, then complete
          )
        );
        this.renderInMolstar(undefined);
      });
  }
  ngOnInit(): void {
    // /* 1. Fetch data */
    // this.globalStore.dispatch(EntryActions.getSummaryData());
    // this.globalStore.dispatch(EntryActions.getAssemblies());
    // this.globalStore.dispatch(EntryActions.getCathMapping());
    // this.globalStore.dispatch(EntryActions.getPfamMapping());
    // this.globalStore.dispatch(EntryActions.getScop175Mapping());
    // this.globalStore.dispatch(EntryActions.getEntryPolymerCoverage());
    // this.globalStore.dispatch(EntryActions.getEntryMolecules());
    // this.globalStore.dispatch(EntryActions.getProcessedDomains());
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getSummaryData,
      EntryActions.getAssemblies,
      EntryActions.getCathMapping,
      EntryActions.getPfamMapping,
      EntryActions.getScop175Mapping,
      EntryActions.getEntryPolymerCoverage,
      EntryActions.getEntryMolecules,
      EntryActions.getProcessedDomains,
    ]);
  }

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  public async closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.state.updateSelectedComponent(null);
    this.state.updateSelectedTabName('');
  }

  public navigateToDetail(data: ProcessedDomain) {
    this.currentViewState.set(ViewState.Detail);
    this.selectedDomain.set(data);
    this.state.updateSelectedDomainTitle(data.accessionName);
    this.updateCurrentDomain();
  }

  private async updateCurrentDomain(): Promise<void> {
    const selection = this.selectedDomain().additionalData.selections[0];
    this.renderInMolstar(this.selectedDomain());
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.state.updateSelectedDomainTitle('Domains');
    this.renderInMolstar(undefined);
  }

  private selectionData?: QueryParam[];

  private async renderInMolstar(domain?: ProcessedDomain) {
    await firstValueFrom(
      this.compCommunication.mobileMolstarLoaded$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    const durationMs = this.compCommunication.mobileMolstar ? 200 : 0;
    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;

    if (!domain) {
      if (this.compCommunication.mobileMolstarDisplay === 'domains') return;
      await clearSelectionInMolstar(instance, durationMs);
      this.compCommunication.mobileMolstarDisplay = 'domains';
      return;
    }

    // TODO: Add domain dropdown to mobile domains too
    const molstarSelection = domain.additionalData.selections[0];
    const domainColor = '#B5CB93'; // domain.molstarColorHex;
    this.selectionData = molstarSelection.map((eachSelection) => {
      return {
        ...eachSelection,
        color: domainColor,
        focus: true,
      };
    });

    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData, '#FEFEFE');
    });
    this.compCommunication.mobileMolstarDisplay = 'domains-specific';
  }

  public getDomainUrl(domain?: ProcessedDomain) {
    if (!domain) return '';
    if (domain.resource.includes('SCOP')) return resourceUrls[domain.resource];
    return resourceUrls[domain.resource] + domain.additionalData?.accession;
  }
}
