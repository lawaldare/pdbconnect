import { Injectable } from '@angular/core';
import { DomainsBoundaries, DomainsRowData, MacromoleculesRowData } from '../../data-classes/data-models-and-definitions/row-and-table.model';
import { Molecule } from '../../data-models/molecule.model';
import { SmartSequenceAnnotation } from '@pdbe-lib/smart-seq-viewer';
import { SequenceDetail } from '../../data-classes/data-models-and-definitions/other-models';

@Injectable({
  providedIn: 'root',
})
export class DomainsFacade {
  public getDomainSequenceDetails(entryId: string, macromoleculesOfDomain: MacromoleculesRowData[], datum: DomainsRowData, chainId: string): SequenceDetail[] {
    const sequenceDetails: SequenceDetail[] = [];

    const macromoleculesOfDomainForChain = macromoleculesOfDomain.filter((mm) => mm.additionalData.molecule.in_chains.indexOf(chainId) > -1);
    if (macromoleculesOfDomainForChain.length > 1) {
      const allEntityIds = macromoleculesOfDomainForChain.map((mm) => mm.additionalData.molecule.entity_id).join("', '");
      console.warn(`Multiple entity_id's (${allEntityIds}) mapped to this ${datum.domain}`);
    }

    const macromolecule = macromoleculesOfDomainForChain[0];
    const moleculeName = macromolecule.name.molecule;

    const boundariesForDomain = datum.additionalData.boundaries;
    const boundariesForChainId = boundariesForDomain.filter((boundary) => boundary.chain === chainId);
    if (boundariesForChainId.length === 0) return [];
    const segmentsStringsForDomains = datum.additionalData.segmentsResidNumbers;
    const segmentsStringsForChainId = segmentsStringsForDomains.filter((segment) => segment[0] === chainId);

    const segmentsForDomains = datum.segments;
    const segmentsForChainId = segmentsForDomains.filter((_segment, i) => boundariesForDomain[i].chain === chainId);
    const segmentsForOtherChains = segmentsForDomains.filter((_segment, i) => boundariesForDomain[i].chain !== chainId);

    const domainDescription = `${datum.resource} domain: ${datum.domain}; Segments: ${segmentsStringsForChainId.join(', ')} (Auth: ${segmentsForChainId.join(', ')})`;
    const otherChains = segmentsForOtherChains.length > 0 ? `; Other auth segments: ${segmentsForOtherChains.join(', ')})` : '';

    const sequenceDetail: SequenceDetail = {
      title: `>FASTA pdb|${entryId}|${moleculeName}; Chain ${chainId}; ${domainDescription}${otherChains}`,
      fullSequence: macromolecule.additionalData.molecule.sequence,
      segments: [],
    };

    let currentCharIndex = 0;
    boundariesForChainId.forEach((boundary) => {
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
    return sequenceDetails;
  }

  public generateSeqViewerDomainAnnotation(entryId: string, datum: DomainsRowData, chainId: string): SmartSequenceAnnotation | undefined {
    const boundariesForChainId = datum.additionalData.boundaries.filter((boundary) => boundary.chain === chainId);
    if (boundariesForChainId.length === 0) return undefined;

    const data: SmartSequenceAnnotation['data'] = [];
    let residueIndex = 1;

    for (let segmentIndex = 0; segmentIndex < boundariesForChainId.length; segmentIndex++) {
      const boundary = boundariesForChainId[segmentIndex];
      // Fill preceding unannotated region
      if (residueIndex < boundary.start) {
        residueIndex = boundary.start;
      }
      // Annotate each residue in domain range
      for (let i = boundary.start; i <= boundary.end; i++) {
        // if (boundary.chain !== chainId) continue;
        data.push({
          residueIndex: i,
          value: `${datum.resource} domain ${datum.domain} (${datum.accessionName} (${datum.additionalData.accession} - ${datum.accessionName})`,
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
      return {
        name: `Domain`,
        identifier: `pdbe-domains-${entryId}-${chainId}-${datum.domain}`,
        scaleType: 'ordinal',
        scaleDomain: [`${datum.resource} domain ${datum.domain} (${datum.additionalData.accession} - ${datum.accessionName})`],
        scaleRange: ['#D0DFBB'],
        rendering: 'Background',
        data,
      };
    }
    return undefined;
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
