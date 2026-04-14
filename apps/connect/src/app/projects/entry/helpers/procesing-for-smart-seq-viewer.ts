import { SmartSequenceAnnotation } from '@pdbe-lib/smart-seq-viewer';
import { ResidueWiseOutliersMolecule } from '../data-models/residuewise-outliers.model';
import { DEFAULT_DOMAIN_HIGHLIGHT_COLOR, OUTLIER_TYPE_LABELS } from '../entry-constant';
import { ResidueListed } from '../data-models/residue-listing.model';
import { AlternativeNumbering } from '@pdbe-lib/smart-seq-viewer';
import { ProcessedDomain } from '../store/data-processing/models/processed-entities.model';
import { LLMAnnotation } from '../data-models/llm-model';

export function convertOutliersToSmartSequenceAnnotation(
  sequence: string,
  entityId: number,
  chainId: string,
  modelId = '1',
  outliers?: ResidueWiseOutliersMolecule[]
): SmartSequenceAnnotation | undefined {
  if (!outliers) return undefined;
  const residueOutlierMap = new Map<number, Set<string>>();

  // Traverse and collect outlier types by residue index
  for (const molecule of outliers) {
    if (molecule.entity_id !== entityId) continue;

    for (const chain of molecule.chains) {
      if (chain.chain_id !== chainId) continue;

      for (const model of chain.models) {
        if (model.model_id !== parseInt(modelId)) continue;

        for (const residue of model.residues) {
          const index = residue.residue_number; // 1-indexed like the sequence
          if (!residueOutlierMap.has(index)) {
            residueOutlierMap.set(index, new Set());
          }
          for (const outlier of residue.outlier_types) {
            residueOutlierMap.get(index)!.add(outlier);
          }
        }
      }
    }
  }

  // Convert to SmartSequenceAnnotation.data
  const annotationData: SmartSequenceAnnotation['data'] = [];

  for (let i = 0; i < sequence.length; i++) {
    const residueIndex = i + 1; // 1-indexed
    const outliers = residueOutlierMap.get(residueIndex);
    const outliersList = outliers ? [...outliers] : [];

    let category: string;

    const count = outliers?.size ?? 0;
    if (count === 0) {
      category = '0 outliers';
    } else if (count === 1) {
      category = '1 outlier';
    } else if (count === 2) {
      category = '2 outliers';
    } else {
      category = '3 or more outliers';
    }

    annotationData.push({
      residueIndex,
      value: category,
      extraData: { outlierTypes: outliersList.map((outlier) => OUTLIER_TYPE_LABELS[outlier]) },
    });
  }

  return {
    name: 'Validation',
    identifier: 'pdbe-validation',
    scaleType: 'ordinal',
    scaleDomain: ['0 outliers', '1 outlier', '2 outliers', '3 or more outliers'],
    scaleRange: ['#D4D5D4', '#E5E501', '#DA6E03', '#B2182B'], // optional: white → yellow → orange → red
    rendering: 'Background',
    data: annotationData,
  };
}

export function createAuthAlternateNumbering(residueList: ResidueListed[]): AlternativeNumbering {
  const authResidueList = residueList.map((eachResidue) => `${eachResidue.author_residue_number}${eachResidue.author_insertion_code.replace(' ', '')}`);
  return {
    numberingType: 'Auth',
    identifier: 'auth',
    alternativeSequence: [authResidueList],
  };
}

export function getNonObserved(residueList: ResidueListed[]): number[] {
  const nonObservedResidues = residueList.filter((eachResidue) => eachResidue.observed_ratio < 1).map((eachResidue) => eachResidue.residue_number);

  return nonObservedResidues;
}

export function generateSeqViewerDomainAnnotation(entryId: string, datum: ProcessedDomain, chainId: string): SmartSequenceAnnotation | undefined {
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
          ordinalLabel: getOrdinalLabel(i, boundary.start, boundary.end),
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
      scaleRange: [DEFAULT_DOMAIN_HIGHLIGHT_COLOR],
      rendering: 'Background',
      data,
    };
  }
  return undefined;
}

function getOrdinalLabel(current: number, start: number, end: number): string {
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

export function getCircleAnnotationsForSeqViewer(groupedLLMAnnotations: LLMAnnotation[]): SmartSequenceAnnotation {
  // Sort by pdbResidue ascending
  const llmAnnotationDataForSeqViewer = groupedLLMAnnotations
    .slice() // avoid mutating original
    .sort((a, b) => a.pdbResidue - b.pdbResidue)
    .filter((annotation, index, self) => index === self.findIndex((a) => a.pdbResidue === annotation.pdbResidue))
    // .map((resid) => resid.authorResidueNumber);
    .map((annotation) => {
      const annotationsForResidue = groupedLLMAnnotations.filter((eachAnnotation) => eachAnnotation.pdbResidue === annotation.pdbResidue);
      const annotationsForResidueNoDup = removeDuplicatesByKey(annotationsForResidue, 'sentence');
      return {
        residueIndex: annotation.pdbResidue,
        value: 'has annotation',
        extraData: annotationsForResidueNoDup,
      };
    });

  return {
    name: 'Text Annotation (AI)',
    identifier: 'pdbe-llm-annotation',
    scaleType: 'ordinal',
    scaleDomain: ['has annotation'],
    scaleRange: ['#4E81C3'],
    rendering: 'CircleAbove',
    data: llmAnnotationDataForSeqViewer,
  };
}

export function removeDuplicatesByKey(array: any[], key: string): any[] {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
}
