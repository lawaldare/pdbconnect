import { Component, DestroyRef, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatedApiService, Bond } from '../../../services/aggregated-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AG_Grid_Theme_Class, agGridOptionsBase, BooleanRendererComponent, DownloadFileTypeService, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef } from 'ag-grid-community';

@Component({
  selector: 'pdbc-bonds-table-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, AgGridAngular],
  templateUrl: './bonds-table-dialog.component.html',
  styleUrl: './bonds-table-dialog.component.scss',
})
export class BondsTableDialogComponent {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dialogRef = inject(MatDialogRef<BondsTableDialogComponent>);
  private readonly downloadFileTypeService = inject(DownloadFileTypeService);

  public bonds: Bond[] = [];
  public readonly displayedColumns: string[] = ['atom_1', 'atom_2', 'bond_type', 'bond_order', 'aromatic', 'stereo', 'ideal_length'];
  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public numberOfBonds = signal(0);

  public readonly colDefs: ColDef[] = [
    { headerName: 'First Atom', field: 'atom_1' },
    { headerName: 'Second Atom', field: 'atom_2' },
    { headerName: 'Bond Type', field: 'bond_type' },
    { headerName: 'Bond Order', field: 'bond_order' },
    { headerName: 'Aromatic', field: 'aromatic', cellRenderer: BooleanRendererComponent },
    { headerName: 'Stereo', field: 'stereo', cellRenderer: BooleanRendererComponent },
    { headerName: 'Bond Length', field: 'ideal_length' },
  ];

  public rowData!: Bond[];
  public paginationPageSizeSelector = signal<number[]>([20, 50]);

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  onGridReady() {
    this.aggregatedApiService
      .getBonds(this.dialogData.ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.rowData = data;
        this.numberOfBonds.set(data.length);
        this.paginationPageSizeSelector.update((options) => [...new Set([...options, data.length])]);
      });
  }

  public downloadCSV(): void {
    this.downloadFileTypeService.downloadCSV(this.rowData, 'bonds');
  }
}
