/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface CofactorModel {
  /**
   * A list of enzyme classes (ECs), where cofactors of this class play a biological role.
   */
  EC: string[];
  /**
   * A list of het codes annotated as members of the cofactor class.
   */
  cofactors: string[];
}
export interface CofactorRoot {}
export interface CrossLink {
  /**
   * The external resource name.
   */
  resource: string;
  /**
   * The external resource id.
   */
  resource_id: string;
}
export interface FunctionalAnnotation {
  /**
   * Name of the functional annotation.
   */
  name: string;
  /**
   * Description for the functional annotation.
   */
  description: string;
  /**
   * URL for the fucntional annotation.
   */
  url: string;
}
export interface Model {
  /**
   * The name of the chemical component.
   */
  name: string;
  /**
   * A flag denoting if the hetcode is released or not.
   */
  released: boolean;
  /**
   * The chemical formula of the component.
   */
  formula: string;
  /**
   * The full INCHI of the component.
   */
  inchi: string;
  /**
   * INCHI key of the component.
   */
  inchi_key: string;
  /**
   * The SMILES representation of the component (could be multiple).
   */
  smiles: string;
  /**
   * An info object which provides details of the chemical component from wwPDB.
   */
  ww_pdb_info: WwPdbInfo;
  /**
   * A list of functional annotations for the chemical component.
   */
  functional_annotations: FunctionalAnnotation[];
  /**
   * Cross references for this chemical component from other resources.
   */
  cross_links: CrossLink[];
  /**
   * A list of synomyms for the chemical component from other sources.
   */
  synonyms: Synonym[];
  /**
   * An object of physical chemical properties.
   */
  phys_chem_properties: PhysChemProperties;
  /**
   * A hetcode which superseeds the hetcode in query.
   */
  superseded_by: string;
}
export interface WwPdbInfo {
  /**
   * The date the chemical component was defined in wwPDB.
   */
  defined_at: string;
  /**
   * The modified date of the chemical component in wwPDB.
   */
  modified: string;
  /**
   * Y/N denoting the modification status of the chemical component in wwPDB.
   */
  modification_flag: string;
  /**
   * This flag denotes if the chemical component is a polymer or non-polymer in wwPDB.
   */
  polymer_type: string;
  /**
   * The standard chemical component defined in wwPDB.
   */
  standard_parent: string;
}
export interface Synonym {
  /**
   * The resource which provides synonym for the chemical component.
   */
  origin: string;
  /**
   * The synonym provided by the resource.
   */
  value: string;
}
export interface PhysChemProperties {
  /**
   * Wildman-Crippen molar refractivity is a common descriptor accounting for molecular size and polarizability.
   */
  crippen_mr: number;
  /**
   * Number of atoms with four attachments different from each other.
   */
  num_atom_stereo_centers: number;
  /**
   * Octanol/Water partition coeficient predicted using Wildman-Crippen method.
   */
  crippen_clog_p: number;
  /**
   * Number of rings.
   */
  num_rings: number;
  /**
   * Number of single bonds, not part of a ring bound to a nonterminal heavy atom.
   */
  num_rotatable_bonds: number;
  /**
   * Number of non oxygen and non carbon atoms.
   */
  num_heteroatoms: number;
  /**
   * Fraction of C atoms that are SP3 hybridized.
   */
  fraction_csp3: number;
  /**
   * Number of aromatic rings for the molecule.
   */
  num_aromatic_rings: number;
  /**
   * Total mass of the molecule.
   */
  exactmw: number;
  /**
   * Atoms shared between rings that share exactly one atom.
   */
  num_spiro_atoms: number;
  /**
   * Number of non hydrogen atoms.
   */
  num_heavy_atoms: number;
  /**
   * Number of aliphatic rings.
   */
  num_aliphatic_rings: number;
  /**
   * Number of hydrogen bond donors.
   */
  num_hbd: number;
  /**
   * Number of saturated heterocycles.
   */
  num_saturated_heterocycles: number;
  /**
   * Topological surface area.
   */
  tpsa: number;
  /**
   * Number of atoms shared between rings that share at least two bonds.
   */
  num_bridgehead_atoms: number;
  /**
   * Number or aromatic rings with at least two different elements.
   */
  num_aromatic_heterocycles: number;
  /**
   * Accessible surface area accorging to the Labute' definition.
   */
  labute_asa: number;
  /**
   * Number of hydrogen bond acceptors.
   */
  num_hba: number;
  /**
   * Number of amide bonds.
   */
  num_amide_bonds: number;
  /**
   * Number of saturated rings.
   */
  num_saturated_rings: number;
  /**
   * Number of hydrogen bond acceptors according to Lipinsky definition.
   */
  lipinski_hba: number;
  /**
   * Number of unsuspected stereocenters.
   */
  num_unspec_atom_stereo_centers: number;
  /**
   * Number of hydrogen bond donors according to Lipinsky definition.
   */
  lipinski_hbd: number;
  /**
   * Number or rings with at least two different elements.
   */
  num_heterocycles: number;
  /**
   * Number of aliphatic heterocycles.
   */
  num_aliphatic_heterocycles: number;
}
export interface PDBCompoundSummary {
  [key: string]: Model[];
}
