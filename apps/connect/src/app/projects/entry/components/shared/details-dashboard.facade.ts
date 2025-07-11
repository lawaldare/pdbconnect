import { inject, Injectable } from '@angular/core';
import {
  DomainsBoundaries,
  DomainsRowData,
  LigandsRowData,
  MacromoleculesResidueRanges,
  MacromoleculesRowData,
} from './interactive-tables/data-models-and-definitions/row-and-table.model';
import { Molecule } from '../../data-models/molecule.model';
import { MolstarSelectionObj } from '@pdbe-lib/molstar-for-apps';
import { EntryApiService } from '../../services/entry-api.service';
import { map } from 'rxjs';

export type BoundsByEntityId = {
  [key: number]: DomainsBoundaries[];
};

export interface SequenceDetail {
  title: string;
  fullSequence: string;
  segments: {
    sequence: string;
    color?: string;
  }[];
}

export interface MappedResidue {
  range: string[];
  coverage: string;
  chainId: string;
  uniprot: string;
  open: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DetailsDashboardFacade {
  public readonly entryApiService = inject(EntryApiService);

  // public getDomainChains(datum: DomainsRowData) {
  //   let uniqueChains: string[] = [];
  //   for (const selection of datum.additionalData.selections) {
  //     const uniqueChainsInSelection = selection.residues.map((sel) => sel.authChainId!).filter((ch, idx, chains) => chains.indexOf(ch) === idx);
  //     uniqueChains.push(...uniqueChainsInSelection);
  //   }
  //   uniqueChains = uniqueChains.filter((e, i, self) => i === self.indexOf(e));

  //   const hasPlural = uniqueChains.length > 1 ? 's' : '';
  //   return `Chain${hasPlural} ${uniqueChains.join(', ')}`;
  // }

  public getDomainSequenceDetails(entryId: string, macromolecules: Molecule[], datum: DomainsRowData) {
    const sequenceDetails: SequenceDetail[] = [];
    const boundariesByEntityId = datum.additionalData.boundaries.reduce((obj: BoundsByEntityId, boundary) => {
      obj[boundary.entity] = obj[boundary.entity] ?? [];
      obj[boundary.entity].push(boundary);
      return obj;
    }, {});

    const domainDescription = `(${datum.resource}): ${datum.domain}; Segments: ${datum.additionalData.segmentsResidNumbers.join(', ')} (Auth: ${datum.segments.join(
      ', '
    )})`;

    for (const [entityId, boundaryList] of Object.entries(boundariesByEntityId)) {
      const entityOfBoundary = macromolecules.filter((mol: Molecule) => mol.entity_id === parseInt(entityId))[0];

      const uniqueChainsInBoundaries = boundaryList.map((sel) => sel.chain).filter((ch, idx, chains) => chains.indexOf(ch) === idx);
      const hasPlural = uniqueChainsInBoundaries.length > 1 ? 's' : '';

      const sequenceDetail: SequenceDetail = {
        title: `>FASTA pdb|${entryId}|${entityOfBoundary.molecule_name[0]}; Chain${hasPlural} ${uniqueChainsInBoundaries.join(', ')}; Domain ${domainDescription}`,
        fullSequence: entityOfBoundary.sequence,
        segments: [],
      };

      let currentCharIndex = 0;
      boundaryList.forEach((boundary) => {
        // Add substring from current index up to start of boundary
        if (currentCharIndex < boundary.start) {
          const outOfBoundary = sequenceDetail.fullSequence.substring(currentCharIndex, boundary.start - 1);
          sequenceDetail.segments.push({
            sequence: outOfBoundary,
          });
        }

        // Add the substring within the boundary as a special case
        const boundarySubstring = sequenceDetail.fullSequence.substring(boundary.start - 1, boundary.end);
        sequenceDetail.segments.push({
          // color: '#9DFF94',
          color: '#D0DFBB',
          sequence: boundarySubstring,
        });

        currentCharIndex = boundary.end; // Update currentIndex to end of boundary
      });
      if (currentCharIndex < sequenceDetail.fullSequence.length) {
        sequenceDetail.segments.push({
          sequence: sequenceDetail.fullSequence.substring(currentCharIndex),
        });
      }
      sequenceDetails.push(sequenceDetail);
    }
    return sequenceDetails;
  }

  public getLigandDropdownString(id: string, selectedLigandInstance: MolstarSelectionObj) {
    return `${id} ${selectedLigandInstance.residues[0].authBegin}${selectedLigandInstance.residues[0].authBeginIns} in chain ${selectedLigandInstance.authChainId}`;
  }

  public getLigandsDropdownOptions(datum: LigandsRowData) {
    const dropdownTitle = 'Select displayed ligand';
    const dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
    for (const selection of datum.additionalData.selections) {
      const name = this.getLigandDropdownString(datum.id, selection);
      dropdownOptionsToMolstar[name] = selection;
    }
    const dropdownOptions = [...Object.keys(dropdownOptionsToMolstar)];
    const dropdownSelected = dropdownOptions[0];
    return {
      dropdownTitle: dropdownTitle,
      dropdownOptionsToMolstar: dropdownOptionsToMolstar,
      dropdownOptions: dropdownOptions,
      dropdownSelected: dropdownSelected,
    };
  }

  public getMacromoleculeDropdownOptions(datum: MacromoleculesRowData) {
    const dropdownTitle = 'Select displayed chain';
    const dropdownOptionsToMolstar: { [key: string]: MolstarSelectionObj } = {};
    for (const selection of datum.additionalData.selections) {
      dropdownOptionsToMolstar[`Chain ${selection.authChainId!}`] = selection;
    }
    const dropdownOptions = [...Object.keys(dropdownOptionsToMolstar)];
    const dropdownSelected = dropdownOptions[0];
    return {
      dropdownTitle: dropdownTitle,
      dropdownOptionsToMolstar: dropdownOptionsToMolstar,
      dropdownOptions: dropdownOptions,
      dropdownSelected: dropdownSelected,
    };
  }

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
