import { AfterViewInit, Component, computed, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { DetailsDashboardFacade } from '../../../components/shared/details-dashboard/details-dashboard.facade';
import { DomainsRowData } from '../../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { MobileFacade } from '../mobile.facade';
import { resourceUrls } from '../../../entry-constant';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MolstarOverviewForTopPage } from '../../../helpers/molstar/molstar-overview-for-top-page';

@Component({
  selector: 'pdbc-mb-domains',
  imports: [CommonModule],
  templateUrl: './mb-domains.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-domains.component.scss'],
})
export class MbDomainsComponent implements AfterViewInit {
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly molstarVisualisation = inject(MolstarOverviewForTopPage);

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

    if (isLoaded) {
      const tabData = this.signals.getTabData('Domains');
      const datum = tabData.tableRows() as DomainsRowData[];
      return datum;
    }
    return [];
  });

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbDomainsComponent>) {}

  async ngAfterViewInit() {
    await this.molstarVisualisation.renderMobileMolstarInitial();
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
    await this.molstarVisualisation.renderMobileMolstarInitial();
  }

  public navigateToDetail(data: DomainsRowData) {
    this.currentViewState.set(ViewState.Detail);
    this.selectedDomain.set(data);
    this.mbFacade.updateSelectedDomainTitle(data.accessionName);
    this.init();
  }

  private async init(): Promise<void> {
    const selection = this.selectedDomain().additionalData.selections[0];
    await this.molstarVisualisation.renderTabsDomains(selection);
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.mbFacade.updateSelectedDomainTitle('Domains');
    await this.molstarVisualisation.renderMobileMolstarInitial();
  }
}
