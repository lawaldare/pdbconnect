/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface ModResidueDetail {
  /**
   * PDB chain id.
   */
  chain_id: string;
  /**
   * Residue number (in PDB-style residue addressing scheme).
   */
  author_residue_number: number;
  /**
   * Author residue insertion code
   */
  author_insertion_code: string;
  /**
   * Chemical component identifier.
   */
  chem_comp_id: string;
  /**
   * Number of alternate conformers modelled for this residue.
   */
  alternate_conformers: number;
  /**
   * Entity id (molecule number in mmcif-speak).
   */
  entity_id: number;
  /**
   * struct_asym_id (chain id in mmcif-speak).
   */
  struct_asym_id: string;
  /**
   * mmcif-style residue index (within entity or struct_asym_id).
   */
  residue_number: number;
  /**
   * A name for the hetcode
   */
  chem_comp_name: string;
  /**
   * The description of the chain.
   */
  description: string;
  /**
   * The formula weight of the chain.
   */
  weight: number;
}
export interface PDBEntryModifiedAAorNA {
  [key: string]: ModResidueDetail[];
}
