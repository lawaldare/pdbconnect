import { guessMissingSymmetryInstanceId, splitOnce } from './misc';

describe('splitOnce', () => {
  it(`splitOnce`, () => {
    expect(splitOnce('A', '-')).toEqual(['A', undefined]);
    expect(splitOnce('A-B', '-')).toEqual(['A', 'B']);
    expect(splitOnce('A-B-C', '-')).toEqual(['A', 'B-C']);
  });
});

describe('ASM-guessMissingAsmSuffix', () => {
  it(`guessMissingAsmSuffix complete fabulation`, () => {
    expect(guessMissingSymmetryInstanceId([])).toEqual('ASM-1');
  });

  it(`guessMissingAsmSuffix order-1`, () => {
    expect(guessMissingSymmetryInstanceId(['ASM-2', 'ASM-3', 'ASM-4'])).toEqual('ASM-1');

    expect(guessMissingSymmetryInstanceId(['ASM-1', 'ASM-3', 'ASM-5'])).toEqual('ASM-1'); // This is suboptimal, but whatever. This case will hopefully never occur.
  });

  it(`guessMissingAsmSuffix order-2`, () => {
    expect(guessMissingSymmetryInstanceId(['ASM-1-6', 'ASM-2-5', 'ASM-2-6', 'ASM-3-5', 'ASM-3-6', 'ASM-4-5', 'ASM-4-6'])).toEqual('ASM-1-5');

    // First position degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-X0-2', 'ASM-X0-3'])).toEqual('ASM-X0-1');

    // Second position degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-2-X0', 'ASM-3-X0'])).toEqual('ASM-1-X0');

    // Both positions degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-2-X0'])).toEqual('ASM-1-X0'); // Total guesswork, could be 'ASM-2-1' as well
  });

  it(`guessMissingAsmSuffix order-3`, () => {
    expect(
      guessMissingSymmetryInstanceId([
        'ASM-A-1-6',
        'ASM-A-2-5',
        'ASM-A-2-6',
        'ASM-A-3-5',
        'ASM-A-3-6',
        'ASM-A-4-5',
        'ASM-A-4-6',
        'ASM-B-1-5',
        'ASM-B-1-6',
        'ASM-B-2-5',
        'ASM-B-2-6',
        'ASM-B-3-5',
        'ASM-B-3-6',
        'ASM-B-4-5',
        'ASM-B-4-6',
        'ASM-C-1-5',
        'ASM-C-1-6',
        'ASM-C-2-5',
        'ASM-C-2-6',
        'ASM-C-3-5',
        'ASM-C-3-6',
        'ASM-C-4-5',
        'ASM-C-4-6',
      ])
    ).toEqual('ASM-A-1-5');

    // First position degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-A-2-11', 'ASM-A-3-11', 'ASM-A-1-12', 'ASM-A-2-12', 'ASM-A-3-12'])).toEqual('ASM-A-1-11');

    // First and second position degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-A-2-11', 'ASM-A-2-12'])).toEqual('ASM-A-2-1');

    // First and third position degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-A-2-11', 'ASM-A-3-11'])).toEqual('ASM-A-1-11');

    // Second and third position degenerate
    expect(guessMissingSymmetryInstanceId(['ASM-A-2-11', 'ASM-B-2-11'])).toEqual('ASM-1-2-11');
  });
});
