import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, Optional, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { baseUrl } from '../../../entry-constant';
import { makeEntityColors } from '../../../helpers/misc';
import { SnapshotSpec } from '../../../helpers/mvs-views/mvs-snapshot-types';
import { ApplicationAPIDispatcher } from '../../../services/application-api-dispacher.service';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { EntryStoreState } from '../../../store/entry-store.model';
import { EntryActions } from '../../../store/entry.actions';
import { EntrySelectors } from '../../../store/entry.selectors';
import { MobileStateService } from '../mobile-state.service';

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
  public readonly gAS = inject(GoogleAnalyticsService);
  public baseUrl = baseUrl;

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

  constructor(@Optional() public bottomSheetRef: MatBottomSheetRef<MbAssembliesComponent>) {
    effect(() => this.compCommunication.mvsSnapshotSpec$.next(this.mvsSnapshotSpec()));
  }

  async ngOnInit() {
    /* 1. Fetch data */
    this.applicationApiDispatcher.dispatchForList([
      EntryActions.getSymmetry,
      EntryActions.getSummaryData,
      EntryActions.getAssemblies,
      EntryActions.getPreferredAssembly,
      EntryActions.getProcessedAssemblies,
    ]);

    this.compCommunication.mobileMolstarDisplay = 'assemblies'; // TODO: @adam Remove this.compCommunication.mobileMolstarDisplay
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

  private readonly procMacromolecules = toSignal(this.globalStore.select(EntrySelectors.processedMacromolecules));
  private readonly procLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));
  private readonly entityColors = computed(() => makeEntityColors(this.procMacromolecules(), this.procLigands()));

  private readonly mvsSnapshotSpec = computed<SnapshotSpec | undefined>(() => {
    const entryId = this.entryId();
    const complex = this.preferredAssembly();
    if (!entryId || !complex) return;

    const assemblyId = complex.assemblyId;
    return {
      name: `Complex ${assemblyId}`,
      kind: 'pdbconnect_complex',
      params: { entry: entryId, assemblyId, entityColors: this.entityColors(), volumeStreaming: true },
    };
  });
}
