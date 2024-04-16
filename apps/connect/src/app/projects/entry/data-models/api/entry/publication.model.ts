/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface Abstract {
  /**
   * Background section of the abstract.
   */
  background?: string;
  /**
   * Objectives section of the abstract.
   */
  objective?: string;
  /**
   * Methods section of the abstract.
   */
  methods?: string;
  /**
   * Results section of the abstract.
   */
  results?: string;
  /**
   * Conclusions section of the abstract.
   */
  conclusions?: string;
  /**
   * Part of abstract that is not under a particular sub-heading sich as Background, Results, etc.
   */
  unassigned?: string;
}
export interface AuthorListItem {
  /**
   * Full name of the author.
   */
  full_name?: string;
  /**
   * Last name of the author.
   */
  last_name?: string;
  /**
   * Initials in the name of the author.
   */
  initials?: string;
}
export interface CitationDetail {
  /**
   * The document object index of the article.
   */
  doi?: string;
  /**
   * The title of the article.
   */
  title: string;
  /**
   * Pubmed id of the article, if any - null otherwise.
   */
  pubmed_id?: string;
  /**
   * Citation type such as book(B), journal(J), review(R), unpublished(U), etc.
   */
  type: string;
  /**
   * PDB entries which share the same primary citation.
   */
  associated_entries?: string;
  /**
   * Itemized description of issue of journal where this article appears.
   */
  journal_info: JournalInfo;
  /**
   * Abstract of the article partitioned into sections.
   */
  abstract: Abstract;
  /**
   * List of authors of the article.
   */
  author_list: AuthorListItem[];
}
export interface JournalInfo {
  /**
   * PDB abbreviation of full name of the journal.
   */
  pdb_abbreviation?: string;
  /**
   * ISO abbreviation of full name of the journal.
   */
  ISO_abbreviation?: string;
  /**
   * The page numbers of the article - this can be pp-pp, or pp or null.
   */
  pages?: string;
  /**
   * The volume in which the article was published, if any - null otherwise.
   */
  volume?: string;
  /**
   * Issue number in which the article appears.
   */
  issue?: string;
  /**
   * The year of publication of the article.
   */
  year?: number;
}
export interface PDBEntryCitations {
  [key: string]: CitationDetail[];
}
