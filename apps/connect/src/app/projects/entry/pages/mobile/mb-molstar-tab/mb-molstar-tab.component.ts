import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, NgZone, QueryList, signal, Type, ViewChild, ViewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { take } from 'rxjs';
import { whenSignalFirstTrue } from '../../../helpers/misc';
import { EntryPageTabsCommonMolstarParams } from '../../../helpers/molstar-helpers';
import { initializeModelIdTracking } from '../../../helpers/molstar-nmr-model-tracking';
import { MVSHandler } from '../../../helpers/mvs-handler';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MobileTabChips } from '../../../store/data-processing/models/other-models';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MbAssembliesComponent } from '../mb-assemblies/mb-assemblies.component';
import { MbDomainsComponent } from '../mb-domains/mb-domains.component';
import { MbLigandsComponent } from '../mb-ligands/mb-ligands.component';
import { MbMacromoleculeComponent } from '../mb-macromolecules/mb-macromolecule.component';
import { MbModelQualityComponent } from '../mb-model-quality/mb-model-quality.component';
import { MobileStateService } from '../mobile-state.service';
import { MobileTabNames } from '../mobile-tab.model';
import { MobileFacade } from '../mobile.facade';

const MOBILE_COMPONENT_MAP = {
  [MobileTabChips.MQuality]: MbModelQualityComponent,
  [MobileTabChips.Assemblies]: MbAssembliesComponent,
  [MobileTabChips.Macromolecules]: MbMacromoleculeComponent,
  [MobileTabChips.Ligands]: MbLigandsComponent,
  [MobileTabChips.Domains]: MbDomainsComponent,
};

@Component({
  selector: 'pdbc-mb-molstar-tab',
  imports: [CommonModule, MaterialModule, NgxSkeletonLoaderModule, MolstarComponent],
  templateUrl: './mb-molstar-tab.component.html',
  styleUrl: './mb-molstar-tab.component.scss',
})
export class MbMolstarTabComponent implements AfterViewInit {
  private bottomSheet = inject(MatBottomSheet);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly state = inject(MobileStateService);
  private readonly zone = inject(NgZone);
  private readonly mbFacade = inject(MobileFacade);

  public readonly gAS = inject(GoogleAnalyticsService);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  @ViewChildren('chipEl') chipElements!: QueryList<ElementRef<HTMLElement>>;

  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly mobileTabChips = [
    { label: 'Model Quality', id: MobileTabChips.MQuality },
    { label: 'Complex', id: MobileTabChips.Assemblies },
    { label: 'Macromolecules', id: MobileTabChips.Macromolecules },
    { label: 'Ligands and Environments', id: MobileTabChips.Ligands },
    { label: 'Domains', id: MobileTabChips.Domains },
  ];

  public selectedTabName = this.state.selectedTabName;

  private molstarReady = signal(false);
  private _molstarComponent?: MolstarComponent;
  @ViewChild('molstarComponent') set molstarComponent(ref: MolstarComponent | undefined) {
    if (ref) {
      this._molstarComponent = ref;
      this.compCommunication.mobileMolstar = ref;
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
    if (isSlow === undefined) return false;
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public inPrefAssembly = this.compCommunication.mobileIsPrefAssembly;
  public hasClosedMessage = this.compCommunication.mobileHasClosedMessage;

  private preferredAssemblyId = computed<string | undefined>(() => this.summary()?.assemblies.find((ass) => ass.preferred)?.assembly_id);

  public readonly configForMolstar = computed(() => {
    return EntryPageTabsCommonMolstarParams;
    // const summary = this.summary();
    // const entryId = this.entryId();
    // const inPrefAssembly = this.inPrefAssembly();

    // if (!summary || !entryId) return undefined;
    // const preferredAssemblyId = this.preferredAssemblyId();
    // const assemblyId = inPrefAssembly ? preferredAssemblyId : undefined;

    // const configForMolstar = {
    //   ...Molstar370DefaultParams,
    //   moleculeId: this.entryId(),
    //   assemblyId,
    //   landscape: false,
    //   subscribeEvents: true,
    //   granularity: 'residue',
    //   hideControls: false,
    //   visualStyle: {
    //     polymer: {
    //       type: 'cartoon',
    //       color: 'entity-id',
    //       // color: 'uniform',
    //       // colorParams: { value: Color(0xd4d5d4) },
    //     },
    //   },
    //   bgColor: 'white',
    //   hideCanvasControls: ['controlToggle', 'controlInfo', 'selection', 'animation', 'trajectory'],
    //   loadMaps: true,
    //   mapSettings: { defaultView: 'selection-box' },
    //   sequencePanel: true,
    // };
    // return configForMolstar;
  });

  constructor() {
    whenSignalFirstTrue(this.molstarFirstRenderFinished).subscribe(async () => {
      // run after molstar rendered
      this.compCommunication.mobileMolstarLoaded$.next(true);

      const mvsHandler = MVSHandler(this._molstarComponent);
      this.compCommunication.mvsSnapshotSpec$.subscribe((spec) => mvsHandler.loadMVSSnapshotSpec(spec));

      // once molstar has rendered, initializes mutation observer for NMR model Id
      initializeModelIdTracking(this.compCommunication.mobileModelIdx$, this._molstarComponent?.getContainer()); // do not await, this never resolves unless a multi-model structure is loaded (promise keeps ref to this.currentModelId$, is this is memory leak?)
    });
  }

  // ngOnInit() {
  //   this.applicationApiDispatcher.dispatchForList([
  //     // stuff for this.processedMacromolecules:
  //     EntryActions.getAssemblies,
  //     EntryActions.getEntryMolecules,
  //     EntryActions.getCarbohydrates,
  //     EntryActions.getProcessedMacromolecules,
  //     // stuff for this.processedLigands:
  //     EntryActions.getBoundMolecules,
  //     EntryActions.getEntryLigandMonomers,
  //     EntryActions.getModifications,
  //     EntryActions.getProcessedLigands,
  //   ]);
  // }
  // private readonly processedMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  // private readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  // private readonly entityColors = computed(() => makeEntityColors(this.processedMacromolecules(), this.processedLigands()));

  ngAfterViewInit(): void {
    // Angular materials body style patch
    document.body.style.top = '0px';
    // Reset scroll
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    this.mbFacade.selectedPageName.pipe(take(1)).subscribe(async (mobileTabName) => {
      if (mobileTabName === MobileTabNames.Molstar) {
        this.onTabClick(this.mobileTabChips[0]);
      }
    });
  }

  public onTabClick(chip: { label: string; id: string }): void {
    // this.mbFacade.onTabClick(chip, this.chipElements);

    if (chip.id === this.selectedTabName()) {
      this.state.updateSelectedTabName('');
    } else {
      this.state.updateSelectedTabName(chip.id);
      // scrolls into view horizontally on mobile without anti pattern
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        const chipElement = this.chipElements.find((el) => el.nativeElement.dataset['id'] === chip.id);
        chipElement?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }

    const componentToOpen: Type<any> = MOBILE_COMPONENT_MAP[chip.id as MobileTabChips] || null;
    if (componentToOpen) {
      this.bottomSheet.open(componentToOpen, {
        height: '40%',
        hasBackdrop: false,
        panelClass: 'custom-bottom-sheet',
      });
    }

    this.gAS.logPageEvents('ep_mobile_3d_tab_switch', {
      tab: chip.id,
    });
  }

  public goBackToOverviewPage(): void {
    this.mbFacade.selectPage(MobileTabNames.Overview);
    this.bottomSheet.dismiss();
  }
}
