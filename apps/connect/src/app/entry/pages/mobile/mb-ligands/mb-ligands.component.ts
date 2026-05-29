/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, Optional, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { TruncatePipe, TruncateTextDirective } from '@pdbc/core';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { InteractionFromAPI } from '../../../data-models/interaction.model';
import { annotationsTooltips } from '../../../entry-constant';
import { interactionsToMolstar } from '../../../helpers/interactions-to-molstar-sel-obj';
import { Dropdown, makeEntityColors, SymmetryOperatorMapping } from '../../../helpers/misc';
import { QueryParamForHelpers } from '../../../helpers/molstar-helpers';
import { SnapshotSpec } from '../../../helpers/mvs-views/mvs-snapshot-types';
import { CommonDropdownOptionData, makeLigandsDropdownOptions, makeSymmetryDropdownOptions } from '../../../helpers/processed-data-to-controls';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { ProcessedLigandOrMod } from '../../../store/data-processing/ligand-processing';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntryActions } from '../../../store/entry.actions';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileStateService } from '../mobile-state.service';

@Component({
  selector: 'pdbc-mb-ligands',
  imports: [CommonModule, TruncatePipe, EntryDropdownComponent, TruncateTextDirective],
  templateUrl: './mb-ligands.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-ligands.component.scss'],
})
export class MbLigandsComponent implements OnInit {
  private readonly state = inject(MobileStateService);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);

  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactionsObservable = this.globalStore.select(EntrySelectors.interactions);
  private readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));

  /** All interactions for current ligand/chainId/residueId/instanceId, without applying filter. */
  private interactionsForCurrentInstance = computed<InteractionFromAPI | undefined>(() => {
    const chainId = this.currentChainId();
    const residueId = this.currentResidueId();
    if (!chainId || !residueId) return undefined;

    const instanceId = this.selectedInstanceId();
    const chainForInteractions = SymmetryOperatorMapping.getRenamedChain(chainId, instanceId, this.symmetryOperatorMapping());

    const allInteractions = this.interactions();
    return allInteractions?.[chainForInteractions]?.[residueId];
  });

  public readonly annotationsTooltips: any = annotationsTooltips;

  public currentViewState = computed<'list' | 'detail'>(() => (this.selectedLigand() ? 'detail' : 'list'));
  public selectedLigand = signal<ProcessedLigandOrMod | undefined>(undefined);
  public expanded = signal<boolean>(false);

  public readonly ligandBoundDetails = computed(() => {
    const ligand = this.selectedLigand();
    if (ligand?.type === 'ligand') return ligand.additionalData.source.bound_details;
    return undefined;
  });

  public readonly molecularWeight = computed(() => {
    const ligand = this.selectedLigand();
    if (ligand?.type === 'ligand') return ligand.additionalData.source.weight;
    return undefined;
  });

  public dropdown = new Dropdown<CommonDropdownOptionData>({
    autoOptions: () => makeLigandsDropdownOptions(this.selectedLigand()),
  });

  public symmetryDropdown = new Dropdown<{ instanceId: string | undefined }>({
    autoOptions: () => makeSymmetryDropdownOptions(this.dropdown.selectedOption()?.data.symmOperators),
  });

  private selectedInstanceId = computed(() => this.symmetryDropdown.selectedOption()?.data.instanceId);
  public inPrefAssemblyForInstance = computed<boolean>(() => this.dropdown.selectedOption()?.data.inPrefAssembly ?? true); // No ligand selected -> true (no warning to display)

  /** Mapping for symmetry operator (if displayed structure is an assembly), or undefined (if displayed structure is deposited model) */
  private symmetryOperatorMapping = computed(() => {
    if (this.displayedAssemblyId() !== undefined) {
      return SymmetryOperatorMapping.getSymmetryOperatorMapping(this.dropdown.selectedOption()?.data.symmOperators ?? []);
    } else {
      return undefined;
    }
  });

  private currentChainId = computed<string | undefined>(() => this.dropdown.selectedOption()?.data.molstarSelection[0].auth_asym_id);
  private currentResidueId = computed<string | undefined>(() => {
    const auth_seq_id = this.dropdown.selectedOption()?.data.molstarSelection[0].auth_seq_id;
    if (auth_seq_id === undefined) return undefined;
    return String(auth_seq_id);
  });

  public readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  public readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private readonly entityColors = computed(() => makeEntityColors(this.processedMacromolecules(), this.processedLigands()));

  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));
  private readonly preferredAssemblyId = computed(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);
  /** Assembly ID of the assembly to be displayed (undefined = deposited model) */
  private readonly displayedAssemblyId = computed<string | undefined>(() => (this.inPrefAssemblyForInstance() ? this.preferredAssemblyId() : undefined));

  public readonly ligandTableRows = computed(() => this.processedLigands() ?? []);

  public allLigandsQueryParam = computed(() => {
    const ligandsSelectionData: QueryParamForHelpers[] = [];
    const ligands = this.processedLigands();
    if (!ligands) return ligandsSelectionData;
    for (const lig of ligands) {
      for (const sel of lig.additionalData.selections) {
        const entityId = sel[0].label_entity_id;
        const chainId = sel[0].auth_asym_id;
        const residueId = sel[0].auth_seq_id;
        const entityColor = lig.molstarColorHex;
        ligandsSelectionData.push({
          label_entity_id: `${entityId}`,
          auth_asym_id: `${chainId}`,
          auth_seq_id: residueId,
          color: entityColor,
          representation: 'spacefill',
          representationColor: entityColor,
          focus: false,
        });
      }
    }
    return ligandsSelectionData;
  });

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbLigandsComponent>) {
    // Update MVS snapshot when needed
    effect(() => this.compCommunication.mvsSnapshotSpec$.next(this.mvsSnapshotSpec()));

    // Fetch interaction data when ligand/chainId/residueId/instanceId changes
    effect(() => {
      const ligand = this.selectedLigand();
      if (!ligand || ligand.type === 'modification') return; // Interaction data are not available for modifications

      const chainId = this.currentChainId();
      const residueId = this.currentResidueId();
      const instanceId = this.selectedInstanceId();
      const inPrefAssemblyForInstance = this.inPrefAssemblyForInstance(); // Interaction data are only available for preferred assembly
      if (inPrefAssemblyForInstance && chainId !== undefined && residueId !== undefined) {
        this.fetchInteractionData(chainId, residueId, instanceId);
      }
    });

    // Update global mobileIsPrefAssembly (for warning display)
    effect(() => this.compCommunication.mobileIsPrefAssembly.set(this.inPrefAssemblyForInstance()));
  }

  private fetchInteractionData(authAsymId: string, residueId: string, instanceId: string | undefined) {
    const chainForInteractions = SymmetryOperatorMapping.getRenamedChain(authAsymId, instanceId, this.symmetryOperatorMapping());
    this.globalStore.dispatch(EntryActions.getInteractions({ chainId: chainForInteractions, residueId: residueId }));
  }

  ngOnInit(): void {
    /* 1. Fetch data */
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getSummaryData,
      EntryActions.getAssemblies,
      EntryActions.getEntryMolecules,
      EntryActions.getBoundMolecules,
      EntryActions.getEntryLigandMonomers,
      EntryActions.getModifications,
      EntryActions.getProcessedLigands,
    ]);
  }

  private async setCurrentLigand(ligand: ProcessedLigandOrMod | undefined) {
    this.selectedLigand.set(ligand);
  }

  public mapSynonyms(synonyms: any[]): string {
    return synonyms.map((synonym) => synonym.value).join(', ');
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

  public navigateToDetail(ligand: ProcessedLigandOrMod) {
    this.setCurrentLigand(ligand);
    this.scrollTabToTop();
  }

  public async goBackToList() {
    this.setCurrentLigand(undefined);
    this.scrollTabToTop();
  }

  private scrollTabToTop() {
    const container = document.querySelector('.mat-bottom-sheet-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  public anyNonPrefAssembly(ligand: ProcessedLigandOrMod) {
    return !ligand.additionalData.selectionsInPrefAssembly.every((isInPrefAssembly) => isInPrefAssembly);
  }

  public async onDropdownSelect(event: string) {
    this.dropdown.select(event);
  }

  public async onSymmetryDropdownSelect(event: string) {
    this.symmetryDropdown.select(event);
  }

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    if (!entryId) return undefined;

    const selectedLigand = this.selectedLigand();

    if (!selectedLigand) {
      return {
        name: 'All ligands and modifications',
        kind: 'pdbconnect_all_ligands',
        params: {
          entry: entryId,
          assemblyId: this.preferredAssemblyId(),
          volumeStreaming: true,
          ligandEntityIds:
            this.processedLigands()
              ?.filter((ligand) => ligand.type === 'ligand')
              ?.map((ligand) => String(ligand.additionalData.source.entity_id)) ?? [],
          modifications:
            this.processedLigands()
              ?.filter((ligand) => ligand.type === 'modification')
              ?.map((modres) => ({ labelCompId: modres.id, color: modres.molstarColorHex ?? 'gray', name: modres.codeAndName.name })) ?? [],
          entityColors: this.entityColors(),
        },
      } satisfies SnapshotSpec;
    } else {
      const molstarSelection = this.dropdown.selectedOption()?.data.molstarSelection;
      if (!molstarSelection) return undefined;

      const authAsymId = molstarSelection[0].auth_asym_id;
      const authSeqId = molstarSelection[0].auth_seq_id;
      const authInsCode = molstarSelection[0].pdbx_PDB_ins_code ?? '';
      if (authAsymId === undefined) throw new Error('authAsymId is undefined');
      if (authSeqId === undefined) throw new Error('authSeqId is undefined');
      const instanceId = this.selectedInstanceId();

      const interactionsData = this.interactionsForCurrentInstance();
      const mvsAtomInteractions = interactionsData ? interactionsToMolstar(interactionsData, this.symmetryOperatorMapping()) : undefined;

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
          volumeStreaming: true,
          entityColors: this.entityColors(),
        },
      } satisfies SnapshotSpec;
    }
  });
}
