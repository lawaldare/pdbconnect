import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ComplexUtilService {
  public filterItemsBySearchQuery(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      const additionalAccession = item.additional_participants
        .map((c: any) => c.accession)
        .join(',')
        .toLocaleLowerCase();
      const commonAccession = item.common_participants
        .map((c: any) => c.accession)
        .join(',')
        .toLocaleLowerCase();
      const additionalName = item.additional_participants
        .map((c: any) => c.name)
        .join(',')
        .toLocaleLowerCase();
      const commonName = item.common_participants
        .map((c: any) => c.name)
        .join(',')
        .toLocaleLowerCase();
      const rowString = additionalAccession + commonAccession + additionalName + commonName;
      return rowString.toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  public filterItemsBySearchQueryComplexes(searchQuery: string, items: any[]): any[] {
    return items.filter((item) => {
      const searchQueryLower = searchQuery.toLocaleLowerCase();
      const additionalAccession = item.pdb_complex_id.join(',').toLocaleLowerCase();
      const commonAccession = item.name.join(',').toLocaleLowerCase();
      const additionalName = item.additional_participants
        .map((c: any) => c.name)
        .join(',')
        .toLocaleLowerCase();
      const commonName = item.common_participants
        .map((c: any) => c.name)
        .join(',')
        .toLocaleLowerCase();
      const rowString = additionalAccession + commonAccession + additionalName + commonName;
      return rowString.toLocaleLowerCase().indexOf(searchQueryLower) !== -1;
    });
  }

  public openLigandPage(ligandId: string) {
    const trimmedValue = ligandId.trim();
    const origin = window.location.origin;
    const pathname = '/chemicalCompound/show/';
    const baseHref = window.location.hostname === 'localhost' ? '' : '/pdbe/connect';
    const href = origin + baseHref + pathname + trimmedValue;
    window.open(href, '_blank');
  }

  public findComplexId(data: any[]) {
    const entries = Object.values(data);

    // If there's only one object, return its pdb_complex_id
    if (entries.length === 1) {
      return entries[0].pdb_complex_id;
    }

    // Otherwise, find the object with preferred_assembly === true
    for (const obj of entries) {
      if (obj.preferred_assembly === true) {
        return obj.pdb_complex_id;
      }
    }
  }
}
