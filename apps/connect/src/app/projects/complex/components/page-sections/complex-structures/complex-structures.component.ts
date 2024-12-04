import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, agGridOptionsBase, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridState, SelectionChangedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MolstarComponent, MaterialModule],
  templateUrl: './complex-structures.component.html',
  styleUrls: ['./complex-structures.component.scss'],
})
export class ComplexStructuresComponent implements OnInit {
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
      width: 100,
    },
    {
      headerName: 'Title',
      field: 'title',
      cellRenderer: TitleRendererComponent,
      width: 250,
    },
    { headerName: 'Exp. method', field: 'experimental_method', width: 170 },
    { headerName: 'Res. (Å)', field: 'resolution', width: 100 },
  ];

  public rowData = computed(() => this.assemblies() as Assembly[]);
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public config!: { moleculeId: string; bgColor: { r: number; g: number; b: number }; assemblyId: number; hideControls: boolean };

  public height = '300px';
  public width = '100%';

  public rowSelection: any = {
    mode: 'singleRow',
    headerCheckbox: false,
  };
  public initialState: GridState = {
    rowSelection: ['0'],
  };
  public selectionColumnDef = {
    sortable: true,
    width: 50,
    maxWidth: 50,
    suppressHeaderMenuButton: false,
    headerTooltip: 'Checkboxes indicate selection',
  };

  ngOnInit(): void {
    this.config = {
      moleculeId: this.rowData()[0].pdb_id,
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: this.rowData()[0].assembly_id,
      hideControls: true,
    };
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
    const moleculeId = data.pdb_id;
    const assemblyId = data.assembly_id;
    this.config = { ...this.config, moleculeId, assemblyId };
  }
}
