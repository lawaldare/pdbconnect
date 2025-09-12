/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, Renderer2, signal, ViewChild, OnInit } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { MolstarComponent, MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { getLigandsDropdownOptions } from '../../helpers/processed-data-to-controls';
import { dashboardStatLinks, INTX_NAME_COLORS } from '../../entry-constant';
import { filter, first, firstValueFrom, map, take, tap, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import {
  AG_Grid_Theme_Class,
  DownloadFileTypeService,
  GoogleAnalyticsService,
  MaterialModule,
  PopupWindowService,
  ScriptLoaderService,
  TruncateTextDirective,
  UtilService,
} from '@pdbc/core';
import { CellMouseOverEvent, SelectionChangedEvent } from 'ag-grid-community';
import { INTX_NAME_STANDARDIZER } from './interaction-type.component';
import { AgGridAngular } from 'ag-grid-angular';
import { colDefs, gridOptions } from './ag-grid';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { EntryActions } from '../../store/entry.actions';
import { Interaction, InteractionFromAPI } from '../../data-models/interaction.model';
import { interactionsToMolstar, normalizeInsertionCode } from '../../helpers/interactions-to-molstar-sel-obj';
import { Molecule } from '../../data-models/molecule.model';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import type { QueryParam } from 'pdbe-molstar/lib/helpers';
import type { Interaction as PDBeMolstarInteraction } from 'pdbe-molstar/lib/extensions/interactions';
import {
  componentExistsInMolstar,
  drawSelectionInMolstar,
  Molstar370DefaultParams,
  removeComponent,
  showInteractivityFocusInMolstar,
  zoomOutStructureInMolstar,
} from '../../helpers/molstar-helpers';
import { AggregatedApiService } from '../../../ligands/services/aggregated-api.service';
import { Depiction } from '../../../ligands/data-models/structure.model';
import { ProcessedLigandOrMod } from '../../store/data-processing/ligand-processing';
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
  ],
  templateUrl: './ligands-tab.component.html',
  styleUrl: './ligands-tab.component.scss',
})
export class LigandsTabComponent implements OnInit {
  /**
   * TODO:
   * 6. Add numbers here
   * 10. Timesheets
   */
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly molstarPluginService = inject(MolstarPluginService);
  private readonly scriptLoader = inject(ScriptLoaderService);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  public dashboardStatLinks = dashboardStatLinks;
  public readonly gAS = inject(GoogleAnalyticsService);
  private aggregatedApiService = inject(AggregatedApiService);

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

  public readonly tabDataLoaded = computed(() => this.processedLigands() !== undefined);

  public readonly util = inject(UtilService);

  public readonly legendsColor = this.getInteractionLabelColorArray(INTX_NAME_COLORS, INTX_NAME_STANDARDIZER);

  public initialColorCount = signal<number>(4);

  public get isMobile(): boolean {
    return window.innerWidth <= 768; // typical mobile breakpoint
  }

  public readonly ligandTableRows = computed(() => {
    const rows = this.processedLigands();
    if (rows === undefined) return [];
    return rows;
  });

  private previousDatumIdx?: number;
  public currentLigandDatum = computed(() => {
    const selectedIdx = this.selectedLigandIdx() ?? 0;
    const rows = this.ligandTableRows();
    const datum = rows[selectedIdx];
    if (!datum) return;

    if (selectedIdx === this.previousDatumIdx) return datum;
    this.previousDatumIdx = selectedIdx;

    if (datum) {
      this.triggerLigandUpdateSideEffects(datum);
    }
    return datum;
  });

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

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

