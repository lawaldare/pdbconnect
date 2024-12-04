import { Component, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TableNames } from '../../pages/entry-v4/entry-v4.component';
import { AssemblyDataToTable } from './data-processing/assembly-row-class';
import { DomainDataToTable } from './data-processing/domain-row-class';
import { LigandDataToTable } from './data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from './data-processing/macromolecule-row';
import { TableFilter } from './data-models-and-definitions/row-and-table.model';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, GridOptions, IRowNode, SelectionChangedEvent } from 'ag-grid-community'; // Column Definition Type Interface
import { ASSEMBLIES_COL_DEFS, DOMAINS_COL_DEFS, LIGANDS_COL_DEFS, MACROMOLECULES_COL_DEFS } from './data-models-and-definitions/column-definition-objects';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, interval, map, Observable, Subscription, take, timer } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { TableNames } from '../../pages/main/main.component';

type DataToTable = AssemblyDataToTable | DomainDataToTable | LigandDataToTable | MacromoleculeDataToTable;

@Component({
  selector: 'pdbc-interactive-tables',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './interactive-tables.component.html',
  styleUrl: './interactive-tables.component.scss',
})
export class InteractiveTablesComponent implements OnInit, OnDestroy {
  public readonly tabName = input.required<TableNames>();
  // public readonly tabName = input.required<string>();
  public readonly pageInformation = input.required<any>();

  public readonly signals = inject(ComponentCommunicationService);

  public tableData?: DataToTable;
  public currentTableFilter: string[] = [];
  public columnDefinitions?: ColDef[];

  /**
   * General table library configurations
   */
  public defaultColumnDefinitions: ColDef = {
    filter: false,
    sortable: false,
  };

  public gridOptions: GridOptions = {
    headerHeight: 75,
    suppressHorizontalScroll: true,
    domLayout: 'normal',
    paginationPageSize: 6,
    paginationPageSizeSelector: false,
    enableCellTextSelection: true,
    suppressRowClickSelection: false,
  };

  public gridApi!: GridApi;

  /**
   * Variables for dynamic table height adjustment
   */
  public tableHeight = '300px';
  private agViewportCheckSubscription!: Subscription;
  private heightObserverSubscription!: Subscription;

  constructor() {
    effect(async () => {
      // Access the current state
      const tabState = this.signals.tabState();
      this.triggerTableSelection();
    });
  }

  private initializeData() {
    if (this.signals.isTabDataGenerated() === false) {
      for (const tabName of ['Assemblies', 'Domains', 'Ligands', 'Macromolecules']) {
        let tempTableData: DataToTable;
        if (tabName === 'Assemblies') {
          tempTableData = new AssemblyDataToTable();
        }
        if (tabName === 'Domains') {
          tempTableData = new DomainDataToTable();
        }
        if (tabName === 'Ligands') {
          tempTableData = new LigandDataToTable();
        }
        if (tabName === 'Macromolecules') {
          tempTableData = new MacromoleculeDataToTable();
        }
        tempTableData!.generateTableData(this.pageInformation());
        this.signals.setTabData(tabName, tempTableData!.tableRows());
      }
      this.signals.isTabDataGenerated.set(true);
    }
  }

  ngOnInit(): void {
    this.initializeData();

    if (this.tabName() === 'Assemblies') {
      this.tableData = new AssemblyDataToTable();
      this.columnDefinitions = ASSEMBLIES_COL_DEFS;
    } else if (this.tabName() === 'Domains') {
      this.tableData = new DomainDataToTable();
      this.columnDefinitions = DOMAINS_COL_DEFS;
    } else if (this.tabName() === 'Ligands') {
      this.tableData = new LigandDataToTable();
      this.columnDefinitions = LIGANDS_COL_DEFS;
    } else if (this.tabName() === 'Macromolecules') {
      this.tableData = new MacromoleculeDataToTable();
      this.columnDefinitions = MACROMOLECULES_COL_DEFS;
    }
    this.tableData!.generateTableData(this.pageInformation());
    this.tableData!.generateTableFilters(this.pageInformation());

    // this.signals.setTabData(this.tabName(), this.tableData!.tableRows());

    if (this.tableData!.displayFilters) {
      this.currentTableFilter = this.tableData!.tableFilters()[0].types;
    }

    // Checks for ag-grid table rendering for dynamic height with autoHeight setting
    this.adjustTableHeightDynamically();
  }

