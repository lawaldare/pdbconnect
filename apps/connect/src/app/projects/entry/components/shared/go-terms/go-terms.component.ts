import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { EntryStoreState } from '../../../store/entry-store.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntrySelectors } from '../../../store/entry.selectors';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AG_Grid_Theme_Class, agGridOptionsBase, autoSizeStrategy } from '@pdbc/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UniProtMappingObj } from '../../../data-models/uniprot-mapping.model';

interface Filter {
  id: string;
  category: string;
  value: number | string;
}

@Component({
  selector: 'pdbc-go-terms',
  imports: [CommonModule, AgGridAngular],
  templateUrl: './go-terms.component.html',
  styleUrl: './go-terms.component.scss',
})
export class GoTermsComponent {
  private readonly globalStore = inject(Store<EntryStoreState>);
  public readonly dialogRef = inject(MatDialogRef<GoTermsComponent>);
  public readonly dialogData = inject(MAT_DIALOG_DATA);

  public readonly goMapping = toSignal(this.globalStore.select(EntrySelectors.goMapping));

  public rowData = linkedSignal({
    source: this.goMapping,
    computation: () => this.getMappedGOMapping,
  });

  public readonly unfilteredRowData = this.getMappedGOMapping;

  public filters = this.countCategoryOccurrences(this.getMappedGOMapping);

  public selectedCategory = signal('All');

  public readonly gridOptions: GridOptions = {
    ...agGridOptionsBase,
    paginationPageSize: 10,
  };

  public readonly defaultColDef: ColDef = {
    filter: false,
  };

  public readonly autoSizeStrategy = autoSizeStrategy;

  public readonly themeClass = AG_Grid_Theme_Class;

  public readonly goSearchCategories: { [key: string]: string } = {
    Molecular_function: 'biological_function',
    Cellular_component: 'biological_cell_component',
    Biological_process: 'biological_process',
  };

  public readonly colDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      cellRenderer: (params: any) =>
        ` <a href="https://www.ebi.ac.uk/pdbe/entry/search/index?${this.goSearchCategories[params.data.category]}:${params.data.name}" target="_blank">${
          params.data.name
        }
            <i class="icon icon-link icon-common" style="margin-left: 5px"></i>
          </a>`,
    },
    {
      headerName: 'ID Number',
      field: 'id',
      cellRenderer: (params: any) => `
      <a href="https://www.ebi.ac.uk/QuickGO/GTerm?id=${params.data.id}" target="_blank">${params.data.id}
        <i class="icon icon-link icon-common" style="margin-left: 5px"></i>
      </a>
    `,
    },
    {
      headerName: 'Category',
      field: 'category',
      cellRenderer: (params: any) => params.data.category.replace('_', ' '),
    },
  ];

  public paginationPageSizeSelector = signal<number[]>([10, 20, 50]);

  private countCategoryOccurrences(data: any): Filter[] {
    return data.reduce(
      (acc: any[], item: any) => {
        const id = item.category;
        const category = item.category.replace('_', ' ');
        const existing = acc.find((obj) => obj.category === category);

        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ id, category, value: 1 });
        }

        return acc;
      },
      [{ id: 'All', category: 'Show all', value: '' }]
    );
  }

  public selectCategory(category: Filter) {
    this.selectedCategory.set(category.id);

    const filteredCategory = this.unfilteredRowData.filter((item: any) => item.category === category.id);

    this.rowData.update(() => (category.id === 'All' ? this.unfilteredRowData : filteredCategory));
  }

  get getMappedGOMapping() {
    return Object.entries(this.goMapping() ?? {}).reduce((acc: any[], [id, item]) => {
      // Filter mappings by entity_id
      const filteredMappings = (item.mappings ?? []).filter((m: UniProtMappingObj) => m.entity_id === this.dialogData.entityId);

      // Only include GO terms that have at least one relevant mapping
      if (filteredMappings.length > 0) {
        acc.push({
          ...item,
          id,
          mappings: filteredMappings, // optionally keep only the filtered mappings
        });
      }

      return acc;
    }, []);
  }
}
