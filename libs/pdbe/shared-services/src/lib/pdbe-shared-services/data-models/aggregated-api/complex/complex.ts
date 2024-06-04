/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface Assembly {
  /**
   * 4-character PDB id code.
   */
  pdb_id?: string;
  /**
   * Numerical assembly id code
   */
  assembly_id: number;
  /**
   * The smallest assembly containing all polymeric entities
   */
  preferred_assembly: boolean;
}
export interface PDBComplex {
  /**
   * The name of the assembly
   */
  name?: string;
  /**
   * PDB Complex ID
   */
  pdb_complex_id?: string;
  /**
   * Complex Portal ID
   */
  complex_portal_id?: string;
  /**
   * Accession & stoichiometry of each unique component in the assembly
   */
  participants: Participant[];
  assemblies: Assembly[];
  /**
   * PDB Complex IDs of the subcomplexes
   */
  subcomplexes: string[];
  /**
   * PDB Complex IDs of the supercomplexes
   */
  supercomplexes: string[];
}
export interface Participant {
  /**
   * UniProt or Rfam accession
   */
  accession: string;
  /**
   * Assembly component stoichiometry of the given accession
   */
  stoichiometry: number;
}

/**
 * Fixed manually
 */
export interface PDBComplexRoot {
  [key: string]: PDBComplex[];
}
