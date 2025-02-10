/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, computed, inject, input, OnChanges, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyDataToTable } from './data-processing/assembly-row-class';
import { DomainDataToTable } from './data-processing/domain-row-class';
import { LigandDataToTable } from './data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from './data-processing/macromolecule-row';
import { TableFilter } from './data-models-and-definitions/row-and-table.model';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, GridOptions, IRowNode, SelectionChangedEvent } from 'ag-grid-community';
import { ASSEMBLIES_COL_DEFS, DOMAINS_COL_DEFS, LIGANDS_COL_DEFS, MACROMOLECULES_COL_DEFS } from './data-models-and-definitions/column-definition-objects';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, interval, map, Observable, Subscription, take, timer } from 'rxjs';
import { ComponentCommunicationService } from '../../services/component-comm.service';
import { TableNames } from '../../pages/main/main.component';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { MainDataProcessingFacade } from '../../pages/main/data-processing.facade';

type DataToTable = AssemblyDataToTable | DomainDataToTable | LigandDataToTable | MacromoleculeDataToTable;

@Component({
  selector: 'pdbc-interactive-tables',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './interactive-tables.component.html',
})
export class InteractiveTablesComponent implements OnChanges, OnDestroy {
  public readonly signals = inject(ComponentCommunicationService);
  public dataProcessing = inject(MainDataProcessingFacade);
  private readonly globalStore = inject(Store<EntryStoreState>);

  public readonly tabName = input.required<TableNames>();
  public molstarResidueInfo = this.signals.molstarResidueInfo;

  public readonly complexDetails = toSignal(this.globalStore.select(EntrySelectors.complexDetails));
  public readonly assemblyData = toSignal(this.globalStore.select(EntrySelectors.assemblies));
  public readonly pisaAssemblyData = toSignal(this.globalStore.select(EntrySelectors.pisaAssemblies));
  public readonly pfamMappings = toSignal(this.globalStore.select(EntrySelectors.pfamMapping));
  public readonly cathMappings = toSignal(this.globalStore.select(EntrySelectors.cathMapping));
  public readonly scopMappings = toSignal(this.globalStore.select(EntrySelectors.scop175Mapping));
  public readonly ligands = toSignal(this.globalStore.select(EntrySelectors.boundLigands));
  public readonly modifications = toSignal(this.globalStore.select(EntrySelectors.modifications));
  public readonly carbohydrates = toSignal(this.globalStore.select(EntrySelectors.carbohydrates));
  public readonly uniprotMapping = toSignal(this.globalStore.select(EntrySelectors.uniprotMapping));
  public readonly macromolecules = toSignal(this.globalStore.select(EntrySelectors.macroMolecules));
  public readonly bestStrMapUniProtId = toSignal(this.globalStore.select(EntrySelectors.bestStructuresMappingsByUniProtIds));

  // Signal to track table readiness
  private tableReadySignal = signal(false);

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

  public tabDataLoaded = computed(() => this.dataProcessing.tabDataLoaded());

  readonly rowHeight = input(50);
  readonly headerHeight = 76;
  readonly paginationHeight = 48;
  readonly maxGridHeight = 600;
  public gridHeight = '';

