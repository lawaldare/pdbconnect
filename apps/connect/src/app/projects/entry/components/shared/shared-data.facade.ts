import { inject, Injectable } from '@angular/core';
import { DomainsBoundaries, MacromoleculesResidueRanges } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { EntryApiService } from '../../services/entry-api.service';
import { map } from 'rxjs';
import { MappedResidue } from '../../data-classes/data-models-and-definitions/other-models';

export type BoundsByEntityId = {
  [key: number]: DomainsBoundaries[];
};

@Injectable({
  providedIn: 'root',
})
export class SharedDataFacade {
  public readonly entryApiService = inject(EntryApiService);

  public transformCoverageData(data: MacromoleculesResidueRanges[]): MappedResidue[] {
    const groupedData: Record<string, any> = {};
    const result: MappedResidue[] = [];
    data.forEach((entry) => {
      const { uniprot, chainId, coverage, range } = entry;

      if (!groupedData[uniprot]) {
        groupedData[uniprot] = {
          chainId,
          coverage,
          uniprot,
          open: false,
          range: [],
          pdbs: this.entryApiService.getSummaryStats(uniprot).pipe(map((stats) => stats.pdbs)),
        };
      }

      groupedData[uniprot].range.push(range);
    });

    for (const key in groupedData) {
      result.push(groupedData[key]);
    }

    return result;
  }
}
