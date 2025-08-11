import { Component, computed, DestroyRef, inject, OnInit, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { ValidationDataProcessingFacade } from '../../../components/model-quality-tab/validation-data.facade';
import { MobileFacade } from '../mobile.facade';
import { MainDataProcessingFacade } from '../../main/data-processing.facade';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { AssembliesRowData } from '../../../data-classes/data-models-and-definitions/row-and-table.model';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MaterialModule } from '@pdbc/core';
import { FormsModule } from '@angular/forms';
import { filter, firstValueFrom, take } from 'rxjs';
import { clearSelectionInMolstar } from '../../../helpers/molstar-helpers';

@Component({
  selector: 'pdbc-mb-assemblies',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './mb-assemblies.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-assemblies.component.scss'],
})
export class MbAssembliesComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dataFacade = inject(ValidationDataProcessingFacade);
  private readonly mbFacade = inject(MobileFacade);
  public readonly dataProcessing = inject(MainDataProcessingFacade);
  public readonly compCommunication = inject(ComponentCommunicationService);
  public expanded = signal<boolean>(false);
  public isChecked = signal<boolean>(false);

  public readonly symmetry = toSignal(this.globalStore.select(EntrySelectors.symmetry));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly assemblyTableRows = computed(() => {
    const isLoaded = this.dataProcessing.tabDataLoaded();
    const tableData = this.compCommunication.tabTableData();
    const hasData = Object.keys(tableData).indexOf('Assemblies') !== -1;

    if (isLoaded && hasData) {
      const tabData = this.compCommunication.getTabData('Assemblies');
      return tabData.tableRows() as AssembliesRowData[];
    }
    return [];
  });

  public readonly preferredAssembly = computed(() => {
    const assemblies = this.assemblyTableRows();
    const preferredAssembly = assemblies.find((assembly) => assembly.assemblyName.includes('preferred'));
    return preferredAssembly ?? assemblies[0];
  });

  public readonly preferredSymmetry = computed(() => {
    const symmetries = this.symmetry();
    if (symmetries) {
      const preferredSymmetry = symmetries.find((symmetry) => symmetry.assembly_id === '1');
      return preferredSymmetry;
    }
    return undefined;
  });

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbAssembliesComponent>) {}

  async ngOnInit() {
    // Wait until first render is finished
    await firstValueFrom(
      this.compCommunication.mobileMolstarLoaded$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );

    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;
    await clearSelectionInMolstar(instance, 700);
  }

  toggleBottomsheetHeight() {
    this.expanded.update((olamide) => !olamide);
    const container = document.querySelector('.custom-bottom-sheet') as HTMLElement;
    if (container) {
      container.style.height = this.expanded() ? '80%' : '40%';
    }
  }

  public async closeBottomSheet() {
    this.bottomSheetRef.dismiss();
    this.mbFacade.updateSelectedComponent(null);
    this.mbFacade.updateSelectedTabName('');
  }
}
