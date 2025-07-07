import { Injectable } from '@angular/core';
import { DomainsRowData } from '../shared/interactive-tables/data-models-and-definitions/row-and-table.model';
import { Molecule } from '../../data-models/molecule.model';
import { BoundsByEntityId, SequenceDetail } from './domains-tab.component';
import { SmartSequenceAnnotation } from '@pdbe-lib/smart-seq-viewer';

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

  public generateSeqViewerDomainAnnotation(entryId: string, macromolecules: Molecule[], datum: DomainsRowData): SmartSequenceAnnotation[] {
    const annotations: SmartSequenceAnnotation[] = [];

    const boundariesByEntityId = datum.additionalData.boundaries.reduce((acc: Record<number, typeof datum.additionalData.boundaries>, boundary) => {
      acc[boundary.entity] = acc[boundary.entity] ?? [];
      acc[boundary.entity].push(boundary);
      return acc;
    }, {});

    for (const [entityIdStr, boundaryList] of Object.entries(boundariesByEntityId)) {
      const entityId = parseInt(entityIdStr);
      const molecule = macromolecules.find((mol) => mol.entity_id === entityId);
      if (!molecule) continue;

      const fullSequence = molecule.sequence;
      const data: SmartSequenceAnnotation['data'] = [];
      let residueIndex = 1;

      for (let segmentIndex = 0; segmentIndex < boundaryList.length; segmentIndex++) {
        const boundary = boundaryList[segmentIndex];
        // Fill preceding unannotated region
        if (residueIndex < boundary.start) {
          residueIndex = boundary.start;
        }

        // Annotate each residue in domain range
        for (let i = boundary.start; i <= boundary.end; i++) {
          data.push({
            residueIndex: i,
            value: 'Domain',
            extraData: {
              ordinalLabel: this.getOrdinalLabel(i, boundary.start, boundary.end),
              domainName: datum.domain,
              source: datum.resource,
              segment: `${boundary.start}-${boundary.end}`,
              segmentIndex: segmentIndex + 1,
              chain: boundary.chain,
            },
          });
        }

        residueIndex = boundary.end + 1;
      }

      if (data.length > 0) {
        annotations.push({
          name: `Domain`,
          identifier: `pdbe-domains-${entryId}-${entityId}-${datum.domain}`,
          scaleType: 'ordinal',
          scaleDomain: ['Domain'],
          scaleRange: ['#D0DFBB'],
          rendering: 'Background',
          data,
        });
      }
    }

    return annotations;
  }

  getOrdinalLabel(current: number, start: number, end: number): string {
    const position = current - start + 1; // 1-based index within the segment
    const lastPosition = end - start + 1;
    const suffix = (n: number): string => {
      const last = n % 10;
      const lastTwo = n % 100;

      if (last === 1 && lastTwo !== 11) return 'st';
      if (last === 2 && lastTwo !== 12) return 'nd';
      if (last === 3 && lastTwo !== 13) return 'rd';
      return 'th';
    };
    if (position === lastPosition) return `${position}${suffix(position)} and last`;

    return `${position}${suffix(position)}`;
  }
}
