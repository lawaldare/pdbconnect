import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryActions } from '../../../../../store/entry.actions';

@Component({
  selector: 'pdbc-mb-overview-assembly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-overview-assembly.component.html',
  styleUrl: './mb-overview-assembly.component.scss',
})
export class MbOverviewAssemblyComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly processedAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));

  public readonly assemblyTableRows = computed(() => {
    const rows = this.processedAssemblies();
    if (rows === undefined) return [];
    return rows;
  });

  ngOnInit(): void {
    // summary data always imported on main
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getPreferredAssembly());
    this.globalStore.dispatch(EntryActions.getProcessedAssemblies());
  }
}
