import { Component, computed, input, OnChanges, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplexData } from '../../../models/complex-structure.model';
import { ToolTipComponent } from '@pdbe-lib/tool-tip';
import { ComplexCardComponent } from '../../section-components/complex-card/complex-card.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'pdbc-complex-interactions',
  standalone: true,
  imports: [CommonModule, ToolTipComponent, ComplexCardComponent, MatPaginator],
  templateUrl: './complex-interactions.component.html',
  styleUrl: './complex-interactions.component.scss',
})
export class ComplexInteractionsComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public summaryData = input.required<ComplexData>();

  public subcomplexesLength = computed(() => this.summaryData().subcomplexes.length);
  public supercomplexesLength = computed(() => this.summaryData().supercomplexes.length);
  public subcomplexesPageSize = signal<number>(5);
  public supercomplexesPageSize = signal<number>(5);
  public subcomplexesPageSizeOptions = computed(() => [5, 10, 15, this.subcomplexesLength()]);
  public supercomplexesPageSizeOptions = computed(() => [5, 10, 15, this.subcomplexesLength()]);

  public subComplexesPage: string[] = [];
  public superComplexesPage: string[] = [];

  ngOnChanges(): void {
    this.subComplexesPage = this.summaryData().subcomplexes.slice(0, this.subcomplexesPageSize());
    this.superComplexesPage = this.summaryData().supercomplexes.slice(0, this.supercomplexesPageSize());
  }

  handlePageEvent(event: PageEvent, filterOn: string) {
    switch (filterOn) {
      case 'subcomplexes': {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.subComplexesPage = this.summaryData().subcomplexes.slice(startIndex, endIndex);
        break;
      }
      case 'supercomplexes': {
        const startIndex = event.pageIndex * event.pageSize;
        const endIndex = startIndex + event.pageSize;
        this.superComplexesPage = this.summaryData().supercomplexes.slice(startIndex, endIndex);
        break;
      }
    }
  }
}
