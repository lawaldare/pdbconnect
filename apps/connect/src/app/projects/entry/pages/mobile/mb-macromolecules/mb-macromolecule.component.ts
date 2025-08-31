import { Component, computed, DestroyRef, ElementRef, inject, Optional, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { MacromoleculesRowData } from '../../../data-classes/data-models-and-definitions/row-and-table.model';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryStoreState } from '../../../store/entry-store.model';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { MaterialModule, UtilService } from '@pdbc/core';
import { SharedDataFacade } from '../../../components/shared/shared-data.facade';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { EntryApiService } from '../../../services/entry-api.service';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { truncateText } from '../../../helpers/truncate-text';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, take, timer } from 'rxjs';
import { clearSelectionInMolstar, drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../../helpers/molstar-helpers';
import { MobileStateService } from '../mobile-state.service';
import { getMacromoleculeChainDropdownOptions, getMacromoleculeSequenceDetails } from '../../../helpers/processed-data-to-controls';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { SequenceDetail } from '../../../data-classes/data-models-and-definitions/other-models';

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
export class MbMacromoleculeComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  private readonly state = inject(MobileStateService);

  public readonly sharedDataFacade = inject(SharedDataFacade);
  public readonly entryApiService = inject(EntryApiService);
  public readonly compCommunication = inject(ComponentCommunicationService);

  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly cathMapping = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scop175Mapping = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly pfamMapping = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly interproMapping = toSignal(this.globalStore.select(EntrySelectors.interproMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));

  private readonly utilService = inject(UtilService);

  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public expanded = signal<boolean>(false);
  public readonly util = inject(UtilService);

  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;

  @ViewChild('macroMoleculeTitle') macroMoleculeTitle!: ElementRef;

  public readonly macromoleculeTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const hasData = this.compCommunication.hasProcessedMacromolecules();

    if (isLoaded && hasData) {
      const datum = this.compCommunication.processedMacromolecules;
      const mappedDatum = datum.map((data) => {
        return {
          ...data,
          mappedResidues: this.sharedDataFacade.transformCoverageData(data.residues),
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

  public sequenceDetails = signal<
    | {
        title: string;
        fullSequence: string;
      }
    | undefined
  >(undefined);

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;

  public selectedMacromolecule = signal<any>({});

  public title = this.state.macromoleculeTitle;

  public structureDomains = computed(() => {
    const cath = this.cathMapping() ?? {};
    const scop = this.scop175Mapping() ?? {};
    const entityId = this.selectedMacromolecule()?.additionalData?.molecule?.entity_id;

    const mappedResult = [];

    for (const [key, value] of Object.entries(cath)) {
      if (value.mappings?.[0].entity_id === entityId) {
        const obj = {
          cathId: key,
          cathTitle: value.homology,
        };
        mappedResult.push(obj);
      }
    }

    for (const [key, value] of Object.entries(scop)) {
      if (value.mappings?.[0].entity_id === entityId) {
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
      if (value.mappings?.[0].entity_id === entityId) {
        const obj = {
          cathId: key,
          cathTitle: value.description,
          identity: 'Pfam',
        };
        mappedResult.push(obj);
      }
    }

    for (const [key, value] of Object.entries(interpro)) {
      if (value.mappings?.[0].entity_id === entityId) {
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
      if (value.mappings?.[0].entity_id === entityId) {
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
      if (item.mappings?.[0].entity_id === entityId) {
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

  private hasMacromolecules$ = toObservable(this.compCommunication.hasProcessedMacromolecules);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbMacromoleculeComponent>) {
    this.hasMacromolecules$
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        filter((hasMM) => hasMM == true)
      )
      .subscribe(async (hasMM) => {
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

  public toggleSynonymsList(total: number) {
    this.initialSynonymsCount.update((prev) => (prev === 5 ? total : 5));
  }

  public toggleGoTermsList(total: number) {
    this.initialGoTermsCount.update((prev) => (prev === 5 ? total : 5));
  }

  private async updateMacromoleculeData(): Promise<void> {
    const macromolecule = this.selectedMacromolecule();
    this.dropdownOptionsToMolstar = getMacromoleculeChainDropdownOptions(macromolecule);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];

    this.sequenceDetails.set(undefined);
    const sequenceDetails = getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, this.dropdownSelected);
    this.sequenceDetails.set(sequenceDetails);

    await this.renderInMolstar(this.selectedMacromolecule());
  }

  private async renderInMolstar(macromolecule?: MacromoleculesRowData) {
    // Wait until first render is finished
    await firstValueFrom(
      this.compCommunication.mobileMolstarLoaded$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    const durationMs = this.compCommunication.mobileMolstar ? 200 : 0;
    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;

    if (!macromolecule) {
      if (this.compCommunication.mobileMolstarDisplay === 'macromols') return;
      await clearSelectionInMolstar(instance, durationMs);
      this.compCommunication.mobileMolstarDisplay = 'macromols';
      return;
    }

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    // loop over each molstar selection and add color and focus
    const selectionData = molstarSelection.map((eachSelection) => {
      return {
        ...eachSelection,
        color: macromolecule.molstarColorHex,
        focus: true,
      };
    });

    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, selectionData, '#FEFEFE');
    });
    this.compCommunication.mobileMolstarDisplay = 'macromols-specific';
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
    this.state.updateSelectedComponent(null);
    this.state.updateSelectedTabName('');
    // const durationMs = this.compCommunication.mobileMolstar ? 300 : 0;
    // const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    // if (!instance) return;
    // await clearSelectionInMolstar(instance, durationMs);
  }

  public navigateToDetail(data: MacromoleculesRowData) {
    this.currentViewState.set(ViewState.Detail);
    const titleElement = this.macroMoleculeTitle.nativeElement;
    const { bestFit, isTruncated } = truncateText(titleElement, data.name.molecule, 3);
    const moleculeName = isTruncated ? bestFit : data.name.molecule;
    this.state.updateSelectedMacromoleculeTitle(moleculeName);
    this.selectedMacromolecule.set(data);
    this.updateMacromoleculeData();
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.state.updateSelectedMacromoleculeTitle('Macromolecules');
    await this.renderInMolstar(undefined);
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;
    await this.renderInMolstar(this.selectedMacromolecule());
  }

  public copySequence(sequenceDetail?: { title: string; fullSequence: string }) {
    if (!sequenceDetail) return;
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }
}
