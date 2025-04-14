import { Component, computed, DestroyRef, inject, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { MobileFacade } from '../mobile.facade';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { AssembliesRowData } from '../../../components/shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MaterialModule } from '@pdbc/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'pdbc-mb-assemblies',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './mb-assemblies.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-assemblies.component.scss'],
})
export class MbAssembliesComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly signals = inject(ComponentCommunicationService);
  public expanded = signal<boolean>(false);
  public isChecked = signal<boolean>(false);

  public readonly symmetry = toSignal(this.globalStore.select(EntrySelectors.symmetry));

  public readonly assemblyTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    if (isLoaded) {
      const tabData = this.signals.getTabData('Assemblies');
      return tabData.tableRows() as AssembliesRowData[];
    }
    return [];
  });

  public readonly prefferedAssembly = computed(() => {
    const assemblies = this.assemblyTableRows();
    const preferredAssembly = assemblies.find((assembly) => assembly.assemblyName.includes('preferred'));
    return preferredAssembly ?? assemblies[0];
  });

  public readonly prefferedSymmetry = computed(() => {
    const symmetries = this.symmetry();
    if (symmetries) {
      const preferredSymmetry = symmetries.find((symmetry) => symmetry.assembly_id === '1');
      return preferredSymmetry;
    }
    return undefined;
  });

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbAssembliesComponent>) {}

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  public closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.mbFacade.updateSelectedComponent(null);
    this.mbFacade.updateSelectedTabName('');
  }
}
