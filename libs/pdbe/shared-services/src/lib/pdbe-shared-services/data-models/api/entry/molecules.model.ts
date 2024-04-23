/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
*/

export interface End {
  /**
   * mmcif-style residue index (within entity or struct_asym_id)
   */
  residue_number: number;
}
export interface EntityDetail {
  /**
   * Type of the molecule.
   */
  molecule_type: string;
  /**
   * Entity id (molecule number in mmcif-speak).
   */
  entity_id: number;
  /**
   * Sample preparation method, such as 'Natural source', 'Genetically manipulated', 'Synthetically obtained', etc.
   */
  sample_preparation: string;
  /**
   * Length of entities, available for polymeric entities
   */
  length?: number;
  /**
   * Number of copies of the entity found in the entry.
   */
  number_of_copies: number;
  /**
   * PDB chain ids that the entity is found in.
   */
  in_chains: string[];
  /**
   * The struct_asym_ids (equivalent of chain ids in mmcif-speak) that the entity is found in.
   */
  in_struct_asyms: string[];
  /**
   * Brief textual description of any mutations to the entity.
   */
  mutation_flag?: string;
  /**
   * Formula weight of the entity in daltons.
   */
  weight: number;
  /**
   * True if all chains of this molecule are trace models, i.e. CA-only or P-only. Makes sense only for molecules of type protein, DNA or RNA.
   */
  ca_p_only: boolean;
  /**
   * Name of the molecule as per the PDB file.
   */
  synonym?: string;
  /**
   * Name of the molecule derived from UniProt mappings.
   */
  molecule_name: string[];
  /**
   * Name of the gene obtained via UniProt mappings.
   */
  gene_name?: string[];
  /**
   * This contains information about source organism and expression host system used to obtain sample where applicable. Note that an entity can have parts obtained from multiple sources.
   */
  source?: SourceItem[];
  /**
   * Sequence of the entity - available for polymeric entities only. Usually there is one character per sequence position, but not if single-letter-code is actually multiple characters - so this string might be longer the length field suggests.
   */
  sequence?: string;
  /**
   * This is a concatenation of single-letter-codes of residues, but non-standard residues may have their chem-comp-id in brackets. e.g. ...VTTF(GYS)VQCF... in case of 3p28. This string can be longer than the length field suggests.
   */
  pdb_sequence?: string;
  /**
   * This is a mapping from residue number (1-based index) to 1-character code, 3 character code and parent residue types for some non-standard residues in this entity.
   */
  pdb_sequence_indices_with_multiple_residues?: {
    [k: string]: unknown;
  };
  /**
   * The chemical components in this entity - available for non-polymeric molecules only.
   */
  chem_comp_ids?: string[];
}
export interface SourceItem {
  /**
   * Scientific name of the organism to which the entity belongs.
   */
  organism_scientific_name?: string;
  /**
   * Scientific name of the host organism used in expression of the entity
   */
  expression_host_scientific_name?: string;
  /**
   * Taxonomy identifier of the organism to which the entity belongs.
   */
  tax_id?: number;
  /**
   * Taxonomy identifier of the host organism used in expression of the entity.
   */
  expression_host_tax_id?: number;
  mappings: Mapping[];
}
export interface Mapping {
  /**
   * Start residue of a range in mmcif numbering scheme
   */
  start: Start;
  /**
   * Start residue of a range in mmcif numbering scheme
   */
  end: End;
}
export interface Start {
  /**
   * mmcif-style residue index (within entity or struct_asym_id)
   */
  residue_number: number;
}
export interface PDBEntryEntities {
  [key: string]: EntityDetail[];
}
