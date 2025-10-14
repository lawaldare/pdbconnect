import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AG_Grid_Theme_Class, agGridOptionsBase, autoSizeStrategy, DownloadFileTypeService, UtilService } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabelUniProtMappingRows, UniProtMappingRows } from '../../../store/data-processing/models/other-models';
import { TableHeaderWithTooltipComponent } from '../table-header-with-tooltip/table-header-with-tooltip.component';

interface DialogData {
  uniprotAccsForMacromolecule: string[];
  labelUniProtMappings: LabelUniProtMappingRows[];
  authUniProtMappings: UniProtMappingRows[];
}

interface Filter {
  id: string;
  category: string;
  value: number | string;
}

@Component({
  selector: 'pdbc-unp-mapping-list',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './unp-mapping-list.component.html',
  styleUrl: './unp-mapping-list.component.scss',
})
export class UnpMappingListComponent {
  public readonly dialogRef = inject(MatDialogRef<UnpMappingListComponent>);
  public readonly dialogData = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly utilService = inject(UtilService);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);

  public readonly rowData = signal<UniProtMappingRows[]>(this.dialogData.authUniProtMappings ?? []);
  public readonly unfilteredRowData = this.dialogData.authUniProtMappings ?? [];

  public filters = this.countCategoryOccurrences(this.dialogData.uniprotAccsForMacromolecule);

  public selectedCategory = signal('All');

  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    suppressRowClickSelection: true, // prevents row selection on click
    enableCellTextSelection: true, // keeps text selectable
    suppressClipboardPaste: true,
    paginationPageSize: 10,
  };

  public readonly defaultColDef: ColDef = {
    filter: false,
    autoHeight: true, // allows rows to grow in height
    wrapText: true, // enables multi-line wrapping
    resizable: true, // let users resize if needed
    cellStyle: { 'white-space': 'normal' }, // override default nowrap
  };

  public readonly autoSizeStrategy = autoSizeStrategy;
  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'UniProt ID',
      field: 'uniprotId',
      cellRenderer: (params: any) =>
        `<a href="https://www.uniprot.org/uniprotkb/${params.value}" target="_blank">${params.value}
          <i class="icon icon-link icon-common" style="margin-left: 5px"></i></a>`,
      width: 150,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Chains',
      field: 'chainIds',
      valueFormatter: (params) => params.value?.join(', ') || '-',
      width: 100,
      suppressSizeToFit: true,
    },
    {
      headerComponent: TableHeaderWithTooltipComponent,
      headerComponentParams: {
        customHeader: 'Coverage',
        customTooltip: 'Percentage of UniProt sequence covered by PDB chain',
      },
      field: 'coverage',
      width: 110,
      suppressSizeToFit: true,
    },
    {
      headerComponent: TableHeaderWithTooltipComponent,
      headerComponentParams: {
        customHeader: 'Identity',
        customTooltip: 'Sequence identity between PDB chain and UniProt sequence',
      },
      field: 'identity',
      width: 100,
      suppressSizeToFit: true,
    },
    {
      headerComponent: TableHeaderWithTooltipComponent,
      headerComponentParams: {
        customHeader: 'UniProt Segments',
        customTooltip: 'Aligned residue ranges in UniProt numbering',
      },
      field: 'uniprotSegments',
      flex: 1,
      valueFormatter: (params) => params.value?.join(', ') || '-',
    },
    {
      headerComponent: TableHeaderWithTooltipComponent,
      headerComponentParams: {
        customHeader: 'Segments',
        customTooltip: 'Aligned residue ranges in label numbering (PDB internal numbering)',
      },
      field: 'labelSegments',
      flex: 1,
      valueFormatter: (params) => params.value?.join(', ') || '-',
    },
    {
      headerComponent: TableHeaderWithTooltipComponent,
      headerComponentParams: {
        customHeader: 'Author Segments',
        customTooltip: 'Residue ranges in author-provided numbering (from mmCIF). Excludes unobserved residues.',
      },
      field: 'authSegments',
      flex: 1,
      valueFormatter: (params) => params.value?.join(', ') || '-',
    },
  ];

  public paginationPageSizeSelector = signal<number[]>([10, 20, 50]);

  private countCategoryOccurrences(uniprotAccs: string[]): Filter[] {
    const filters = uniprotAccs.map((acc) => ({
      id: acc,
      category: acc,
      value: 1,
    }));

    return [{ id: 'All', category: 'Show all', value: '' }, ...filters];
  }

  public selectCategory(category: Filter) {
    this.selectedCategory.set(category.id);

    const filteredRows = category.id === 'All' ? this.unfilteredRowData : this.unfilteredRowData.filter((r) => r.uniprotId === category.id);

    this.rowData.set(filteredRows);
  }

  public downloadCSV(): void {
    const currentFilter = this.selectedCategory();
    const filteredRows = this.rowData();

    if (!filteredRows || !filteredRows.length) {
      console.warn('No data to download.');
      this.utilService.openSnackBar('No data to download', 'Dismiss');
      return;
    }
    // Map the data to a CSV-friendly format
    const mappedData = filteredRows.map((row) => ({
      'UniProt ID': row.uniprotId,
      Chains: row.chainIds?.join(', ') || '-',
      'Coverage (%)': row.coverage,
      'Identity (%)': row.identity,
      'UniProt Segments': row.uniprotSegments?.join(', ') || '-',
      'Label Segments': row.labelSegments?.join(', ') || '-',
      'Author Segments': row.authSegments?.join(', ') || '-',
    }));

    // Create filename with filter name (if specific)
    const fileName = currentFilter && currentFilter !== 'All' ? `unp-mappings-${currentFilter}` : 'unp-mappings-all';

    if (mappedData && mappedData.length) {
      this.downloadFileTypeService.downloadCSV(mappedData, fileName);
    }
  }
}
