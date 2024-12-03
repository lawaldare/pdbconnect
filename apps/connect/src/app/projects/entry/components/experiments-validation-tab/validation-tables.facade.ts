import { Injectable, signal, WritableSignal } from '@angular/core';
import { GridApi, GridReadyEvent, IRowNode, RowStyle, RowClassParams } from 'ag-grid-community';
import { ColDef, GridOptions, ValueFormatterParams } from 'ag-grid-community'; // Column Definition Type Interface

export interface ValidationXRayRow {
  metric: string;
  value: string[];
  source: string;
}

export interface ValidationSamplesRow {
  sample: string;
  contents: string[];
  recorded_spectra: string;
}

@Injectable({
  providedIn: 'root',
})
export class ValidationTablesFacade {
  public xRayDatasetGridDefs: ColDef[] = [
    {
      headerName: 'Metric',
      field: 'metric',
      flex: 1,
      wrapText: true,
      autoHeight: true,
      filter: false,
      resizable: false,
    },
    {
      headerName: 'Value',
      field: 'value',
      flex: 1,
      wrapText: true,
      autoHeight: true,
      filter: false,
      resizable: false,
      cellRenderer: (params: ValueFormatterParams<ValidationXRayRow, string>) => {
        return this.fieldFormatterXRayRow(params.data!);
      },
    },
    {
      headerName: 'Source',
      field: 'source',
      flex: 1,
      wrapText: true,
      autoHeight: true,
      filter: false,
      resizable: false,
    },
  ];

  public nmrSamplesGridDefs: ColDef[] = [
    {
      headerName: 'Sample',
      field: 'sample',
      flex: 1,
      wrapText: true,
      autoHeight: true,
      filter: false,
      resizable: false,
    },
    {
      headerName: 'Contents',
      field: 'contents',
      flex: 1,
      wrapText: true,
      autoHeight: true,
      filter: false,
      resizable: false,
      cellRenderer: (params: ValueFormatterParams<ValidationXRayRow, string>) => {
        return `<span>${params.value!}</span>`;
      },
    },
    {
      headerName: 'Recorded spectra',
      field: 'recorded_spectra',
      flex: 1,
      wrapText: true,
      autoHeight: true,
      filter: false,
      resizable: false,
    },
  ];

  public gridOptions: GridOptions = {
    headerHeight: 75,
    suppressHorizontalScroll: true,
    domLayout: 'autoHeight',
    paginationPageSizeSelector: false,
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
  };

  public defaultColGridDef: ColDef = {
    filter: false,
    sortable: false,
  };

  public fieldFormatterXRayRow(rowData: ValidationXRayRow) {
    if (rowData.metric === 'Cell dimensions') {
      return `
        <div>
            <div>
                <span><b>a:</b>${rowData.value[0]}</span>
                <span style="margin-left: 10px;"><b>b:</b>${rowData.value[1]}</span>
                <span style="margin-left: 10px;"><b>c:</b>${rowData.value[2]}</span>
                <br>
            </div>
            <div>
                <span><b>α:</b> ${rowData.value[3]}</span>
                <span style="margin-left: 10px;"><b>β:</b> ${rowData.value[4]}</span>
                <span style="margin-left: 10px;"><b>γ:</b> ${rowData.value[5]}</span>
            </div>
        </div>`;
    }
    if (rowData.metric === 'EDS resolution') {
      // 2.19Å - 10Å
      const newValue = `${rowData.value[0]}Å - ${rowData.value[1]}Å`;
      return `<span>${newValue}</span>`;
    }
    if (rowData.metric === 'Twinning statistics') {
      const newValue = `<|L|> = ${rowData.value[0]}, <|L<sup>2</sup>|> = ${rowData.value[1]}`;
      return `<span>${newValue}</span>`;
    }
    if (rowData.metric === 'Spacegroup') {
      let newValue = rowData.value[0];
      for (let i = 1; i < rowData.value.length; i++) {
        const char = rowData.value[i];
        if (char.length === 1) newValue += ` ${char}`;
        else if (char.length > 0) {
          newValue += ` ${char[0]}<sub>${char.slice(1)}</sub>`;
        }
      }
      return `<span>${newValue}</span>`;
    }
    if (rowData.metric === 'Wilson B' || rowData.metric === 'Bulk solvent B') {
      const newValue = `${rowData.value[0]} Å<sup>2</sup>`;
      return `<span>${newValue}</span>`;
    }
    if (rowData.metric === 'Bulk solvent k') {
      const newValue = `${rowData.value[0]} e<sup>-</sup>/Å<sup>3</sup>`;
      return `<span>${newValue}</span>`;
    }
    return `<span>${rowData.value.join(' ')}</span>`;
  }
}
