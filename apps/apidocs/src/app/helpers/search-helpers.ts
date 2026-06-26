import { SearchFieldDoc } from '../models/search-field.model';

export function normalizeText(value: string): string {
  return (value ?? '').toLowerCase().trim();
}

export function filterFieldDocs(fields: SearchFieldDoc[], query: string): SearchFieldDoc[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return fields;

  const terms = normalized.split(/\s+/);

  return fields.filter((field) => terms.every((term) => field.searchText.includes(term)));
}
