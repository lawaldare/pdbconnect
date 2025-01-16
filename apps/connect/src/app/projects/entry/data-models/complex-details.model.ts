export interface ComplexParticipant {
  accession: string;
  stoichiometry: number;
}

interface ComplexAssembly {
  assembly_id: number;
  preferred_assembly: boolean;
}

export interface ComplexDetails {
  name: string;
  pdb_complex_id: string;
  complex_portal_id: string | null;
  participants: ComplexParticipant[];
  assemblies: ComplexAssembly[];
  subcomplexes: string[];
  supercomplexes: string[];
}
