import { Component, Input, computed, signal } from '@angular/core';
import { SearchFieldDoc } from '../../models/search-field.model';
import { filterFieldDocs } from '../../helpers/search-helpers';

@Component({
  selector: 'pdbc-search-field-docs',
  standalone: true,
  templateUrl: './search-solr-docs.component.html',
  styleUrls: ['./search-solr-docs.component.scss'],
})
export class PdbeSearchSolrDocs {
  private readonly allFields = signal<SearchFieldDoc[]>([]);
  readonly searchText = signal('');
  readonly selectedCategory = signal<string>('All');

  @Input()
  set fields(value: SearchFieldDoc[] | null | undefined) {
    this.allFields.set(value ?? []);
  }

  readonly categories = computed(() => {
    const unique = new Set(
      this.allFields()
        .map((field) => field.category?.trim())
        .filter((category): category is string => !!category)
    );

    return ['All', ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  });

  readonly filteredFields = computed(() => {
    const category = this.selectedCategory();

    const categoryFiltered = category === 'All' ? this.allFields() : this.allFields().filter((field) => field.category === category);

    return filterFieldDocs(categoryFiltered, this.searchText());
  });

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchText.set(input?.value ?? '');
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  clearFilters(): void {
    this.selectedCategory.set('All');
    this.searchText.set('');
  }
}
