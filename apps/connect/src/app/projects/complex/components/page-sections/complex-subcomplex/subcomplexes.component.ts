/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AG_Grid_Theme_Class, MaterialModule } from '@pdbc/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { filter, map } from 'rxjs';
import { ComplexUtilService } from '../../../services/complex-util.service';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { SelectionChangedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';

@Component({
  selector: 'pdbc-subcomplexes',
  standalone: true,
  imports: [CommonModule, MolstarComponent, NgxSkeletonLoaderModule, MaterialModule, ReactiveFormsModule, AgGridAngular],
  templateUrl: './subcomplexes.component.html',
  styleUrl: './subcomplexes.component.scss',
})
export class SubComplexesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public readonly helpLogoSrc = '/assets/images/help_outline_24px.svg';
  private utilService = inject(ComplexUtilService);

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public subcomplexInteractions = toSignal(this.globalStore.select(ComplexSelectors.subComplexInteractions));

  public rowData = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => this.subcomplexInteractions() ?? [],
  });

  public unfilteredComplexes = linkedSignal({
    source: this.subcomplexInteractions,
    computation: () => this.subcomplexInteractions() ?? [],
  });

  public searchTerm = new FormControl('');

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public height = '400px';

  public config!: any;

  ngOnInit(): void {
    this.globalStore
      .select(ComplexSelectors.subComplexInteractions)
      .pipe(
        filter((d) => d.length > 0),
        map((data) => {
          this.config = {
            moleculeId: data[0].representative_structure.pdb_id,
            bgColor: { r: 255, g: 255, b: 255 },
            assemblyId: data[0].representative_structure.assembly_id,
            hideControls: true,
            hideCanvasControls: ['expand', 'animation', 'controlToggle', 'controlInfo', 'selection', 'trajectory'],
            landscape: true,
          };
        })
      )
      .subscribe();

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

  public onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
    const moleculeId = data.representative_structure.pdb_id;
    const assemblyId = data.representative_structure.assembly_id;
    this.config = { ...this.config, moleculeId, assemblyId };
  }
}
