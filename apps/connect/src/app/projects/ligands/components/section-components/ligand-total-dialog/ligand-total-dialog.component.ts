import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AG_Grid_Theme_Class, agGridOptionsBase, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef } from 'ag-grid-community';
import { Chain } from '../../../data-models/structure.model';

@Component({
  selector: 'pdbc-ligand-total-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, AgGridAngular],
  templateUrl: './ligand-total-dialog.component.html',
  styleUrl: './ligand-total-dialog.component.scss',
})
export class LigandTotalDialogComponent {
  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    paginationPageSize: 10,
  };

  public readonly colDefs: ColDef[] = [
    { headerName: 'PDB ID', field: 'pdb_id', flex: 1 },
    { headerName: 'AUTH ASYM ID', field: 'auth_asym_id', flex: 1 },
    { headerName: 'STRUCT ASYM ID', field: 'struct_asym_id', flex: 1 },
  ];

  public rowData!: Chain[];

  public readonly themeClass = AG_Grid_Theme_Class;
  public paginationPageSizeSelector = signal<number[]>([10, 20, 50]);

  constructor(public dialogRef: MatDialogRef<LigandTotalDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: Chain[]) {}

  onGridReady() {
    const unique = [];
    const pdbIds = new Set();

    for (const obj of this.dialogData) {
      if (!pdbIds.has(obj.pdb_id)) {
        unique.push(obj);
        pdbIds.add(obj.pdb_id);
      }
    }
    this.rowData = unique;
  }
}
