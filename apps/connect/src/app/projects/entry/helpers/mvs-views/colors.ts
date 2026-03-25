import { type ColorT } from 'molstar/lib/extensions/mvs/tree/mvs/param-types';

const SET1: ColorT[] = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf']; // Excluding the last color (gray)
const SET2: ColorT[] = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494']; // Excluding the last color (gray)
const DARK2: ColorT[] = ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d']; // Excluding the last color (gray)
const SET1_SAFE: ColorT[] = ['#4daf4a', '#984ea3', '#ff7f00', '#a65628', '#f781bf']; // Excluding colors that conflict with element coloring (red oxygen, blue nitrogen, yellow sulfur)
const SET2_SAFE: ColorT[] = ['#e5c494', '#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854']; // Excluding colors that conflict with element coloring (red oxygen, blue nitrogen, yellow sulfur)
const VIVID: ColorT[] = ['#e58606', '#5d69b1', '#52bca3', '#99c945', '#cc61b0', '#24796c', '#daa51b', '#764e9f', '#ed645a']; // Discard the last color (gray) and #2f8ac4 blue (too similir to the blue in Set1)
const BOLD: ColorT[] = ['#7f3c8d', '#11a579', '#3969ac', '#f2b701', '#e73f74', '#80ba5a', '#e68310', '#008695', '#cf1c90', '#f97b72']; // Discard the last color (gray)
const PASTEL: ColorT[] = ['#66c5cc', '#f6cf71', '#f89c74', '#dcb0f2', '#87c55f', '#9eb9f3', '#fe88b1', '#c9db74', '#8be0a4', '#b497e7']; // Discard the last color (gray)

/** A set of non-gray colors starting with relatively decent colors, for polymer entities */
export const ENTITY_COLORS = [...DARK2, ...BOLD, ...PASTEL, ...SET2_SAFE];

/** A set of non-gray colors starting with pastel colors, for ligands (same as for polymers but drawn from the end) */
export const LIGAND_COLORS = ENTITY_COLORS.slice().reverse();

/** A set of non-gray colors starting with brighter colors, for highlighting domains */
export const ANNOTATION_COLORS = [...SET1, ...VIVID];

/** A set of non-gray colors starting with brighter colors, for modified residues (same as for domains but drawn from the end) */
export const MODRES_COLORS = ANNOTATION_COLORS.slice().reverse();

/** Color for water entity */
export const WATER_COLOR = '#ff0d0d';

/** Color for entities if not specified otherwise */
export const DEFAULT_ENTITY_COLOR = '#808080';

export const VALIDATION_COLORS = {
  NOT_APPLICABLE: '#808080', // not applicable
  0: '#ffffff', // 0 issues (PDBconnect currently uses #d4d5d4)
  1: '#e5e501', // 1 issues
  2: '#da6e03', // 2 issues
  3: '#b2182b', // 3 or more issues
  HAS_ISSUE: '#b2182b',
} as const;

export const ATOM_INTERACTION_COLORS: Record<string, ColorT> = {
  AMIDERING: 'red',
  CARBONPI: 'magenta',
  DONORPI: 'magenta',
  carbonyl: '#ffffff',
  covalent: '#ffffff',
  hbond: '#00ffff',
  hydrophobic: 'yellow',
  metal_complex: '#00ff00',
  polar: '#0000ff',
  vdw: '#ffffff',
  vdw_clash: 'red',
  weak_hbond: '#00aaaa',
  weak_polar: '#0000aa',

  _DEFAULT_: 'gray',
  _MIXED_: 'gray',
  // TODO collect all possible values and decide on colors, this is non-exhaustive list with random colors
} as const;

/** For all the selected chains in Text Annotation view */
export const CHAIN_ANNOTATED_COLOR = '#d0dfbb';

/** For all annotated residues in Text Annotation view */
export const RESIDUE_ANNOTATED_COLOR = '#4E81C3';

/** For highlighted residue in Text Annotation view */
export const RESIDUE_HIGHLIGHT_COLOR = '#ff8800';
// export const RESIDUE_HIGHLIGHT_COLOR = RESIDUE_ANNOTATED_COLOR;

/** Iterate over the elements of `values` in a cycle (forever). */
export function* cycleIterator<T>(values: T[]) {
  let counter = 0;
  while (true) {
    yield values[counter];
    counter = (counter + 1) % values.length;
  }
}
