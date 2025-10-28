/**
 * Generates a complete AlphaMissense-style dataset for a given protein sequence.
 * Each residue will have 20 variants (A–Y), including the reference amino acid (category 'wt').
 *
 * @param sequence - Protein sequence (e.g. "MKTAYIAKQRQISFVKSHFSRQDIL")
 */
export function generateExampleAFMissense(sequence: string) {
  const aminoAcids = 'ACDEFGHIKLMNPQRSTVWY'.split('');
  const data: any[] = [];

  for (let i = 0; i < sequence.length; i++) {
    const ref = sequence[i];

    for (const variant of aminoAcids) {
      const isWT = variant === ref;

      const score = isWT ? -1 : parseFloat(Math.random().toFixed(4));
      const category = isWT ? 'wt' : score > 0.5 ? 'LPath' : 'LBen';

      data.push({
        score,
        start: i + 1,
        referenceVariant: ref,
        variant,
        category,
        xValue: i + 1,
        yValue: variant,
      });
    }
  }

  return data;
}
