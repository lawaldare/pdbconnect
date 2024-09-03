import { AfterViewInit, Component, DestroyRef, Inject, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AggregatedApiService, Bond } from '../../../services/aggregated-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '@pdbc/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'pdbc-bonds-table-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './bonds-table-dialog.component.html',
  styleUrl: './bonds-table-dialog.component.scss',
})
export class BondsTableDialogComponent implements AfterViewInit {
  private readonly aggregatedApiService = inject(AggregatedApiService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly dialogRef = inject(MatDialogRef<BondsTableDialogComponent>);
  public bonds: Bond[] = [];
  public readonly displayedColumns: string[] = ['atom_1', 'atom_2', 'bond_type', 'bond_order', 'aromatic', 'stereo', 'ideal_length'];
  public dataSource = new MatTableDataSource<Bond>(this.bonds);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public pageSizeOptions = signal([10, 20, 30]);

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  ngAfterViewInit() {
    this.aggregatedApiService
      .getBonds(this.dialogData.ligandId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.pageSizeOptions.update((options) => [...new Set([...options, this.dataSource.data.length])]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}