  public readonly configForMolstar = computed(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: preferredAssemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      landscape: true,
      subscribeEvents: true,
      granularity: 'element',
      // 'granularity': 'residue',
      hideControls: true,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'entity-id',
          // 'color': 'uniform',
          // 'colorParams': { value: Color(0xfefefe) },
        },
        het: {
          type: 'ball-and-stick',
          color: 'entity-id',
        },
      },
      loadMaps: true,
      mapSettings: { defaultView: 'selection-box' },
    };

    return configForMolstar;
  });

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
    if (datum && datum.type === 'ligand') {
      return (datum.additionalData.source as any).bound_details;
    }
    return undefined;
  });

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  public readonly popService = inject(PopupWindowService);

  public popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.molstarContainer, 'ligand-molstar');
    }
  }

  private getInteractionLabelColorArray(colors: Record<string, string>, labels: Record<string, string>): { label: string; color: string }[] {
    return Object.entries(labels).map(([key, label]) => ({
      label,
      color: colors[key] || '#000000', // default color if not found
    }));
  }

  async triggerLigandUpdateSideEffects(ligand: ProcessedLigandOrMod) {
    // update ligand dropdown options
    this.updateDropdownOptions(ligand);

    // used in template for dashboard stats
    this.selectionIdentifier = ligand.id;

    // update whether we show the env viewer or not
    await this.updateVisualsDisplayed(ligand);

    // update visualisations with data
    await this.renderInMolstar(ligand);
    await this.initOrRefreshLigandEnvViewer(ligand);
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

  private selectionData?: QueryParam[];
  private ligandSelection?: QueryParam[];
  private residuesAsSticks?: QueryParam[];

  async triggerLigandInteractionsSideEffects(rawInteractions: InteractionFromAPI | undefined) {
    const interactions = rawInteractions ? rawInteractions.interactions : undefined;
    const ligand = this.currentLigandDatum();
    if (!ligand) return;
    if (interactions === undefined) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    if (!molstarSelection) return;

    // await until molstar first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready === true),
        first()
      )
    );

    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;

    if (!this.molstarPluginService.PDBeMolstarPluginClass) return;
    await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.clearInteractions(instance);

    const { residuesMolstarSelections, interactionsMolstarSelections } = interactionsToMolstar(ligand, molstarSelection, interactions);

    const pdbeInteractions = interactionsMolstarSelections as unknown as PDBeMolstarInteraction[];

    const residueSelectionData: QueryParam[] = residuesMolstarSelections.map((resid) => {
      // TODO: Once endpoint has entity_id data use it to map colours
      return {
        ...resid,
        // type_symbol: ['C'],
        representation: 'ball-and-stick',
        // representationColor: '#d3d3d3',
        focus: false,
      };
    });
    this.residuesAsSticks = residueSelectionData;
    this.selectionData = this.ligandSelection ? [...this.ligandSelection] : [];
    this.selectionData.push(...residueSelectionData);
    await this.onDrawSelectionInMolstar();

    this.molstarSelectionMutex = this.molstarSelectionMutex.then(async () => {
      await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.clearInteractions(instance);
      await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.loadInteractions(instance, { interactions: pdbeInteractions, structureId: 1 });
    });

    if (rawInteractions) await this.loadInteractionsLigandEnvViewer(rawInteractions);
  }

  private ligandEnvMutex = Promise.resolve();
  private ligandEnvToken = 0;

  constructor() {
    this.ligandEnvMutex = this.ligandEnvMutex.then(async () => {
      await this.scriptLoader.loadScript('https://d3js.org/d3.v5.min.js', true);
      await this.scriptLoader.loadScript('./assets/pdb-ligand-env-component-2.0.0-min.js', true);
    });
  }

  ngOnInit(): void {
    /* 1. Fetch data */
    this.interactionsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((allInteractions) => {
      const chainId = this.currentChainId();
      const residueId = this.currentResidueId();
      if (!chainId || !residueId) return;
      const interactionsFromApi = allInteractions[chainId][residueId];
      // only update if no search term
      if (!this.searchTerm.value) {
        this.triggerLigandInteractionsSideEffects(interactionsFromApi);
      }
      const interactions = interactionsFromApi.interactions;
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

    const entityId = molstarSelection[0].entity_id;
    const chainId = molstarSelection[0].auth_asym_id!;
    const residueId = molstarSelection[0].auth_residue_number!;

    this.currentChainId.set(chainId);
    this.currentResidueId.set(`${residueId}`);

    this.noTermFiltering.set(true);
    this.searchTerm.setValue('');
    this.interactionsRowData.set([]);

    this.globalStore.dispatch(
      EntryActions.getInteractions({
        chainId: chainId ?? '',
        residueId: `${residueId}`,
      })
    );
    if (ligand.type === 'modification') {
      this.interactionsRowData.set(undefined);
    }

    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    // Access Molstar instance
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;

    const entityColor = ligand.molstarColorHex;
    const componentQuery = ligand.type === 'modification' ? 'non-standard' : 'ligand';
    const hasLigandsOrMod = await componentExistsInMolstar(instance, componentQuery);
    this.ligandSelection = [
      {
        ...molstarSelection[0],
        color: entityColor,
        focus: true,
        ...(hasLigandsOrMod === false && {
          representation: 'ball-and-stick',
          representationColor: ligand.molstarColorHex,
        }),
      },
    ];
    this.selectionData = [...this.ligandSelection];

    const durationMs = this._molstarComponent ? 1200 : 0;
    this.molstarSelectionMutex = this.molstarSelectionMutex.then(async () => {
      await zoomOutStructureInMolstar(instance, durationMs);
    });

    timer(durationMs + 100).subscribe(async () => {
      await this.onDrawSelectionInMolstar();
    });
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // all possible rendering functions are called for a dashboard
    const ligand = this.currentLigandDatum()!;
    await this.renderInMolstar(ligand);
    await this.initOrRefreshLigandEnvViewer(ligand);
  }

  private async waitForLigandEnvReady(maxWaitMs = 5000, intervalMs = 100, onlyDepiction = true): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const noInteractionsElement = document.querySelector('text.pdb-lig-env-svg-node');
      noInteractionsElement?.remove();
      if (onlyDepiction && this.ligandEv?.display?.depiction) return;
      else if (onlyDepiction === false && this.ligandEv?.display?.nodes && this.ligandEv?.display?.links) {
        return;
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error('LigandEnv display nodes/links not ready within timeout');
  }

  private async loadInteractionsLigandEnvViewer(interactionsRawData: InteractionFromAPI) {
    const token = this.ligandEnvToken;
    this.ligandEnvMutex = this.ligandEnvMutex.then(async () => {
      const dataToLigEnv: { [key: string]: InteractionFromAPI[] } = {};
      const copiedInteractions = JSON.parse(JSON.stringify(interactionsRawData));
      dataToLigEnv[`${this.entryId()}`] = [copiedInteractions];
      this.ligandEv.display.addLigandInteractions(dataToLigEnv, false);

      await this.waitForLigandEnvReady(5000, 100, false);
      if (token !== this.ligandEnvToken) return;
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (token !== this.ligandEnvToken) return;

      this.ligandEv.display.centerScene();

      // // configure interactivity for dynamic data load
      const nodes = this.ligandEv.display.nodes;
      nodes
        .filter((datum: any) => !datum.residue.isLigand)
        //   .on('mouseenter', null)
        //   .on('mouseleave', null) // clear previous listeners
        .on('mouseenter', (datum: any, i: number, g: any) => {
          //     const g = document.querySelectorAll('.pdb-lig-env-svg-node');
          this.ligandEv.display.nodeMouseoverEventHandler(datum, i, g);
          const instance = this._molstarComponent?.getInstance() ?? null;
          if (!instance) return;
          const authorInsertionCode = datum.residue.authorInsertionCode.replaceAll(' ', '');
          this.molstarSelectionMutex = this.molstarSelectionMutex.then(() =>
            instance.visual.highlight({
              data: [
                {
                  auth_asym_id: datum.residue.chainId,
                  auth_residue_number: datum.residue.authorResidueNumber,
                  auth_ins_code_id: authorInsertionCode,
                },
              ],
            })
          );
        })
        .on('mouseleave', (datum: any, i: number, g: any) => {
          //     const g = document.querySelectorAll('.pdb-lig-env-svg-node');
          //     this.ligandEv.display.nodeMouseoutEventHandler(datum, datum.index - 1, g);
          this.ligandEv.display.nodeMouseoutEventHandler(datum, i, g);
          const instance = this._molstarComponent?.getInstance() ?? null;
          if (!instance) return;
          this.molstarSelectionMutex = this.molstarSelectionMutex.then(() => instance.visual.clearHighlight());
        });

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

  private async initOrRefreshLigandEnvViewer(ligand: ProcessedLigandOrMod) {
    const ligandId = ligand.id;
    // ligand env viewer is only shown for ligands tab. data is retrieved from dropdown
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const resId = molstarSelection[0].auth_residue_number!;
    const chainId = molstarSelection[0].auth_asym_id!;

    // this.resetLigEnvRenderer();
    const imageContainer = this.ligandEnvContainer.nativeElement;

    const token = this.ligandEnvToken;
    this.aggregatedApiService
      .fetchDepiction(ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async (depiction: Depiction) => {
        this.ligandEnvMutex = this.ligandEnvMutex.then(async () => {
          if (token !== this.ligandEnvToken) return;
          if (this.ligandEv) {
            this.renderer.removeChild(imageContainer, this.ligandEv);
            this.ligandEv = undefined;
          }

          const ligandComp = this.renderer.createElement('pdb-ligand-env');
          // this.renderer.setAttribute(ligandComp, 'pdb-id', this.entryId() ?? ''.toLowerCase());
          this.renderer.appendChild(imageContainer, ligandComp);
          // ligandComp.display.initLigandInteraction = () => {
          //   ligandComp.chainId = chainId;
          // };
          this.renderer.setProperty(ligandComp, 'depiction', depiction);
          this.ligandEv = ligandComp;
          this.ligandEv.display.initLigandInteraction = () => {
            ligandComp.chainId = chainId;
          };
          this.ligandEv.pdbId = `${this.entryId()}`;
          this.ligandEv.chainId = chainId;
          this.ligandEv.resId = resId;
          this.ligandEv.display.pdbId = `${this.entryId()}`;
          this.ligandEv.display.chainId = chainId;
          this.ligandEv.display.resId = resId;
          if (token !== this.ligandEnvToken) return;
          await this.waitForLigandEnvReady(5000, 100, true);
          if (token !== this.ligandEnvToken) return;
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (token !== this.ligandEnvToken) return;
          this.ligandEv.display.centerScene();
        });
      });
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  private async destroyLigandEnv() {
    this.ligandEnvMutex = this.ligandEnvMutex.then(async () => {
      // to destroy ligand env we use removeChild and reset all variables related to it's loading status
      if (this.ligandEv) {
        const imageContainer = this.ligandEnvContainer.nativeElement;
        this.renderer.removeChild(imageContainer, this.ligandEv);
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

  private tableHoverMutex = Promise.resolve();
  private molstarSelectionMutex = Promise.resolve();

  async onDrawSelectionInMolstar() {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;

    this.molstarSelectionMutex = this.molstarSelectionMutex.then(async () => {
      await drawSelectionInMolstar(instance, this.residuesAsSticks);
      await drawSelectionInMolstar(instance, this.ligandSelection, undefined, true);
      await showInteractivityFocusInMolstar(instance, this.ligandSelection);
      await removeComponent(instance, 'structure-focus-target-sel');
      await removeComponent(instance, 'structure-focus-surr-sel');
    });
    await this.molstarSelectionMutex;
  }

  async onCellMouseOver(event: CellMouseOverEvent<Interaction>) {
    this.tableHoverMutex = this.tableHoverMutex.then(() => this._handleCellMouseOver(event));
    await this.tableHoverMutex;
  }

  async onCellMouseOut() {
    this.tableHoverMutex = this.tableHoverMutex.then(() => this._handleCellMouseOut());
    await this.tableHoverMutex;
  }

  private async _handleCellMouseOver(event: CellMouseOverEvent<Interaction>) {
    const int = event.data; // fully typed
    if (!int) return;

    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const entityId = molstarSelection[0].entity_id;
    const chainId = molstarSelection[0].auth_asym_id;
    const residueId = molstarSelection[0].auth_residue_number!;
    const resIns = molstarSelection[0].auth_ins_code_id;

    const chainToEntityId = this.chainToEntityId();
    if (!chainToEntityId) return;
    const residEntityId = chainToEntityId[int.end.chain_id];

    const atomSelections: QueryParam[] = [
      {
        entity_id: `${entityId}`,
        auth_asym_id: chainId,
        auth_seq_id: residueId,
        auth_ins_code_id: normalizeInsertionCode(resIns),
        atoms: int.ligand_atoms,
        focus: true,
      },
      {
        entity_id: `${residEntityId}`,
        auth_asym_id: int.end.chain_id,
        auth_seq_id: int.end.author_residue_number,
        auth_ins_code_id: normalizeInsertionCode(int.end.author_insertion_code),
        atoms: int.end.atom_names,
        focus: true,
      },
    ];

    await instance.visual.focus(atomSelections);
    await instance.visual.highlight({ data: atomSelections });
  }

  private async _handleCellMouseOut() {
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;

    const ligand = this.currentLigandDatum();
    if (!ligand) return;

    if (!this.ligandSelection) return;

    this.selectionData = [];
    if (this.ligandSelection) this.selectionData.push(...this.ligandSelection);
    if (this.residuesAsSticks) this.selectionData.push(...this.residuesAsSticks);

    await instance.visual.focus(this.ligandSelection);
    await showInteractivityFocusInMolstar(instance, this.ligandSelection);
    await removeComponent(instance, 'structure-focus-target-sel');
    await removeComponent(instance, 'structure-focus-surr-sel');
    await instance.visual.clearHighlight();
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
