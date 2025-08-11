import { AfterViewInit, Component, computed, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { DetailsDashboardFacade } from '../../../components/shared/details-dashboard.facade';
import { DomainsRowData } from '../../../data-classes/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { MobileFacade } from '../mobile.facade';
import { resourceUrls } from '../../../entry-constant';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, take, timer } from 'rxjs';
import { clearSelectionInMolstar, drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../../helpers/molstar-helpers';
import { domainMolstarSelObjToQueryParam } from '../../../helpers/temp-mol-sel-obj-to-queryparam';
import { QueryParam } from 'pdbe-molstar/lib/helpers';

@Component({
  selector: 'pdbc-mb-domains',
  imports: [CommonModule],
  templateUrl: './mb-domains.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-domains.component.scss'],
})
export class MbDomainsComponent {
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly resourceUrls = resourceUrls;

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;
  public selectedDomain = signal<any>({});
  public expanded = signal<boolean>(false);
  public title = this.mbFacade.domainTitle;

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;

  public readonly domainTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const tableData = this.signals.tabTableData();
    const hasData = Object.keys(tableData).indexOf('Domains') !== -1;

    if (isLoaded && hasData) {
      const tabData = this.signals.getTabData('Domains');
      const datum = tabData.tableRows() as DomainsRowData[];
      return datum;
    }
    return [];
  });

  private hasDomains$ = toObservable(this.compCommunication.hasProcessedDomains);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbDomainsComponent>) {
    this.hasDomains$
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        filter((hasDom) => hasDom == true)
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

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  public async closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.mbFacade.updateSelectedComponent(null);
    this.mbFacade.updateSelectedTabName('');
  }

  public navigateToDetail(data: DomainsRowData) {
    this.currentViewState.set(ViewState.Detail);
    this.selectedDomain.set(data);
    this.mbFacade.updateSelectedDomainTitle(data.accessionName);
    this.updateCurrentDomain();
  }

  private async updateCurrentDomain(): Promise<void> {
    const selection = this.selectedDomain().additionalData.selections[0];
    this.renderInMolstar(this.selectedDomain());
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.mbFacade.updateSelectedDomainTitle('Domains');
    this.renderInMolstar(undefined);
  }

  private selectionData?: QueryParam[];

  private async renderInMolstar(domain?: DomainsRowData) {
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
      await clearSelectionInMolstar(instance, durationMs);
      return;
    }

    const domainColor = '#B5CB93';
    this.selectionData = domainMolstarSelObjToQueryParam(domain, true, domainColor);

    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData, '#FEFEFE');
    });
  }
}
