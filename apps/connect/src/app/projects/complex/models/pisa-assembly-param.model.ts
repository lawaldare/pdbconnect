/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PISAAssemblyParam {
  dissociation_energy: number;
  accessible_surface_area: number;
  buried_surface_area: number;
  dissociation_entropy: number;
  dissociation_area: number;
  solvation_energy_gain: number;
  pdb_id: string;
  assembly_id: string;
  experimental_method: string;
  resolution: number;
  [key: string]: any;
}
