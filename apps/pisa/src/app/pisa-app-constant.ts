export const pisaUploadpageTooltips = {
  cellParameter: 'Crystallographic data found in the uploaded structure: Cell dimensions (A, B, C) and angles (Alpha, Beta, Gamma).',
  spaceSymmetryGroup: 'The CCP4-notation space symmetry group, fetched from the uploaded file.',
  othogonalisationCode: 'Used to transform the potentially non-Cartesian coordinate space from the asymmetric unit into standard Cartesian orthogonal axes.',
  processLigands: 'Specifies which ligands should be taken into consideration for multimeric state analysis. Unchecking a ligand removes it from analysis.',
  processLigandPosition:
    'Controls how ligands are taken into account in PISA calculations: “free”, consider ligands as dissociable; “fixed”, hold ligands to their macromolecular surface; and “auto”, let PISA empirically decide between “fixed” or “free” per ligand.',
  includeInAnalysis:
    'Controls whether both complexes are predicted from the crystallographic unit cell, along with calculating interface information, or just interface information',
};
