import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnInit, Optional, signal, ViewChild } from '@angular/core';
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
import { DetailsDashboardFacade, SequenceDetail } from '../../../components/shared/details-dashboard.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { EntryApiService } from '../../../services/entry-api.service';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { MolstarOverviewForTopPage } from '../../../helpers/molstar/molstar-overview-for-top-page';
import { truncateText } from '../../../helpers/truncate-text';

export enum ViewState {
  List = 'list',
  Detail = 'detail',
}

interface GoMapped {
  names: string[];
  count: number;
  category: string;
}

@Component({
  selector: 'pdbc-mb-macromolecule',
  imports: [CommonModule, MaterialModule, EntryDropdownComponent],
  templateUrl: './mb-macromolecule.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-macromolecule.component.scss'],
})
export class MbMacromoleculeComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  private readonly mbFacade = inject(MobileFacade);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  public readonly entryApiService = inject(EntryApiService);

  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly cathMapping = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scop175Mapping = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly pfamMapping = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly interproMapping = toSignal(this.globalStore.select(EntrySelectors.interproMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));

  private readonly utilService = inject(UtilService);
  public readonly molstarVisualisation = inject(MolstarOverviewForTopPage);

  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public expanded = signal<boolean>(false);
  public readonly util = inject(UtilService);

  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;
  public sequenceDetails: SequenceDetail[] = [];

  @ViewChild('macroMoleculeTitle') macroMoleculeTitle!: ElementRef;

  public readonly macromoleculeTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const tableData = this.signals.tabTableData();
    const hasData = Object.keys(tableData).indexOf('Macromolecules') !== -1;

    if (isLoaded && hasData) {
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

  public selectedMacromolecule = signal<any>({});

  public title = this.mbFacade.macromoleculeTitle;

  public structureDomains = computed(() => {
    const cath = this.cathMapping() ?? {};
    const scop = this.scop175Mapping() ?? {};
    const entityId = this.selectedMacromolecule()?.additionalData?.molecule?.entity_id;

    const mappedResult = [];

    for (const [key, value] of Object.entries(cath)) {
      if (value.mappings[0].entity_id === entityId) {
        const obj = {
          cathId: key,
          cathTitle: value.homology,
        };
        mappedResult.push(obj);
      }
    }

    for (const [key, value] of Object.entries(scop)) {
      if (value.mappings[0].entity_id === entityId) {
        const obj = {
          cathId: key,
          cathTitle: value.identifier,
        };
        mappedResult.push(obj);
      }
    }

    return mappedResult;
  });

  public sequenceDomains = computed(() => {
    const pfam = this.pfamMapping() ?? {};
    const interpro = this.interproMapping() ?? {};
    const entityId = this.selectedMacromolecule()?.additionalData?.molecule?.entity_id;

    const mappedResult = [];

    for (const [key, value] of Object.entries(pfam)) {
      if (value.mappings[0].entity_id === entityId) {
        const obj = {
          cathId: key,
          cathTitle: value.description,
          identity: 'Pfam',
        };
        mappedResult.push(obj);
      }
    }

    for (const [key, value] of Object.entries(interpro)) {
      if (value.mappings[0].entity_id === entityId) {
        const obj = {
          cathId: key,
          cathTitle: value.identifier,
          identity: 'InterPro',
        };
        mappedResult.push(obj);
      }
    }

    return mappedResult;
  });

  public ecFunctions = computed(() => {
    const ec = this.ecMapping() ?? {};
    const entityId = this.selectedMacromolecule()?.additionalData?.molecule?.entity_id;

    const mappedResult = [];

    for (const [key, value] of Object.entries(ec)) {
      if (value.mappings[0].entity_id === entityId) {
        mappedResult.push({
          id: key,
          name: value.accepted_name,
          reaction: value.reaction,
          systematic_name: value.systematic_name,
          synonyms: value.synonyms,
        });
      }
    }

    return mappedResult;
  });

  public goFunctions = computed(() => {
    const go = this.goMapping() ?? {};
    const entityId = this.selectedMacromolecule()?.additionalData?.molecule?.entity_id;

    const grouped = Object.values(go).reduce((acc: GoMapped[], item: any) => {
      if (item.mappings[0].entity_id === entityId) {
        if (!acc[item.category]) {
          acc[item.category] = {
            names: [],
            count: 0,
            category: item.category.replace('_', ' '),
          };
        }
        acc[item.category].names.push(item.name);
        acc[item.category].count += 1;
      }
      return acc;
    }, {} as any);

    const mappedResult = Object.values(grouped);

    return mappedResult;
  });

  public initialSynonymsCount = signal<number>(5);
  public initialGoTermsCount = signal<number>(5);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbMacromoleculeComponent>) {}

  async ngOnInit() {
    await this.molstarVisualisation.resetMobileMolstarInitial();
  }

  public toggleSynonymsList(total: number) {
    this.initialSynonymsCount.update((prev) => (prev === 5 ? total : 5));
  }

  public toggleGoTermsList(total: number) {
    this.initialGoTermsCount.update((prev) => (prev === 5 ? total : 5));
  }

  private async init(): Promise<void> {
    const dropdownResults = this.detailsDashboardFacade.getMacromoleculeDropdownOptions(this.selectedMacromolecule());
    this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;

    this.dropdownOptions = dropdownResults.dropdownOptions.map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = dropdownResults.dropdownSelected;

    this.sequenceDetails = this.detailsDashboardFacade.getMacromoleculeSequenceDetails(this.entryId() ?? '', this.selectedMacromolecule(), this.dropdownSelected);

    await this.initMolstar();
  }

  private async initMolstar() {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    await this.molstarVisualisation.renderTabsMacromolecules(this.selectedMacromolecule(), molstarSelection);
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
    // this.mbFacade.updateSelectedMacromoleculeTitle('Macromolecules');
    await this.molstarVisualisation.resetMobileMolstarInitial();
  }

  public navigateToDetail(data: MacromoleculesRowData) {
    this.currentViewState.set(ViewState.Detail);
    const titleElement = this.macroMoleculeTitle.nativeElement;
    const { bestFit, isTruncated } = truncateText(titleElement, data.name.molecule, 3);
    const moleculeName = isTruncated ? bestFit : data.name.molecule;
    this.mbFacade.updateSelectedMacromoleculeTitle(moleculeName);
    this.selectedMacromolecule.set(data);
    this.init();
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.mbFacade.updateSelectedMacromoleculeTitle('Macromolecules');
    await this.molstarVisualisation.resetMobileMolstarInitial();
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;
    await this.initMolstar();
  }

  public copySequence(sequenceDetail: SequenceDetail) {
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }
}
