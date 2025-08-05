import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  QueryList,
  Renderer2,
  signal,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MbModelQualityComponent } from '../mb-model-quality/mb-model-quality.component';
import { MbAssembliesComponent } from '../mb-assemblies/mb-assemblies.component';
import { MbMacromoleculeComponent } from '../mb-macromolecules/mb-macromolecule.component';
import { MbLigandsComponent } from '../mb-ligands/mb-ligands.component';
import { MbDomainsComponent } from '../mb-domains/mb-domains.component';
import { MobileFacade } from '../mobile.facade';
import { MolstarForEntryPages } from '../../../helpers/molstar-for-entry-pages';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MobileTabNames } from '../mobile-main/mobile-main.component';
import { filter, take } from 'rxjs';
import { MolstarStateService } from '../../../services/molstar-state.service';
import { NavigationEnd, Router } from '@angular/router';

export enum MobileTabChips {
  MQuality = 'MQuality',
  Assemblies = 'Assemblies',
  Macromolecules = 'Macromolecules',
  Ligands = 'Ligands',
  Domains = 'Domains',
}

@Component({
  selector: 'pdbc-mb-molstar-tab',
  imports: [CommonModule, MaterialModule],
  templateUrl: './mb-molstar-tab.component.html',
  styleUrl: './mb-molstar-tab.component.scss',
})
export class MbMolstarTabComponent implements AfterViewInit, OnDestroy {
  private bottomSheet = inject(MatBottomSheet);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly mbFacade = inject(MobileFacade);
  private readonly zone = inject(NgZone);
  private readonly _router = inject(Router);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  @ViewChildren('chipEl') chipElements!: QueryList<ElementRef<HTMLElement>>;

  private molstarFirstRenderStarted = signal(false);
  private readonly molstarVisualisation = inject(MolstarForEntryPages);
  private readonly renderer = inject(Renderer2);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public readonly molstarState = inject(MolstarStateService);

  public readonly mobileTabChips = [
    { label: 'Model Quality', id: MobileTabChips.MQuality },
    { label: 'Assembly', id: MobileTabChips.Assemblies },
    { label: 'Macromolecules', id: MobileTabChips.Macromolecules },
    { label: 'Ligands and Environments', id: MobileTabChips.Ligands },
    { label: 'Domains', id: MobileTabChips.Domains },
  ];

  public selectedTabName = this.mbFacade.selectedTabName;
  private selectedComponent = this.mbFacade.selectedComponent;

  ngAfterViewInit() {
    this.mbFacade.selectedPageName.pipe(take(1)).subscribe(async (mobileTabName) => {
      if (mobileTabName === MobileTabNames.Molstar) {
        console.log('Initializing Molstar viewer');
        this.onTabClick(this.mobileTabChips[0]);
        await this.initializeMolstarViewer();
      }
    });
  }

  public onTabClick(chip: { label: string; id: string }): void {
    this.mbFacade.onTabClick(chip, this.chipElements);
  }

  private async initializeMolstarViewer(): Promise<void> {
    const molstarElement = document.getElementById('molstar-mobile-element');
    this.molstarVisualisation.entryId = this.entryId();
    this.molstarVisualisation.setRenderer(this.renderer);
    this.molstarVisualisation.molstarViewerElement = molstarElement as HTMLElement;

    await this.molstarVisualisation.renderMobileMolstarInitial();
    this.molstarState.molstarFirstRenderFinished.set(true);
  }

  public goBackToOverviewPage(): void {
    this.mbFacade.selectPage(MobileTabNames.Overview);
    this.bottomSheet.dismiss();
  }

  ngOnDestroy(): void {
    this.molstarState.molstarFirstRenderFinished.set(false);
    this.molstarFirstRenderStarted.set(false);
    this.molstarVisualisation.molstarViewerElement = undefined;
  }
}
