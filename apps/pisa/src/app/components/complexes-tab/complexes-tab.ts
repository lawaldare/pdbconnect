/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { PisaSelectors } from '../../store/pisa.selectors';
import { filter } from 'rxjs';
import { PisaUtilService } from '../../services/pisa-util.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { SingleInterfaceComponent } from '../single-interface/single-interface';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'pisa-complexes-tab',
  imports: [CommonModule, AgGridAngular, MolstarComponent, SingleInterfaceComponent, NgxSkeletonLoaderModule],
  templateUrl: './complexes-tab.html',
  styleUrl: './complexes-tab.scss',
})
export class ComplexesTabComponent implements OnInit {
  private pisaStore = inject(Store);
  public pisaUtilService = inject(PisaUtilService);

  private gridApi?: GridApi;

  public readonly gridOptions = gridOptions;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));

  public selectedRowData = signal<any>({});

  public rowData = linkedSignal({
    source: this.assemblyResponse,
    computation: () => {
      const response = this.assemblyResponse();
      console.log('Assembly response:', response);

      if (!response) {
        return null;
      }

      return this.transformPqsSets(response.pqs_sets ?? []);
    },
  });
  public numberOfPQSSets = linkedSignal({
    source: this.assemblyResponse,
    computation: () => this.assemblyResponse()?.pqs_sets?.length || 0,
  });
  public numberOfComplexes = linkedSignal({
    source: this.assemblyResponse,
    computation: () => {
      const assemblyResults = this.assemblyResponse();
      if (!assemblyResults) return null;
      const sum = assemblyResults?.pqs_sets?.reduce((acc: number, curr: any) => acc + curr.complexes.length, 0);
      return sum;
    },
  });

  public config!: any;
  public height = '400px';

  ngOnInit(): void {
    this.config = {
      moleculeId: '1a0u',
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: '1',
      hideControls: true,
      hideCanvasControls: ['expand', 'animation', 'controlToggle'],
      landscape: true,
    };
  }

  public onSelectionChanged(event: SelectionChangedEvent) {
    const selectedNodes = event.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return;
    }
    const data = selectedNodes[0].data;
    this.updatedSelectedRow(data);
  }

  private updatedSelectedRow(data: any) {
    console.log('Selected row:', data);
    this.selectedRowData.set(data);
  }

  public onFilterChanged(event: any) {
    console.log('Filter changed:', event);
  }

  public onRowDataUpdated(event: any) {
    this.selectFirstDataRow();
  }

  public onComplexStructureGridReady(event: GridReadyEvent<any>) {
    this.gridApi = event.api;
    this.pisaUtilService.setCurrentGridAPI(this.gridApi);
  }

  private selectFirstDataRow() {
    if (!this.gridApi) return;

    const rowCount = this.gridApi.getDisplayedRowCount();

    for (let i = 0; i < rowCount; i++) {
      const row = this.gridApi.getDisplayedRowAtIndex(i);
      if (!row?.data) continue;

      if (row.data.groupHeader) continue; // skip PQS headers

      row.setSelected(true, true);
      this.gridApi.ensureIndexVisible(i);
      this.updatedSelectedRow(row.data); // keep right panel in sync
      break;
    }
  }

  private transformPqsSets(pqsSets: any[]) {
    const out = [];

    for (const set of pqsSets ?? []) {
      out.push({ groupHeader: `PQS set ${set.pqs_set_id}` });

      for (const c of set.complexes ?? []) {
        out.push({
          complex_key: c.complex_key,
          formula: c.formula,
          composition: c.composition,
          asa: c.asa,
          bsa: c.bsa,
          int_energy: c.int_energy,
          diss_energy: c.diss_energy,
          mmsize: c.mmsize,
          interfaces: c?.interfaces?.interfaces,
          unit_cell: c.n_uc,
          symmetry_number: c.symmetry_number,
        });
      }
    }

    return out;
  }

  public downloadComplex() {
    console.log('Download complex');
  }
}
