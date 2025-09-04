import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
// import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { entryAssembliesTooltips } from '../../entry-constant';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { PopupWindowService, UtilService } from '@pdbc/core';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { filter, firstValueFrom, take, timer } from 'rxjs';
import { EntryActions } from '../../store/entry.actions';

@Component({
  selector: 'pdbc-assemblies-tab',
  standalone: true,
  imports: [CommonModule, InteractiveTablesComponent, NgxSkeletonLoaderModule, HelpIconWithTooltipComponent, MolstarComponent],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent {
  public readonly compCommunication = inject(ComponentCommunicationService);
  // public readonly dataProcessing = inject(MainDataProcessingFacade);

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

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

  public readonly symmetry = toSignal(this.globalStore.select(EntrySelectors.symmetry));
  public readonly processedAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));

  public readonly entryAssembliesTooltips = entryAssembliesTooltips;

  public readonly util = inject(UtilService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  // public readonly tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());
  public readonly tabDataLoaded = computed(() => this.processedAssemblies() !== undefined);

  public readonly selectedAssemblyIdx = toSignal(this.compCommunication.assemblySelection$);

  public readonly assemblyTableRows = computed(() => {
    // const isLoaded = this.compCommunication.hasProcessedAssemblies();
    const rows = this.processedAssemblies();
    if (!rows) return [];
    return rows;
  });

  private previousAssemblyDatumIdx?: number;
  public currentAssemblyDatum = computed(() => {
    const selectedIdx = this.selectedAssemblyIdx() ?? 0;
    const rows = this.processedAssemblies();
    if (!rows) return;
    const datum = rows[selectedIdx];
    if (!datum) return;

    if (selectedIdx === this.previousAssemblyDatumIdx) return datum;
    this.previousAssemblyDatumIdx = selectedIdx;

    // could be an effect also
    if (datum) {
      this.triggerMolstarSideEffect();
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

  public readonly configForMolstar = computed<InitParams | undefined>(() => {
    const assembly = this.currentAssemblyDatum();
    const entryId = this.entryId();
    // const chainSelection = this.chainSelection();

    if (!assembly || !entryId) return undefined;
    const assemblyId = assembly.assemblyId ? assembly.assemblyId : '1';

    const configForMolstar: InitParams = {
      ...DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: assemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      landscape: true,
      subscribeEvents: true,
      granularity: 'chain',
      hideControls: true,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'entity-id',
        },
      },
    };

    return configForMolstar;
  });

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  public readonly popService = inject(PopupWindowService);

  public popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.molstarContainer, 'assemblies-molstar');
    }
  }

  private resetCamera() {
    const plugin = this._molstarComponent?.getInstance()?.plugin ?? null;
    if (!plugin) return;
    plugin.managers.camera.reset(undefined, 100);
  }

  async triggerMolstarSideEffect() {
    // Wait until first render is finished
    await firstValueFrom(
      this.molstarFirstRenderFinished$.pipe(
        filter((ready) => ready === true), // proceed when true
        take(1)
      )
    );

    // reset camera after loaded
    timer(800).subscribe(() => {
      this.resetCamera();
    });
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
