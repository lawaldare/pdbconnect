import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AG_Grid_Theme_Class } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { gridOptions, colDefs, initialState, rowSelection } from './ag-grid';
import { GridReadyEvent, SelectionChangedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './upload.html',
  styleUrl: './upload.scss',
})
export class Upload {
  public readonly rowData = [
    { groupHeader: 'PQS set 1 (stable)' },
    { size: 4, formula: 'A2B2a4', composition: 'ACBD[HEM]4', surface: 23290, buried: 11280, dGint: -106.4, dGdiss: 7.9 },
    { size: 4, formula: 'A2B2a4', composition: 'ACBD[HEM]4', surface: 23290, buried: 11280, dGint: -106.4, dGdiss: 7.9, highlight: true },
    { groupHeader: 'PQS set 1 (unstable)' },
    { size: 4, formula: 'A2B2a4', composition: 'ACBD[HEM]4', surface: 23290, buried: 11280, dGint: -106.4, dGdiss: 7.9 },
    { groupHeader: 'PQS set 2' },
    { size: 4, formula: 'A2B2a4', composition: 'ACBD[HEM]4', surface: 13310, buried: 3970, dGint: -49.1, dGdiss: 2.2 },
  ];

  public readonly gridOptions = gridOptions;
  public readonly themeClass = AG_Grid_Theme_Class;
  public readonly colDefs = colDefs;
  public readonly initialState = initialState;
  public readonly rowSelection = rowSelection;

  public paginationPageSizeSelector = signal<number[]>([10, 20]);

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
}
