/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, Renderer2, signal, ViewChild } from '@angular/core';
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
  TruncateTextDirective,
  UtilService,
} from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { MolstarComponent, MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { AgGridAngular } from 'ag-grid-angular';
import { CellMouseOverEvent, SelectionChangedEvent } from 'ag-grid-community';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, take, timer } from 'rxjs';
import { EntryApiService } from '../../services/entry-api.service';
import { Interaction, InteractionFromAPI } from '../../data-models/interaction.model';
import { Molecule } from '../../data-models/molecule.model';
import { dashboardStatLinks, INTX_NAME_COLORS, symmOperatorTooltip } from '../../entry-constant';
import { interactionsToMolstar, MVSAtomInteraction, normalizeInsertionCode } from '../../helpers/interactions-to-molstar-sel-obj';
import { makeEntityColors, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams, QueryParamForHelpers } from '../../helpers/molstar-helpers';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import { getCleanSelectionName, getLigandsDropdownOptions } from '../../helpers/processed-data-to-controls';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { ProcessedLigandOrMod } from '../../store/data-processing/ligand-processing';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntryActions } from '../../store/entry.actions';
import { EntrySelectors } from '../../store/entry.selectors';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { colDefs, gridOptions } from './ag-grid';
import { INTX_NAME_STANDARDIZER } from './interaction-type.component';

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
  private readonly molstarPluginService = inject(MolstarPluginService);
  private readonly scriptLoader = inject(ScriptLoaderService);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly symmOperatorTooltip = symmOperatorTooltip;

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: QueryParamForHelpers[] } = {};

  public symmetryDropdownSelected?: string;
  public symmetryDropdownOptions: DownloadOption[] = [];

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

  public residToInstanceId: { [key: string]: string | undefined } = {};

  public readonly tabDataLoaded = computed(() => this.processedLigands() !== undefined);

  public readonly util = inject(UtilService);

  public readonly legendsColor = this.getInteractionLabelColorArray(INTX_NAME_COLORS, INTX_NAME_STANDARDIZER);

  public getCleanSelectionName = getCleanSelectionName;

  public initialColorCount = signal<number>(4);

  public get isMobile(): boolean {
    return window.innerWidth <= 768; // typical mobile breakpoint
  }

  public readonly ligandTableRows = computed(() => {
    const rows = this.processedLigands();
    if (rows === undefined) return [];
    return rows;
  });

  public currentLigandDatum = signal<ProcessedLigandOrMod | undefined>(undefined);

  public selectionIdentifier = 'None';
  public selectionTypeText?: string;

  @ViewChild('ligandEnvContainer') ligandEnvContainer!: ElementRef;
  private ligandEv: any;
  public hasLigandEnv = false;

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

  public inPrefAssembly = signal(true);
  public inPrefAssemblyForInstance = signal(true);

  public messageNoInteractions = computed(() => {
    const inPrefAssemblyForInstance = this.inPrefAssemblyForInstance();
    if (inPrefAssemblyForInstance === false) return 'Interactions are only calculated for ligands of the preferred assembly';
    return 'No ligand interactions found';
  });

  public readonly configForMolstar = computed(() => ({
    ...EntryPageTabsCommonMolstarParams,
    granularity: 'element',
  }));

  private currentChainId = signal<string | undefined>(undefined);
  private currentResidueId = signal<string | undefined>(undefined);

  public readonly isInitialInteractionsMoreThanOne = computed(() => {
    const chainId = this.currentChainId();
    const residueId = this.currentResidueId();
    if (!chainId || !residueId) return false;
    const interactionsFromApi = this.interactions();
    if (!interactionsFromApi) return false;
    const interaction = interactionsFromApi[chainId][residueId].interactions;
    return interaction && interaction.length > 1;
  });

  public searchTerm = new FormControl('');
  private noTermFiltering = signal<boolean>(false);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;

  public interactionsRawData = signal<InteractionFromAPI | undefined>(undefined);
  public interactionsRowData = signal<Interaction[] | undefined>(undefined);

  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  // public selectionStats: { [key: string]: any } | undefined;
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

  private getInteractionLabelColorArray(colors: Record<string, string>, labels: Record<string, string>): { label: string; color: string }[] {
    return Object.entries(labels).map(([key, label]) => ({
      label,
      color: colors[key] || '#000000', // default color if not found
    }));
  }

  private async updateInPrefAssemblyForInstance(ligand: ProcessedLigandOrMod) {
    // check if ligand instance is in pref assembly based on idx of ligand instance
    const ligInstanceIdx = Object.keys(this.dropdownOptionsToMolstar).indexOf(this.dropdownSelected);
    const isSelectionPrefAssembly = ligand.additionalData.selectionsInPrefAssembly[ligInstanceIdx];
    this.inPrefAssemblyForInstance.set(isSelectionPrefAssembly);
  }

  async triggerLigandUpdateSideEffects(ligand: ProcessedLigandOrMod) {
    // update ligand dropdown options
    this.updateDropdownOptions(ligand);
    this.updateSymmetryDropdownOptions(ligand);

    // used in template for dashboard stats
    this.selectionIdentifier = ligand.id;

    // update whether we show the env viewer or not
    await this.updateVisualsDisplayed(ligand);

    // check if molstar config needs update and wait for it
    await this.updateInPrefAssemblyForInstance(ligand);
    const allLigandsInPrefAssembly = ligand.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly === true);
    this.inPrefAssembly.set(allLigandsInPrefAssembly);

    // update visualisations with data
    // get interactions data, create ligand selection, zoom in ligand
    this.renderInMolstar(ligand);

    // if (this.ligandEv === undefined && this.hasLigandEnv) {
    //   const interactionRawData = this.interactionsRawData();
    //   // refresh data to ligand env viewer
    //   await this.initOrRefreshLigandEnvViewer(ligand, interactionRawData);
    // }
  }

  updateDropdownOptions(ligand: ProcessedLigandOrMod) {
    this.dropdownOptionsToMolstar = getLigandsDropdownOptions(ligand);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `lig-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];
  }

  updateSymmetryDropdownOptions(ligand: ProcessedLigandOrMod) {
    // update for symmetry operations dropdown
    const idxOfSelection = Object.keys(this.dropdownOptionsToMolstar).indexOf(this.dropdownSelected);
    const ligandSymmOperators = idxOfSelection > -1 ? ligand.symmOpListForEachLigOrMod[idxOfSelection] : undefined;

    if (ligandSymmOperators) {
      this.symmetryDropdownOptions = ligandSymmOperators.map((op, idx) => {
        return {
          name: op,
          url: `domain-0-symop-${idx + 1}`,
          downloadable: false,
        };
      });
      this.symmetryDropdownSelected = this.symmetryDropdownOptions.length > 0 ? this.symmetryDropdownOptions[0].name : undefined;
    } else {
      this.symmetryDropdownSelected = undefined;
      this.symmetryDropdownOptions = [];
    }
  }

  async updateVisualsDisplayed(ligand: ProcessedLigandOrMod) {
    // modification is a special case for Ligands table in which lig env viewer is not displayed
    if (ligand.type.includes('modification') === false) {
      this.hasLigandEnv = true;
    } else {
      // if it is a ligand
      // we await destruction of current ligand env viewer (if there is one) and resetting of loading status vars
      this.hasLigandEnv = false;
      await this.destroyLigandEnv();
    }
  }

  private getMvsSnapshotSpec(mvsAtomInteractions: MVSAtomInteraction[] | undefined): SnapshotSpec | undefined {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    if (!molstarSelection) return undefined;

    const authAsymId = molstarSelection[0].auth_asym_id;
    const authSeqId = molstarSelection[0].auth_seq_id;
    const authInsCode = molstarSelection[0].pdbx_PDB_ins_code ?? '';
    if (authAsymId === undefined) throw new Error('authAsymId is undefined');
    if (authSeqId === undefined) throw new Error('authSeqId is undefined');

    return {
      name: 'Ligand environment',
      kind: 'pdbconnect_environment',
      params: {
        entry: entryId,
        assemblyId: this.displayedAssemblyId(),
        authAsymId,
        authSeqId,
        authInsCode,
        instanceId: this.symmetryDropdownSelected || undefined,
        atomInteractions: mvsAtomInteractions ?? 'builtin',
        // atomInteractions: mvsAtomInteractions ?? 'none',
        volumeStreaming: true,
        entityColors: this.entityColors(),
      },
    };
  }

  async triggerLigandInteractionsSideEffects(rawInteractions: InteractionFromAPI | undefined) {
    const interactions = rawInteractions?.interactions;
    if (!interactions) return;
    const ligand = this.currentLigandDatum();
    if (!ligand) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    if (!molstarSelection) return;

    if (rawInteractions) await this.initOrRefreshLigandEnvViewer(ligand, rawInteractions);

    const instanceId = this.symmetryDropdownSelected || undefined;
    const mvsInteractions = interactionsToMolstar(ligand, molstarSelection, interactions, instanceId);

    this.residToInstanceId = mvsInteractions.residToInstanceId;

    this.mvsSnapshotSpec$.next(this.getMvsSnapshotSpec(mvsInteractions.interactionsMolstarSelections));

    // TODO: Refactor use of residToInstanceId
    // TODO: Fix mapping of instance_id vs API chain numbering for MVS and for residToInstanceId (e.g. 1e94: chain E in ASM-1 -> E, ASM-3 -> E_3 (should be E_2), ASM-5 -> E_5 (should be E_3)
    // TODO: Fix weird table behavior when the user changes to a ligand with no interaction data
  }

  private readonly ligandEnvMutex = Mutex('ligandEnvMutex');
  private readonly tableHoverMutex = Mutex('tableHoverMutex');

  constructor() {
    this.ligandEnvMutex.run(async () => {
      // await this.scriptLoader.loadScript('https://d3js.org/d3.v5.min.js', true);
      await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-3.0.0-min.js', true);
    });

    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });
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

  private readonly mvsSnapshotSpec$ = new BehaviorSubject<SnapshotSpec | undefined>(undefined);

  ngAfterViewInit(): void {
    this.viewReady.set(true);

    this.compCommunication.ligandSelection$.pipe(debounceTime(50), distinctUntilChanged()).subscribe(async (idx) => {
      if (idx === undefined || idx === null) return;
      const datum = this.ligandTableRows()[idx];
      if (datum) {
        this.currentLigandDatum.set(datum);
        await this.triggerLigandUpdateSideEffects(datum);
      }
    });

    this.interactionsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((allInteractions) => {
      const chainId = this.currentChainId();
      const residueId = this.currentResidueId();
      const symOpForInteractions =
        this.symmetryDropdownSelected && this.symmetryDropdownSelected !== 'ASM-1' ? '_' + this.symmetryDropdownSelected.split('-')[1] : '';
      const chainForInteractions = `${chainId}${symOpForInteractions}`;
      if (!chainId || !residueId) return;
      const interactionsFromApi = allInteractions[chainForInteractions][residueId];
      // only update if no search term
      if (!this.searchTerm.value) {
        this.triggerLigandInteractionsSideEffects(interactionsFromApi);
      }
      const interactions = interactionsFromApi.interactions;
      this.interactionsRawData.set(interactionsFromApi);
      this.interactionsRowData.set(interactions);
    });

    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          const chainId = this.currentChainId();
          const residueId = this.currentResidueId();
          if (!chainId || !residueId) return undefined;
          const allInteractions = this.interactions();
          if (!allInteractions || Object.keys(allInteractions).length === 0) return undefined;
          if (Object.keys(allInteractions).indexOf(chainId) === -1) return undefined;
          if (Object.keys(allInteractions[chainId]).indexOf(residueId) === -1) return undefined;
          const interactionsFromApiToFilter = allInteractions[chainId][residueId] ?? [];
          const filteredInteractions = searchQuery
            ? this.filterItemsBySearchQuery(searchQuery, interactionsFromApiToFilter.interactions)
            : interactionsFromApiToFilter.interactions;

          const interactionsFromApiFiltered: InteractionFromAPI = {
            ...interactionsFromApiToFilter,
            interactions: filteredInteractions,
          };
          // interactionsFromApi.interactions = filteredInteractions;
          // return searchQuery ? this.filterItemsBySearchQuery(searchQuery, interactionsFromApi.interactions) : interactionsFromApi.interactions;
          return interactionsFromApiFiltered;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((interactionsFromApiFiltered) => {
        if (this.noTermFiltering() === false) {
          this.interactionsRawData.set(interactionsFromApiFiltered);
          this.triggerLigandInteractionsSideEffects(interactionsFromApiFiltered);
          this.interactionsRowData.set(interactionsFromApiFiltered?.interactions);
        }
        this.noTermFiltering.set(false);
      });
  }

  public toggleColorList(): void {
    const colorList = this.legendsColor ?? [];
    this.initialColorCount.update((prev) => (prev === 4 ? colorList.length : 4));
  }

  private async renderInMolstar(ligand: ProcessedLigandOrMod) {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    const chainId = molstarSelection[0].auth_asym_id;
    const residueId = molstarSelection[0].auth_seq_id;

    this.currentChainId.set(chainId);
    this.currentResidueId.set(`${residueId}`);

    this.noTermFiltering.set(true);
    this.searchTerm.setValue('');
    this.interactionsRawData.set(undefined);
    this.interactionsRowData.set([]);

    const inPrefAssemblyForInstance = this.inPrefAssemblyForInstance();
    const symOpForInteractions = this.symmetryDropdownSelected && this.symmetryDropdownSelected !== 'ASM-1' ? '_' + this.symmetryDropdownSelected.split('-')[1] : '';
    const chainForInteractions = `${chainId}${symOpForInteractions}`;
    if (inPrefAssemblyForInstance) {
      this.globalStore.dispatch(
        EntryActions.getInteractions({
          chainId: chainForInteractions ?? '',
          residueId: `${residueId}`,
        })
      );
    }
    if (ligand.type === 'modification') {
      this.interactionsRawData.set(undefined);
      this.interactionsRowData.set(undefined);
    }

    this.mvsSnapshotSpec$.next(this.getMvsSnapshotSpec(undefined));
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // all possible rendering functions are called for a dashboard
    const ligand = this.currentLigandDatum();
    if (!ligand) return;
    this.updateSymmetryDropdownOptions(ligand);

    // check if molstar config needs update and wait for it
    await this.updateInPrefAssemblyForInstance(ligand);

    // get interactions data, create ligand selection, zoom in ligand
    this.renderInMolstar(ligand);
    const interactionRawData = this.interactionsRawData();

    // refresh data to ligand env viewer
    await this.initOrRefreshLigandEnvViewer(ligand, interactionRawData);
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdownSelected = event;

    const ligand = this.currentLigandDatum();
    if (!ligand) return;
    await this.renderInMolstar(ligand);
    const interactionRawData = this.interactionsRawData();

    // refresh data to ligand env viewer
    await this.initOrRefreshLigandEnvViewer(ligand, interactionRawData);
  }

  private async initOrRefreshLigandEnvViewer(ligand: ProcessedLigandOrMod, interactionsRawData?: InteractionFromAPI) {
    const ligandId = ligand.id;
    // ligand env viewer is only shown for ligands tab. data is retrieved from dropdown
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const resId = molstarSelection[0].auth_seq_id;
    const chainId = molstarSelection[0].auth_asym_id!;

    // this.resetLigEnvRenderer();
    if (!this.viewReady()) {
      await firstValueFrom(
        toObservable(this.viewReady).pipe(
          filter((ready) => ready),
          take(1)
        )
      );
    }
    const imageContainer = this.ligandEnvContainer.nativeElement;

    this.ligandEnvMutex.run(async () => {
      const depiction = await firstValueFrom(this.entryApiService.fetchDepiction(ligandId).pipe(takeUntilDestroyed(this.destroyRef)));

      if (this.ligandEv) {
        this.renderer.removeChild(imageContainer, this.ligandEv);
        this.ligandEv = undefined;
      }

      await customElements.whenDefined('pdb-ligand-env');
      const ligandComp = this.renderer.createElement('pdb-ligand-env');
      ligandComp.menuOn = true;
      ligandComp.zoomControlsOn = true;

      // this.renderer.setAttribute(ligandComp, 'pdb-id', this.entryId() ?? ''.toLowerCase());
      this.renderer.appendChild(imageContainer, ligandComp);
      // ligandComp.display.initLigandInteraction = () => {
      //   ligandComp.chainId = chainId;
      // };
      this.renderer.setProperty(ligandComp, 'depiction', depiction);
      this.ligandEv = ligandComp;
      this.ligandEv.pdbId = `${this.entryId()}`;
      this.ligandEv.chainId = chainId;
      this.ligandEv.resId = resId;
      this.ligandEv.display.pdbId = `${this.entryId()}`;
      this.ligandEv.display.chainId = chainId;
      this.ligandEv.display.resId = resId;
    });
    if (interactionsRawData) {
      this.ligandEnvMutex.run(async () => {
        const dataToLigEnv: { [key: string]: InteractionFromAPI[] } = {};
        const copiedInteractions = JSON.parse(JSON.stringify(interactionsRawData));
        dataToLigEnv[`${this.entryId()}`] = [copiedInteractions];
        try {
          await this.ligandEv.display.addLigandInteractions(dataToLigEnv, false);
        } catch (err) {
          console.error('Failed to add ligand interactions:', err);
          return;
        }

        this.ligandEv.display.centerScene();

        // const links = this.ligandEv.display.links;
        // links.selectAll('line').on('mouseenter', null).on('mouseleave', null); // clear previous listeners
        // ... if there is ever a way to use Molstar to select the interactions
        // .on('mouseenter', (ev: any, datum: any) => {
        //   const g = document.querySelectorAll('.pdb-lig-env-svg-bond');
        //   this.ligandEv.display.linkMouseOverEventHandler(datum, datum.index, g);
        // })
        // .on('mouseleave', (ev: any, datum: any) => {
        //   const g = document.querySelectorAll('.pdb-lig-env-svg-bond');
        //   this.ligandEv.display.linkMouseOutEventHandler(datum, datum.index, g);
        // })
      });
    }
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  private async destroyLigandEnv() {
    this.ligandEnvMutex.run(async () => {
      // to destroy ligand env we use removeChild and reset all variables related to it's loading status
      if (this.ligandEnvContainer && this.ligandEnvContainer.nativeElement) {
        const imageContainer = this.ligandEnvContainer.nativeElement;
        this.renderer.removeChild(imageContainer, this.ligandEv);
      }

      if (this.ligandEv) {
        // this.ligandEnvContainer.nativeElement.innerHTML = '';
        this.ligandEv = undefined;
      }

      this.hasLigandEnv = false;
      // unfortunately needed so destruction happens syncronously
      await firstValueFrom(timer(100));
    });
  }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      const residueName = item.end.chem_comp_id.toString() + '_' + item.end.author_residue_number.toString();
      const atomName = item.end.atom_names.join(',');
      const interactionType = item.interaction_details.map((type: keyof typeof INTX_NAME_STANDARDIZER) => INTX_NAME_STANDARDIZER[type]).join(',');
      const distance = item.distance;
      const ligandAtom = item.ligand_atoms.join(',');
      const rowString = residueName + atomName + interactionType + distance + ligandAtom;
      return rowString.toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
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
    const int = event.data; // fully typed
    if (!int) return;

    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const entityId = molstarSelection[0].label_entity_id;
    const chainId = molstarSelection[0].auth_asym_id;
    const residueId = molstarSelection[0].auth_seq_id;
    const resIns = molstarSelection[0].pdbx_PDB_ins_code;

    const chainToEntityId = this.chainToEntityId();
    if (!chainToEntityId) return;
    const residEntityId = chainToEntityId[int.end.chain_id];

    const instance_id = this.symmetryDropdownSelected ? this.symmetryDropdownSelected : undefined;

    const residueChain = int.end.chain_id.split('_')[0];
    const residueNum = int.end.author_residue_number;
    const residueIns = normalizeInsertionCode(int.end.author_insertion_code);
    const resIdentifier = `${residueChain}|${residueNum}|${residueIns}`;

    const atomSelections: QueryParamForHelpers[] = [
      {
        label_entity_id: `${entityId}`,
        auth_asym_id: chainId,
        auth_seq_id: residueId,
        pdbx_PDB_ins_code: normalizeInsertionCode(resIns),
        atoms: int.ligand_atoms,
        instance_id,
      },
      {
        label_entity_id: `${residEntityId}`,
        auth_asym_id: residueChain,
        auth_seq_id: residueNum,
        pdbx_PDB_ins_code: residueIns,
        atoms: int.end.atom_names,
        instance_id: this.residToInstanceId[resIdentifier],
      },
    ];
    await instance.visual.highlight({ data: atomSelections });
    // await instance.visual.focus(atomSelections);
  }

  private async _handleCellMouseOut() {
    const instance = this._molstarComponent?.getInstance();
    if (!instance) return;
    await instance.visual.clearHighlight();
    // if (this.ligandSelection) await instance.visual.focus(this.ligandSelection);
  }

  public downloadCSV(): void {
    const mappedData = this.interactionsRowData()?.map((row) => {
      return {
        'Ligand Atoms': row.ligand_atoms.join(', '),
        'Interacting Molecule': this.getMoleculeName(row.end.chain_id),
        Residue: row.end.chem_comp_id + '_' + row.end.author_residue_number,
        Atoms: row.end.atom_names.join(','),
        'Interaction Type': row.interaction_details.map((type) => INTX_NAME_STANDARDIZER[type as keyof typeof INTX_NAME_STANDARDIZER]).join(', '),
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
