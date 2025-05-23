import { Component, computed, inject, linkedSignal, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexCardComponent } from '../../section-components/complex-card/complex-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-subcomplexes',
  standalone: true,
  imports: [CommonModule, ComplexCardComponent, MatPaginator, NgxSkeletonLoaderModule, MaterialModule],
  templateUrl: './subcomplexes.component.html',
  styleUrl: './subcomplexes.component.scss',
})
export class SubComplexesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));

  public subcomplexesLength = computed(() => this.subcomplexInteractions()?.length);
  public subcomplexesPageSize = signal<number>(6);
  public subcomplexesPageSizeOptions = computed(() => [6, 12, 18]);

  public subComplexesPage = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => (this.subcomplexInteractions() ?? []).slice(0, this.subcomplexesPageSize()),
  });

  public handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.subComplexesPage.update(() => (this.subcomplexInteractions() ?? []).slice(startIndex, endIndex));
  }
}
