import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, ValueGetterParams, CellValueChangedEvent, SelectionChangedEvent, ValueFormatterParams } from 'ag-grid-community'; // Column Definition Type Interface
import { CustomButtonComponent } from './button-cell-renderer.component';
import { PlaygroundService } from '../../services/playground.service';
import { CompanyLogoRenderer } from './logo-renderer';
import { MissionResultRenderer } from './mission-result-renderer.component';
import { AG_Grid_Theme_Class } from '@pdbc/core';

// Row Data Interface
interface IRow {
  mission: string;
  company: string;
  location: string;
  date: string;
  time: string;
  rocket: string;
  price: number;
  successful: boolean;
}

@Component({
  selector: 'pdbe-connect-playground-app-summary',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.scss',
})
export class AGridComponent {
  public readonly rowData = [
    { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
    { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
    { make: 'Fiat', model: '500', price: 15774, electric: false },
    { make: 'Nissan', model: 'Juke', price: 20675, electric: false },
  ];

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'Make & Model',
      valueGetter: (p: ValueGetterParams) => p.data.make + ' ' + p.data.model,
    },
    { field: 'price', valueFormatter: (p) => '£' + Math.floor(p.value).toLocaleString() },
    {
      field: 'electric',
      cellClassRules: {
        // apply green to electric cars
        'rag-green': (params) => params.value === true,
      },
      valueFormatter: (p) => p.value.toLocaleString(),
    },
    { field: 'button', cellRenderer: CustomButtonComponent },
  ];

  themeClass = AG_Grid_Theme_Class;

  // Return formatted date value
  dateFormatter(params: ValueFormatterParams) {
    return new Date(params.value).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  public readonly defaultColDef: ColDef = {
    filter: true,
    flex: 1,
  };

  public readonly defaultColGridDef: ColDef = {
    filter: true,
  };

  private readonly playgroundService = inject(PlaygroundService);
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public rowGridData: IRow[] = [];
  public colGridDefs: ColDef[] = [
    { field: 'mission', width: 200 },
    { field: 'company', cellRenderer: CompanyLogoRenderer, width: 130 },
    { field: 'location', width: 225 },
    { field: 'date', valueFormatter: this.dateFormatter },
    {
      field: 'price',
      editable: true,
      width: 130,
      valueFormatter: (params) => {
        return '£' + params.value.toLocaleString();
      },
    },
    { field: 'successful', width: 120, cellRenderer: MissionResultRenderer },
    { field: 'rocket' },
  ];

  onGridReady() {
    this.playgroundService.loadGridData().subscribe((data) => (this.rowGridData = data));
  }

  // Handle cell editing event
  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log(event);
    console.log(`New Cell Value: ${event.value}`);
  };

  // Handle row selection changed event
  onSelectionChanged = (event: SelectionChangedEvent) => {
    console.log(event);
    console.log('Row Selected!');
  };
}
