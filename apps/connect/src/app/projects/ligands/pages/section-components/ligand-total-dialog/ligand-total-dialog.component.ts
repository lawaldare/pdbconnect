import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chain } from '@angular/compiler';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-ligand-total-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './ligand-total-dialog.component.html',
  styleUrl: './ligand-total-dialog.component.scss',
})
export class LigandTotalDialogComponent {
  public readonly displayedColumns: string[] = ['pdb_id', 'auth_asym_id', 'struct_asym_id'];
  public structureData: Chain[] = [];
  public dataSource = new MatTableDataSource<Chain>(this.structureData);
  constructor(public dialogRef: MatDialogRef<LigandTotalDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: Chain[]) {
    this.dataSource.data = dialogData;
  }
}
