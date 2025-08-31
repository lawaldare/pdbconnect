import { AlternativeNumbering, SmartSequenceAnnotation, SmartSequenceAnnotationRenderingTypes } from './seq-viewer-models';

function onlyDigits(s: string) {
  for (let i = s.length - 1; i >= 0; i--) {
    const d = s.charCodeAt(i);
    if (d < 48 || d > 57) return false;
  }
  return true;
}

export function validateAlternativeNumberings(sequence: string, alternativeNumberings: AlternativeNumbering[], preValidate?: boolean) {
  const preVal: {
    valid: boolean;
    authOffset: string | undefined;
  } = {
    valid: false,
    authOffset: undefined,
  };
  const seqLength = sequence.length;
  for (const alternativeNumbering of alternativeNumberings) {
    for (const seq of alternativeNumbering.alternativeSequence) {
      const altLength = seq.length;
      if (seqLength !== altLength) {
        if (preValidate) return preVal;
        throw new Error(`${alternativeNumbering.numberingType} numbering has different length (${altLength}) from seq length (${seqLength})`);
      }
    }
    if (alternativeNumbering.identifier === 'auth') {
      if (alternativeNumbering.alternativeSequence.length > 1) {
        if (preValidate) return preVal;
        throw new Error(`Only a single Auth alternative sequence numbering is allowed`);
      }
      const seq = alternativeNumbering.alternativeSequence[0] as string[]; // auth should have single sequence
      const authIsNumeric = seq.every((num) => onlyDigits(num));
      if (authIsNumeric) {
        preVal.authOffset = `${parseInt(seq[0]) - 1}`;
      } else {
        preVal.authOffset = 'non-trivial';
      }
    }
  }
  preVal.valid = true;
  return preVal;
}

export function validateNonObserved(sequence: string, nonObserved: number[], preValidate?: boolean) {
  const seqLength = sequence.length;
  for (const num of nonObserved) {
    if (num < 1 || num > seqLength) {
      if (preValidate) return { valid: false };
      throw new Error(`Invalid non-observed resnum: ${num}`);
    }
  }
  return { valid: true };
}

export function validateAnnotations(annotations: SmartSequenceAnnotation[], preValidate?: boolean) {
  const identifiers = new Set<string>();
  const names = new Set<string>();
  const renderings = new Set<SmartSequenceAnnotationRenderingTypes>();

  for (const ann of annotations) {
    if (identifiers.has(ann.identifier)) {
      if (preValidate) return { valid: false };
      throw new Error(`Duplicate annotation identifier: ${ann.identifier}`);
    }
    if (names.has(ann.name)) {
      if (preValidate) return { valid: false };
      throw new Error(`Duplicate annotation name: ${ann.name}`);
    }
    if (renderings.has(ann.rendering)) {
      if (preValidate) return { valid: false };
      throw new Error(`Only one annotation per rendering type is allowed. Duplicate: ${ann.rendering}`);
    }

    identifiers.add(ann.identifier);
    names.add(ann.name);
    renderings.add(ann.rendering);
  }
  return { valid: true };
}
