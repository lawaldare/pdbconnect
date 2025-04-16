import { AfterViewInit, Component, computed, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { MobileFacade } from '../mobile.facade';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LigandsRowData } from '../../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { TruncatePipe } from '@pdbc/core';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { DetailsDashboardFacade } from '../../../components/shared/details-dashboard/details-dashboard.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MolstarSelectionObj } from '../../../helpers/molstar/molstar-helpers';

@Component({
  selector: 'pdbc-mb-ligands',
  imports: [CommonModule, TruncatePipe, EntryDropdownComponent],
  templateUrl: './mb-ligands.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-ligands.component.scss'],
})
export class MbLigandsComponent implements AfterViewInit {
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;
  public selectedLigands = signal<any>({});
  public expanded = signal<boolean>(false);
  public title = this.mbFacade.ligandTitle;

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;

  public readonly LigandTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();

    if (isLoaded) {
      const tabData = this.signals.getTabData('Ligands');
      const datum = tabData.tableRows() as LigandsRowData[];
      return datum;
    }
    return [];
  });

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbLigandsComponent>) {}

  async ngAfterViewInit() {
    this.mbFacade.renderMolstarMQ(this.entryId() ?? '', true);
  }

  private async init() {
    const dropdownResults = this.detailsDashboardFacade.getLigandsDropdownOptions(this.selectedLigands());
    this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;

    this.dropdownOptions = dropdownResults.dropdownOptions.map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = dropdownResults.dropdownSelected;

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    await this.mbFacade.renderMolstarLigands(this.entryId() ?? '', this.selectedLigands(), molstarSelection, true);
  }

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  public closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.mbFacade.updateSelectedComponent(null);
    this.mbFacade.updateSelectedTabName('');
  }

  public navigateToDetail(data: LigandsRowData) {
    this.currentViewState.set(ViewState.Detail);
    this.selectedLigands.set(data);
    const title = `${data.codeAndName.count} X ${data.id}`;
    this.mbFacade.updateSelectedLigandTitle(title);
    this.init();
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.mbFacade.updateSelectedLigandTitle('Ligands');
    await this.mbFacade.renderMolstarMQ(this.entryId() ?? '', true);
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    await this.mbFacade.renderMolstarLigands(this.entryId() ?? '', this.selectedLigands(), molstarSelection, true);
  }
}