  async ngOnChanges(): Promise<void> {
    const tableData = this.signals.getTabData(this.tabName());
    this.tableData = tableData as DataToTable;
    console.log('TABLE DATA:', this.tableData.tableRows());
    if (this.tabName() === 'Assemblies') {
      this.columnDefinitions = ASSEMBLIES_COL_DEFS;
    } else if (this.tabName() === 'Domains') {
      this.columnDefinitions = DOMAINS_COL_DEFS;
    } else if (this.tabName() === 'Ligands') {
      this.columnDefinitions = LIGANDS_COL_DEFS;
    } else if (this.tabName() === 'Macromolecules') {
      this.columnDefinitions = MACROMOLECULES_COL_DEFS;
    }

    if (this.tableData!.displayFilters) {
      this.currentTableFilter = this.tableData?.tableFilters()[0].types;
    }

    console.log('INTERACTIVE TABLES DATA LOADED:', this.tabName());

    this.adjustTableHeightDynamically();
    // }
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

  private updateGridHeight(): void {
    const rowCount = this.tableData?.tableRows().length ?? 0;
    const calculatedHeight = rowCount * this.rowHeight() + this.headerHeight + this.paginationHeight + 40;
    this.gridHeight = Math.min(calculatedHeight, this.maxGridHeight) + 'px';
  }
  private adjustTableHeightDynamically(): void {
    // Set up an observable to check for the ag-center-cols-container element existance every 100ms
    this.agViewportCheckSubscription = interval(100)
      .pipe(
        map(() => document.querySelector('.ag-center-cols-container') as HTMLElement),
        filter((element) => !!element && element.offsetHeight > 0), // Check if the element exists and has a height
        take(1) // Complete the observable after the first match
      )
      .subscribe((element) => {
        // This is called after ag-center-cols-container is first rendered on the page

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
    // function is triggered on first table ready event
    this.gridApi = params.api;

    this.updateGridHeight();

    // unfortunately needed so selection happens syncronously
    await firstValueFrom(timer(100));

    // Mark the table as ready
    this.tableReadySignal.set(true);
  }

  public triggerTableSelection() {
    // function manually triggers table selection event

    // we get selected row number from component communication service
    let selectionState = this.signals.getTabState(this.tabName());

    // if this is the first time this is triggered, select the first row
    if (this.gridApi !== undefined && this.gridApi?.getRenderedNodes().length > 0 && selectionState === 'Main') {
      this.signals.setTabState(this.tabName(), 0);
      selectionState = 0;
    }

    // if selection state is not initial value ('Main')
    if (selectionState !== 'Main') {
      // manually look for the node which has to be displayed and trigger it's selection
      const nodes = this.gridApi?.getRenderedNodes() ?? [];
      for (const node of nodes) {
        if (node.rowIndex === (selectionState as number)) {
          node.setSelected(true); // automatically triggers onTableSelectionChanged
        } else {
          node.setSelected(false);
        }
      }
    }
  }

  public onTableSelectionChanged(_event: SelectionChangedEvent) {
    // function called on each table selection event
    const selectedRow = this.gridApi?.getSelectedRows(); // Get selected row data
    if (selectedRow.length > 0) {
      const rowIdx = this.tableData!.tableRows().indexOf(selectedRow[0]);
      this.loadSelectionFromTable(rowIdx);
    }
  }

  public loadSelectionFromTable(rowIdx: number) {
    this.signals.setTabState(this.tabName(), rowIdx);
  }

  public applyFilter(obj: TableFilter): void {
    // function enables triggering external table filters
    this.currentTableFilter = obj.types;
    this.gridApi.onFilterChanged();
  }

  // Determines whether an external filter is active
  // NEEDS TO BE ARROW FUNCTION TO KEEP CONTEXT OF "this"
  public isExternalFilterPresent = (): boolean => {
    return this.currentTableFilter.length > 0;
  };

  // External filter logic: determines if a row passes the external filter
  // NEEDS TO BE ARROW FUNCTION TO KEEP CONTEXT OF "this"
  public doesExternalFilterPass = (node: IRowNode): boolean => {
    if (this.tabName() === 'Assemblies') {
      // assemblies rows are filtered according to multimericStates
      return this.currentTableFilter.indexOf(node.data!.multimericStates) > -1;
    } else if (this.tabName() === 'Domains') {
      // domain rows are filtered according to resource
      return this.currentTableFilter.indexOf(node.data!.resource) > -1;
    } else if (this.tabName() === 'Ligands') {
      // ligand rows are filtered according to data type
      return this.currentTableFilter.indexOf(node.data.type) > -1;
    } else if (this.tabName() === 'Macromolecules') {
      // const matchingIdx = this.macromolecules()
      //   .map((mol: Molecule, idx: number) => (this.currentTableFilter.includes(mol.molecule_type) ? idx : -1))
      //   .filter((idx: number) => idx > -1);
      // return matchingIdx.includes(this.unsortedTableRows().indexOf(node.data));

      // macromolecule rows are filtered according to molecular type
      return this.currentTableFilter.indexOf(node.data!.additionalData.molecule.molecule_type) > -1;
    }
    return true;
  };
}
