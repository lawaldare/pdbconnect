import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, agGridOptionsBase } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './complex-structures.component.html',
  styleUrls: ['./complex-structures.component.scss'],
})
export class ComplexStructuresComponent {
  private gridApi!: GridApi<Assembly>;
  public assemblies = input.required<Assembly[]>();
  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    { headerName: 'ID', valueGetter: (params) => `${params.data.pdb_id}_${params.data.assembly_id}`, flex: 1.2, sort: 'asc' },
    { headerName: 'Title', field: 'title', flex: 3 },
    { headerName: 'Experimental Method', field: 'experimental_method', flex: 2 },
    { headerName: 'Resolution (Å)', field: 'resolution', flex: 1.6 },
    { headerName: 'Symmetry', field: 'symmetry', valueFormatter: (params) => `${params.value.type} (${params.value.symbol})`, flex: 1.4 },
  ];

  public rowData = computed(() => this.assemblies() as Assembly[]);
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  onGridReady(params: GridReadyEvent<Assembly>) {
    // this.rowData = this.assemblies();
    this.gridApi = params.api;
  }
}
