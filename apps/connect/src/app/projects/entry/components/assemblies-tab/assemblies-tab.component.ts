import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { AssembliesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { entryAssembliesTooltips } from '../../entry-constant';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarStateService } from '../../services/molstar-state.service';
import { ActionQueueService } from '../../services/action-queue.service';

@Component({
  selector: 'pdbc-assemblies-tab',
  standalone: true,
  imports: [CommonModule, InteractiveTablesComponent, NgxSkeletonLoaderModule, HelpIconWithTooltipComponent],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly molstarState = inject(MolstarStateService);
  private readonly actionQueue = inject(ActionQueueService);

  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());

  public readonly symmetry = toSignal(this.globalStore.select(EntrySelectors.symmetry));

  public readonly entryAssembliesTooltips = entryAssembliesTooltips;

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  public readonly selectedAssemblyIdx = toSignal(this.compCommunication.assemblySelection$);

  public readonly assemblyTableRows = computed(() => {
    const isLoaded = this.compCommunication.hasProcessedAssemblies();
    if (!isLoaded) return [];
    return this.compCommunication.processedAssemblies;
  });

  private previousAssemblyDatumIdx?: number;
  public currentAssemblyDatum = computed(() => {
    const selectedIdx = this.selectedAssemblyIdx() ?? 0;
    const rows = this.assemblyTableRows();
    const datum = rows[selectedIdx];
    if (!datum) return;

    if (selectedIdx === this.previousAssemblyDatumIdx) return datum;
    this.previousAssemblyDatumIdx = selectedIdx;

    // could be an effect also
    if (datum) {
      this.triggerMolstarSideEffect(datum);
    }
    return datum;
  });

  public readonly preferredSymmetry = computed(() => {
    const symmetries = this.symmetry();
    if (symmetries) {
      const preferredSymmetry = symmetries.find((symmetry) => symmetry.assembly_id === '1');
      return preferredSymmetry;
    }
    return undefined;
  });

  triggerMolstarSideEffect(assembly: AssembliesRowData) {
    this.actionQueue.addAction(
      `renderMolstarForAssemblies-${assembly.assemblyId}`,
      async () => {
        await this.molstarState.renderMolstarForAssemblies(assembly.assemblyId);
      },
      true
    );
  }

  public getAdditionalData(name: string) {
    // this function is used to get specific data shown in Assembly dashboard view
    type AssembliesAddDataKeys =
      | 'accessibleSurfaceArea'
      | 'buriedSurfaceArea'
      | 'dissociationArea'
      | 'dissociationEnergy'
      | 'dissociationEntropy'
      | 'symmetryNumber'
      | 'interfaceCount';
    return this.currentAssemblyDatum()!.additionalData[name as AssembliesAddDataKeys];
  }

  public toggleSidebar() {
    this.isSidebarDisplayed.update((prev) => !prev);
  }
}
