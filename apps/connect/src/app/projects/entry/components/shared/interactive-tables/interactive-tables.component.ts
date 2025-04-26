/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyDataToTable } from './data-processing/assembly-row-class';
import { DomainDataToTable } from './data-processing/domain-row-class';
import { LigandDataToTable } from './data-processing/ligand-row-class';
import { MacromoleculeDataToTable } from './data-processing/macromolecule-row';
import { TableNames } from '../../../pages/main/main.component';
import { ComponentCommunicationService } from '../../../services/component-comm.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { resourceUrls } from '../../../entry-constant';

type DataToTable = AssemblyDataToTable | DomainDataToTable | LigandDataToTable | MacromoleculeDataToTable;

export interface Filter {
  types: string[];
  description: string;
}

@Component({
  selector: 'pdbc-interactive-tables',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './interactive-tables.component.html',
  styleUrl: './interactive-tables.component.scss',
})
export class InteractiveTablesComponent implements OnChanges {
  public readonly signals = inject(ComponentCommunicationService);

  public readonly tabName = input.required<TableNames>();

  public readonly resourceUrls = resourceUrls;

  public tableData?: any;
  public currentTableFilter: string[] = [];

  public selectedRowCard = signal<any>({});
  public filters = signal<Filter[]>([]);
  public selectedFilter = signal<Filter>({} as Filter);
  public rowCards = signal<any[]>([]);
  public startNumber = signal<number>(1);
  private mappedTableRows = signal<any[]>([]);

  async ngOnChanges(): Promise<void> {
    const tableData = this.signals.getTabData(this.tabName());
    this.tableData = tableData as DataToTable;
    const mappedTableRows = tableData.tableRows().map((row, index) => ({
      ...row,
      index,
    }));
    this.mappedTableRows.update(() => mappedTableRows);
    this.rowCards.update(() => mappedTableRows);
    this.selectedRowCard.set(this.rowCards()[0]);
    this.filters.update(() =>
      tableData.tableFilters().map((filter: any) => {
        return {
          types: filter.types,
          description: filter.description.includes('All') ? 'All' : filter.description,
        };
      })
    );
    this.selectedFilter.set(this.filters()[0]);
    this.loadSelectionFromTable(0);
  }

  onCardClick(card: any): void {
    this.selectedRowCard.set(card);
    this.loadSelectionFromTable(card.index);
  }

  onChangePage(num: number): void {
    const p = (num - 1) * 10;
    this.startNumber.set(num);
    this.selectedRowCard.set(this.rowCards()[p]);
    this.loadSelectionFromTable(this.rowCards()[p].index);
  }

  public loadSelectionFromTable(rowIdx: number) {
    console.log('loadSelectionFromTable', rowIdx);
    this.signals.setTabState(this.tabName(), rowIdx);
  }

  public applyFilter(obj: any, tabName: string): void {
    // function enables triggering external table filters
    this.selectedFilter.set(obj);
    this.startNumber.set(1);

    if (tabName === 'Macromolecules') {
      const filteredRowCards = this.mappedTableRows().filter((row: any) => obj.types.includes(row?.additionalData?.molecule?.molecule_type));
      this.rowCards.update(() => filteredRowCards);
    }

    if (tabName === 'Ligands') {
      const filteredRowCards = this.mappedTableRows().filter((row: any) => obj.types.includes(row?.type));
      this.rowCards.update(() => filteredRowCards);
    }

    if (tabName === 'Domains') {
      const filteredRowCards = this.mappedTableRows().filter((row: any) => obj.types.includes(row?.resource));
      this.rowCards.update(() => filteredRowCards);
    }

    this.selectedRowCard.set(this.rowCards()[0]);
    this.loadSelectionFromTable(this.rowCards()[0].index);
  }
}
