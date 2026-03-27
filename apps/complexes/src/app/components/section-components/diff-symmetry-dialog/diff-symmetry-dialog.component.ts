/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/prefer-inject */

import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AG_Grid_Theme_Class, agGridOptionsBase, autoSizeStrategy, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Assembly } from '../../../models/complex-structure.model';

@Component({
  selector: 'pdbc-bonds-table-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, AgGridAngular],
  templateUrl: './diff-symmetry-dialog.component.html',
  styleUrl: './diff-symmetry-dialog.component.scss',
})
export class DiffSymmetryDialogComponent {
  public readonly dialogRef = inject(MatDialogRef<DiffSymmetryDialogComponent>);

  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly colDefs: ColDef[] = [
    { headerName: 'PDB_ID', field: 'pdb_id' },
    { headerName: 'ASSEMBLY_ID', field: 'assembly_id' },
    {
      headerName: 'SYMMETRY_TYPE',
      field: 'symmetry',
      cellRenderer: (params: any) => params.data.type,
    },
    {
      headerName: 'SYMMETRY_SYMBOL',
      field: 'bond_order',
      cellRenderer: (params: any) => params.data.symbol,
    },
  ];

  public rowData!: Assembly[];
  public paginationPageSizeSelector = signal<number[]>([20, 50]);

  public readonly autoSizeStrategy = autoSizeStrategy;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  onGridReady() {
    this.rowData = this.dialogData.assemblies;
  }
}
