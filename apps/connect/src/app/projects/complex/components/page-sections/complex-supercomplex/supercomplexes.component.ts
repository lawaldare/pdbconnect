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
  selector: 'pdbc-supercomplexes',
  standalone: true,
  imports: [CommonModule, MaterialModule, ComplexCardComponent, MatPaginator, NgxSkeletonLoaderModule, ReactiveFormsModule],
  templateUrl: './supercomplexes.component.html',
  styleUrl: './supercomplexes.component.scss',
})
export class SuperComplexesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  private utilService = inject(ComplexUtilService);

  private readonly globalStore = inject(Store<ComplexStoreState>);

  public supercomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));

  public supercomplexesLength = linkedSignal({
    source: this.supercomplexInteractions,
    computation: () => (this.supercomplexInteractions() ?? []).length,
  });
  public supercomplexesPageSize = signal<number>(6);
  public supercomplexesPageSizeOptions = computed(() => [6, 12, 18]);

  public superComplexesPage = linkedSignal({
    source: this.supercomplexInteractions,
    computation: () => (this.supercomplexInteractions() ?? []).slice(0, this.supercomplexesPageSize()),
  });

  private unfilteredComplexes = linkedSignal({
    source: this.supercomplexInteractions,
    computation: () => (this.supercomplexInteractions() ?? []).slice(0, this.supercomplexesPageSize()),
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
        this.supercomplexesLength.set(data.length);
        this.superComplexesPage.update(() => (data ?? []).slice(0, this.supercomplexesPageSize()));
      });
  }

  public handlePageEvent(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.superComplexesPage.update(() => (this.supercomplexInteractions() ?? []).slice(startIndex, endIndex));
  }
}
