/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, GoogleAnalyticsService, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { colDefs, gridOptions, initialState, rowSelection } from './ag-grid';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ComplexStructureFacade } from './complex-structure.facade';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MolstarComponent, MaterialModule, FormsModule],
  templateUrl: './complex-structures.component.html',
  styleUrls: ['./complex-structures.component.scss'],
})
export class ComplexStructuresComponent implements OnInit {
  private readonly facade = inject(ComplexStructureFacade);
  private readonly globalStore = inject(Store<ComplexStoreState>);

  public readonly summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
  private readonly gAS = inject(GoogleAnalyticsService);

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  private gridApi!: GridApi;

  public rowData = computed(() => {
    const value = this.selectedBM();
    const assemblies = this.summaryData()?.assemblies as Assembly[];
    if (value === 'all') {
      return assemblies;
    }

    return assemblies.filter((assembly) => assembly.bound_macromolecules.includes(value));
  });
  public uniqueBoundMacromolecules = computed(() => {
    const data = this.summaryData();
    return data?.unique_bound_macromolecules;
  });
  public assembliesWithBoundMacromolecules = computed(() => {
    const assemblies = this.summaryData()?.assemblies;
    return assemblies?.filter((assembly) => assembly.bound_macromolecules.length > 0);
  });
  public selectedBM = signal('all');
  public boundMacromolecules = computed(() => {
    const assemblies = this.assembliesWithBoundMacromolecules();
    const result = assemblies?.reduce((acc: any, assembly) => {
      for (const bound of assembly.bound_macromolecules) {
        if (!acc[bound]) {
          acc[bound] = 1;
        } else {
          acc[bound]++;
        }
      }
      return acc;
    }, {});

    const mappedOptions = Object.entries(result).reduce(
      (acc: any[], [macromolecule, count]) => {
        acc.push({
          label: `${macromolecule.charAt(0).toUpperCase() + macromolecule.slice(1)} (${count})`,
          value: macromolecule,
        });
        return acc;
      },
      [{ label: `All (${assemblies?.length})`, value: 'all' }]
    );

    return mappedOptions;
  });

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

  public config!: any;

  public height = '400px';

  private selectedRowPDBId = signal<string>('');

  public structuresLength = computed(() => this.rowData().length);
  public structuresPageSize = signal<number>(5);
  public structuresPageSizeOptions = computed(() => [5, 10, 20, 50, 100]);
  public searchTerm = signal('');
  private unfilteredStructures = computed(() => this.rowData() ?? []);
  public structuresPage = linkedSignal({
    source: this.searchTerm,
    computation: () => {
      if (!this.searchTerm().trim()) {
        return this.unfilteredStructures().slice(0, this.structuresPageSize());
      }
      return this.facade.filterItemsBySearchQuery(this.searchTerm(), this.unfilteredStructures()).slice(0, this.structuresPageSize());
    },
  });

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
    const selectedNodes = event.api.getSelectedNodes();
    if (selectedNodes.length === 0) {
      return;
    }
    const data = selectedNodes[0].data;
    this.updatedSelectedRow(data);
  }

  private updatedSelectedRow(data: any) {
    const moleculeId = data.pdb_id;
    const assemblyId = data.assembly_id;
    this.config = { ...this.config, moleculeId, assemblyId };
  }

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage.set(this.rowData().slice(startIndex, endIndex) ?? []);
  }

  public downloadMMCIF(): void {
    this.facade.downloadMMCIF(this.gridApi);
    this.gAS.logPageEvents('cp_download', {
      tab: 'structures',
      data: '.mmcif',
    });
  }

  public onComplexStructureGridReady(event: GridReadyEvent<any>) {
    this.gridApi = event.api;
  }

  public downloadCSV(): void {
    this.facade.downloadCSV(this.gridApi);
    this.gAS.logPageEvents('cp_download', {
      tab: 'structures',
      data: '.csv',
    });
  }

  public onFilterChanged(event: any) {
    this.facade.onFilterChanged(event);
  }

  public onRowDataUpdated(event: any) {
    this.facade.onRowDataUpdated(event);
  }
}
