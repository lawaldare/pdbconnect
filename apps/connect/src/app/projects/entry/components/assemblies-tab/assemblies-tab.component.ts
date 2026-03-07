/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { InteractiveTablesComponent } from '../shared/interactive-tables/interactive-tables.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../store/entry-store.model';
import { EntrySelectors } from '../../store/entry.selectors';
import { dashboardStatLinks, entryAssembliesTooltips, tourIds } from '../../entry-constant';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { GoogleAnalyticsService, PopupWindowService, UtilService } from '@pdbc/core';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { filter, firstValueFrom, take, timer } from 'rxjs';
import { Molstar370DefaultParams } from '../../helpers/molstar-helpers';
import { EntryPageTutorialTourService } from '../../services/entry-page-tutorial-tour.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'pdbc-assemblies-tab',
  standalone: true,
  imports: [CommonModule, InteractiveTablesComponent, NgxSkeletonLoaderModule, HelpIconWithTooltipComponent, MolstarComponent],
  templateUrl: './assemblies-tab.component.html',
  styleUrl: './assemblies-tab.component.scss',
})
export class AssembliesTabComponent implements AfterViewInit {
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

  public molstarFirstRenderFinished = computed(() => {
    if (!this.molstarReady()) return false;
    return this._molstarComponent?.firstLoadFinished() || false;
  });
  private molstarFirstRenderFinished$ = toObservable(this.molstarFirstRenderFinished);

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

  public isBannerCookies = signal(false);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tutorialTourService.hasAssemblies.set(this.hasAssemblies());
      const agreed = this.tutorialTourService.getCookie(tourIds.assemblies);
      if (!agreed && this.hasAssemblies()) {
        this.isBannerCookies.set(true);
      }
    }, 500);
  }

  public startAssembliesTabTour(): void {
    this.tutorialTourService.startTour(this.tutorialTourService.complexesTabTourSteps);
  }

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

  public readonly preferredSymmetry = computed(() => {
    const symmetries = this.symmetry();
    if (symmetries) {
      const preferredSymmetry = symmetries.find((symmetry) => symmetry.assembly_id === '1');
      return preferredSymmetry;
    }
    return undefined;
  });

  public readonly configForMolstar = computed(() => {
    const assembly = this.currentAssemblyDatum();
    const entryId = this.entryId();
    // const chainSelection = this.chainSelection();

    if (!assembly || !entryId) return undefined;
    const assemblyId = assembly.assemblyId ? assembly.assemblyId : '1';

    // Check InitParams and DefaultParams at:
    // https://github.com/molstar/pdbe-molstar/blob/v3.7.2/src/app/spec.ts
    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: assemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      subscribeEvents: true,
      granularity: 'chain',
      hideControls: false,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'entity-id',
        },
      },
      sequencePanel: true,
    };

    return configForMolstar;
  });

  @ViewChild('popoutWrapper') popoutWrapper!: ElementRef;
  public readonly popService = inject(PopupWindowService);

  public popupMolstar(): void {
    const fullMode = this.popService.isMaximizedOnMac();
    if (!fullMode) {
      this.popService.popOut(this.popoutWrapper, 'assemblies-molstar');
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

  public generateComplexPageUrl(complexId: string): string {
    return `${environment.baseUrl}pdbe/pdbe-kb/complexes/${complexId}`;
  }
}
