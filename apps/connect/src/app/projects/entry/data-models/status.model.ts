export type StatusCode = 'WDRN' | 'HPUB' | 'OBS' | 'AUTH' | 'HOLD' | 'POLC' | 'AUCO' | 'REFI' | 'PROC' | 'WAIT' | 'REPL' | 'REL' | 'INITIAL';

export interface EntryStatus {
  title: string;
  status_code: StatusCode;
  entry_authors: string;
  experimental_method: string;
  experimental_method_class: string;
  since: string | null;
  superceded_by: string[];
  obsoletes: string[];
  entryId?: string;
}

export const entryStatusDefault = {
  title: '',
  status_code: 'INITIAL' as StatusCode,
  entry_authors: '',
  experimental_method: '',
  experimental_method_class: '',
  since: '',
  superceded_by: [],
  obsoletes: [],
};
