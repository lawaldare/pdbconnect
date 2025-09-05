/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, ElementRef, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AG_Grid_Theme_Class, MaterialModule, UtilService } from '@pdbc/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, rowSelection } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { SuperpositionService } from '../../../services/superposition.service';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';
import { superpositionTooltip } from '../../../complex.constant';
import { MbComplexComponent } from '../mb-complex-components';

@Component({
  selector: 'pdbc-subcomplexes',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule, MaterialModule, ReactiveFormsModule, AgGridAngular, HelpIconWithTooltipComponent, MbComplexComponent],
  templateUrl: './subcomplexes.component.html',
  styleUrl: '../sub-and-super-complex.scss',
})
export class SubComplexesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  private utilService = inject(ComplexUtilService);
  private readonly util = inject(UtilService);

  private readonly superpositionService = inject(SuperpositionService);
  public initialized = false;

  @ViewChild('molstarContainer') set container(el: ElementRef | undefined) {
    if (el && this.rowData().length && !this.initialized) {
      this.initialized = true;
      this.superpositionService.loadInitialComplexView(el.nativeElement);
    }
  }

  public isLoading = this.superpositionService.isLoading;

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));

  public rowData = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => this.subcomplexInteractions() ?? [],
  });

  public structuresPage = linkedSignal({
    source: this.rowData,
    computation: () => (this.rowData() ?? []).slice(0, this.structuresPageSize()),
  });

  public unfilteredComplexes = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => this.subcomplexInteractions() ?? [],
  });

  public searchTerm = new FormControl('');

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public height = '400px';

  private currentComplexId = signal<string>('');

  public superpositionTooltip = superpositionTooltip;

  public structuresLength = computed(() => (this.rowData() ?? []).length);
  public structuresPageSize = signal<number>(5);
  public structuresPageSizeOptions = computed(() => [5, 10, 20, 50, 100]);

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
        this.rowData.update(() => data ?? []);
      });
  }

  public openComplexPage(complexId: string): void {
    this.util.redirectToSearchTerm(complexId, '_blank');
  }

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage.set((this.rowData() ?? []).slice(startIndex, endIndex));
  }

  public async onSelectionChanged(event: SelectionChangedEvent) {
    if (this.currentComplexId()) {
      await this.superpositionService.deleteComplex(this.currentComplexId());
    }
    const data = event.api.getSelectedNodes()[0].data;
    this.currentComplexId.set(data.pdb_complex_id);
    await this.superpositionService.loadComplex(data.pdb_complex_id, 'subcomplex');
  }
}
