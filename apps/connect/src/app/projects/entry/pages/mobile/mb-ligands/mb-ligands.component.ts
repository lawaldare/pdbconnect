/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, DestroyRef, effect, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LigandsRowData } from '../../../data-classes/data-models-and-definitions/row-and-table.model';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { TruncatePipe, TruncateTextDirective } from '@pdbc/core';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { LigandsTabService } from '../../../components/ligands-tab/ligands-tab.service';
import { annotationsTooltips } from '../../../entry-constant';
import { interactionsToMolstar } from '../../../helpers/interactions-to-molstar-sel-obj';
import { Interaction } from '../../../data-models/interaction.model';
import { EntryActions } from '../../../store/entry.actions';
import { debounceTime, distinctUntilChanged, filter, first, firstValueFrom, take, timer } from 'rxjs';
import { componentExistsInMolstar, drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../../helpers/molstar-helpers';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Interaction as PDBeMolstarInteraction } from 'pdbe-molstar/lib/extensions/interactions/index';
import { MobileStateService } from '../mobile-state.service';
import { getLigandsDropdownOptions } from '../../../helpers/processed-data-to-controls';

@Component({
  selector: 'pdbc-mb-ligands',
  imports: [CommonModule, TruncatePipe, EntryDropdownComponent, TruncateTextDirective],
  templateUrl: './mb-ligands.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-ligands.component.scss'],
})
export class MbLigandsComponent {
  private readonly state = inject(MobileStateService);

  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly molstarPluginService = inject(MolstarPluginService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactionsObservable = this.globalStore.select(EntrySelectors.interactions);

  private currentChainId = signal<string | undefined>(undefined);
  private currentResidueId = signal<string | undefined>(undefined);

  public readonly ligandsTabService = inject(LigandsTabService);

  public readonly annotationsTooltips: any = annotationsTooltips;

  public dropdownOptionsToMolstar: { [key: string]: QueryParam[] } = {};

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;
  public selectedLigands = signal<any>({});
  public expanded = signal<boolean>(false);
  public title = this.state.ligandTitle;

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;

  public readonly LigandTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const hasData = this.compCommunication.hasProcessedLigands();

    if (isLoaded && hasData) {
      const datum = this.compCommunication.processedLigandsAndModifications;
      return datum.map((row: LigandsRowData, index) => ({
        ...row,
        index,
        annotations: this.ligandsTabService.ligandMonomers()[row.id] ?? [],
        isModified: this.ligandsTabService.modifications()?.find((e) => e === row.id) ? true : false,
      }));
    }
    return [];
  });

  private async triggerLigandInteractionsSideEffects(interactions: Interaction[] | undefined) {
    const ligand = this.selectedLigands() as LigandsRowData;
    if (!interactions) return;
    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    if (!molstarSelection) return;

    // await until molstar first render is finished
    await firstValueFrom(
      this.compCommunication.mobileMolstarLoaded$.pipe(
        filter((ready) => ready === true),
        first()
      )
    );

    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;

    const { residuesMolstarSelections, interactionsMolstarSelections } = interactionsToMolstar(
      ligand,
      molstarSelection,
      interactions,
      this.compCommunication.chainToEntityId()
    );

    const pdbeInteractions = interactionsMolstarSelections as unknown as PDBeMolstarInteraction[];
    const residueSelectionData: QueryParam[] = residuesMolstarSelections.map((resid) => {
      return {
        ...resid,
        representation: 'ball-and-stick',
        focus: false,
      };
    });
    this.residuesAsSticks = residueSelectionData;
    this.selectionData = this.ligandSelection ? [...this.ligandSelection] : [];
    this.selectionData.push(...residueSelectionData);

    timer(800).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });

    await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.clearInteractions(instance);
    await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.loadInteractions(instance, { interactions: pdbeInteractions, structureId: 1 });
  }

  public allLigandsQueryParam = computed(() => {
    const ligandsSelectionData: QueryParam[] = [];
    const hasLigandsData = this.compCommunication.hasProcessedLigands();
    if (!hasLigandsData) return ligandsSelectionData;
    const ligands = this.compCommunication.processedLigandsAndModifications;
    for (const lig of ligands) {
      for (const sel of lig.additionalData.selections) {
        const entityId = sel[0].entity_id;
        const chainId = sel[0].auth_asym_id;
        const residueId = sel[0].auth_residue_number;
        const entityColor = lig.molstarColorHex;
        ligandsSelectionData.push({
          entity_id: `${entityId}`,
          auth_asym_id: `${chainId}`,
          auth_residue_number: residueId,
          color: entityColor,
          representation: 'spacefill',
          representationColor: entityColor,
          focus: false,
        });
      }
    }
    return ligandsSelectionData;
  });

  private hasLigands$ = toObservable(this.compCommunication.hasProcessedLigands);

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbLigandsComponent>) {
    this.hasLigands$
      .pipe(
        debounceTime(50),
        distinctUntilChanged(),
        filter((hasLig) => hasLig == true)
      )
      .subscribe(async (hasLig) => {
        // Wait until mobileMolstarLoaded$ is true before proceeding
        await firstValueFrom(
          this.compCommunication.mobileMolstarLoaded$.pipe(
            filter((ready) => ready), // Proceed only when it's true
            take(1) // Take the first value, then complete
          )
        );
        this.renderInMolstar(undefined);
      });

    this.interactionsObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((allInteractions) => {
      const chainId = this.currentChainId();
      const residueId = this.currentResidueId();
      if (!chainId || !residueId) return;
      if (!allInteractions || Object.keys(allInteractions).length === 0) return;
      const interactions = allInteractions[chainId][residueId];
      this.triggerLigandInteractionsSideEffects(interactions);
    });
  }

  private async updateCurrentLigand() {
    const ligand = this.selectedLigands();
    this.dropdownOptionsToMolstar = getLigandsDropdownOptions(ligand);
    this.dropdownOptions = Object.keys(this.dropdownOptionsToMolstar).map((eachString, idx) => {
      return {
        name: eachString,
        url: `lig-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = Object.keys(this.dropdownOptionsToMolstar)[0];
    await this.renderInMolstar(this.selectedLigands());
  }
  public mapSynonyms(synonyms: any[]): string {
    return synonyms.map((synonym) => synonym.value).join(', ');
  }

  private selectionData?: QueryParam[];
  private ligandSelection?: QueryParam[];
  private residuesAsSticks?: QueryParam[];

  private async renderInMolstar(ligand?: LigandsRowData) {
    // Wait until first render is finished
    await firstValueFrom(
      this.compCommunication.mobileMolstarLoaded$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    const durationMs = this.compCommunication.mobileMolstar ? 700 : 0;
    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;

    if (!ligand) {
      if (this.compCommunication.mobileMolstarDisplay === 'ligands') return;
      const ligandsSelectionData = this.allLigandsQueryParam();
      await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.clearInteractions(instance);
      await drawSelectionInMolstar(instance, ligandsSelectionData, '#FEFEFE');
      await zoomOutStructureInMolstar(instance, 700);
      this.compCommunication.mobileMolstarDisplay = 'ligands';
      return;
    }

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const chainId = molstarSelection[0].auth_asym_id!;
    const residueId = molstarSelection[0].auth_residue_number!;
    this.currentChainId.set(chainId);
    this.currentResidueId.set(`${residueId}`);

    this.globalStore.dispatch(
      EntryActions.getInteractions({
        chainId: chainId ?? '',
        residueId: `${residueId}`,
      })
    );

    // Access Molstar instance
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

    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
    this.compCommunication.mobileMolstarDisplay = 'ligands-specific';
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

  public navigateToDetail(data: LigandsRowData) {
    this.currentViewState.set(ViewState.Detail);
    this.selectedLigands.set(data);
    const title = `${data.codeAndName.count} X ${data.id}`;
    this.state.updateSelectedLigandTitle(title);
    this.updateCurrentLigand();
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.state.updateSelectedLigandTitle('Ligands');
    await this.renderInMolstar(undefined);
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;
    await this.renderInMolstar(this.selectedLigands());
  }
}
