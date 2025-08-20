/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, Renderer2, signal, ViewChild, OnInit } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { LigandsRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { MolstarComponent, MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { getLigandsDropdownOptions } from '../../helpers/processed-data-to-controls';
import { dashboardStatLinks, INTX_NAME_COLORS } from '../../entry-constant';
import { filter, first, firstValueFrom, map, take, timer } from 'rxjs';
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
  TruncateTextDirective,
  UtilService,
} from '@pdbc/core';
import { CellMouseOverEvent, SelectionChangedEvent } from 'ag-grid-community';
import { INTX_NAME_STANDARDIZER } from './interaction-type.component';
import { AgGridAngular } from 'ag-grid-angular';
import { colDefs, gridOptions } from './ag-grid';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryDropdownComponent } from '../entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { EntryActions } from '../../store/entry.actions';
import { Interaction } from '../../data-models/interaction.model';
import { interactionsToMolstar, normalizeInsertionCode } from '../../helpers/interactions-to-molstar-sel-obj';
import { Molecule } from '../../data-models/molecule.model';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Structure } from 'molstar/lib/mol-model/structure';
import { Interaction as PDBeMolstarInteraction } from 'pdbe-molstar/lib/extensions/interactions/index';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PresetStructureRepresentations } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset';
import { DownloadStructure } from 'molstar/lib/mol-plugin-state/actions/structure';
import { drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../helpers/molstar-helpers';

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
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly molstarPluginService = inject(MolstarPluginService);

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  public dashboardStatLinks = dashboardStatLinks;
  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public readonly selectedLigandIdx = toSignal(this.compCommunication.ligandSelection$);

  public readonly util = inject(UtilService);

  public readonly legendsColor = this.getInteractionLabelColorArray(INTX_NAME_COLORS, INTX_NAME_STANDARDIZER);

  public initialColorCount = signal<number>(4);

  public get isMobile(): boolean {
    return window.innerWidth <= 768; // typical mobile breakpoint
  }

  public readonly ligandTableRows = computed(() => {
    const isLoaded = this.compCommunication.hasProcessedLigands();
    if (!isLoaded) return [];
    return this.compCommunication.processedLigandsAndModifications;
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
  private ligandEnvInstance: any;
  private ligandEnvLoaded = false;
  public hasLigandEnv = false;
  private ligandEnvSelection: {
    resId: number;
    chainId: string;
  } = {
    resId: -1,
    chainId: '-1',
  };

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

  public readonly configForMolstar = computed<InitParams | undefined>(() => {
    const summary = this.summaryData();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar: InitParams = {
      ...DefaultParams,
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
    };

    return configForMolstar;
  });

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactionsObservable = this.globalStore.select(EntrySelectors.interactions);
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));
  public readonly summaryData = toSignal(this.globalStore.select(EntrySelectors.summaryData));

  public readonly isInitialInteractionsMoreThanOne = computed(() => {
    const interaction = this.interactions();
    return interaction && interaction.length > 1;
  });

  public searchTerm = new FormControl('');
  private noTermFiltering = signal<boolean>(false);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;

  public interactionsRowData = signal<Interaction[] | undefined>(undefined);

  public paginationPageSizeSelector = signal<number[]>([5, 10, 20]);

  public selectionStats: { [key: string]: any } | undefined;

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

  async triggerLigandUpdateSideEffects(ligand: LigandsRowData) {
    // update ligand dropdown options
    this.updateDropdownOptions(ligand);

    // used in template for dashboard stats
    this.selectionIdentifier = ligand.id;

    // update whether we show the env viewer or not
    await this.updateVisualsDisplayed(ligand);

    // update visualisations with data
    await this.renderInMolstar(ligand);
    await this.initOrRefreshLigandEnvViewer();
  }

  updateDropdownOptions(ligand: LigandsRowData) {
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

  async updateVisualsDisplayed(ligand: LigandsRowData) {
    // modification is a special case for Ligands table in which lig env viewer is not displayed
    if (ligand.type.includes('modification') === false) {
      this.hasLigandEnv = true;
    } else {
      // if it is a ligand
      // we await destruction of current ligand env viewer (if there is one) and resetting of loading status vars
      await this.destroyLigandEnv();
    }
  }

  private selectionData?: QueryParam[];
  private ligandSelection?: QueryParam[];
  private residuesAsSticks?: QueryParam[];

  async triggerLigandInteractionsSideEffects(interactions: Interaction[] | undefined) {
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

    const { residuesMolstarSelections, interactionsMolstarSelections } = interactionsToMolstar(
      ligand,
      molstarSelection,
      interactions,
      this.compCommunication.chainToEntityId()
    );

    // const entityId = molstarSelection.entityId;
    // const chainId = molstarSelection.authChainId;
    // const residueId = molstarSelection.residues[0].authBegin;

    const pdbeInteractions = interactionsMolstarSelections as unknown as PDBeMolstarInteraction[];

    const residueSelectionData: QueryParam[] = residuesMolstarSelections.map((resid) => {
      const macromoleculeOfResidue = this.compCommunication.processedMacromolecules.filter((mm) => `${mm.additionalData.molecule.entity_id}` === resid.entity_id!)[0];
      // const colorToMol = macromoleculeOfResidue.molstarColorHex ? Color(parseInt(macromoleculeOfResidue.molstarColorHex.slice(1), 16)) : undefined;
      return {
        ...resid,
        color: macromoleculeOfResidue.molstarColorHex,
        sideChain: true,
        // representation: "ball-and-stick",
        // representationColor: macromoleculeOfResidue.molstarColorHex,
        focus: false,
      };
    });
    this.residuesAsSticks = residueSelectionData;
    this.selectionData = this.ligandSelection ? [...this.ligandSelection] : [];
    this.selectionData.push(...residueSelectionData);
    await drawSelectionInMolstar(instance, this.selectionData);

    await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.clearInteractions(instance);
    await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.loadInteractions(instance, { interactions: pdbeInteractions, structureId: 1 });
  }

  constructor() {
    // forces molstar to apply 'polymer-and-ligand' component preset when it loads (so ligands, ions, etc always shown)
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((finished) => {
      if (finished && this.compCommunication.currentTabName() === 'ligands') {
        let attempts = 0;
        const maxAttempts = 180; // polling for 3 minutes, 1 attempt every second

        const pollingInterval = setInterval(() => {
          try {
            if (this.compCommunication.currentTabName() !== 'ligands') {
              clearInterval(pollingInterval);
              return;
            }
            const plugin = this._molstarComponent?.getInstance()?.plugin ?? null;
            if (!plugin) throw new Error('Mol* plugin not found');

            const params = DownloadStructure.createDefaultParams(plugin.state.data.root.obj!, plugin);
            const assemblyRef = plugin.managers.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
            const structure = plugin.state.data?.select(assemblyRef)[0]?.obj?.data;
            const thresholds = plugin.config.get(PluginConfig.Structure.SizeThresholds) || Structure.DefaultSizeThresholds;
            const size = Structure.getSize(structure, thresholds);
            if (size !== Structure.Size.Small) {
              PresetStructureRepresentations['polymer-and-ligand'].apply(assemblyRef, params as any, plugin);
            }
          } catch (error) {
            console.warn(`Error during attempt ${attempts + 1} for Mol* initialization:`, error);
          }

          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(pollingInterval); // Stop polling after 3 minutes
            console.warn('Polling expired: Mol* setup was not successful in time.');
          }
        }, 1000); // polling interval: 1 secon
      }
    });
  }

  ngOnInit(): void {
    this.interactionsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((interactions) => {
      // only update if no search term
      if (!this.searchTerm.value) {
        this.triggerLigandInteractionsSideEffects(interactions);
      }
      this.interactionsRowData.set(interactions);
    });

    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          const interactions = this.interactions() ?? [];
          return searchQuery ? this.filterItemsBySearchQuery(searchQuery, interactions) : interactions;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((filtered: Interaction[] | undefined) => {
        if (this.noTermFiltering() === false) {
          this.triggerLigandInteractionsSideEffects(filtered);
          this.interactionsRowData.set(filtered);
        }
        this.noTermFiltering.set(false);
      });
  }

  public toggleColorList(): void {
    const colorList = this.legendsColor ?? [];
    this.initialColorCount.update((prev) => (prev === 4 ? colorList.length : 4));
  }

  private async renderInMolstar(ligand: LigandsRowData) {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    const entityId = molstarSelection[0].entity_id;
    const chainId = molstarSelection[0].auth_asym_id!;
    const residueId = molstarSelection[0].auth_residue_number!;

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
    const entityColor = ligand.molstarColorHex;
    this.ligandSelection = [
      {
        ...molstarSelection[0],
        color: entityColor,
        focus: true,
      },
    ];
    this.selectionData = [...this.ligandSelection];

    const durationMs = this._molstarComponent ? 1200 : 0;
    const instance = this._molstarComponent?.getInstance() ?? null;
    if (!instance) return;
    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;

    // all possible rendering functions are called for a dashboard
    const ligand = this.currentLigandDatum()!;
    await this.renderInMolstar(ligand);
    await this.initOrRefreshLigandEnvViewer();
  }

  private async initOrRefreshLigandEnvViewer() {
    // stop if this dashboard does not have ligand env viewer (initially false and then set in onTableRowSelection according to tabName input)
    if (!this.hasLigandEnv) return;

    // ligand env viewer is only shown for ligands tab. data is retrieved from dropdown
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const resId = molstarSelection[0].auth_residue_number!;
    const chainId = molstarSelection[0].auth_asym_id!;

    // stop if ligand already loaded
    if (this.ligandEnvSelection.resId === resId && this.ligandEnvSelection.chainId === chainId) {
      return;
    }
    if (this.ligandEnvLoaded === false) {
      // on first rendering, create the element properly and set parameters
      this.ligandEnvInstance = this.renderer.createElement('pdb-ligand-env');
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-id', this.entryId() ?? ''.toLowerCase());
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-res-id', `${resId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-chain-id', `${chainId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'environment', `development`);
      const container = this.ligandEnvContainer.nativeElement;
      this.renderer.appendChild(container, this.ligandEnvInstance);
      this.ligandEnvLoaded = true;
    } else {
      // if rendering NOT for the first time, just set parameters
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-res-id', `${resId}`);
      this.renderer.setAttribute(this.ligandEnvInstance, 'pdb-chain-id', `${chainId}`);
      this.ligandEnvInstance.innerHTML = '';
      this.ligandEnvInstance.connectedCallback();
    }
    this.ligandEnvSelection = {
      resId: resId,
      chainId: chainId ?? '',
    };
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }

  private async destroyLigandEnv() {
    // to destroy ligand env we use removeChild and reset all variables related to it's loading status
    if (this.ligandEnvInstance) {
      this.renderer.removeChild(this.elementRef.nativeElement, this.ligandEnvInstance);
      // this.ligandEnvContainer.nativeElement.innerHTML = '';
      this.ligandEnvInstance = undefined;
    }
    this.ligandEnvLoaded = false;
    this.hasLigandEnv = false;
    this.ligandEnvSelection = {
      resId: -1,
      chainId: '-1',
    };
    // unfortunately needed so destruction happens syncronously
    await firstValueFrom(timer(100));
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

    const residEntityId = this.compCommunication.chainToEntityId()[int.end.chain_id];

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

    await instance.visual.focus(this.selectionData);
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
    const entityId = this.compCommunication.chainToEntityId()[chainId];
    if (!entityId) return 'Undefined';

    const hasData = this.compCommunication.hasProcessedMacromolecules();
    if (!hasData) return 'Undefined';
    const macromolecules = this.compCommunication.processedMacromolecules;
    if (macromolecules.length === 0) return 'Undefined';

    const mols = macromolecules.filter((mol) => mol.additionalData.molecule.entity_id === parseInt(entityId));
    if (mols.length === 0) return 'Undefined';

    return mols[0].name.molecule; //.replace(/\s/g, "_");
  }

  public mapSynonyms(synonyms: any[]): string {
    return synonyms.map((synonym) => synonym.value).join(', ');
  }
}
