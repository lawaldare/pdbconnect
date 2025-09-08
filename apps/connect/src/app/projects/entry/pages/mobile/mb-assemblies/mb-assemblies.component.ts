import { Component, computed, inject, OnInit, Optional, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryStoreState } from '../../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MaterialModule } from '@pdbc/core';
import { FormsModule } from '@angular/forms';
import { filter, firstValueFrom, take } from 'rxjs';
import { clearSelectionInMolstar } from '../../../helpers/molstar-helpers';
import { MobileStateService } from '../mobile-state.service';
import { EntryActions } from '../../../store/entry.actions';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-assemblies',
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './mb-assemblies.component.html',
  styleUrls: ['../common-mb-header.scss', './mb-assemblies.component.scss'],
})
export class MbAssembliesComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly state = inject(MobileStateService);
  public readonly compCommunication = inject(ComponentCommunicationService);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public expanded = signal<boolean>(false);
  public isChecked = signal<boolean>(false);

  public readonly symmetry = toSignal(this.globalStore.select(EntrySelectors.symmetry));
  public readonly entryId = toSignal(this.globalStore.select(EntrySelectors.entryId));

  public readonly processedAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));

  public readonly assemblyTableRows = computed(() => {
    const rows = this.processedAssemblies();
    if (rows) return rows;
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
    /* 1. Fetch data */
    // this.globalStore.dispatch(EntryActions.getSymmetry());
    // this.globalStore.dispatch(EntryActions.getSummaryData());
    // this.globalStore.dispatch(EntryActions.getAssemblies());
    // this.globalStore.dispatch(EntryActions.getPreferredAssembly());
    // this.globalStore.dispatch(EntryActions.getProcessedAssemblies());
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getSymmetry,
      EntryActions.getSummaryData,
      EntryActions.getAssemblies,
      EntryActions.getPreferredAssembly,
      EntryActions.getProcessedAssemblies,
    ]);

    /* 2. Draw in Molstar */
    // Wait until first render is finished
    await firstValueFrom(
      this.compCommunication.mobileMolstarLoaded$.pipe(
        filter((ready) => ready), // proceed when true
        take(1)
      )
    );
    if (this.compCommunication.mobileMolstarDisplay === 'assemblies') return;

    const instance = this.compCommunication.mobileMolstar?.getInstance() ?? null;
    if (!instance) return;
    await clearSelectionInMolstar(instance, 700);
    this.compCommunication.mobileMolstarDisplay = 'assemblies';
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
    this.state.updateSelectedComponent(null);
    this.state.updateSelectedTabName('');
  }
}
