import { Component, DestroyRef, inject, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AggregatedApiService, Atom } from '../../../services/aggregated-api.service';
import { AG_Grid_Theme_Class, agGridOptionsBase, BooleanRendererComponent, MaterialModule } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions, ColDef } from 'ag-grid-community';

@Component({
  selector: 'pdbc-atoms-table-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, AgGridAngular],

  templateUrl: './atoms-table-dialog.component.html',
  styleUrl: './atoms-table-dialog.component.scss',
})
export class AtomsTableDialogComponent {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dialogRef = inject(MatDialogRef<AtomsTableDialogComponent>);

  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
  };

  public readonly themeClass = AG_Grid_Theme_Class;

  public numberOfAtoms = signal(0);

  public readonly colDefs: ColDef[] = [
    { headerName: 'Atom Name', field: 'atom_name' },
    { headerName: 'Element', field: 'element' },
    { headerName: 'PDB Name', field: 'pdb_name' },
    { headerName: 'Leaving Atom', field: 'leaving_atom', cellRenderer: BooleanRendererComponent },
    { headerName: 'Aromatic', field: 'aromatic', cellRenderer: BooleanRendererComponent },
    { headerName: 'Charge', field: 'charge' },
    { headerName: 'Ideal X', field: 'ideal_x' },
    { headerName: 'Ideal Y', field: 'ideal_y' },
    { headerName: 'Ideal Z', field: 'ideal_z' },
  ];

  public rowData!: Atom[];
  public paginationPageSizeSelector = signal<number[]>([20, 50]);

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  onGridReady() {
    this.aggregatedApiService
      .getAtoms(this.dialogData.ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.rowData = data;
        this.numberOfAtoms.set(data.length);
        this.paginationPageSizeSelector.update((options) => [...new Set([...options, data.length])]);
      });
  }
}
