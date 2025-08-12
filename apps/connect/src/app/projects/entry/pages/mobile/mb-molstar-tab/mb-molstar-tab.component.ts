import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileFacade } from '../mobile.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MobileTabNames } from '../mobile-main/mobile-main.component';
import { take } from 'rxjs';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { DefaultParams, InitParams } from 'pdbe-molstar/lib/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PresetStructureRepresentations } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset';
import { DownloadStructure } from 'molstar/lib/mol-plugin-state/actions/structure';
import { Structure } from 'molstar/lib/mol-model/structure';
import { initializeModelIdTracking } from '../../../helpers/molstar-nmr-model-tracking';
import { Color } from 'molstar/lib/mol-util/color';
import { MobileTabChips } from '../../../data-classes/data-models-and-definitions/other-models';

@Component({
  selector: 'pdbc-mb-molstar-tab',
  imports: [CommonModule, MaterialModule, MolstarComponent],
  templateUrl: './mb-molstar-tab.component.html',
  styleUrl: './mb-molstar-tab.component.scss',
})
export class MbMolstarTabComponent implements AfterViewInit {
  private bottomSheet = inject(MatBottomSheet);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly mbFacade = inject(MobileFacade);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public readonly summary = toSignal(this.globalStore.select(EntrySelectors.summaryData));

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  @ViewChildren('chipEl') chipElements!: QueryList<ElementRef<HTMLElement>>;

  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly mobileTabChips = [
    { label: 'Model Quality', id: MobileTabChips.MQuality },
    { label: 'Assembly', id: MobileTabChips.Assemblies },
    { label: 'Macromolecules', id: MobileTabChips.Macromolecules },
    { label: 'Ligands and Environments', id: MobileTabChips.Ligands },
    { label: 'Domains', id: MobileTabChips.Domains },
  ];

  public selectedTabName = this.mbFacade.selectedTabName;

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

  public readonly configForMolstar = computed<InitParams | undefined>(() => {
    const summary = this.summary();
    const entryId = this.entryId();

    if (!summary || !entryId) return undefined;
    const preferredAssembly = summary.assemblies.length > 0 ? summary.assemblies.filter((eachAssembly) => eachAssembly.preferred) : [];
    const preferredAssemblyId = preferredAssembly.length > 0 ? preferredAssembly[0].assembly_id : '1';

    const configForMolstar: InitParams = {
      ...DefaultParams,
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
    };

    return configForMolstar;
  });

  private modelIdObserver?: MutationObserver;

  constructor() {
    // once molstar has rendered, initializes mutation observer for NMR model Id
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (finished) => {
      if (finished) {
        this.modelIdObserver = await initializeModelIdTracking(this.compCommunication.mobileModelIdx$, this._molstarComponent?.getContainer());
      }
    });
    // forces molstar to apply 'polymer-and-ligand' component preset when it loads (so ligands, ions, etc always shown)
    this.molstarFirstRenderFinished$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((finished) => {
      if (finished) {
        let attempts = 0;
        const maxAttempts = 180; // polling for 3 minutes, 1 attempt every second

        const pollingInterval = setInterval(() => {
          try {
            const plugin = this._molstarComponent?.getInstance()?.plugin ?? null;
            if (!plugin) throw new Error('Mol* plugin not found');

            const params = DownloadStructure.createDefaultParams(plugin.state.data.root.obj!, plugin);
            const assemblyRef = plugin.managers.structure?.hierarchy?.current?.structures[0]?.cell?.transform?.ref;
            const structure = plugin.state.data?.select(assemblyRef)[0]?.obj?.data;
            const thresholds = plugin.config.get(PluginConfig.Structure.SizeThresholds) || Structure.DefaultSizeThresholds;
            const size = Structure.getSize(structure, thresholds);
            if (size !== Structure.Size.Small) {
              PresetStructureRepresentations['polymer-and-ligand'].apply(assemblyRef, params as any, plugin);
            }
            this.compCommunication.mobileMolstarLoaded$.next(true);
          } catch (error) {
            console.warn(`Error during attempt ${attempts + 1} for Mol* initialization:`, error);
          }

          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(pollingInterval); // Stop polling after 3 minutes
            console.warn('Polling expired: Mol* setup was not successful in time.');
          }
        }, 1000); // polling interval: 1 secon
      }
    });
  }

  ngAfterViewInit(): void {
    this.mbFacade.selectedPageName.pipe(take(1)).subscribe(async (mobileTabName) => {
      if (mobileTabName === MobileTabNames.Molstar) {
        this.onTabClick(this.mobileTabChips[0]);
      }
    });
  }

  public onTabClick(chip: { label: string; id: string }): void {
    this.mbFacade.onTabClick(chip, this.chipElements);
  }

  public goBackToOverviewPage(): void {
    this.mbFacade.selectPage(MobileTabNames.Overview);
    this.bottomSheet.dismiss();
  }
}
