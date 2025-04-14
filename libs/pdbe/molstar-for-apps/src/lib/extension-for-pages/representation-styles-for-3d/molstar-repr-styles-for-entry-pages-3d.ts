import { Color } from 'molstar/lib/mol-util/color';

/**
 * This file contains pre defined representations for different molecule types
 * in Molstar that are used in different detail tabs (bottom of the page)
 */

/**
 * Used in Summary view component for selected Macromolecules, Domains
 */
export const SELECTED_REPR_COL_BY_ENTITY = {
  type: 'cartoon',
  color: 'entity-id',
  colorParams: { overrideWater: true },
  typeParams: { alpha: 1 },
};

/**
 * Used in Model quality tab for ...
 */

/**
 * Used in Macromolecules, Ligands (modifications only) and Domains tabs to style the non selected
 * molecules
 */
export const REPR_NONSELECTION_POLYMER = {
  type: 'cartoon',
  color: 'uniform',
  colorParams: { value: Color(0xfefefe) },
  typeParams: { alpha: 0.65 },
};

/**
 * Used in Macromolecules and Domains tabs to style ligands
 */
export const REPR_NONSELECTION_LIGAND = {
  type: 'ball-and-stick',
  color: 'uniform',
  colorParams: { value: Color(0xfefefe) },
  typeParams: { alpha: 0.65 },
};

/**
 * Used in Macromolecules and Domains tabs to style carbohydrate macromolecules
 */
export const REPR_NONSELECTION_BRANCHED = {
  type: 'carbohydrate',
  colorParams: { name: 'carbohydrate-symbol' },
  typeParams: { alpha: 0.65 },
};

/**
 * Used in Macromolecules and Domains tabs to style non-carbohydrate macromolecules
 */
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

/**
 * Used in Ligands and Environments tab to style ligand
 */
export const LIGANDS_REPR_SELECTION = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  colorParams: { carbonColor: { name: 'entity-id', params: {} } },
};

/**
 * Used in Ligands and Environments tab to style semi transparent highlight around ligand
 */
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

/**
 * Used in Ligands and Environments tab to style interacting residues
 */
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

/**
 * Used in Macromolecules tab when carbohydrate macromolecule is selected
 */
export const MACROMOLECULES_REPR_SELECTION_CARB = {
  type: 'ball-and-stick',
  color: 'element-symbol',
  colorParams: { carbonColor: { name: 'uniform', params: { value: Color(0x82a74f) } } },
  typeParams: { alpha: 1 },
};
