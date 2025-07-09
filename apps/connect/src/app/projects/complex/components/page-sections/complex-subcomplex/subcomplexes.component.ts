/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexCardComponent } from '../../section-components/complex-card/complex-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MaterialModule } from '@pdbc/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ComplexUtilService } from '../../../services/complex-util.service';

@Component({
  selector: 'pdbc-subcomplexes',
  standalone: true,
  imports: [CommonModule, ComplexCardComponent, MatPaginator, NgxSkeletonLoaderModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './subcomplexes.component.html',
  styleUrl: './subcomplexes.component.scss',
})
export class SubComplexesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  private utilService = inject(ComplexUtilService);

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));

  public subcomplexesLength = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => (this.subcomplexInteractions() ?? []).length,
  });
  public subcomplexesPageSize = signal<number>(6);
  public subcomplexesPageSizeOptions = computed(() => [6, 12, 18]);

  public subComplexesPage = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => (this.subcomplexInteractions() ?? []).slice(0, this.subcomplexesPageSize()),
  });

  public unfilteredComplexes = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => this.subcomplexInteractions() ?? [],
  });

  public searchTerm = new FormControl('');

  ngOnInit(): void {
    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery: string | null) => {
          if (searchQuery) {
            return this.utilService.filterItemsBySearchQuery(searchQuery, this.unfilteredComplexes());
          } else {
            return this.unfilteredComplexes();
          }
        })
      )
      .subscribe((data: any) => {
        this.subcomplexesLength.set(data.length);
        this.subComplexesPage.update(() => (data ?? []).slice(0, this.subcomplexesPageSize()));
      });
  }

  public handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.subComplexesPage.update(() => (this.subcomplexInteractions() ?? []).slice(startIndex, endIndex));
  }
}
