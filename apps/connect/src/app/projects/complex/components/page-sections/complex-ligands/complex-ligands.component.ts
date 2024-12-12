import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, take, tap } from 'rxjs';
import { ComplexLigandGridComponent } from '../../section-components/complex-ligand-grid/complex-ligand-grid.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { Store } from '@ngrx/store';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { LigandSelectors } from '../../../../ligands/store/ligand.selectors';
import { NavSection } from '@pdbc/core';
import { LigandActions } from '../../../../ligands/store/ligand.actions';
import { navComplexSections } from '../../../complex.constant';
import { ComplexActions } from '../../../store/complex.actions';

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
export class ComplexLigandsComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);

  public ligandsPage = signal<ComplexLigand[]>([]);
  public ligandsPageSize = signal<number>(5);

  private readonly ligands$ = this.globalStore.select(ComplexSelectors.complexLigands);

  public readonly complexId = toSignal(this.globalStore.select(ComplexSelectors.complexId));

  public ligands = toSignal(this.ligands$);

  public ligandsLength = computed(() => this.ligands()?.length);
  public ligandsPageSizeOptions = computed(() => [5, 10, 15]);

  public navSections = toSignal(this.globalStore.select(ComplexSelectors.navItems));

  ngOnInit(): void {
    this.ligandsPage.update(() => (this.ligands() ?? []).slice(0, this.ligandsPageSize()));
    if (!this.ligandsLength() || this.ligandsLength() === 0) {
      this.updateWhenNoLigands();
    }
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
}
