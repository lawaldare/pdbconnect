/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, Renderer2, signal, ViewChild, OnInit } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { LigandsRowData, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { getLigandsDropdownOptions } from '../../helpers/processed-data-to-controls';
import { dashboardStatLinks } from '../../entry-constant';
import { filter, first, firstValueFrom, map, timer } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { Store } from '@ngrx/store';
import { AG_Grid_Theme_Class, DownloadFileTypeService, MaterialModule, PopupWindowService, TruncateTextDirective, UtilService } from '@pdbc/core';
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
import { MolstarStateService } from '../../services/molstar-state.service';
import { ActionQueueService } from '../../services/action-queue.service';
import { Interaction } from '../../data-models/interaction.model';
import { interactionsToMolstar, normalizeInsertionCode } from '../../helpers/interactions-to-molstar';
import { Molecule } from '../../data-models/molecule.model';

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
  ],
  templateUrl: './ligands-tab.component.html',
  styleUrl: './ligands-tab.component.scss',
})
export class LigandsTabComponent implements OnInit {
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly molstarState = inject(MolstarStateService);
  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());
  readonly molstarReady$ = toObservable(this.molstarFirstRenderFinished);

  private readonly actionQueue = inject(ActionQueueService);

  public readonly dataProcessing = inject(MainDataProcessingFacade);

  public dropdownSelected!: string;
  public dropdownOptions: DownloadOption[] = [];
  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};

  public renderer = inject(Renderer2);
  public elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  public dashboardStatLinks = dashboardStatLinks;

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public readonly selectedLigandIdx = toSignal(this.compCommunication.ligandSelection$);

  public readonly util = inject(UtilService);

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
    resId: string;
    chainId: string;
  } = {
    resId: '-1',
    chainId: '-1',
  };

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactionsObservable = this.globalStore.select(EntrySelectors.interactions);
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));

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

  async triggerLigandInteractionsSideEffects(interactions: Interaction[] | undefined) {
    const ligand = this.currentLigandDatum();
    if (!ligand) return;
    if (interactions === undefined) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    if (!molstarSelection) return;

    // await until molstar first render is finished
    await firstValueFrom(
      this.molstarReady$.pipe(
        filter((ready) => ready === true),
        first()
      )
    );

    const { residuesMolstarSelections, interactionsMolstarSelections } = interactionsToMolstar(
      ligand,
      molstarSelection,
      interactions,
      this.compCommunication.chainToEntityId()
    );

    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const residueId = molstarSelection.residues[0].authBegin;

    this.actionQueue.addAction(
      `renderMolstarInteractions-${ligand.id}-${entityId}-${chainId}-${residueId}-${interactions.length}`,
      async () => {
        await this.molstarState.renderMolstarInteractions(residuesMolstarSelections, interactionsMolstarSelections);
      },
      false // skippable
    );
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

  private async renderInMolstar(ligand: LigandsRowData) {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];

    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const residueId = molstarSelection.residues[0].authBegin;

    this.noTermFiltering.set(true);
    this.searchTerm.setValue('');
    this.interactionsRowData.set([]);

    this.globalStore.dispatch(
      EntryActions.getInteractions({
        chainId: chainId ?? '',
        residueId: residueId,
      })
    );
    if (ligand.type === 'modification') {
      this.interactionsRowData.set(undefined);
    }

    this.actionQueue.addAction(
      `renderMolstarForLigands-${ligand.id}-${entityId}-${chainId}-${residueId}`,
      async () => {
        await this.molstarState.renderMolstarForLigands(this.entryId()!, ligand, molstarSelection);
      },
      false // skippable
    );
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
    const resId = molstarSelection.residues[0].authBegin;
    const chainId = molstarSelection.authChainId;

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
      resId: '-1',
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

  onCellMouseOver(event: CellMouseOverEvent<Interaction>) {
    const int = event.data; // fully typed
    if (!int) return;
    // TODO: Add interactivity here somehow (Atom selections?)
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    // const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const residueId = molstarSelection.residues[0].authBegin;
    const resIns = molstarSelection.residues[0].authBeginIns;

    const atomSelections = [
      {
        auth_asym_id: chainId,
        auth_seq_id: parseInt(residueId),
        auth_ins_code_id: normalizeInsertionCode(resIns),
        atoms: int.ligand_atoms,
      },
      {
        auth_asym_id: int.end.chain_id,
        auth_seq_id: int.end.author_residue_number,
        auth_ins_code_id: normalizeInsertionCode(int.end.author_insertion_code),
        atoms: int.end.atom_names,
      },
    ];

    this.actionQueue.addAction(
      `zoomMolstarInteraction`,
      async () => {
        await this.molstarState.zoomMolstarInteraction(atomSelections);
      },
      true // skippable
    );
  }

  onCellMouseOut() {
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    this.actionQueue.addAction(
      `zoomOutMolstarInteraction`,
      async () => {
        await this.molstarState.molstarVisualisation.focusLoci(molstarSelection, 50);
        await this.molstarState.molstarVisualisation.clearHighlightLoci();
      },
      true // skippable
    );
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

    const isLoaded = this.dataProcessing.tabDataLoaded();
    const tableData = this.compCommunication.tabTableData();
    const hasData = Object.keys(tableData).indexOf('Macromolecules') !== -1;
    if (!isLoaded || !hasData) return 'Undefined';

    const tabData = this.compCommunication.getTabData('Macromolecules');
    const macromolecules = tabData.tableRows() as MacromoleculesRowData[];
    if (macromolecules.length === 0) return 'Undefined';

    const mols = macromolecules.filter((mol) => mol.additionalData.molecule.entity_id === parseInt(entityId));
    if (mols.length === 0) return 'Undefined';

    return mols[0].name.molecule; //.replace(/\s/g, "_");
  }

  public mapSynonyms(synonyms: any[]): string {
    return synonyms.map((synonym) => synonym.value).join(', ');
  }
}
