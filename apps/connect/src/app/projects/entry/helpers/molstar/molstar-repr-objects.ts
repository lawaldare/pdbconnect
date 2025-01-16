import { Color } from 'molstar/lib/mol-util/color';

/**
 * This file contains pre defined representations for different molecule types
 * in Molstar that are used in different detail tabs (bottom of the page)
 */

// For tabs:
// DOMAINS, LIGANDS (when modification), MACROMOLECULES
export const REPR_NONSELECTION_POLYMER = {
  type: 'cartoon',
  color: 'uniform',
  colorParams: { value: Color(0xfefefe) },
  typeParams: { alpha: 0.65 },
};

// For tabs:
// DOMAINS, MACROMOLECULES
export const REPR_NONSELECTION_LIGAND = {
  type: 'ball-and-stick',
  color: 'uniform',
  colorParams: { value: Color(0xfefefe) },
  typeParams: { alpha: 0.65 },
};

// For tabs:
// DOMAINS, MACROMOLECULES
export const REPR_NONSELECTION_BRANCHED = {
  type: 'carbohydrate',
  colorParams: { name: 'carbohydrate-symbol' },
  typeParams: { alpha: 0.65 },
};

// For tabs:
// DOMAINS, MACROMOLECULES (when macromolecule is not a carbohydrate)
export const PROTEIN_REPR_SELECTION = {
  type: 'cartoon',
  color: 'uniform',
  colorParams: { value: Color(0x82a74f) },
  typeParams: { alpha: 1 },
};

// (Not currently used)
export const LIGANDS_REPR_NONSELECTION_LIGAND = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  //colorParams: { carbonColor: { name: 'entity-id', params: {} } }
  colorParams: { carbonColor: { name: 'uniform', params: { value: Color(0xfefefe) } } },
};

// For tabs:
// LIGANDS & ENV
export const LIGANDS_REPR_SELECTION = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  colorParams: { carbonColor: { name: 'entity-id', params: {} } },
};

// For tabs:
// LIGANDS & ENV
export const LIGANDS_REPR_HIGHLIGHT = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  colorParams: { carbonColor: { name: 'entity-id', params: {} } },
  // colorParams: { carbonColor: { name: 'uniform', params: { value: Color(0xFEFEFE) } } },
  typeParams: {
    sizeFactor: 0.22,
    // sizeAspectRatio: 0.73,
    sizeAspectRatio: 0.95,
    adjustCylinderLength: true,
    xrayShaded: true,
    aromaticBonds: false,
    multipleBonds: 'off',
    excludeTypes: ['hydrogen-bond', 'metal-coordination'],
  },
};

// For tabs:
// LIGANDS & ENV
export const LIGANDS_REPR_NONSELECTION_POLYMER = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  colorParams: {
    carbonColor: {
      // name: 'entity-id',
      // params: {
      //   palette: whiteColorPalette
      // }
      name: 'uniform',
      params: {
        value: Color(0xfefefe),
      },
    },
  },
  typeParams: { alpha: 0.65 },
};

// For tabs:
// MACROMOLECULES (when macromolecule is a carbohydrate)
export const MACROMOLECULES_REPR_SELECTION_CARB = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  colorParams: { carbonColor: { name: 'uniform', params: { value: Color(0x82a74f) } } },
  typeParams: { alpha: 1 },
};
