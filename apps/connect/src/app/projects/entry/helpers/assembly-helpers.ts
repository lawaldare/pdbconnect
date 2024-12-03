import { ComplexParticipant } from '../data-models/complex-details.model';

export type MULTIMER_MAPPING_KEYS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export const MULTIMER_MAPPING = {
  // see http://en.wikipedia.org/wiki/IUPAC_numerical_multiplier
  1: 'monomer',
  2: 'dimer',
  3: 'trimer',
  4: 'tetramer',
  5: 'pentamer',
  6: 'hexamer',
  7: 'heptamer',
  8: 'octamer',
  9: 'nonamer',
  10: 'decamer',
  11: 'undecamer',
  12: 'dodecamer',
  13: 'tridecamer',
  14: 'tetradecamer',
  15: 'pentadecamer',
  16: 'hexadecamer',
  17: 'heptadecamer',
  18: 'octadecamer',
  19: 'nonadecamer',
  20: 'icosamer',
};

export function calculateAssemblyComposition(participants: ComplexParticipant[]) {
  const participantTypes: string[] = [];
  let mericityTotal = 0;
  for (const participant of participants) {
    if (participantTypes.indexOf(participant.accession) === -1) {
      participantTypes.push(participant.accession);
      mericityTotal += participant.stoichiometry;
    }
  }

  let compositionPrefix = 'homo ';
  if (participantTypes.length > 1) {
    compositionPrefix = 'hetero ';
  }
  let compositionSuffix = `${mericityTotal}-mer`;
  if (mericityTotal <= 20) {
    compositionSuffix = MULTIMER_MAPPING[mericityTotal as MULTIMER_MAPPING_KEYS];
  }
  let composition = `${compositionPrefix}${compositionSuffix}`;
  if (composition === 'homo monomer') {
    composition = 'monomeric';
  }
  return composition;
}
