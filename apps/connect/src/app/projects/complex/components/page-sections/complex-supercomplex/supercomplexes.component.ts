/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, ElementRef, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AG_Grid_Theme_Class, MaterialModule } from '@pdbc/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, rowSelection } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { SuperpositionService } from '../../../services/superposition.service';
import { superpositionTooltip } from '../../../complex.constant';
import { HelpIconWithTooltipComponent } from '@pdbc/help-icon-with-tooltip';

@Component({
  selector: 'pdbc-supercomplexes',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule, MaterialModule, ReactiveFormsModule, AgGridAngular, HelpIconWithTooltipComponent],
  templateUrl: './supercomplexes.component.html',
  styleUrl: './supercomplexes.component.scss',
})
export class SuperComplexesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  private utilService = inject(ComplexUtilService);
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
  public supercomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.superComplexInteractions));

  public rowData = linkedSignal({
    source: this.supercomplexInteractions,
    computation: () => this.supercomplexInteractions() ?? [],
  });

  public unfilteredComplexes = linkedSignal({
    source: this.supercomplexInteractions,
    computation: () => this.supercomplexInteractions() ?? [],
  });

  public searchTerm = new FormControl('');

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  // public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public height = '400px';

  private currentComplexId = signal<string>('');

  public superpositionTooltip = superpositionTooltip;

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

  public async onSelectionChanged(event: SelectionChangedEvent) {
    if (this.currentComplexId()) {
      await this.superpositionService.deleteComplex(this.currentComplexId());
    }
    const data = event.api.getSelectedNodes()[0].data;
    this.currentComplexId.set(data.pdb_complex_id);
    await this.superpositionService.loadComplex(data.pdb_complex_id, 'supercomplex');
  }
}
