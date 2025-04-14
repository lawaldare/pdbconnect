import { Component, inject, OnInit, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@pdbc/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../mb-bottom-sheet/bottom-sheet.component';
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
export class MbMolstarTabComponent implements OnInit {
  private bottomSheet = inject(MatBottomSheet);
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly mbFacade = inject(MobileFacade);

  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly mobileTabChips = [
    { label: 'Model Quality', id: MobileTabChips.MQuality },
    { label: 'Assembly', id: MobileTabChips.Assemblies },
    { label: 'Macromolecules', id: MobileTabChips.Macromolecules },
    { label: 'Ligands and Environments', id: MobileTabChips.Ligands },
    { label: 'Domains', id: MobileTabChips.Domains },
  ];

  public selectedTabName = this.mbFacade.selectedTabName;
  private selectedComponent = this.mbFacade.selectedComponent;

  ngOnInit(): void {
    this.openBottomSheet();
  }

  openBottomSheet(): void {
    // this.bottomSheet.open(this.selectedComponent(), {
    //   height: '40%',
    //   hasBackdrop: false,
    // });
  }

  public onTabClick(chip: { label: string; id: string }): void {
    if (chip.id === this.selectedTabName()) {
      this.mbFacade.updateSelectedTabName('');
    } else {
      this.mbFacade.updateSelectedTabName(chip.id);
    }

    console.log(this.selectedTabName());

    switch (this.selectedTabName()) {
      case MobileTabChips.MQuality:
        this.mbFacade.updateSelectedComponent(MbModelQualityComponent);
        break;
      case MobileTabChips.Assemblies:
        this.mbFacade.updateSelectedComponent(MbAssembliesComponent);
        break;
      case MobileTabChips.Macromolecules:
        this.mbFacade.updateSelectedComponent(MbMacromoleculeComponent);
        break;
      case MobileTabChips.Ligands:
        this.mbFacade.updateSelectedComponent(MbLigandsComponent);
        break;
      case MobileTabChips.Domains:
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
}
