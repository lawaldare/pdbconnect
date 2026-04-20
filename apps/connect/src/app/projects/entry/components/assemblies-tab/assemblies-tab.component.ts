/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, PopupWindowService, UtilService } from '@pdbc/core';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { dashboardStatLinks, entryAssembliesTooltips } from '../../entry-constant';
import { makeEntityColors, whenSignalFirstTrue } from '../../helpers/misc';
import { EntryPageTabsCommonMolstarParams } from '../../helpers/molstar-helpers';
import { MVSHandler } from '../../helpers/mvs-handler';
import { SnapshotSpec } from '../../helpers/mvs-views/mvs-snapshot-types';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';

@Component({
  selector: 'pdbc-assemblies-tab',
  standalone: true,
  imports: [CommonModule, InteractiveTablesComponent, NgxSkeletonLoaderModule, HelpIconWithTooltipComponent, MolstarComponent],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent {
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly gAS = inject(GoogleAnalyticsService);
  public readonly tutorialTourService = inject(EntryPageTutorialTourService);

  public dashboardStatLinks = dashboardStatLinks;

  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly assemblySummaryDict = toSignal(this.globalStore.select(EntrySelectors.complexPagesSummary));

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

  private procAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));
  public hasLoadedAssemblies = computed(() => this.procAssemblies() !== undefined);
  public hasAssemblies = computed(() => {
    const rows = this.procAssemblies();
    if (rows === undefined) return false;
    return rows.length > 0;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public readonly symmetry = toSignal(this.globalStore.select(EntrySelectors.symmetry));
  public readonly processedAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));

  public readonly entryAssembliesTooltips = entryAssembliesTooltips;

  public readonly util = inject(UtilService);

  public readonly isSidebarDisplayed = signal<boolean>(true);
  public readonly tabDataLoaded = computed(() => this.processedAssemblies() !== undefined);

  public readonly selectedAssemblyIdx = toSignal(this.compCommunication.assemblySelection$);

  public readonly assemblyTableRows = computed(() => {
    const rows = this.processedAssemblies();
    if (!rows) return [];
    return rows;
  });

  private readonly procMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  private readonly procLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private readonly entityColors = computed(() => makeEntityColors(this.procMacromolecules(), this.procLigands()));

  private previousAssemblyDatumIdx?: number;
  public currentAssemblyDatum = computed(() => {
    const selectedIdx = this.selectedAssemblyIdx() ?? 0;
    const rows = this.processedAssemblies();
    if (!rows) return;
    const datum = rows[selectedIdx];
    if (!datum) return;

    if (selectedIdx === this.previousAssemblyDatumIdx) return datum;
    this.previousAssemblyDatumIdx = selectedIdx;

    // // could be an effect also
    // if (datum) {
    //   this.triggerMolstarSideEffect();
    // }
    return datum;
  });
  private currentAssemblyDatum$ = toObservable(this.currentAssemblyDatum);

  public selectionStats = computed(() => {
    const assemblySummaryDict = this.assemblySummaryDict();
    const entryId = this.entryId();
    const currentAssembly = this.currentAssemblyDatum();
    if (entryId && assemblySummaryDict && currentAssembly) {
      const currentAssemblyId = `${entryId}_${currentAssembly.assemblyId}`;
      const datum = assemblySummaryDict[currentAssemblyId];
      if (datum) return datum as any;
    }
    return undefined;
  });

  public readonly currentSymmetry = computed(() => {
    const symmetries = this.symmetry();
    const currentAssembly = this.currentAssemblyDatum();
    const currentAssemblyId = currentAssembly ? currentAssembly.assemblyId : undefined;
    if (symmetries && currentAssemblyId) {
      const currentSymmetry = symmetries.find((symmetry) => symmetry.assembly_id === currentAssemblyId);
      return currentSymmetry;
    }
    return undefined;
  });

  public readonly configForMolstar = computed(() => ({
    ...EntryPageTabsCommonMolstarParams,
    granularity: 'chain',
  }));

  @ViewChild('popoutWrapper') popoutWrapper!: ElementRef;
  public readonly popService = inject(PopupWindowService);

  public popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.popoutWrapper, 'assemblies-molstar');
    }
  }

  constructor() {
    effect(() => {
      const entryId = this.entryId();
      const complex = this.currentAssemblyDatum();
      if (!entryId || !complex) return;

      const assemblyId = complex.assemblyId;
      this.mvsSnapshotSpec.next({
        name: `Complex ${assemblyId}`,
        kind: 'pdbconnect_complex',
        params: { entry: entryId, assemblyId, entityColors: this.entityColors(), volumeStreaming: false },
      });
    });

    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(() => {
      // run after molstar rendered
      const mvsHandler = MVSHandler(this._molstarComponent);
      this.mvsSnapshotSpec.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));
    });
  }

  private readonly mvsSnapshotSpec = new BehaviorSubject<SnapshotSpec | undefined>(undefined);

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

  public generateComplexPageUrl(complexId: string): string {
    return `${environment.baseUrl}pdbe/pdbe-kb/complexes/${complexId}`;
  }
}
