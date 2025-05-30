import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, DownloadFileTypeService, DownloadService, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { colDefs, gridOptions, initialState, rowSelection } from './ag-grid';
import { environment } from '../../../../../../environments/environment';

export interface PISAAssemblyParam {
  dissociation_energy: number;
  accessible_surface_area: number;
  buried_surface_area: number;
  dissociation_entropy: number;
  dissociation_area: number;
  solvation_energy_gain: number;
  pdb_id: string;
  assembly_id: string;
}

@Component({
  selector: 'pdbc-complex-pisa',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MaterialModule],
  templateUrl: './complex-pisa.component.html',
  styleUrls: ['./complex-pisa.component.scss'],
})
export class ComplexPISAComponent {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly pisa = toSignal(this.globalStore.select(ComplexSelectors.pisa));
  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  private readonly fileDownloadUrl = `${environment.pdbeBaseUrl}download/api/pdb/`;
  private readonly downloadService = inject(DownloadService);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);

  public rowData = computed(() => this.pisa());
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public config!: any;

  public height = '400px';

  private selectedRowPDBId = signal<string>('');

  rowClassRules = {
    'highlight-row': (params: any) => params.data.id === this.selectedRowPDBId(),
  };

  onGridReady(event: GridReadyEvent<any>) {
    // this.selectedRowPDBId(event.api.getSelectedNodes()[0]?.data?.pdb_id);
    // event.api.sizeColumnsToFit();
    // this.rowData
  }

  public onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
    console.log('Selected Row Data:', data);
  }

  public downloadMMCIF(): void {
    // const pdbIds = this.rowData()
    //   .map((assembly) => assembly.pdb_id)
    //   .join(',');
    // if (pdbIds.length <= 100) {
    //   this.downloadService.initiateDownload(this.fileDownloadUrl, 'entry', pdbIds, 'updated-mmCIF');
    // } else {
    //   //go to download service
    //   localStorage.setItem('pdbIds', pdbIds);
    //   const url = `${environment.pdbeBaseUrl}download/docs`;
    //   window.open(url);
    // }
  }

  public downloadCSV(): void {
    // const mappedData = this.rowData().map((structure) => {
    //   return {
    //     PDB: structure.pdb_id,
    //     ID: structure.assembly_id,
    //     Title: structure.title,
    //     'Experimental Method': structure.experimental_method,
    //     Resolution: structure.resolution,
    //   };
    // });
    // this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
  }
}
