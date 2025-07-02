import { SmartSequenceAnnotation, SmartSequenceAnnotationRenderingTypes } from './sequence-visualisation';
import { AlternativeNumbering } from './sequence-visualisation';

const AMINO_ACIDS = 'ACDEFGHIKLMNPQRSTVWY';
const CATEGORIES = ['low', 'medium', 'high'];
const COLORS = ['#87cefa', '#ffa500', '#ff4500'];

/**
 * Generate a random protein sequence using 20 standard amino acids.
 */
export function generateRandomSequence(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const aa = AMINO_ACIDS[Math.floor(Math.random() * AMINO_ACIDS.length)];
    result += aa;
  }
  return result;
}

/**
 * Generate a random SmartSequenceAnnotation object with fake data
 * using "Background" rendering style and "ordinal" scale.
 */
export function generateRandomAnnotations(
  annotationIdx: number,
  sequence: string,
  rendering: SmartSequenceAnnotationRenderingTypes,
  options?: { coverageProbability?: number; fullCoverage?: boolean }
): SmartSequenceAnnotation {
  const data = [];

  const probability = options?.fullCoverage ? 1 : options?.coverageProbability ?? Math.random() * 0.3 + 0.1; // 0.1–0.4

  for (let i = 0; i < sequence.length; i++) {
    // Randomly annotate probability of residues
    if (Math.random() < probability) {
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      data.push({
        residueIndex: i + 1, // 1-indexed
        value: category,
      });
    }
  }

  const annotation: SmartSequenceAnnotation = {
    name: `Generated Annotation ${annotationIdx}`,
    identifier: `gen_annotation_${annotationIdx}`,
    scaleType: 'ordinal',
    scaleDomain: CATEGORIES,
    scaleRange: COLORS,
    rendering,
    data,
  };

  return annotation;
}

function getRandomAuthIndex(i: number): string | number {
  const base = i + 1; // 1-indexed
  const random = Math.random();

  if (random < 0.7) {
    return base; // just number
  } else {
    const suffixes = ['A', 'B', 'C', 'U', 'X'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${base}${suffix}`;
  }
}

/**
 * Generate random alternative numbering for a given sequence.
 * @param sequence The protein sequence (1-indexed)
 * @param useAuth If true, assigns Auth numbering to all residues
 * @param useUniprot If true, assigns UniProt numbering to some residues (can have multiple per residue)
 */
export function generateRandomAlternativeNumberings(sequence: string, useAuth = true, useUniprot = false): AlternativeNumbering[] {
  const length = sequence.length;
  const result: AlternativeNumbering[] = [];

  if (useAuth) {
    const authNumbering: AlternativeNumbering = {
      numberingType: 'Auth',
      identifier: 'auth',
      alternativeSequence: Array.from({ length }, (_, i) => [getRandomAuthIndex(i)]),
    };
    result.push(authNumbering);
  }

  if (useUniprot) {
    const uniprotNumbering: AlternativeNumbering = {
      numberingType: 'UniProt',
      identifier: 'uniprot',
      alternativeSequence: [],
      extraIdentifiers: [],
    };

    const numMappings = Math.floor(Math.random() * 3) + 1; // 1 to 3 UniProt IDs
    const mappingData: {
      uniprotId: string;
      start: number;
      end: number;
      offset: number; // Start value of UniProt numbering
    }[] = [];

    for (let i = 0; i < numMappings; i++) {
      const uniprotId = `P${Math.floor(10000 + Math.random() * 89999)}`; // e.g. P12345
      const rangeLength = Math.floor(length * (Math.random() * 0.6 + 0.3)); // 30–90% of length
      const start = Math.floor(Math.random() * (length - rangeLength));
      const end = start + rangeLength;
      const offset = Math.floor(Math.random() * 50) + 1;

      mappingData.push({ uniprotId, start, end, offset });
    }

    // Initialize each residue's mapping array
    for (let i = 0; i < length; i++) {
      const altNums: Array<string | number> = [];
      const ids: string[] = [];

      for (const map of mappingData) {
        if (i >= map.start && i < map.end) {
          altNums.push(map.offset + (i - map.start));
          ids.push(map.uniprotId);
        }
      }

      uniprotNumbering.alternativeSequence.push(altNums);
      uniprotNumbering.extraIdentifiers!.push(ids);
    }

    result.push(uniprotNumbering);
  }

  return result;
}
