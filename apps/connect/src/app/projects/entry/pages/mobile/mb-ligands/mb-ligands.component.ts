/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, effect, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewState } from '../mb-macromolecules/mb-macromolecule.component';
import { MobileFacade } from '../mobile.facade';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LigandsRowData } from '../../../data-classes/data-models-and-definitions/row-and-table.model';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { TruncatePipe, TruncateTextDirective } from '@pdbc/core';
import { EntryDropdownComponent } from '../../../components/entry-page-header/sub-components/entry-dropdown/entry-dropdown.component';
import { DownloadOption } from '@pdbe-lib/dropdown-menu';
import { DetailsDashboardFacade } from '../../../components/shared/details-dashboard.facade';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MolstarPluginService, MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { LigandsTabService } from '../../../components/ligands-tab/ligands-tab.service';
import { annotationsTooltips } from '../../../entry-constant';
import { interactionsToMolstar } from '../../../helpers/interactions-to-molstar-sel-obj';
import { Interaction } from '../../../data-models/interaction.model';
import { EntryActions } from '../../../store/entry.actions';
import { debounceTime, distinctUntilChanged, filter, first, firstValueFrom, take, timer } from 'rxjs';
import { drawSelectionInMolstar, zoomOutStructureInMolstar } from '../../../helpers/molstar-helpers';
import { QueryParam } from 'pdbe-molstar/lib/helpers';
import { Interaction as PDBeMolstarInteraction } from 'pdbe-molstar/lib/extensions/interactions/index';

@Component({
  selector: 'pdbc-mb-ligands',
  imports: [CommonModule, TruncatePipe, EntryDropdownComponent, TruncateTextDirective],
  templateUrl: './mb-ligands.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-ligands.component.scss'],
})
export class MbLigandsComponent {
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public readonly detailsDashboardFacade = inject(DetailsDashboardFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly molstarPluginService = inject(MolstarPluginService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly interactions = toSignal(this.globalStore.select(EntrySelectors.interactions));

  public readonly ligandsTabService = inject(LigandsTabService);

  public readonly annotationsTooltips: any = annotationsTooltips;

  public dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};

  public currentViewState = signal<ViewState>(ViewState.List);
  public viewStates = ViewState;
  public selectedLigands = signal<any>({});
  public expanded = signal<boolean>(false);
  public title = this.mbFacade.ligandTitle;

  public dropdownOptions: DownloadOption[] = [];
  public dropdownSelected!: string;

  public readonly LigandTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const tableData = this.signals.tabTableData();
    const hasData = Object.keys(tableData).indexOf('Ligands') !== -1;

    if (isLoaded && hasData) {
      const tabData = this.signals.getTabData('Ligands');
      const datum = tabData.tableRows() as LigandsRowData[];
      return datum.map((row: any, index) => ({
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
      this.signals.chainToEntityId()
    );

    const pdbeInteractions = interactionsMolstarSelections as unknown as PDBeMolstarInteraction[];
    // await this.molstarState.renderMolstarInteractions(residuesMolstarSelections, interactionsMolstarSelections);
    const residueSelectionData: QueryParam[] = residuesMolstarSelections.map((resid) => {
      // const resid = eachResidData.residues[0];
      const macromoleculeOfResidue = this.compCommunication.processedMacromolecules.filter((mm) => `${mm.additionalData.molecule.entity_id}` === resid.entity_id!)[0];
      // const colorToMol = macromoleculeOfResidue.molstarColorHex ? Color(parseInt(macromoleculeOfResidue.molstarColorHex.slice(1), 16)) : undefined;
      return {
        ...resid,
        // entity_id: `${resid.entityId!}`,
        // auth_asym_id: `${resid.authChainId!}`,
        // auth_residue_number: parseInt(resid.authBegin),
        // auth_ins_code_id: resid.authBeginIns && resid.authBeginIns !== 'undefined' ? resid.authBeginIns : undefined,
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
        const entityId = sel.entityId;
        const chainId = sel.authChainId;
        const residueId = sel.residues[0].authBegin;
        const entityColor = lig.molstarColorHex;
        ligandsSelectionData.push({
          entity_id: `${entityId}`,
          auth_asym_id: `${chainId}`,
          auth_residue_number: parseInt(residueId),
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
    effect(() => {
      const data = this.interactions();
      if (data) {
        this.triggerLigandInteractionsSideEffects(data);
      }
    });
  }

  private async updateCurrentLigand() {
    const dropdownResults = this.detailsDashboardFacade.getLigandsDropdownOptions(this.selectedLigands());
    this.dropdownOptionsToMolstar = dropdownResults.dropdownOptionsToMolstar;

    this.dropdownOptions = dropdownResults.dropdownOptions.map((eachString, idx) => {
      return {
        name: eachString,
        url: `macro-${idx + 1}`,
        downloadable: false,
      };
    });
    this.dropdownSelected = dropdownResults.dropdownSelected;

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
      const ligandsSelectionData = this.allLigandsQueryParam();
      await this.molstarPluginService.PDBeMolstarPluginClass.extensions.Interactions.clearInteractions(instance);
      await drawSelectionInMolstar(instance, ligandsSelectionData, '#FEFEFE');
      await zoomOutStructureInMolstar(instance, 700);
      return;
    }

    const molstarSelection = this.dropdownOptionsToMolstar[this.dropdownSelected];
    const entityId = molstarSelection.entityId;
    const chainId = molstarSelection.authChainId;
    const residueId = molstarSelection.residues[0].authBegin;

    this.globalStore.dispatch(
      EntryActions.getInteractions({
        chainId: chainId ?? '',
        residueId: residueId,
      })
    );

    // Access Molstar instance
    const entityColor = ligand.molstarColorHex;
    this.ligandSelection = [
      {
        entity_id: `${entityId}`,
        auth_asym_id: `${chainId}`,
        auth_residue_number: parseInt(residueId),
        color: entityColor,
        focus: true,
      },
    ];
    this.selectionData = [...this.ligandSelection];

    await zoomOutStructureInMolstar(instance, durationMs);

    timer(durationMs + 100).subscribe(async () => {
      await drawSelectionInMolstar(instance, this.selectionData);
    });
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
  }

  public navigateToDetail(data: LigandsRowData) {
    this.currentViewState.set(ViewState.Detail);
    this.selectedLigands.set(data);
    const title = `${data.codeAndName.count} X ${data.id}`;
    this.mbFacade.updateSelectedLigandTitle(title);
    this.updateCurrentLigand();
  }

  public async goBackToList() {
    this.currentViewState.set(ViewState.List);
    this.mbFacade.updateSelectedLigandTitle('Ligands');
    await this.renderInMolstar(undefined);
  }

  public async onDropdownSelect(event: string) {
    this.dropdownSelected = event;
    await this.renderInMolstar(this.selectedLigands());
  }
}
