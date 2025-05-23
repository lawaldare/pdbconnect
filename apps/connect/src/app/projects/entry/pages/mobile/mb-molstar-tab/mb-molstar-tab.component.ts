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
import { MolstarOverviewForTopPage } from '../../../helpers/molstar/molstar-overview-for-top-page';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MobileTabNames } from '../mobile-main/mobile-main.component';
import { take } from 'rxjs';
import { MolstarStateService } from '../../../services/molstar-state.service';

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

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));
  public molstarFirstRenderFinished = computed(() => this.molstarState.molstarFirstRenderFinished());

  @ViewChild('molstarContainer') molstarContainer!: ElementRef;
  @ViewChildren('chipEl') chipElements!: QueryList<ElementRef<HTMLElement>>;

  private molstarFirstRenderStarted = signal(false);
  private readonly molstarVisualisation = inject(MolstarOverviewForTopPage);
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
    this.mbFacade.selectedMobileTabName.pipe(take(1)).subscribe(async (mobileTabName) => {
      if (mobileTabName === MobileTabNames.Molstar) {
        await this.initializeMolstarViewer();
      }
    });
  }

  public onTabClick(chip: { label: string; id: string }): void {
    if (chip.id === this.selectedTabName()) {
      this.mbFacade.updateSelectedTabName('');
    } else {
      this.mbFacade.updateSelectedTabName(chip.id);
      // scrolls into view horizontally on mobile without anti pattern
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        const chipElement = this.chipElements.find((el) => el.nativeElement.dataset['id'] === chip.id);
        chipElement?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });
    }

    switch (this.selectedTabName()) {
      case MobileTabChips.MQuality:
        this.mbFacade.updateSelectedComponent(MbModelQualityComponent);
        break;
      case MobileTabChips.Assemblies:
        this.mbFacade.updateSelectedComponent(MbAssembliesComponent);
        break;
      case MobileTabChips.Macromolecules:
        this.mbFacade.updateSelectedMacromoleculeTitle('Macromolecules');
        this.mbFacade.updateSelectedComponent(MbMacromoleculeComponent);
        break;
      case MobileTabChips.Ligands:
        this.mbFacade.updateSelectedLigandTitle('Ligands');
        this.mbFacade.updateSelectedComponent(MbLigandsComponent);
        break;
      case MobileTabChips.Domains:
        this.mbFacade.updateSelectedDomainTitle('Domains');
        this.mbFacade.updateSelectedComponent(MbDomainsComponent);
        break;
      default:
        this.mbFacade.updateSelectedComponent(null);

        break;
    }

    if (this.selectedComponent() !== null) {
      const componentInstance = this.selectedComponent() as Type<any>;
      this.bottomSheet.open(componentInstance, {
        height: '40%',
        hasBackdrop: false,
        panelClass: 'custom-bottom-sheet',
      });
    } else {
      this.bottomSheet.dismiss();
    }
  }

  private async initializeMolstarViewer(): Promise<void> {
    const molstarElement = document.getElementById('molstar-mobile-element');
    this.molstarVisualisation.entryId = this.entryId();
    this.molstarVisualisation.setRenderer(this.renderer);
    this.molstarVisualisation.molstarViewerElement = molstarElement as HTMLElement;

    await this.molstarVisualisation.renderMobileMolstarInitial();
    this.molstarState.molstarFirstRenderFinished.set(true);
  }

  ngOnDestroy(): void {
    this.molstarState.molstarFirstRenderFinished.set(false);
    this.molstarFirstRenderStarted.set(false);
    this.molstarVisualisation.molstarViewerElement = undefined;
  }
}
