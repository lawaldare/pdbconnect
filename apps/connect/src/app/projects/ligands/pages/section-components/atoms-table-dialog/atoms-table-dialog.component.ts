import { AfterViewInit, Component, DestroyRef, inject, Inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AggregatedApiService, Atom } from '../../../services/aggregated-api.service';
import { MaterialModule } from '@pdbc/core';

@Component({
  selector: 'pdbc-atoms-table-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './atoms-table-dialog.component.html',
  styleUrl: './atoms-table-dialog.component.scss',
})
export class AtomsTableDialogComponent implements AfterViewInit {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dialogRef = inject(MatDialogRef<AtomsTableDialogComponent>);
  public atoms: Atom[] = [];
  public readonly displayedColumns: string[] = ['atom_name', 'element', 'pdb_name', 'leaving_atom', 'aromatic', 'charge', 'ideal_x', 'ideal_y', 'ideal_z'];
  public dataSource = new MatTableDataSource<Atom>(this.atoms);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public pageSizeOptions = signal([10, 20, 30]);

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngAfterViewInit() {
    this.aggregatedApiService
      .getAtoms(this.dialogData.ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.pageSizeOptions.update((options) => [...new Set([...options, this.dataSource.data.length])]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}
