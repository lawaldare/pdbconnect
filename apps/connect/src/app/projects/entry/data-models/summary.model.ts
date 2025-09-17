/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
*/

export interface Assembly {
  /**
   * Assembly identifier.
   */
  assembly_id: string;
  /**
   * Assembly name indicates oligomericity.
   */
  name: string;
  /**
   * This indicates whether the assembly has more than one type of components.
   */
  form: string;
  /**
   * Indicates if this assembly is the most likely biological assembly.
   */
  preferred: boolean;
}
export interface EntrySummary {
  /**
   * Title of the entry as provided by the depositor.
   */
  title: string;
  /**
   * The wwPDB site where this entry was processed.
   */
  processing_site?: string;
  /**
   * The wwPDB site where this entry was deposited.
   */
  deposition_site?: string;
  /**
   * Date of deposition in yyyymmdd format.
   */
  deposition_date: string;
  /**
   * Date of release in yyyymmdd format.
   */
  release_date: string;
  /**
   * Date of latest revision of the entry in yyyymmdd format.
   */
  revision_date: string;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method_class: string[];
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method: string[];
  /**
   * A list of related entries if the entry is part of a split entry, otherwise an empty list.
   */
  split_entry: unknown[];
  /**
   * A list of structures related with the input.
   */
  related_structures: {
    resource: string;
    accession: string;
    relationship: string;
  }[];
  /**
   * List of depositors who deposited this entry.
   */
  entry_authors: string[];
  /**
   * Number of molecules (or entities) of various types.
   */
  number_of_entities: NumberOfEntities;
  /**
   * A summary of author-defined or PISA-derived assemblies for the entry.
   */
  assemblies: Assembly[];
}
export interface NumberOfEntities {
  water: number;
  polypeptide: number;
  dna: number;
  rna: number;
  sugar: number;
  ligand: number;
  'dna/rna': number;
  other: number;
  carbohydrate_polymer: number;
}
export interface PDBEntrySummary {
  [key: string]: EntrySummary[];
}

export interface relatedStructure {
  resource: string;
  accession: string;
  relationship: string;
}

export interface ProcessedSummary {
  entryTitle: string;
  entryAuthors: string;
  depositionDate: string;
  releaseDate: string;
  revisionDate: string;
  assemblies: Assembly[];
  relatedStructures: relatedStructure[];
  experimentalMethods: string[];
}
