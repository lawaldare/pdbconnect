import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, NgZone, QueryList, signal, Type, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileFacade } from '../mobile.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { take } from 'rxjs';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { initializeModelIdTracking } from '../../../helpers/molstar-nmr-model-tracking';
import { MobileTabChips } from '../../../store/data-processing/models/other-models';
import { MbAssembliesComponent } from '../mb-assemblies/mb-assemblies.component';
import { MbDomainsComponent } from '../mb-domains/mb-domains.component';
import { MbLigandsComponent } from '../mb-ligands/mb-ligands.component';
import { MbMacromoleculeComponent } from '../mb-macromolecules/mb-macromolecule.component';
import { MbModelQualityComponent } from '../mb-model-quality/mb-model-quality.component';
import { MobileStateService } from '../mobile-state.service';
import { MobileTabNames } from '../mobile-tab.model';
import { Molstar370DefaultParams } from '../../../helpers/molstar-helpers';

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
    if (isSlow === undefined) return false;
    return isSlow === false || forceLoad === true;
  });

  public toggleMolstar() {
    const forceLoad = this.compCommunication.forceLoad();
    this.compCommunication.forceLoad.set(!forceLoad);
  }

  public readonly configForMolstar = computed(() => {
    const summary = this.summary();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar = {
      ...Molstar370DefaultParams,
      moleculeId: this.entryId(),
      assemblyId: preferredAssemblyId,
      bgColor: { r: 255, g: 255, b: 255 },
      landscape: false,
      subscribeEvents: true,
      granularity: 'residue',
      hideControls: true,
      visualStyle: {
        polymer: {
          type: 'cartoon',
          color: 'entity-id',
          // color: 'uniform',
          // colorParams: { value: Color(0xd4d5d4) },
        },
      },
      hideCanvasControls: ['controlToggle', 'controlInfo', 'selection', 'animation', 'trajectory'],
      loadMaps: true,
      mapSettings: { defaultView: 'selection-box' },
    };

    return configForMolstar;
  });

  private modelIdObserver?: MutationObserver;
  constructor() {
    // once molstar has rendered, initializes mutation observer for NMR model Id
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (finished) => {
      if (finished) {
        this.compCommunication.mobileMolstarLoaded$.next(true);
        this.modelIdObserver = await initializeModelIdTracking(this.compCommunication.mobileModelIdx$, this._molstarComponent?.getContainer());
      }
    });
  }

  ngAfterViewInit(): void {
    document.body.style.top = '0px';
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

    this.gAS.logEntryPageEvents('ep_mobile_3d_tab_switch', {
      tab: chip.id,
    });
  }

  public goBackToOverviewPage(): void {
    this.mbFacade.selectPage(MobileTabNames.Overview);
    this.bottomSheet.dismiss();
  }
}
