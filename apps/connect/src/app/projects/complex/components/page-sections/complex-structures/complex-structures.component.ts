/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, DownloadFileTypeService, DownloadService, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { SelectionChangedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { colDefs, gridOptions, initialState, rowSelection } from './ag-grid';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MolstarComponent, MaterialModule],
  templateUrl: './complex-structures.component.html',
  styleUrls: ['./complex-structures.component.scss'],
})
export class ComplexStructuresComponent implements OnInit {
  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  private readonly fileDownloadUrl = `${environment.pdbeBaseUrl}download/api/pdb/`;
  private readonly downloadService = inject(DownloadService);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);

  public rowData = computed(() => this.summaryData()?.assemblies as Assembly[]);
  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public config!: any;

  public height = '400px';

  private selectedRowPDBId = signal<string>('');

  rowClassRules = {
    'highlight-row': (params: any) => params.data.id === this.selectedRowPDBId(),
  };

  ngOnInit(): void {
    this.config = {
      moleculeId: this.rowData()[0].pdb_id,
      bgColor: { r: 255, g: 255, b: 255 },
      assemblyId: this.rowData()[0].assembly_id,
      hideControls: true,
      hideCanvasControls: ['expand', 'animation', 'controlToggle'],
      landscape: true,
    };
  }

  public onSelectionChanged(event: SelectionChangedEvent) {
    const data = event.api.getSelectedNodes()[0].data;
    const moleculeId = data.pdb_id;
    const assemblyId = data.assembly_id;
    this.config = { ...this.config, moleculeId, assemblyId };
  }

  public downloadMMCIF(): void {
    const pdbIds = this.rowData()
      .map((assembly) => assembly.pdb_id)
      .join(',');
    if (pdbIds.length <= 100) {
      this.downloadService.initiateDownload(this.fileDownloadUrl, 'entry', pdbIds, 'updated-mmCIF');
    } else {
      //go to download service
      localStorage.setItem('pdbIds', pdbIds);
      const url = `${environment.pdbeBaseUrl}download/docs`;
      window.open(url);
    }
  }

  public downloadCSV(): void {
    const mappedData = this.rowData().map((structure) => {
      return {
        PDB: structure.pdb_id,
        ID: structure.assembly_id,
        Title: structure.title,
        'Experimental Method': structure.experimental_method,
        Resolution: structure.resolution,
      };
    });
    this.downloadFileTypeService.downloadCSV(mappedData, 'structures');
  }
}
