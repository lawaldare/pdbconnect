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

@Component({
  selector: 'pdbc-complex-interactions',
  standalone: true,
  imports: [CommonModule, ToolTipComponent, ComplexCardComponent, MatPaginator],
  templateUrl: './complex-interactions.component.html',
  styleUrl: './complex-interactions.component.scss',
})
export class ComplexInteractionsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));

  public subcomplexesLength = computed(() => this.summaryData()?.subcomplexes.length);
  public supercomplexesLength = computed(() => this.summaryData()?.supercomplexes.length);
  public subcomplexesPageSize = signal<number>(5);
  public supercomplexesPageSize = signal<number>(5);
  public subcomplexesPageSizeOptions = computed(() => [5, 10, 20, 50]);
  public supercomplexesPageSizeOptions = computed(() => [5, 10, 20, 50]);

  public subComplexesPage: string[] = [];
  public superComplexesPage: string[] = [];

  public subLength = computed(() => this.summaryData()?.subcomplexes.length);
  public superLength = computed(() => this.summaryData()?.supercomplexes.length);

  public navSections = toSignal(this.globalStore.select(ComplexSelectors.navItems));

  ngOnInit(): void {
    this.subComplexesPage = (this.summaryData()?.subcomplexes ?? []).slice(0, this.subcomplexesPageSize());
    this.superComplexesPage = (this.summaryData()?.supercomplexes ?? []).slice(0, this.supercomplexesPageSize());
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
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.subComplexesPage = this.summaryData()?.subcomplexes ?? [].slice(startIndex, endIndex);
        break;
      }
      case 'supercomplexes': {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.superComplexesPage = this.summaryData()?.supercomplexes ?? [].slice(startIndex, endIndex);
        break;
      }
    }
  }
}
