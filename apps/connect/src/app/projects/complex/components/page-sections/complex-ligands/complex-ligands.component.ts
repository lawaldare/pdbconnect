import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexLigandGridComponent } from '../../section-components/complex-ligand-grid/complex-ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { ComplexActions } from '../../../store/complex.actions';
import { navComplexSections } from '../../../complex.constant';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';

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
  imports: [CommonModule, ComplexLigandGridComponent, MatPaginator, ReactiveFormsModule],
  templateUrl: './complex-ligands.component.html',
  styleUrl: './complex-ligands.component.scss',
})
export class ComplexLigandsComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);

  public ligandsPageSize = signal<number>(5);

  public readonly complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));

  public ligands = signal<ComplexLigand[]>([]);
  public filteredligands = signal<ComplexLigand[]>([]);
  public ligandsPage = signal<ComplexLigand[]>([]);

  public ligandsLength = signal<number>(0);
  public ligandsPageSizeOptions = computed(() => [5, 10, 15]);

  public navSections = toSignal(this.globalStore.select(ComplexSelectors.navItems));

  public searchTerm = new FormControl('');

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.globalStore.select(ComplexSelectors.complexLigands).subscribe((ligands) => {
      if (ligands.length > 0) {
        this.ligands.update(() => ligands);
        this.filteredligands.update(() => ligands);
        this.ligandsLength.set(this.filteredligands().length);
        this.ligandsPage.update(() => (this.ligands() ?? []).slice(0, this.ligandsPageSize()));
        this.globalStore.dispatch(ComplexActions.setNavItems({ navItems: navComplexSections }));
      } else {
        this.updateWhenNoLigands();
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
        this.filteredligands.update(() => data);
        this.ligandsLength.set(this.filteredligands().length);
        this.ligandsPage.update(() => (this.filteredligands() ?? []).slice(0, this.ligandsPageSize()));
      });
  }

  private updateWhenNoLigands(): void {
    const tempNavsections = (this.navSections() ?? []).filter((section) => section.sectionId !== 'ligands-section');
    this.globalStore.dispatch(ComplexActions.setNavItems({ navItems: tempNavsections }));
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
}
