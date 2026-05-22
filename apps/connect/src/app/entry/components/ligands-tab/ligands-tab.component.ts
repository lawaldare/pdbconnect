/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, Renderer2, signal, untracked, ViewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  AG_Grid_Theme_Class,
  DownloadFileTypeService,
  GoogleAnalyticsService,
  MaterialModule,
  Mutex,
  PopupWindowService,
  ScriptLoaderService,
  SingleAsyncQueue,
  TruncateTextDirective,
  UtilService,
} from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { AgGridAngular } from 'ag-grid-angular';
import { CellMouseOverEvent, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { debounceTime, distinctUntilChanged, firstValueFrom, timer } from 'rxjs';
import { Interaction, InteractionFromAPI } from '../../data-models/interaction.model';
import { Molecule } from '../../data-models/molecule.model';
import { dashboardStatLinks, INTX_NAME_COLORS, symmOperatorTooltip } from '../../entry-constant';
import { interactionsToMolstar, normalizeInsertionCode } from '../../helpers/interactions-to-molstar-sel-obj';
import { Dropdown, makeEntityColors, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams, QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import { CommonDropdownOptionData, getCleanSelectionName, makeLigandsDropdownOptions, makeSymmetryDropdownOptions } from '../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryApiService } from '../../services/entry-api.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { ProcessedLigandOrMod } from '../../store/data-processing/ligand-processing';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { colDefs, gridOptions } from './ag-grid';
import { INTX_NAME_STANDARDIZER, standardizeInteractionType } from './interaction-type.component';

@Component({
  selector: 'pdbc-ligands-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntryDropdownComponent,
    InteractiveTablesComponent,
    NgxSkeletonLoaderModule,
    MaterialModule,
    AgGridAngular,
    ReactiveFormsModule,
    TruncateTextDirective,
    ToolTipComponent,
    MolstarComponent,
    HelpIconWithTooltipComponent,
  ],
  templateUrl: './ligands-tab.component.html',
  styleUrl: './ligands-tab.component.scss',
})
export class LigandsTabComponent implements AfterViewInit {
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly scriptLoader = inject(ScriptLoaderService);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public dropdown = new Dropdown<CommonDropdownOptionData>({
    autoOptions: () => makeLigandsDropdownOptions(this.currentLigandDatum()),
  });

  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
    autoOptions: () => makeSymmetryDropdownOptions(this.dropdown.selectedOption()?.data.symmOperators),
  });

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);
  public inPrefAssemblyForInstance = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No ligand selected -> true (no warning to display)

  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  public dashboardStatLinks = dashboardStatLinks;
  public readonly gAS = inject(GoogleAnalyticsService);
  private entryApiService = inject(EntryApiService);

  public readonly isSidebarDisplayed = signal<boolean>(true);

  public readonly selectedLigandIdx = toSignal(this.compCommunication.ligandSelection$);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactionsObservable = this.globalStore.select(EntrySelectors.interactions);
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  public readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  public readonly chainToEntityId = toSignal(this.globalStore.select(EntrySelectors.macromolsChainsToEntityIds));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly ligandSummaryList = toSignal(this.globalStore.select(EntrySelectors.ligandPagesSummary));
  private readonly procMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  private readonly procLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private readonly entityColors = computed(() => makeEntityColors(this.procMacromolecules(), this.procLigands()));
  private readonly preferredAssemblyId = computed(() => this.summaryData()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForInstance() ? this.preferredAssemblyId() : undefined));

  public readonly tabDataLoaded = computed(() => this.processedLigands() !== undefined);

  public readonly util = inject(UtilService);

  public readonly legendItems = getInteractionLegendItems(INTX_NAME_COLORS, INTX_NAME_STANDARDIZER);

  public getCleanSelectionName = getCleanSelectionName;

  public readonly legendExpanded = signal<boolean>(false);
  /** Maximum number of legend items to display, unless the legend is fully expanded. */
  public readonly LegendMaxItems = 4;

  public get isMobile(): boolean {
    return window.innerWidth <= 768; // typical mobile breakpoint
  }

  public readonly ligandTableRows = computed(() => this.processedLigands() ?? []);

  public currentLigandDatum = signal<ProcessedLigandOrMod | undefined>(undefined);

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  @ViewChild('ligandEnvContainer') ligandEnvContainer!: ElementRef;
  private ligandEv: any;

  private molstarReady = signal(false);
  private _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.molstarReady.set(true);
    }
  }
  private molstarFirstRenderFinished = computed(() => this.molstarReady() && this._molstarComponent!.firstLoadFinished());

  public readonly slowNetwork = toSignal(
    this.compCommunication.slowNetwork$,
    { initialValue: undefined } // assume "unknown/loading" until we know
  );

  public readonly checkedWebGl = computed(() => this.compCommunication.checkedWebGlSupport);
  public readonly isWebGlEnabled = computed(() => this.compCommunication.isWebGlEnabled);

  public readonly fastNetworkOrForceLoad = computed(() => {
    const isSlow = this.slowNetwork();
    const forceLoad = this.compCommunication.forceLoad();
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public inPrefAssembly = computed(() => {
    const ligand = this.currentLigandDatum();
    if (!ligand) return true;
    return ligand.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  });

  public messageNoInteractions = computed(() => {
    const inPrefAssemblyForInstance = this.inPrefAssemblyForInstance();
    if (inPrefAssemblyForInstance === false) return 'Interactions are only calculated for ligands of the preferred assembly';
    return 'No ligand interactions found';
  });

  public readonly configForMolstar = computed(() => ({
    ...EntryPageTabsCommonMolstarParams,
    granularity: 'element',
  }));

  private currentChainId = computed<string | undefined>(() => this.dropdown.selectedOption()?.data.molstarSelection[0].auth_asym_id);
  private currentResidueId = computed<string | undefined>(() => {
    const auth_seq_id = this.dropdown.selectedOption()?.data.molstarSelection[0].auth_seq_id;
    if (auth_seq_id === undefined) return undefined;
    return String(auth_seq_id);
  });

  public searchTermForm = new FormControl('');
  private searchTerm = toSignal(this.searchTermForm.valueChanges);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;

  /** All interactions for current ligand/chainId/residueId/instanceId, without applying filter. */
  private interactionsForCurrentInstance = computed<InteractionFromAPI | undefined>(() => {
    const chainId = this.currentChainId();
    const residueId = this.currentResidueId();
    if (!chainId || !residueId) return undefined;

    const instanceId = this.selectedInstanceId();
    const chainForInteractions = chainNameForInteractionsApi(chainId, instanceId);

    const allInteractions = this.interactions();
    return allInteractions?.[chainForInteractions]?.[residueId];
  });

  /** Filtered interactions for current ligand/chainId/residueId/instanceId. */
  public filteredInteractionsData = computed<InteractionFromAPI | undefined>(() => {
    const interactionsForCurrentInstance = this.interactionsForCurrentInstance();
    if (!interactionsForCurrentInstance) return undefined;

    const searchQuery = this.searchTerm();
    const filteredInteractions = this.filterItemsBySearchQuery(searchQuery, interactionsForCurrentInstance.interactions);
    return {
      ...interactionsForCurrentInstance,
      interactions: filteredInteractions,
    };
  });

  /** Filtered interactions for current ligand/chainId/residueId/instanceId. */
  public filteredInteractionsRows = computed<Interaction[] | undefined>(() => this.filteredInteractionsData()?.interactions);

  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  public selectionStats = computed(() => {
    const ligandSummaryList = this.ligandSummaryList();
    const currentLig = this.currentLigandDatum();
    if (ligandSummaryList && currentLig) {
      const currentLigId = currentLig.id;
      const datum = ligandSummaryList.find((eachLig) => eachLig.ligand_id === currentLigId);
      if (datum) return datum as any;
    }
    return undefined;
  });

  public ligandWeight = computed(() => {
    const datum = this.currentLigandDatum();
    if (datum && datum.type === 'ligand') {
      return (datum.additionalData.source as Molecule).weight;
    }
    return undefined;
  });

  public ligandBoundDetails = computed(() => {
    const datum = this.currentLigandDatum();
    if (datum?.type === 'ligand') {
      return datum.additionalData.source.bound_details;
    }
    return undefined;
  });

  @ViewChild('popoutWrapper') popoutWrapper!: ElementRef;
  public readonly popService = inject(PopupWindowService);

  public popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.popoutWrapper, 'ligand-molstar');
    }
  }

  async triggerLigandUpdateSideEffects(ligand: ProcessedLigandOrMod) {
    // used in template for dashboard stats
    this.selectionIdentifier = ligand.id; // TODO: to computed

    this.searchTermForm.setValue('');
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const molstarSelection = this.dropdown.selectedOption()?.data.molstarSelection;
    if (!molstarSelection) return undefined;

    const authAsymId = molstarSelection[0].auth_asym_id;
    const authSeqId = molstarSelection[0].auth_seq_id;
    const authInsCode = molstarSelection[0].pdbx_PDB_ins_code ?? '';
    if (authAsymId === undefined) throw new Error('authAsymId is undefined');
    if (authSeqId === undefined) throw new Error('authSeqId is undefined');
    const instanceId = this.selectedInstanceId();

    const ligand = this.currentLigandDatum();
    const interactions = this.filteredInteractionsRows();
    const mvsAtomInteractions =
      ligand && interactions ? interactionsToMolstar(ligand, molstarSelection, interactions, instanceId).interactionsMolstarSelections : undefined;

    return {
      name: 'Ligand environment',
      kind: 'pdbconnect_environment',
      params: {
        entry: entryId,
        assemblyId: this.displayedAssemblyId(),
        authAsymId,
        authSeqId,
        authInsCode,
        instanceId,
        atomInteractions: mvsAtomInteractions ?? 'builtin',
        // atomInteractions: mvsAtomInteractions ?? 'none',
        volumeStreaming: true,
        entityColors: this.entityColors(),
      },
    };
  });
  private readonly mvsSnapshotSpec$ = toObservable(this.mvsSnapshotSpec);

  private readonly ligandEnvQueue = new SingleAsyncQueue();
  private readonly tableHoverMutex = Mutex('tableHoverMutex');

  constructor() {
    this.ligandEnvQueue.enqueue(async () => {
      // await this.scriptLoader.loadScript('https://d3js.org/d3.v5.min.js', true);
      await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-3.0.0-min.js', true);
    });

    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });

    // Fetch interaction data when ligand/chainId/residueId/instanceId changes
    effect(() => {
      const chainId = this.currentChainId();
      const residueId = this.currentResidueId();
      const instanceId = this.selectedInstanceId();
      const inPrefAssemblyForInstance = this.inPrefAssemblyForInstance();
      if (inPrefAssemblyForInstance && chainId !== undefined && residueId !== undefined) {
        this.fetchInteractionData(chainId, residueId, instanceId);
      }
    });

    // Refresh data to ligand env viewer when ligand/chainId/residueId/instanceId changes
    effect(async () => {
      const viewReady = this.viewReady();
      if (!viewReady) return;

      const ligand = this.currentLigandDatum();
      if (ligand?.type === 'ligand') {
        // Regular ligand -> show Ligand Env viewer
        const interactionRawData = this.filteredInteractionsData();
        await untracked(() => this.initOrRefreshLigandEnvViewer(ligand, interactionRawData));
      } else {
        // Modification or no ligand -> hide Ligand Env viewer
        await this.destroyLigandEnv();
      }
    });
  }

  private fetchInteractionData(authAsymId: string, residueId: string, instanceId: string | undefined) {
    const chainForInteractions = chainNameForInteractionsApi(authAsymId, instanceId);
    this.globalStore.dispatch(EntryActions.getInteractions({ chainId: chainForInteractions, residueId: residueId }));
  }

  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  public hasLoadedLigands = computed(() => this.processedLigands() !== undefined);
  public hasLigands = computed(() => {
    const rows = this.processedLigands();
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  /**
   * For ligand env viewer to always initialise
   */
  private viewReady = signal(false);

  ngAfterViewInit(): void {
    this.viewReady.set(true);

    this.compCommunication.ligandSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe(async (idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.ligandTableRows()[idx];
      if (datum) {
        this.currentLigandDatum.set(datum);
      }
    });
  }

  public toggleColorList(): void {
    this.legendExpanded.update((prev) => !prev);
  }

  public async onDropdownSelect(event: string) {
    this.dropdown.select(event);
    this.searchTermForm.setValue('');
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
    this.searchTermForm.setValue('');
  }

  private async initOrRefreshLigandEnvViewer(ligand: ProcessedLigandOrMod, interactionsRawData: InteractionFromAPI | undefined) {
    const ligandId = ligand.id;
    // ligand env viewer is only shown for ligands tab. data is retrieved from dropdown
    const molstarSelection = this.dropdown.selectedOption()?.data.molstarSelection;
    if (!molstarSelection) return;
    const resId = molstarSelection[0].auth_seq_id;
    const chainId = molstarSelection[0].auth_asym_id!;

    console.log('RUN initOrRefreshLigandEnvViewer', ligand.id, chainId, resId, ':', interactionsRawData?.interactions.length);

    const imageContainer = this.ligandEnvContainer.nativeElement;

    const QUEUE_THROTTLE_MS = 1000; // Throttling here avoids repeated rendering when user quickly types something in the filter form

    this.ligandEnvQueue.enqueueWithThrottle(QUEUE_THROTTLE_MS, async () => {
      const depiction = await firstValueFrom(this.entryApiService.fetchDepiction(ligandId).pipe(takeUntilDestroyed(this.destroyRef)));

      if (this.ligandEv) {
        this.renderer.removeChild(imageContainer, this.ligandEv);
        this.ligandEv = undefined;
      }

      await customElements.whenDefined('pdb-ligand-env');
      const ligandComp = this.renderer.createElement('pdb-ligand-env');
      ligandComp.menuOn = true;
      ligandComp.zoomControlsOn = true;

      this.renderer.appendChild(imageContainer, ligandComp);
      this.renderer.setProperty(ligandComp, 'depiction', depiction);
      this.ligandEv = ligandComp;
      this.ligandEv.pdbId = `${this.entryId()}`;
      this.ligandEv.chainId = chainId;
      this.ligandEv.resId = resId;
      this.ligandEv.display.pdbId = `${this.entryId()}`;
      this.ligandEv.display.chainId = chainId;
      this.ligandEv.display.resId = resId;

      if (interactionsRawData && interactionsRawData.interactions.length > 0) {
        // Calling `addLigandInteractions` with [] would freeze ligand env viewer!
        const dataToLigEnv: { [key: string]: InteractionFromAPI[] } = {};
        const copiedInteractions = JSON.parse(JSON.stringify(interactionsRawData));
        dataToLigEnv[`${this.entryId()}`] = [copiedInteractions];
        try {
          await this.ligandEv.display.addLigandInteractions(dataToLigEnv, false);
        } catch (err) {
          console.error('Failed to add ligand interactions:', err);
        }
      }
      this.ligandEv.display.centerScene();
      console.log('FINISHED initOrRefreshLigandEnvViewer', ligand.id, chainId, resId, ':', interactionsRawData?.interactions.length);
    });
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  private async destroyLigandEnv() {
    console.log('destroyLigandEnv');
    this.ligandEnvQueue.enqueue(async () => {
      // to destroy ligand env we use removeChild and reset all variables related to it's loading status
      if (this.ligandEnvContainer && this.ligandEnvContainer.nativeElement) {
        const imageContainer = this.ligandEnvContainer.nativeElement;
        this.renderer.removeChild(imageContainer, this.ligandEv);
      }

      this.ligandEv = undefined;

      // unfortunately needed so destruction happens syncronously
      await firstValueFrom(timer(100));
    });
  }

  /** Return list of interactions which match `searchQuery`. Return all interactions if `searchQuery` is empty/undefined/null. */
  private filterItemsBySearchQuery(searchQuery: string | null | undefined, items: Interaction[]): Interaction[] {
    if (!searchQuery) return items;
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      const residueName = item.end.chem_comp_id.toString() + '_' + item.end.author_residue_number.toString();
      const atomName = item.end.atom_names.join(',');
      const interactionType = item.interaction_details.map(standardizeInteractionType).join(',');
      const distance = item.distance;
      const ligandAtom = item.ligand_atoms.join(',');
      const rowString = residueName + atomName + interactionType + distance + ligandAtom;
      return rowString.toLocaleLowerCase().includes(searchQueryLower);
    });
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
  }

  async onCellMouseOver(event: CellMouseOverEvent<Interaction>) {
    await this.tableHoverMutex.run(() => this._handleCellMouseOver(event));
  }

  async onCellMouseOut() {
    await this.tableHoverMutex.run(() => this._handleCellMouseOut());
  }

  private async _handleCellMouseOver(event: CellMouseOverEvent<Interaction>) {
    const int = event.data;
    if (!int) return;

    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    const molstarSelection = this.dropdown.selectedOption()?.data.molstarSelection;
    if (!molstarSelection) return;
    const chainId = molstarSelection[0].auth_asym_id;
    const residueId = molstarSelection[0].auth_seq_id;
    const resIns = molstarSelection[0].pdbx_PDB_ins_code;

    const instance_id = this.selectedInstanceId();

    const defaultInstance = this.displayedAssemblyId() === undefined ? undefined : 'ASM-1';
    const [residueChain, residueInstance] = chainIdAndInstanceIdFromRenamedChain(int.end.chain_id, defaultInstance);
    const residueNum = int.end.author_residue_number;
    const residueIns = normalizeInsertionCode(int.end.author_insertion_code);

    const atomSelections: QueryParamForHelpers[] = [
      {
        auth_asym_id: chainId,
        auth_seq_id: residueId,
        pdbx_PDB_ins_code: normalizeInsertionCode(resIns),
        atoms: int.ligand_atoms,
        instance_id,
      },
      {
        auth_asym_id: residueChain,
        auth_seq_id: residueNum,
        pdbx_PDB_ins_code: residueIns,
        atoms: int.end.atom_names,
        instance_id: residueInstance,
      },
    ];
    await instance.visual.highlight({ data: atomSelections });
  }

  private async _handleCellMouseOut() {
    const instance = this._molstarComponent?.getInstance();
    if (!instance) return;
    await instance.visual.clearHighlight();
  }

  public downloadCSV(): void {
    const mappedData = this.filteredInteractionsRows()?.map((row) => {
      return {
        'Ligand Atoms': row.ligand_atoms.join(', '),
        'Interacting Molecule': this.getMoleculeName(row.end.chain_id),
        Residue: row.end.chem_comp_id + '_' + row.end.author_residue_number,
        Atoms: row.end.atom_names.join(','),
        'Interaction Type': row.interaction_details.map(standardizeInteractionType).join(', '),
        'Distance (Å)': row.distance,
      };
    });
    if (mappedData && mappedData.length) {
      this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
    }
  }

  private getMoleculeName(chainId: string) {
    const chainToEntityId = this.chainToEntityId();
    if (!chainToEntityId) return 'Undefined';

    const entityId = chainToEntityId[chainId];
    if (!entityId) return 'Undefined';

    const macromolecules = this.macromolecules();
    if (macromolecules === undefined || macromolecules.length === 0) return 'Undefined';

    const mols = macromolecules.filter((mol) => mol.entity_id === parseInt(entityId));
    if (mols.length === 0) return 'Undefined';

    return mols[0].molecule_name[0]; //.replace(/\s/g, "_");
  }

  public mapSynonyms(synonyms: any[]): string {
    return synonyms.map((synonym) => synonym.value).join(', ');
  }
}

// TODO: Fix mapping of instance_id vs API chain numbering for MVS and for residToInstanceId (e.g. 1e94: chain E in ASM-1 -> E, ASM-3 -> E_3 (should be E_2), ASM-5 -> E_5 (should be E_3)
function chainNameForInteractionsApi(authAsymId: string, instanceId: string | undefined) {
  const symOpForInteractions = instanceId && instanceId !== 'ASM-1' ? '_' + instanceId.split('-')[1] : '';
  return `${authAsymId}${symOpForInteractions}`;
}
function chainIdAndInstanceIdFromRenamedChain(renamedChain: string, fallbackInstanceId: string | undefined): [chainId: string, instanceId: string | undefined] {
  const [chainId, instanceNum] = renamedChain.split('_');
  return [chainId, instanceNum !== undefined ? `ASM-${instanceNum}` : fallbackInstanceId];
}

function getInteractionLegendItems(colors: Record<string, string>, labels: Record<string, string>) {
  return Object.entries(labels).map(([key, label]) => ({
    /** Unique key */
    key,
    /** Interaction type name to display */
    label,
    color: colors[key] || '#000000', // default color if not found
  }));
}
