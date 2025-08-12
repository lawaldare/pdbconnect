import { inject, Injectable } from '@angular/core';
import { MacromoleculesResidueRanges, MacromoleculesRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { EntryApiService } from '../../services/entry-api.service';
import { map } from 'rxjs';
import { MappedResidue, SequenceDetail } from '../../data-classes/data-models-and-definitions/other-models';

@Injectable({
  providedIn: 'root',
})
export class MacromoleculesFacade {
  public readonly entryApiService = inject(EntryApiService);

  public getMacromoleculeSequenceDetails(entryId: string, datum: MacromoleculesRowData, chainId: string) {
    const entity = datum.additionalData.molecule;
    const seq = entity.sequence;
    const sequenceDetails: SequenceDetail[] = [];
    if (seq) {
      sequenceDetails.push({
        title: `>FASTA pdb|${entryId}|${entity.molecule_name[0]}; Chain ${chainId}`,
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
