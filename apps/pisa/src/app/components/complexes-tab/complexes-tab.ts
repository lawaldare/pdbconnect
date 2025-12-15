/* eslint-disable @angular-eslint/component-selector */
import { CommonModule } from '@angular/common';
import { Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { AG_Grid_Theme_Class } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { Store } from '@ngrx/store';
import { PisaSelectors } from '../../store/pisa.selectors';
import { EMPTY, filter, mergeMap } from 'rxjs';
import { PisaUtilService } from '../../services/pisa-util.service';
import { PisaActions } from '../../store/pisa.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';

@Component({
  selector: 'pisa-complexes-tab',
  imports: [CommonModule, AgGridAngular, MolstarComponent],
  templateUrl: './complexes-tab.html',
  styleUrl: './complexes-tab.scss',
})
export class ComplexesTabComponent implements OnInit {
  private pisaStore = inject(Store);
  private pisaUtilService = inject(PisaUtilService);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));

  public rowData = linkedSignal({
    source: this.assemblyResponse,
    computation: () => {
      console.log('Assembly response:', this.assemblyResponse()?.pqs_sets);
      return this.transformPqsSets(this.assemblyResponse()?.pqs_sets ?? []);
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
  }

  public onFilterChanged(event: any) {
    console.log('Filter changed:', event);
  }

  public onRowDataUpdated(event: any) {
    console.log('Row data updated:', event);
  }

  public onComplexStructureGridReady(event: GridReadyEvent<any>) {
    console.log('Complex structure grid ready:', event);
  }

  private transformPqsSets(pqsSets: any[]) {
    const out = [];

    for (const set of pqsSets ?? []) {
      out.push({ groupHeader: `PQS set ${set.pqs_set_id}` });

      for (const c of set.complexes ?? []) {
        out.push({
          complex_instance_id: c.complex_instance_id,
          formula: c.formula,
          composition: c.composition,
          asa: c.asa,
          bsa: c.bsa,
          int_energy: c.int_energy,
          diss_energy: c.diss_energy,
          mmsize: c.mmsize,
          interfaces: c?.interfaces?.interfaces,
        });
      }
    }

    return out;
  }
}
