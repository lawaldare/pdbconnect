import { Article } from './article.model';

export interface OtherPublications {
  Articles: Article[];
  Reviews: Article[];
}

export interface UniProtPublication {
  pubmed_id: string | null;
  title: string | null;
  journal: string | null;
  volume: string | null;
  citation_type: string | null;
  year: string | null;
  pages: string | null;
  authors: string | null;
  // only in UniProt publications
  accession: string | null;
}

export interface UniProtPublications {
  Articles: UniProtPublication[];
  Reviews: UniProtPublication[];
}

export interface RelatedPublication {
  appears_without_citation: OtherPublications;
  cited_by: OtherPublications;
  uniprot_publications: UniProtPublications;
}
