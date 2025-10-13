/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexLigandGridComponent } from '../../section-components/complex-ligand-grid/complex-ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ComplexLigand } from '../../../models/complex-ligands.model';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-complex-ligands',
  standalone: true,
  imports: [CommonModule, ComplexLigandGridComponent, MatPaginator, ReactiveFormsModule, MaterialModule],
  templateUrl: './complex-ligands.component.html',
  styleUrl: './complex-ligands.component.scss',
})
export class ComplexLigandsComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);

  public ligandsPageSize = signal<number>(6);

  public readonly complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));

  public ligands = signal<ComplexLigand[]>([]);
  public ligandsPage = signal<ComplexLigand[]>([]);

  public ligandsLength = signal<number>(0);
  public ligandsPageSizeOptions = computed(() => [6, 12, 18]);

  public searchTerm = new FormControl('');

  private readonly destroyRef = inject(DestroyRef);

  public selectedSortBy = new FormControl('functional', { nonNullable: true });

  @ViewChild('ligandGrid', { read: ComplexLigandGridComponent }) public ligandGrid!: ComplexLigandGridComponent;

  ngOnInit(): void {
    this.globalStore.select(ComplexSelectors.complexLigands).subscribe((ligands) => {
      if (ligands.length > 0) {
        this.updateUI(ligands);
      }
    });

    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.filterItemsBySearchQuery(searchQuery, this.ligands());
          } else {
            return this.ligands();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: any) => {
        this.ligandsLength.set(data.length);
        this.ligandsPage.update(() => (data ?? []).slice(0, this.ligandsPageSize()));
      });
  }

  handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.ligandsPage.update(() => (this.ligands() ?? []).slice(startIndex, endIndex));
  }

  private filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      return item.name.toLocaleLowerCase().indexOf(searchQueryLower) !== -1 || item.ligandId.toString().toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  private updateUI(ligands: ComplexLigand[]): void {
    this.ligands.update(() => ligands);
    this.ligandsLength.set(ligands.length);
    this.ligandsPage.update(() => (this.ligands() ?? []).slice(0, this.ligandsPageSize()));
  }

  private sortByFunctional(): void {
    this.globalStore.select(ComplexSelectors.complexLigands).subscribe((ligands) => {
      if (ligands && ligands.length > 0) {
        this.updateUI(ligands);
      }
    });
  }
  private sortByFrequency(): void {
    this.globalStore.select(ComplexSelectors.complexLigands).subscribe((ligands) => {
      if (ligands && ligands.length > 0) {
        const updateLigands = [...ligands].sort((a, b) => b.num_pdb_entries - a.num_pdb_entries);
        this.updateUI(updateLigands);
      }
    });
  }

  public onSortTypeChange(value: string) {
    if (value === 'functional') {
      this.sortByFunctional();
    } else if (value === 'frequency') {
      this.sortByFrequency();
    }

    // this.ligandGrid.renderLigandImg();
  }
}
