/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, computed, effect, inject, linkedSignal, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { MobileFacade } from '../mobile.facade';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LigandsRowData } from '../../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { TruncatePipe, TruncateTextDirective } from '@pdbc/core';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { DetailsDashboardFacade } from '../../../components/shared/details-dashboard.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { MolstarOverviewForTopPage } from '../../../helpers/molstar/molstar-overview-for-top-page';
import { LigandsTabService } from '../../../components/ligands-tab/ligands-tab.service';
import { annotationsTooltips } from '../../../entry-constant';
import { interactionsToMolstar } from '../../../helpers/interactions-to-molstar';
import { Interaction } from '../../../data-models/interaction.model';
import { MolstarStateService } from '../../../services/molstar-state.service';
import { EntryActions } from '../../../store/entry.actions';

@Component({
  selector: 'pdbc-mb-ligands',
  imports: [CommonModule, TruncatePipe, EntryDropdownComponent, TruncateTextDirective],
  templateUrl: './mb-ligands.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-ligands.component.scss'],
})
export class MbLigandsComponent implements AfterViewInit {
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly molstarState = inject(MolstarStateService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));

  public readonly molstarVisualisation = inject(MolstarOverviewForTopPage);

  public readonly ligandsTabService = inject(LigandsTabService);

  public readonly annotationsTooltips: any = annotationsTooltips;

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
    const tableData = this.signals.tabTableData();
    const hasData = Object.keys(tableData).indexOf('Ligands') !== -1;

    if (isLoaded && hasData) {
      const tabData = this.signals.getTabData('Ligands');
      const datum = tabData.tableRows() as LigandsRowData[];
      return datum.map((row: any, index) => ({
        ...row,
        index,
        annotations: this.ligandsTabService.ligandMonomers()[row.id] ?? [],
        isModified: this.ligandsTabService.modifications()?.find((e) => e === row.id) ? true : false,
      }));
    }
    return [];
  });

  private async triggerLigandInteractionsSideEffects(interactions: Interaction[] | undefined) {
    const ligand = this.selectedLigands() as LigandsRowData;
    if (!interactions) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    if (!molstarSelection) return;

    const { residuesMolstarSelections, interactionsMolstarSelections } = interactionsToMolstar(
      ligand,
      molstarSelection,
      interactions,
      this.signals.chainToEntityId()
    );

    await this.molstarState.renderMolstarInteractions(residuesMolstarSelections, interactionsMolstarSelections);
  }

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbLigandsComponent>) {
    effect(() => {
      const data = this.interactions();
      if (data) {
        this.triggerLigandInteractionsSideEffects(data);
      }
    });
  }

  async ngAfterViewInit() {
    // await this.molstarVisualisation.resetMobileMolstarInitial();
    await this.molstarVisualisation.unfocusLoci();
    await this.molstarVisualisation.renderOverviewLigands();
    console.log(this.LigandTableRows());
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

    await this.initMolstar();
  }
  public mapSynonyms(synonyms: any[]): string {
    return synonyms.map((synonym) => synonym.value).join(', ');
  }

  private async initMolstar() {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const residueId = molstarSelection.residues[0].authBegin;

    this.globalStore.dispatch(
      EntryActions.getInteractions({
        chainId: chainId ?? '',
        residueId: residueId,
      })
    );

    await this.molstarVisualisation.renderTabsLigands(this.selectedLigands(), molstarSelection);
  }

  public toggleBottomsheetHeight() {
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
    // await this.molstarVisualisation.resetMobileMolstarInitial();
    await this.molstarVisualisation.unfocusLoci();
    await this.molstarVisualisation.renderOverviewLigands();
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
    // await this.molstarVisualisation.resetMobileMolstarInitial();
    await this.molstarVisualisation.unfocusLoci();
    await this.molstarVisualisation.renderOverviewLigands();
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;
    await this.initMolstar();
  }
}
