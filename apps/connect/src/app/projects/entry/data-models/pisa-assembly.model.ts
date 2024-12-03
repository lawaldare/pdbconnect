export interface PisaAssembly {
  assembly_id: string;
  pisa_version: string;
  assembly: {
    id: string;
    size: string;
    interface_count: number;
    score: string;
    macromolecular_size: string;
    dissociation_energy: number;
    accessible_surface_area: number;
    buried_surface_area: number;
    entropy: number;
    dissociation_area: number;
    solvation_energy_gain: number;
    number_of_uc: string;
    number_of_dissociated_elements: string;
    symmetry_number: string;
    formula: string;
    composition: string;
    R350: string;
  };
}
