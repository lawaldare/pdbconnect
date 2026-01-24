/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, computed, inject, linkedSignal, OnInit, signal, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { PisaSelectors } from '../../store/pisa.selectors';
import { filter, firstValueFrom, take } from 'rxjs';
import { PisaUtilService } from '../../services/pisa-util.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MolstarComponent, MolstarPluginService } from '@pdbe-lib/molstar-for-apps';
import { ComplexTabSingleInterfaceComponent } from '../complex-tab-single-interface/complex-tab-single-interface';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { pisaComplexView } from '@pdbc/core';

@Component({
  selector: 'pisa-complexes-tab',
  imports: [CommonModule, AgGridAngular, MolstarComponent, ComplexTabSingleInterfaceComponent, NgxSkeletonLoaderModule],
  templateUrl: './complexes-tab.html',
  styleUrl: './complexes-tab.scss',
})
export class ComplexesTabComponent implements OnInit {
  private pisaStore = inject(Store);
  public pisaUtilService = inject(PisaUtilService);
  private molstarPluginService = inject(MolstarPluginService);

  private gridApi?: GridApi;

  public readonly gridOptions = gridOptions;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));
  public readonly jobId = toSignal(this.pisaStore.select(PisaSelectors.jobId).pipe(filter(Boolean)));

  public selectedRowData = signal<any>({});

  private complexesData = computed(() => {
    const response = this.assemblyResponse();
    const allComplexes = response?.pqs_sets.flatMap((set: any) => set.complexes);
    return allComplexes;
  });

  @ViewChild('molstar') molstar!: MolstarComponent;

  public rowData = linkedSignal({
    source: this.assemblyResponse,
    computation: () => {
      const response = this.assemblyResponse();

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

  private async updatedSelectedRow(data: any) {
    this.selectedRowData.set(data);
    await this.loadMVS(data);
  }

  private async loadMVS(data: any) {
    await this.molstarPluginService.loadPlugin();

    const MVS = this.molstarPluginService.getClass()?.extensions.MVS;
    const complexesData = this.complexesData();

    if (!MVS) return;
    if (!complexesData) return;

    setTimeout(async () => {
      const snapshot = pisaComplexView(MVS?.MVSData.createBuilder(), {
        structureUrl: `https://wwwdev.ebi.ac.uk/pdbe/pdbe-kb/pisa/api/model/${this.jobId()}`,
        structureFormat: 'mmcif',
        complexesData: complexesData,
        complexKey: data.complex_key,
        interfacesData: [],
      });

      const mvs = MVS.MVSData.createMultistate([snapshot]);
      const plugin = this.molstar.getInstance().plugin;
      await MVS.loadMVS(plugin, mvs);
    }, 500);
  }

  public onFilterChanged(event: any) {
    // console.log('Filter changed:', event);
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
