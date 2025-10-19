/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assembly } from '../../../models/complex-structure.model';
import { AG_Grid_Theme_Class, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';
import { MolstarComponent } from '@pdbe-lib/molstar-for-apps';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ComplexStoreState } from '../../../store/complex-store.model';
import { ComplexSelectors } from '../../../store/complex.selectors';
import { colDefs, gridOptions, initialState, rowSelection } from './ag-grid';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { ComplexStructureFacade } from './complex-structure.facade';

@Component({
  selector: 'pdbc-complex-structures',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MolstarComponent, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './complex-structures.component.html',
  styleUrls: ['./complex-structures.component.scss'],
})
export class ComplexStructuresComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly facade = inject(ComplexStructureFacade);

  private readonly globalStore = inject(Store<ComplexStoreState>);
  public readonly summaryData = toSignal(this.globalStore.select(ComplexSelectors.complexData));
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

  public searchTerm = new FormControl('');

  public structuresLength = computed(() => this.rowData().length);
  public structuresPageSize = signal<number>(5);
  public structuresPageSizeOptions = computed(() => [5, 10, 20, 50, 100]);
  public structuresPage: Assembly[] = [];

  private unfilteredStructures: Assembly[] = [];

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

    this.structuresPage = this.rowData().slice(0, this.structuresPageSize());
    this.unfilteredStructures = this.rowData();

    this.searchTerm.valueChanges
      .pipe(
        map((searchQuery) => {
          if (searchQuery) {
            return this.facade.filterItemsBySearchQuery(searchQuery, this.unfilteredStructures);
          } else {
            return this.unfilteredStructures;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.structuresPage = data.slice(0, this.structuresPageSize());
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
    const moleculeId = data.pdb_id;
    const assemblyId = data.assembly_id;
    this.config = { ...this.config, moleculeId, assemblyId };
  }

  public handlePageEvent(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.structuresPage = this.rowData().slice(startIndex, endIndex);
  }

  public downloadMMCIF(): void {
    this.facade.downloadMMCIF(this.gridApi);
  }

  public onComplexStructureGridReady(event: GridReadyEvent<any>) {
    this.gridApi = event.api;
  }

  public downloadCSV(): void {
    this.facade.downloadCSV(this.gridApi);
  }

  public onRowDataUpdated(event: any) {
    if (event.api.getDisplayedRowCount() > 0) {
      const firstNode = event.api.getDisplayedRowAtIndex(0);
      if (firstNode) {
        firstNode.setSelected(true);
      }
    }
  }
}
