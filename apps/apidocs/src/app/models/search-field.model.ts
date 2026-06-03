export interface SearchFieldDoc {
  key: string;
  datatype: string;
  description: string;
  category: string;
  possibleValues: string[];
  examples: string[];
  searchText: string;
}

export interface RawSearchFieldDoc {
  datatype: string;
  description: string;
  category: string;
  possible_values: string[];
  examples: string[];
}

export interface RawFieldDocsResponse {
  fields: RawSearchFieldDoc[];
}
