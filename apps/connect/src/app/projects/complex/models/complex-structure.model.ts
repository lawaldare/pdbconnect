export interface Symmetry {
  type: string;
  symbol: string;
}

export interface RepresentativeStructure {
  pdb_id: string;
  assembly_id: string;
}

export interface Participant {
  accession: string;
  stoichiometry: number;
  accession_type: string;
  name: string;
}
export interface Assembly {
  assembly_id: number;
  experimental_method: string;
  pdb_id: string;
  preferred_assembly: boolean;
  resolution: number;
  symmetry: Symmetry;
  title: string;
}
export interface ComplexData {
  name: string | null;
  complex_portal_id: string;
  source_organism: string;
  representative_structure: RepresentativeStructure;
  oligomeric_state: string;
  symmetry: Symmetry;
  stoichiometry: number;
  participants: Participant[];
  observed_experimental_methods_with_counts: Record<string, number>;
  assemblies: Assembly[];
  subcomplexes: string[];
  supercomplexes: string[];
  complexId: string;
}

type RelationshipType = 'sub-complex' | 'super-complex';

export interface ComplexInteraction {
  pdb_complex_id: string;
  name: string;
  representative_structure: RepresentativeStructure;
  relationship_type: RelationshipType;
  common_participants: Participant[];
  additional_participants: Participant[];
}
