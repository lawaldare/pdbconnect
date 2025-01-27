import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
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
  public subcomplexesPageSize = signal<number>(5);
  public supercomplexesPageSize = signal<number>(5);
  public subcomplexesPageSizeOptions = computed(() => [5, 10, 20, 50]);
  public supercomplexesPageSizeOptions = computed(() => [5, 10, 20, 50]);

  public subLength = computed(() => this.subcomplexInteractions()?.length);
  public superLength = computed(() => this.supercomplexInteractions()?.length);

  private subPageIndex = signal(0);
  private superPageIndex = signal(0);

  subComplexesPage = computed(() => {
    const start = this.subPageIndex() * this.subcomplexesPageSize();
    const end = start + this.subcomplexesPageSize();
    return (this.subcomplexInteractions() ?? []).slice(start, end);
  });
  superComplexesPage = computed(() => {
    const start = this.superPageIndex() * this.supercomplexesPageSize();
    const end = start + this.supercomplexesPageSize();
    return (this.supercomplexInteractions() ?? []).slice(start, end);
  });

  public navSections = toSignal(this.globalStore.select(ComplexSelectors.navItems));

  ngOnInit(): void {
    if (this.subLength() === 0 && this.superLength() === 0) {
      this.updateNavItemsWhenNoInteraction();
    }
  }

  private updateNavItemsWhenNoInteraction(): void {
    const tempNavsections = (this.navSections() ?? []).filter((section) => section.sectionId !== 'interaction-section');
    this.globalStore.dispatch(ComplexActions.setNavItems({ navItems: tempNavsections }));
  }

  handlePageEvent(event: PageEvent, filterOn: string) {
    switch (filterOn) {
      case 'subcomplexes': {
        this.subPageIndex.set(event.pageIndex);
        break;
      }
      case 'supercomplexes': {
        this.superPageIndex.set(event.pageIndex);
        break;
      }
    }
  }
}
