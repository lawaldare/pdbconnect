import { Component, computed, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { ComplexCardComponent } from '../../section-components/complex-card/complex-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexActions } from '../../../store/complex.actions';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ComplexInteraction } from '../../../models/complex-structure.model';

@Component({
  selector: 'pdbc-complex-interactions',
  standalone: true,
  imports: [CommonModule, ToolTipComponent, ComplexCardComponent, MatPaginator, NgxSkeletonLoaderModule],
  templateUrl: './complex-interactions.component.html',
  styleUrl: './complex-interactions.component.scss',
})
export class ComplexInteractionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));
  public supercomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));

  public subcomplexesLength = computed(() => this.subcomplexInteractions()?.length);
  public supercomplexesLength = computed(() => this.supercomplexInteractions()?.length);
  public subcomplexesPageSize = signal<number>(6);
  public supercomplexesPageSize = signal<number>(6);
  public subcomplexesPageSizeOptions = computed(() => [6, 12, 18]);
  public supercomplexesPageSizeOptions = computed(() => [6, 12, 18]);

  public superComplexesPage = linkedSignal({
    source: this.supercomplexInteractions,
    computation: () => (this.supercomplexInteractions() ?? []).slice(0, this.supercomplexesPageSize()),
  });

  public subComplexesPage = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => (this.subcomplexInteractions() ?? []).slice(0, this.subcomplexesPageSize()),
  });

  public navSections = toSignal(this.globalStore.select(ComplexSelectors.navItems));

  ngOnInit(): void {
    if (this.subcomplexesLength() === 0 && this.supercomplexesLength() === 0) {
      this.updateNavItemsWhenNoInteraction();
    }
  }

  private updateNavItemsWhenNoInteraction(): void {
    const tempNavsections = (this.navSections() ?? []).filter((section) => section.sectionId !== 'interaction-section');
    this.globalStore.dispatch(ComplexActions.setNavItems({ navItems: tempNavsections }));
  }

  public handlePageEvent(event: PageEvent, filterOn: string): void {
    switch (filterOn) {
      case 'subcomplexes': {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.subComplexesPage.update(() => (this.subcomplexInteractions() ?? []).slice(startIndex, endIndex));
        break;
      }
      case 'supercomplexes': {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.superComplexesPage.update(() => (this.supercomplexInteractions() ?? []).slice(startIndex, endIndex));
        break;
      }
    }
  }
}
