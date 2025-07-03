import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EntryDropdownFacade {
  public filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    const searchQueryLower = searchQuery.toLocaleLowerCase();

    return items
      .map((group) => {
        return {
          group: group.group,
          items: group.items.filter((item: any) => item.name.toLocaleLowerCase().indexOf(searchQueryLower) !== -1),
        };
      })
      .filter((group) => group.items.length > 0);
  }

  public nameToEventTag(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }
}
