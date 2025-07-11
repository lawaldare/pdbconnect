/* eslint-disable @typescript-eslint/no-explicit-any */

import { inject, Injectable } from '@angular/core';
import { MacromoleculesRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { SequenceDetail } from './llm-tab.component';
import { EntryApiService } from '../../services/entry-api.service';

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

  public groupByPdbChain(data: any) {
    return data.reduce((acc: any, item: any) => {
      const chain = item.pdbChain;
      if (!acc[chain]) {
        acc[chain] = [];
      }
      acc[chain].push(item);
      return acc;
    }, {});
  }
}
