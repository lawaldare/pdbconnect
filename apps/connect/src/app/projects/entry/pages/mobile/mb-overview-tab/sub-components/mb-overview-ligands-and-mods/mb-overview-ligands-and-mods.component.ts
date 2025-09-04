import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../../../store/entry.selectors';
import { EntryActions } from '../../../../../store/entry.actions';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pdbc-mb-overview-ligands-and-mods',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  templateUrl: './mb-overview-ligands-and-mods.component.html',
  styleUrl: './mb-overview-ligands-and-mods.component.scss',
})
export class MbOverviewLigandsAndModsComponent implements OnInit {
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly processedLigands = toSignal(this.globalStore.select(EntrySelectors.processedLigands));

  public readonly ligandInitialCount = signal<number>(5);

  public loadedLigands = computed(() => this.processedLigands() !== undefined);

  public readonly ligandTableRows = computed(() => {
    const rows = this.processedLigands();
    if (rows === undefined) return [];
    return rows;
  });

  ngOnInit(): void {
    this.globalStore.dispatch(EntryActions.getAssemblies());
    this.globalStore.dispatch(EntryActions.getEntryMolecules());
    this.globalStore.dispatch(EntryActions.getEntryLigandMonomers());
    this.globalStore.dispatch(EntryActions.getModifications());
    this.globalStore.dispatch(EntryActions.getProcessedLigands());
  }

  public toggleLigandList(): void {
    this.ligandInitialCount.update((prev) => (prev === 5 ? this.ligandTableRows().length : 5));
  }
}
