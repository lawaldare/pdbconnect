import { SmartSequenceAnnotation } from '@pdbe-lib/smart-seq-viewer';
import { ResidueWiseOutliersMolecule } from '../data-models/residuewise-outliers.model';
import { OUTLIER_TYPE_LABELS } from '../entry-constant';
import { ResidueListed } from '../data-models/residue-listing.model';
import { AlternativeNumbering } from '@pdbe-lib/smart-seq-viewer';

export function convertOutliersToSmartSequenceAnnotation(
  sequence: string,
  entityId: number,
  chainId: string,
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
