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

@Component({
  selector: 'pisa-complexes-tab',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './complexes-tab.html',
  styleUrl: './complexes-tab.scss',
})
export class ComplexesTabComponent implements OnInit {
  private pisaStore = inject(Store);
  private pisaUtilService = inject(PisaUtilService);

  // public readonly rowData = [
  //   { groupHeader: 'PQS set 1' },
  //   {
  //     complex_instance_id: 1,
  //     formula: 'ABab',
  //     composition: 'DR[MG][CA]',
  //     asa: 43738.6,
  //     bsa: 5814.1,
  //     int_energy: -55.5,
  //     diss_energy: 32.139,
  //     mmsize: 2,
  //     interfaces: [],
  //   },
  //   {
  //     complex_instance_id: 2,
  //     formula: 'A2B2a2b2',
  //     composition: 'DRDR[MG][CA][MG][CA]',
  //     asa: 87477.2,
  //     bsa: 11628.2,
  //     int_energy: -111.0,
  //     diss_energy: 64.278,
  //     mmsize: 4,
  //     interfaces: [],
  //   },
  //   { groupHeader: 'PQS set 2' },
  //   {
  //     complex_instance_id: 1,
  //     formula: 'ABab',
  //     composition: 'DR[MG][CA]',
  //     asa: 43738.6,
  //     bsa: 5814.1,
  //     int_energy: -55.5,
  //     diss_energy: 32.139,
  //     mmsize: 2,
  //     interfaces: [],
  //   },
  //   {
  //     complex_instance_id: 2,
  //     formula: 'A2B2a2b2',
  //     composition: 'DRDR[MG][CA][MG][CA]',
  //     asa: 87477.2,
  //     bsa: 11628.2,
  //     int_energy: -111.0,
  //     diss_energy: 64.278,
  //     mmsize: 4,
  //     interfaces: [],
  //   },
  // ];

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public readonly assemblyResponse = toSignal(this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean)));

  // public rowData2 = linkedSignal({
  //   source: this.assemblyResponse,
  //   computation: () => {
  //     console.log('Assembly response:', this.assemblyResponse()?.pqs_sets);
  //     return this.transformPqsSets(this.assemblyResponse()?.pqs_sets ?? []);
  //   },
  // });
  public rowData = signal<any[]>([]);

  ngOnInit(): void {
    this.pisaStore
      .select(PisaSelectors.jobId)
      .pipe(
        mergeMap((jobId) => {
          if (!jobId) {
            console.warn('No job ID available in store.');
            const payload = this.pisaUtilService.getDataInSessionStorage('pisa-assembly-payload');
            if (payload) {
              this.pisaStore.dispatch(PisaActions.submitPISAJob({ payload }));
            } else {
              console.error('No assembly payload found in session storage.');
              //TODO;
              //Navigate to upload page
            }
          }
          return this.pisaStore.select(PisaSelectors.assemblyResults).pipe(filter(Boolean));
        })
      )
      .subscribe((assemblyResults) => {
        console.log('Assembly results received:', assemblyResults);
        if (assemblyResults) {
          const transformedData = this.transformPqsSets(assemblyResults.pqs_sets ?? []);
          this.rowData.set(transformedData);
          console.log('Transformed row data:', transformedData);
        }
      });
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
