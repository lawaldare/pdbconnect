import { AlternativeNumbering } from './seq-viewer-models';

export function getResidueNameFromCode(code: string): string {
  const map: { [key: string]: string } = {
    A: 'Ala',
    R: 'Arg',
    N: 'Asn',
    D: 'Asp',
    C: 'Cys',
    Q: 'Gln',
    E: 'Glu',
    G: 'Gly',
    H: 'His',
    I: 'Ile',
    L: 'Leu',
    K: 'Lys',
    M: 'Met',
    F: 'Phe',
    P: 'Pro',
    S: 'Ser',
    T: 'Thr',
    W: 'Trp',
    Y: 'Tyr',
    V: 'Val',
  };
  return map[code.toUpperCase()] || code;
}

export function getAltNumber(residueIndex: number, altType: 'auth' | 'uniprot', alternativeNumberings?: AlternativeNumbering[]) {
  if (!alternativeNumberings) return `${residueIndex}`;
  for (const alternativeNumbering of alternativeNumberings) {
    if (alternativeNumbering.identifier === altType) {
      // only getting numbering from first alt sequence
      return `${alternativeNumbering.alternativeSequence[0][residueIndex - 1]}`;
    }
  }
  return `${residueIndex}`;
}
