import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntryActions } from '../../../../../store/entry.actions';
import { ApplicationAPIDispatcher } from '../../../../../services/application-api-dispacher.service';

@Component({
  selector: 'pdbc-mb-overview-assembly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mb-overview-assembly.component.html',
  styleUrl: './mb-overview-assembly.component.scss',
})
export class MbOverviewAssemblyComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly applicationApiDispatcher = inject(ApplicationAPIDispatcher);

  public readonly processedAssemblies = toSignal(this.globalStore.select(EntrySelectors.processedAssemblies));

  public readonly assemblyTableRows = computed(() => {
    const rows = this.processedAssemblies();
    if (rows === undefined) return [];
    return rows;
  });

  ngOnInit(): void {
    this.applicationApiDispatcher.dispatchForList([EntryActions.getAssemblies, EntryActions.getPreferredAssembly, EntryActions.getProcessedAssemblies]);
    // summary data always imported on main
    // this.globalStore.dispatch(EntryActions.getAssemblies());
    // this.globalStore.dispatch(EntryActions.getPreferredAssembly());
    // this.globalStore.dispatch(EntryActions.getProcessedAssemblies());
  }
}
