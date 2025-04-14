import { Component, computed, DestroyRef, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { MacromoleculesRowData } from '../../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryStoreState } from '../../../store/entry-store.model';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { MobileFacade } from '../mobile.facade';
import { MaterialModule, UtilService } from '@pdbc/core';
import { DetailsDashboardFacade } from '../../../components/shared/details-dashboard/details-dashboard.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { EntryApiService } from '../../../services/entry-api.service';

enum ViewState {
  List = 'list',
  Detail = 'detail',
}

@Component({
  selector: 'pdbc-mb-macromolecule',
  imports: [CommonModule, MaterialModule],
  templateUrl: './mb-macromolecule.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-macromolecule.component.scss'],
})
export class MbMacromoleculeComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  private readonly mbFacade = inject(MobileFacade);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  public readonly entryApiService = inject(EntryApiService);

  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));

  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public expanded = signal<boolean>(false);
  public readonly util = inject(UtilService);

  public readonly macromoleculeTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();

    if (isLoaded) {
      const tabData = this.signals.getTabData('Macromolecules');
      const datum = tabData.tableRows() as MacromoleculesRowData[];
      const mappedDatum = datum.map((data) => {
        return {
          ...data,
          mappedResidues: this.detailsDashboardFacade.transformCoverageData(data.residues),
          organisms: [...new Set(data['organisms'])],
        };
      });
      return mappedDatum;
    }
    return [];
  });

  public bestResidues = computed(() => {
    const isoformsMappingKeys = Object.keys(this.isoformsMapping() ?? {});
    const filteredIsoformsMapping: any[] = [];

    isoformsMappingKeys.forEach((uniprot: string) => {
      if (uniprot.indexOf('-') !== -1) {
        filteredIsoformsMapping.push({ ...this.isoformsMapping()?.[uniprot], uniprot });
      }
    });

    return filteredIsoformsMapping;
  });

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;

  public selectedMacromolecule = signal<MacromoleculesRowData>({} as MacromoleculesRowData);

  public title = this.mbFacade.macromoleculeTitle;

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbMacromoleculeComponent>) {
    console.log('MbMacromoleculeComponent initialized', this.macromoleculeTableRows());
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

  public navigateToDetail(data: MacromoleculesRowData) {
    this.currentViewState.set(ViewState.Detail);
    this.mbFacade.updateSelectedTitle(data.name.molecule);
    this.selectedMacromolecule.set(data);
  }

  public goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.mbFacade.updateSelectedTitle('Macromolecules');
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }
}
