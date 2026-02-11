export interface Author {
  full_name: string;
  last_name: string;
  initials: string;
}

export interface Abstract {
  background: string | null;
  conclusions: string | null;
  methods: string | null;
  objective: string | null;
  results: string | null;
  unassigned: string | null;
}

export interface JournalInfo {
  ISO_abbreviation: string;
  issue: string;
  pages: string;
  pdb_abbreviation: string;
  volume: string;
  year: number;
}

export interface Publication {
  abstract: Abstract;
  associated_entries: string;
  author_list: Author[];
  doi: string;
  journal_info: JournalInfo;
  pubmed_id: string;
  title: string;
  type: string;
}
