export interface WwPdbInfo {
  defined_at: string;
  modified: string;
  modification_flag: string;
  polymer_type: string;
  standard_parent: string | undefined;
}

export interface FunctionalAnnotation {
  name: string;
  description: string;
  url: string;
}

export interface CrossLink {
  resource: string;
  resource_id: string;
}

export interface Synonym {
  origin: string;
  value: string;
}

export interface PhysChemProperties {
  crippen_mr: number;
  num_atom_stereo_centers: number;
  crippen_clog_p: number;
  num_rings: number;
  num_rotatable_bonds: number;
  num_heteroatoms: number;
  fraction_csp3: number;
  num_aromatic_rings: number;
  exactmw: number;
  num_spiro_atoms: number;
  num_heavy_atoms: number;
  num_aliphatic_rings: number;
  num_hbd: number;
  num_saturated_heterocycles: number;
  tpsa: number;
  num_bridgehead_atoms: number;
  num_aromatic_heterocycles: number;
  labute_asa: number;
  num_hba: number;
  num_amide_bonds: number;
  num_saturated_rings: number;
  lipinski_hba: number;
  num_unspec_atom_stereo_centers: number;
  lipinski_hbd: number;
  num_heterocycles: number;
  num_aliphatic_heterocycles: number;
}

export interface LigandProperty {
  name: string;
  value: string;
  toolTip?: string;
}

export interface LigandSummary {
  name: string;
  release_status: string;
  formula: string;
  inchi: string;
  inchi_key: string;
  smiles: { program: string; version: string; name: string }[];
  ww_pdb_info: WwPdbInfo;
  functional_annotations: FunctionalAnnotation[];
  cross_links: CrossLink[];
  synonyms: Synonym[];
  phys_chem_properties: PhysChemProperties;
  superseded_by: string | undefined;
  subcomponent_occurrences: Record<string, number>;
  weight: number;
}
