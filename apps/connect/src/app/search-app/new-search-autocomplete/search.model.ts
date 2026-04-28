export interface Doc {
  num_pdb_entries: number;
  value: string;
  var_name: string;
}

export interface DocList {
  start: number;
  numFound: number;
  docs: Doc[];
}

export interface ResultGroup {
  groupValue: string;
  doclist: DocList;
}