  ngOnDestroy(): void {
    // Clean up the subscription for dynamic height with autoHeight when the component is destroyed
    if (this.heightObserverSubscription) {
      this.heightObserverSubscription.unsubscribe();
    }
    if (this.agViewportCheckSubscription) {
      this.agViewportCheckSubscription.unsubscribe();
    }
  }

  private adjustTableHeightDynamically(): void {
    // Set up an observable to check for the element every 100ms
    this.agViewportCheckSubscription = interval(100)
      .pipe(
        map(() => document.querySelector('.ag-center-cols-container') as HTMLElement),
        filter((element) => !!element && element.offsetHeight > 0), // Check if the element exists and has a height
        take(1) // Complete the observable after the first match
      )
      .subscribe((element) => {
        // This is called after ag-center-cols-container is rendered on the page

        // We now create an Observable that emits whenever a mutation affecting height occurs
        const heightChange$ = new Observable<number>((observer) => {
          // Initialize the MutationObserver to monitor the element's height
          const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(() => {
              const newHeight = element.offsetHeight;
              observer.next(newHeight); // Emit the new height
            });
          });

          // Observe changes to the element's subtree and attributes
          mutationObserver.observe(element, {
            attributes: true,
            childList: true,
            subtree: true,
          });

          // Disconnect the observer on unsubscription
          return () => mutationObserver.disconnect();
        }).pipe(
          distinctUntilChanged(), // Only emit if the height changes from the previous one
          debounceTime(50) // Wait 50 milliseconds between emissions
        );

        // Subscribe to the Observable and handle height changes
        this.heightObserverSubscription = heightChange$.subscribe((newHeight) => {
          // Adjust total element height based on the new height
          this.tableHeight = 160 + newHeight + 'px';
        });
      });
  }

  public async onTableGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

    // unfortunately needed so selection happens syncronously
    await firstValueFrom(timer(100));

    this.triggerTableSelection();
  }

  public triggerTableSelection() {
    let selectionState = this.signals.getTabState(this.tabName());

    if (this.gridApi.getRenderedNodes().length > 0 && selectionState === 'Main') {
      this.signals.setTabState(this.tabName(), 0);
      selectionState = 0;
    }

    if (selectionState !== 'Main') {
      const nodes = this.gridApi.getRenderedNodes();
      for (const node of nodes) {
        if (node.rowIndex === (selectionState as number)) {
          node.setSelected(true); // automatically triggers onTableSelectionChanged
        }
      }
    }
  }

  public onTableSelectionChanged(_event: SelectionChangedEvent) {
    const selectedRow = this.gridApi.getSelectedRows(); // Get selected row data
    if (selectedRow.length > 0) {
      const rowIdx = this.tableData!.tableRows().indexOf(selectedRow[0]);
      this.loadSelectionFromTable(rowIdx);
    }
  }

  public loadSelectionFromTable(rowIdx: number) {
    this.signals.setTabState(this.tabName(), rowIdx);
  }

  public applyFilter(obj: TableFilter): void {
    this.currentTableFilter = obj.types;
    this.gridApi.onFilterChanged();
  }

  // Determines whether an external filter is active
  // NEEDS TO BE ARROW FUNCTION TO KEEP THIS CONTEXT
  public isExternalFilterPresent = (): boolean => {
    return this.currentTableFilter.length > 0;
  };

  // External filter logic: determines if a row passes the external filter
  // NEEDS TO BE ARROW FUNCTION TO KEEP THIS CONTEXT
  public doesExternalFilterPass = (node: IRowNode): boolean => {
    if (this.tabName() === 'Assemblies') {
      return true;
    } else if (this.tabName() === 'Domains') {
      return this.currentTableFilter.indexOf(node.data!.resource) > -1;
    } else if (this.tabName() === 'Ligands') {
      return this.currentTableFilter.indexOf(node.data.type) > -1;
    } else if (this.tabName() === 'Macromolecules') {
      // const matchingIdx = this.pageInformation().macromolecules
      //   .map((mol: Molecule, idx: number) => (this.currentTableFilter.includes(mol.molecule_type) ? idx : -1))
      //   .filter((idx: number) => idx > -1);
      // return matchingIdx.includes(this.unsortedTableRows().indexOf(node.data));
      return this.currentTableFilter.indexOf(node.data!.additionalData.molecule.molecule_type) > -1;
    }
    return true;
  };
}
