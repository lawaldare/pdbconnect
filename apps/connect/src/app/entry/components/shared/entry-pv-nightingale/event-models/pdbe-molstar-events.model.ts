export interface MolstarEventData {
  entry_id: string;
  model: number;
  instance: string;
  entity_id: string;
  label_asym_id: string;
  auth_asym_id: string;
  unp_accession: string;
  unp_seq_id: number;
  seq_id: number;
  auth_seq_id: number;
  ins_code: string;
  comp_id: string;
  atom_id: string[];
  alt_id: string;
  micro_het_comp_ids: string[];
  residueNumber: number;
}

export type PDBMolstarEvent = Event & { eventData: MolstarEventData };
