import { Injectable } from '@angular/core';
import { DomainsRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { Molecule } from '../../data-models/molecule.model';
import { BoundsByEntityId, SequenceDetail } from './domains-tab.component';

@Injectable({
  providedIn: 'root',
})
export class DomainsFacade {
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
}
