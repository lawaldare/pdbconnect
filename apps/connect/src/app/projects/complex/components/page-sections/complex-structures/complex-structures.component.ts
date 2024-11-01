import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, agGridOptionsBase, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridApi, GridReadyEvent, CellClickedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MolstarComponent, MaterialModule],
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
    {
      headerName: 'ID',
      field: 'id',
      valueGetter: (params) => `${params.data.pdb_id}_${params.data.assembly_id}`,
      cellStyle: (params) => ({
        color: '#3b6fb6',
        cursor: 'pointer',
        textDecoration: 'underline',
      }),
      flex: 1,
      sort: 'asc',
    },
    {
      headerName: 'Title',
      field: 'title',
      cellRenderer: TitleRendererComponent,
      flex: 2,
    },
    { headerName: 'Exp. method', field: 'experimental_method', flex: 1.6 },
    { headerName: 'Res. (Å)', field: 'resolution', flex: 1 },
    // { headerName: 'Symmetry', field: 'symmetry', valueFormatter: (params) => `${params.value.type} (${params.value.symbol})`, flex: 1.6 },
  ];

  public rowData = computed(() => this.assemblies() as Assembly[]);
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public config = signal<any>({
    moleculeId: '1a00',
    bgColor: { r: 255, g: 255, b: 255 },
    subscribeEvents: false,
    assemblyId: '1',
    hideControls: true,
  });

  public height = '500px';
  public width = '100%';

  onGridReady(params: GridReadyEvent<Assembly>) {
    this.gridApi = params.api;
  }

  onCellClicked(event: CellClickedEvent) {
    if (event.column.getColId() === 'id') {
      const pdbId = event.data.pdb_id;
      const assemblyId = event.data.assembly_id;
      this.config.update((config) => ({ ...config, moleculeId: pdbId, assemblyId }));
    }
  }
}
