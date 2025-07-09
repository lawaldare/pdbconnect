/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { MacromoleculesResidueRanges, MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { MappedResidue, SequenceDetail } from './llm-tab.component';
import { EntryApiService } from '../../services/entry-api.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MacromoleculesFacade {
  public readonly entryApiService = inject(EntryApiService);

  public getMacromoleculeSequenceDetails(entryId: string, datum: MacromoleculesRowData, dropdownSelected: string) {
    const entity = datum.additionalData.molecule;
    const seq = entity.sequence;
    const sequenceDetails: SequenceDetail[] = [];
    if (seq) {
      sequenceDetails.push({
        title: `>FASTA pdb|${entryId}|${entity.molecule_name[0]}; ${dropdownSelected}`,
        fullSequence: seq,
        segments: [{ sequence: seq }],
      });
    }
    return sequenceDetails;
  }

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
