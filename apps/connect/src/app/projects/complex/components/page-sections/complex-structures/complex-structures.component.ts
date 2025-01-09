import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, agGridOptionsBase, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef, GridState, SelectionChangedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { TitleRendererComponent } from '../../cell renderers/structure-title.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { CustomHeaderComponent } from '../../cell renderers/custom-header.component';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MolstarComponent, MaterialModule],
  templateUrl: './complex-structures.component.html',
  styleUrls: ['./complex-structures.component.scss'],
})
export class ComplexStructuresComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    defaultColDef: {
      ...agGridOptionsBase.defaultColDef,
      sortable: false,
      headerComponentParams: { showHelpIcon: false, tooltipText: '' },
    },
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'ID',
      field: 'id',
      valueGetter: (params) => `${params.data.pdb_id}_${params.data.assembly_id}`,
      width: 120,
      headerComponentParams: { showHelpIcon: true, tooltipText: 'Composite index consisting of PDB identifier and assembly identifier.' },
    },
    {
      headerName: 'Title',
      field: 'title',
      cellRenderer: TitleRendererComponent,
      width: 180,
    },
    { headerName: 'Exp. method', field: 'experimental_method', width: 170 },
    {
      headerName: 'Res. (Å)',
      field: 'resolution',
      suppressHeaderFilterButton: true,
      width: 120,
      headerComponentParams: {
        showHelpIcon: true,
        tooltipText: 'Indicates the level of detail present in the 3D structure. Smaller value means finer details of the structure and higher quality.',
      },
    },
  ];

  public rowData = computed(() => this.summaryData()?.assemblies as Assembly[]);
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public config!: { moleculeId: string; bgColor: { r: number; g: number; b: number }; assemblyId: number; hideControls: boolean };

  public height = '300px';
  public width = '100%';

  public components: {
    [p: string]: any;
  } = {
    agColumnHeader: CustomHeaderComponent,
  };

  public rowSelection: any = {
    mode: 'singleRow',
    headerCheckbox: false,
  };
  public initialState: GridState = {
    rowSelection: ['0'],
  };
  public selectionColumnDef = {
    sortable: true,
    width: 80,
    maxWidth: 80,
    suppressHeaderMenuButton: false,
    headerName: 'Show',
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
