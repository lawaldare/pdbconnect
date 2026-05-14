import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, effect, ElementRef, inject, OnInit, Optional, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, MaterialModule, UtilService } from '@pdbc/core';
import { distinctUntilChanged, filter } from 'rxjs';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { baseUrl } from '../../../entry-constant';
import { Dropdown, makeEntityColors, updateSymmetryDropdownOptions } from '../../../helpers/misc';
import { QueryParamForHelpers } from '../../../helpers/molstar-helpers';
import { SnapshotSpec } from '../../../helpers/mvs-views/mvs-snapshot-types';
import { getMacromoleculeChainDropdownOptions, getMacromoleculeSequenceDetails } from '../../../helpers/processed-data-to-controls';
import { truncateText } from '../../../helpers/truncate-text';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryApiService } from '../../../services/entry-api.service';
import { getUniProtMappingsForMacromolecule } from '../../../store/data-processing/macromolecule-processing';
import { ProcessedMacromolecule } from '../../../store/data-processing/models/processed-entities.model';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntryActions } from '../../../store/entry.actions';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileStateService } from '../mobile-state.service';

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
  private readonly state = inject(MobileStateService);
  public readonly gAS = inject(GoogleAnalyticsService);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly entryApiService = inject(EntryApiService);
  public readonly compCommunication = inject(ComponentCommunicationService);

  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  public readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private readonly entityColors = computed(() => makeEntityColors(this.processedMacromolecules(), this.processedLigands()));

  public readonly isoformsMapping = toSignal(this.globalStore.select(EntrySelectors.isoformsMapping));
  public readonly cathMapping = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scop175Mapping = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly pfamMapping = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly interproMapping = toSignal(this.globalStore.select(EntrySelectors.interproMapping));
  public readonly ecMapping = toSignal(this.globalStore.select(EntrySelectors.ecMapping));
  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));
  public readonly uniprotMappings = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly polymerCoverage = toSignal(this.globalStore.select(EntrySelectors.polymerCoverage));
  public readonly proteinsStatsObservable = this.globalStore.select(EntrySelectors.proteinPagesSummaryByUniProtIds);

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  private readonly preferredAssemblyId = computed(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);

  private readonly utilService = inject(UtilService);
  public baseUrl = baseUrl;

  public expanded = signal<boolean>(false);
  public readonly util = inject(UtilService);

  public dropdown = new Dropdown<{ molstarSelection: QueryParamForHelpers[]; inPrefAssembly: boolean; symmOperators: string[] }>();
  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
    defaultOption: (options) => options.find((opt) => opt.data.instanceId !== undefined) ?? options[0],
  });

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);
  private inPrefAssemblyForInstance = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No macromolecule selected -> true (no warning to display)

  @ViewChild('macroMoleculeTitle') macroMoleculeTitle!: ElementRef;

  public readonly macromoleculeTableRows = computed(() => {
    const rows = this.processedMacromolecules();
    if (rows === undefined) return [];
    return rows;
  });

  public uniprotMappedData = computed(() => {
    const currentMacromoleculeDatum = this.selectedMacromolecule();
    const uniprotMappings = this.uniprotMappings();
    const polymerCoverage = this.polymerCoverage();

    if (!currentMacromoleculeDatum) return undefined;
    if (!uniprotMappings) return undefined;
    if (!polymerCoverage) return undefined;

    const mol = currentMacromoleculeDatum.additionalData.molecule;
    const mappedUnpsRows = getUniProtMappingsForMacromolecule(mol, uniprotMappings, polymerCoverage);
    return mappedUnpsRows;
  });

  public uniprotsAllowed = computed(() => this.uniprotMappedData()?.uniprotAccsForMacromolecule);
  public uniprotsAllowedObs$ = toObservable(this.uniprotsAllowed);

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

  public sequenceDetails = computed<{ title: string; fullSequence: string } | undefined>(() => {
    const macromolecule = this.selectedMacromolecule();
    if (!macromolecule) return undefined;
    const chain = this.dropdown.selectedOption()?.name;
    if (!chain) return undefined;
    return getMacromoleculeSequenceDetails(this.entryId() ?? '', macromolecule, chain);
  });

  public currentViewState = computed<'list' | 'detail'>(() => (this.selectedMacromolecule() ? 'detail' : 'list'));

  public selectedMacromolecule = signal<ProcessedMacromolecule | undefined>(undefined);

  public uniqueOrganismsWithStrains = computed(() => {
    const macromolecule = this.selectedMacromolecule();
    if (macromolecule === undefined) return [];

    const seen = new Set<string>();
    return (macromolecule.additionalData.molecule['source'] ?? [])
      .filter((s) => s.organism_scientific_name)
      .filter((s) => {
        const key = `${s.organism_scientific_name}|${s.strain ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((s) => ({
        name: s.organism_scientific_name,
        strain: s.strain,
      }));
  });

  public uniqueExpSystems = computed(() => {
    const macromolecule = this.selectedMacromolecule();
    if (macromolecule === undefined) return [];
    const sources = macromolecule.additionalData.molecule.source;
    if (!sources) return [];
    const expSystems = sources.map((src) => src.expression_host_scientific_name);
    return [...new Set(expSystems.filter((expSystem) => expSystem !== null))];
  });

  public isUniprotMappingsClosed = true;
  public isUniprotMappingsBig = computed(() => {
    const currentMacromoleculeDatum = this.selectedMacromolecule();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return false;
    if (!mappedUnps) return false;

    const mappingsForChains = mappedUnps.labelUniProtMappings;

    if (mappingsForChains.length > 1 || mappingsForChains[0].uniprotSegments.length > 2) {
      return true;
    }
    return false;
  });

  public uniprotProcessedMappings = computed(() => {
    const currentMacromoleculeDatum = this.selectedMacromolecule();
    const mappedUnps = this.uniprotMappedData();

    if (!currentMacromoleculeDatum) return undefined;
    if (!mappedUnps) return undefined;

    const mappingsForChains = mappedUnps.labelUniProtMappings;
    return mappingsForChains;
  });

  public title = computed(() => {
    const macromolecule = this.selectedMacromolecule();
    if (macromolecule) {
      const fullTitle = macromolecule.name.molecule;
      const titleElement = this.macroMoleculeTitle.nativeElement;
      const { bestFit, isTruncated } = truncateText(titleElement, fullTitle, 3);
      return isTruncated ? bestFit : fullTitle;
    } else {
      return `Macromolecules (${this.macromoleculeTableRows().length})`;
    }
  });

  public structureDomains = computed(() => {
    const cath = this.cathMapping() ?? {};
    const scop = this.scop175Mapping() ?? {};
    const entityId = this.selectedMacromolecule()?.additionalData?.molecule?.entity_id;

    const mappedResult = [];

    for (const [key, value] of Object.entries(cath)) {
      if (value.mappings?.[0].entity_id === entityId) {
        const obj = {
          domainId: key,
          domainTitle: value.homology,
          identity: 'CATH',
          link: `https://www.cathdb.info/version/latest/superfamily/${key}`,
        };
        mappedResult.push(obj);
      }
    }

    for (const [key, value] of Object.entries(scop)) {
      if (value.mappings?.[0].entity_id === entityId) {
        const obj = {
          domainId: key,
          domainTitle: value.identifier,
          identity: 'SCOP 1.75',
          link: `https://ftp.ebi.ac.uk/pub/databases/pdbe-kb/scop-legacy/`,
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
          domainId: key,
          domainTitle: value.description,
          identity: 'Pfam',
          link: `https://www.ebi.ac.uk/interpro/entry/pfam/${key}`,
        };
        mappedResult.push(obj);
      }
    }

    for (const [key, value] of Object.entries(interpro)) {
      if (value.mappings?.[0].entity_id === entityId) {
        const obj = {
          domainId: key,
          domainTitle: value.identifier,
          identity: 'InterPro',
          link: `https://www.ebi.ac.uk/interpro/entry/interPro/${key}`,
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

  public numOfStructures = signal<number | undefined>(undefined);
  public numOfStructuresDict = signal<{ [key: string]: number } | undefined>(undefined);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbMacromoleculeComponent>) {
    // Update MVS snapshot when needed
    effect(() => this.compCommunication.mvsSnapshotSpec$.next(this.mvsSnapshotSpec()));

    // Update global mobileIsPrefAssembly (for warning display)
    effect(() => this.compCommunication.mobileIsPrefAssembly.set(this.inPrefAssemblyForInstance()));
  }

  ngOnInit(): void {
    /* 1. Fetch tab data*/
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getGOMapping,
      EntryActions.getECMapping,
      EntryActions.getPfamMapping,
      EntryActions.getCathMapping,
      EntryActions.getScop175Mapping,
      EntryActions.getInterproMapping,
      EntryActions.getIsoformsMapping,
      EntryActions.getSummaryData,
      EntryActions.getAssemblies,
      EntryActions.getEntryMolecules,
      EntryActions.getCarbohydrates,
      EntryActions.getUniprotMapping,
      EntryActions.getEntryPolymerCoverage,
      EntryActions.getProcessedMacromolecules,
    ]);

    // when uniprot listing has arrived and been processed
    this.uniprotsAllowedObs$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        filter((unps) => unps !== undefined)
      )
      .subscribe((unpsList) => {
        const unpDict: Record<string, number> = {};
        for (const unp of unpsList) {
          unpDict[unp] = 0; // start with 0 structures
          this.globalStore.dispatch(EntryActions.getUniprotSummary({ uniprotId: unp }));
        }
        this.numOfStructuresDict.set(unpDict);
      });
    // when uniprot summary API call has finished
    this.proteinsStatsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((proteinSummary) => {
      if (proteinSummary) {
        const updated = { ...this.numOfStructuresDict() };
        for (const [unp, datum] of Object.entries(proteinSummary)) {
          if (datum) updated[unp] = datum.pdbs;
        }
        this.numOfStructuresDict.set(updated);
      }
    });
  }

  public getNumberStructures(unp: string) {
    return this.numOfStructuresDict()?.[unp] ?? undefined;
  }

  public toggleSynonymsList(total: number) {
    this.initialSynonymsCount.update((prev) => (prev === 5 ? total : 5));
  }

  public toggleGoTermsList(total: number) {
    this.initialGoTermsCount.update((prev) => (prev === 5 ? total : 5));
  }

  private async setCurrentMacromolecule(macromolecule: ProcessedMacromolecule | undefined): Promise<void> {
    this.selectedMacromolecule.set(macromolecule);
    this.updateDropdownOptions(macromolecule);
    this.updateSymmetryDropdownOptions();
  }

  private updateDropdownOptions(macromolecule: ProcessedMacromolecule | undefined) {
    if (macromolecule) {
      const options = getMacromoleculeChainDropdownOptions(macromolecule);
      type DropdownOption = MbMacromoleculeComponent['dropdown']['options'][number];
      this.dropdown.updateOptions(
        Object.keys(options).map((name, idx): DropdownOption => {
          const authAsymId = macromolecule.additionalData.selections[idx][0].auth_asym_id;
          return {
            name: name,
            url: `macro-${idx + 1}`,
            downloadable: false,
            data: {
              molstarSelection: options[name],
              inPrefAssembly: macromolecule.additionalData.selectionsInPrefAssembly[idx],
              symmOperators: authAsymId !== undefined ? macromolecule.chainSymmOperators[authAsymId] : [],
            },
          };
        })
      );
    } else {
      this.dropdown.updateOptions([]);
    }
  }

  private updateSymmetryDropdownOptions() {
    updateSymmetryDropdownOptions(this.symmetryDropdown, this.dropdown.selectedOption()?.data.symmOperators, 'macro-0-symop-');
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
  }

  public navigateToDetail(macromolecule: ProcessedMacromolecule) {
    this.setCurrentMacromolecule(macromolecule);
    this.scrollTabToTop();
  }

  public async goBackToList() {
    this.setCurrentMacromolecule(undefined);
    this.scrollTabToTop();
  }

  private scrollTabToTop() {
    const container = document.querySelector('.mat-bottom-sheet-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  public generateOrganismSearchUrl(term: string): string {
    return this.util.generateQueryURL(term, 'q_organism_name');
  }

  public anyNonPrefAssembly(macromolecule: ProcessedMacromolecule) {
    return macromolecule.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true) === false;
  }

  public onDropdownSelect(event: string) {
    this.dropdown.select(event);
    this.updateSymmetryDropdownOptions();
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
  }

  public copySequence(sequenceDetail?: { title: string; fullSequence: string }) {
    if (!sequenceDetail) return;
    const text = `${sequenceDetail.title}\r\n${sequenceDetail.fullSequence}`;
    this.utilService.copy(text);
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const macromolecule = this.selectedMacromolecule();
    if (!macromolecule) {
      return {
        name: `Preferred complex`,
        kind: 'pdbconnect_complex',
        params: { entry: entryId, assemblyId: this.preferredAssemblyId(), entityColors: this.entityColors(), volumeStreaming: true },
      };
    }

    const entityId = `${macromolecule.additionalData.molecule.entity_id}`;
    const dropdownSelected = this.dropdown.selectedOption();
    if (!dropdownSelected) return undefined;
    const { molstarSelection, inPrefAssembly } = dropdownSelected.data;
    const labelAsymId = molstarSelection[0].label_asym_id;
    const authAsymId = molstarSelection[0].auth_asym_id;
    const assemblyId = inPrefAssembly ? this.preferredAssemblyId() : undefined;
    const instanceId = this.selectedInstanceId();

    return {
      name: `Macromolecule ${entityId}`,
      kind: 'pdbconnect_macromolecule',
      params: {
        entry: entryId,
        assemblyId,
        entityId,
        labelAsymId,
        authAsymId,
        instanceId,
        focus: true,
        volumeStreaming: true,
        color: macromolecule.molstarColorHex,
      },
    };
  });
}
