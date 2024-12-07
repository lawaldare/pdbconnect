import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { ComplexLigandGridComponent } from '../../section-components/complex-ligand-grid/complex-ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { toSignal } from '@angular/core/rxjs-interop';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { ComplexSelectors } from '../../../store/complex.selectors';

export interface ComplexLigand {
  ligandId: string;
  annotations: string[];
  num_pdb_entries: number;
  num_chains: number;
  num_ligand_instances: number;
  name: string;
}

@Component({
  selector: 'pdbc-complex-ligands',
  standalone: true,
  imports: [CommonModule, ComplexLigandGridComponent, MatPaginator],
  templateUrl: './complex-ligands.component.html',
  styleUrl: './complex-ligands.component.scss',
})
export class ComplexLigandsComponent {
  private readonly globalStore = inject(Store<ComplexStoreState>);

  public ligandsPage = signal<ComplexLigand[]>([]);
  public ligandsPageSize = signal<number>(5);

  private readonly ligands$ = this.globalStore.select(ComplexSelectors.complexLigands).pipe(
    tap((ligands) => {
      this.ligandsPage.update(() => ligands.slice(0, this.ligandsPageSize()));
    })
  );

  public ligands = toSignal(this.ligands$);
  public ligandsLength = computed(() => this.ligands()?.length);
  public ligandsPageSizeOptions = computed(() => [5, 10, 15]);

  handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.ligandsPage.update(() => (this.ligands() ?? []).slice(startIndex, endIndex));
  }
}
