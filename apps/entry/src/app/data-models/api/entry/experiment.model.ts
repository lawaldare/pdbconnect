/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface AdditionalExperimentalDetail {
  /**
   * The gamma angle of the unit cell (degrees).
   */
  emdb_id: string;
  /**
   * The gamma angle of the unit cell (degrees).
   */
  url: string;
}
export interface BufferItem {
  name?: string;
  ph: number;
  details?: string;
}
export interface Cell {
  /**
   * The length of the a axis of the unit cell (Angstroms).
   */
  a?: number;
  /**
   * The length of the b axis of the unit cell (Angstroms).
   */
  b?: number;
  /**
   * The length of the c axis of the unit cell (Angstroms).
   */
  c?: number;
  /**
   * The alpha angle of the unit cell (degrees).
   */
  alpha?: number;
  /**
   * The beta angle of the unit cell (degrees).
   */
  beta?: number;
  /**
   * The gamma angle of the unit cell (degrees).
   */
  gamma?: number;
}
export interface Conditions {
  /**
   * Pressure.
   */
  pressure?: string;
  /**
   * Pressure units.
   */
  pressure_units?: string;
  /**
   * Temperature when recording the spectra.
   */
  temperature?: string;
  /**
   * pH of the sample.
   */
  pH?: string;
  /**
   * Ionic strength of the sample.
   */
  ionic_strength?: string;
}
export interface ConditionsAndSpectraItem {
  /**
   * List of recorded NMR spectra.
   */
  spectrum_type: string[];
  /**
   * Description of conditions when recording NMR spectra.
   */
  conditions: Conditions;
}
export interface CrystalGrowthItem {
  /**
   * Description of crystal growth.
   */
  grow_details?: string;
  /**
   * Temperature at which crystals were obtained.
   */
  grow_temperature?: number;
  /**
   * pH of crystal growth medium.
   */
  grow_ph?: number;
  /**
   * Growth method, e.g. hanging drop, etc.
   */
  grow_method?: string;
}
export interface DiffractionExperimentItem {
  /**
   * Diffraction protocol.
   */
  diffraction_protocol?: string;
  /**
   * Wavelength of the source.
   */
  wavelength?: number;
  /**
   * Type of beam source.
   */
  beam_source_type?: string;
  /**
   * Name of beam source.
   */
  beam_source_name?: string;
  /**
   * Synchrotron site.
   */
  synchrotron_site?: string;
  /**
   * Details on synchrotron beamline.
   */
  synchrotron_beamline?: string;
  /**
   * Description of source.
   */
  source_details?: string;
  /**
   * List of wavelengths used in this diffraction experiment.
   */
  wavelength_list?: string;
  /**
   * Detector type.
   */
  detector_type?: string;
  /**
   * Detector name.
   */
  detector?: string;
  /**
   * Description of source.
   */
  detector_details?: string;
  /**
   * Ambient temperature at which data was collected.
   */
  ambient_temp?: number;
}
export interface ECExperimentDetail {
  /**
   * The higher limit of resolution of crystallographic data as reported by depositors. Null if not available.
   */
  resolution?: number;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method: string;
  /**
   * The crystallographic R factor - null when not available.
   */
  r_factor?: number;
  /**
   * Crystallographic free R factor if available, else null.
   */
  r_free?: number;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method_class: string;
  /**
   * The length of the a axis of the unit cell (Angstroms).
   */
  length_a: number;
  /**
   * The length of the b axis of the unit cell (Angstroms).
   */
  length_b: number;
  /**
   * The length of the c axis of the unit cell (Angstroms).
   */
  length_c: number;
  /**
   * The alpha angle of the unit cell (degrees).
   */
  angle_alpha: number;
  /**
   * The beta angle of the unit cell (degrees).
   */
  angle_beta: number;
  /**
   * The gamma angle of the unit cell (degrees).
   */
  angle_gamma: number;
  /**
   * Percent completeness of diffraction data.
   */
  completeness?: number;
  /**
   * Refinement software used.
   */
  refinement_software?: string;
  /**
   * Number of structure factors deposited.
   */
  num_reflections?: number;
  /**
   * This is the lower limit of resolution data if available, else null.
   */
  resolution_low?: number;
  /**
   * The higher limit of resolution of crystallographic data as reported by depositors. Null if not available.
   */
  resolution_high?: number;
  /**
   * Percentage of collected reflections used as the free set for cross-validation.
   */
  r_free_percent_reflections?: number;
  /**
   * Percentage of reflections observed with respect to expected.
   */
  percent_reflections_observed?: number;
  /**
   * Brief description of the method used to choose the refinement-free set of reflections, generally RANDOM.
   */
  r_free_selection_details?: string;
  /**
   * Any particular method, such as molecular replacement, used in structure determination.
   */
  structure_determination_method?: string;
  /**
   * The crystallographic R factor without including the free reflections - null when not available.
   */
  r_work?: number;
  /**
   * The starting model, if any, for this entry, as in e.g. molecular replacement.
   */
  starting_model?: string;
  /**
   * Spacegroup in the Hermann-Mauguin space-group notation.
   */
  spacegroup: string;
  /**
   * Flag to indicate if experimental data were deposited.
   */
  experiment_data_available?: string;
  /**
   * Phasing method used.
   */
  phasing_method?: string;
  additional_experimental_details?: AdditionalExperimentalDetail[];
  imaging: ImagingItem[];
  image_acquisition?: ImageScans[];
  fitting?: FittingItem[];
  specimen_preparation: SpecimenPreparationItem[];
  processing: Processing;
}
export interface ImagingItem {
  microscope: string;
  holder_details?: string;
  holder_model?: string;
  date?: string;
  acceleration_voltage: number;
  em_imaging_mode: string;
  illumination_mode: string;
  spherical_aberration_coef?: number;
  nominal_minimum_defocus?: number;
  nominal_maximum_defocus?: number;
  nominal_magnification?: number;
  calibrated_magnification?: number;
  tilt_minimum_angle?: number;
  tilt_maximum_angle?: number;
  energy_filter?: string;
  energy_window?: string;
  temperature?: number;
  minimum_temperature?: number;
  maximum_temperature?: number;
  detector_distance?: string;
  electron_dose?: number;
  electron_source?: string;
  astigmatism?: string;
  astigmatism_correction_details?: string;
  details?: string;
  detector: string;
  detector_details?: string;
}
export interface ImageScans {
  scanner?: string;
  sampling_interval?: number;
  bits_per_pixel?: number;
  number_images?: number;
  details?: string;
}
export interface FittingItem {
  initial_model_list?: string;
  struct_asym_id?: string;
  method?: string;
  target_criteria?: string;
  software?: string;
  overall_b_value?: number;
  refinement_space?: string;
  refinement_protocol?: string;
  details?: string;
}
export interface SpecimenPreparationItem {
  specimen_concentration?: number;
  crystal_grow_details?: string;
  buffer?: BufferItem[];
  support?: SupportItem[];
  vitrification?: VitrificationItem[];
}
export interface SupportItem {
  experimental_method?: string;
  grid_type?: string;
  grid_mesh_size?: number;
  grid_material?: string;
  film_material?: string;
  pretreatment?: string;
  details?: string;
}
export interface VitrificationItem {
  cryogen: string;
  humidity?: string;
  temperature?: number;
  instrument?: string;
  experimental_method?: string;
  time_resolved_state?: string;
  details?: string;
}
export interface Processing {
  particle_selection?: ParticleSelectionItem[];
  reconstruction?: ReconstructionItem[];
}
export interface ParticleSelectionItem {
  number_of_projections: number;
  software?: string;
  experimental_method?: string;
  details?: string;
}
export interface ReconstructionItem {
  experimental_method?: string;
  resolution_by_author: number;
  resolution_method?: string;
  ctf_correction_method?: string;
  nominal_pixel_size?: number;
  actual_pixel_size?: number;
  magnification_calibration?: string;
  euler_angles_details?: string;
  number_class_averages?: number;
  software?: string;
  details?: string;
}
export interface EMExperimentDetail {
  resolution: number;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method: string;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method_class: string;
  additional_experimental_details?: AdditionalExperimentalDetail[];
  imaging: ImagingItem[];
  image_acquisition?: ImageScans[];
  fitting?: FittingItem[];
  specimen_preparation: SpecimenPreparationItem[];
  processing: Processing;
}
export interface ExpressionHostScientificNameItem {
  /**
   * Taxonomy identifier of the organism to which the entity belongs.
   */
  tax_id?: number;
  /**
   * Scientific name of the host organism used in expression of the entity.
   */
  scientific_name?: string;
}
export interface NMRExperimentDetail {
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method: string;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method_class: string;
  /**
   * How many nuclei were assigned a chemical shift value (Percentage of total number of assignable nuclei).
   */
  completeness_of_chemical_shift_assignment?: number;
  /**
   * List of software used in the study.
   */
  nmr_software: NmrSoftwareItem[];
  /**
   * List of NMR spectrometers.
   */
  nmr_spectrometer: NmrSpectrometerItem[];
  /**
   * Scientific name of the host organism used in expression of the entity.
   */
  expression_host_scientific_name: ExpressionHostScientificNameItem[];
  /**
   * List of NMR samples, experiments and experimental conditions.
   */
  nmr_experiments: NmrExperiment[];
  /**
   * Whether the experimental restraints were deposited.
   */
  nmr_experimental_restraints_available: boolean;
  /**
   * Description of the NMR ensemble and its refinement method.
   */
  nmr_ensemble_refinement: NmrEnsembleRefinement;
}
export interface NmrSoftwareItem {
  /**
   * For what was the software used.
   */
  classification?: string;
  /**
   * Software name.
   */
  software_name?: string;
}
export interface NmrSpectrometerItem {
  /**
   * Manufacturer of the NMR spectrometer.
   */
  manufacturer?: string;
  /**
   * NMR spectrometer model.
   */
  model?: string;
  /**
   * NMR spectrometer magnetic field strength (MHz).
   */
  field_strength?: string;
}
export interface NmrExperiment {
  /**
   * Identifier for an NMR sample.
   */
  solution_id?: string;
  /**
   * Solvent in the NMR sample.
   */
  solvent_system?: string;
  /**
   * Concatenated description of an NMR sample.
   */
  sample_contents?: string;
  /**
   * Detailed list of components in an NMR sample.
   */
  sample_components: SampleComponent[];
  /**
   * List of conditions and spectra recorded under them.
   */
  conditions_and_spectra: ConditionsAndSpectraItem[];
}
export interface SampleComponent {
  /**
   * A component in the NMR sample, including macromolecules, ligands and buffer molecules.
   */
  molecule?: string;
  /**
   * How (if at all) the molecule was isotopically enriched.
   */
  isotopic_labeling?: string;
  /**
   * Concentration of the molecule.
   */
  concentration?: number;
  /**
   * Units in which the concentration was measured.
   */
  concentration_units?: string;
}
export interface NmrEnsembleRefinement {
  /**
   * Number of models in the deposited NMR ensemble.
   */
  number_of_deposited_models: number;
  /**
   * Mean main chain RMSD to the representative model for the largest well-defined core.
   */
  backbone_rmsd_for_largest_domain?: number;
  /**
   * Representative model from the NMR ensemble, as defined by the authors.
   */
  author_defined_representative_model?: number;
  /**
   * Protein residues forming the well-defined core of the structure.
   */
  well_defined_core: string[];
  /**
   * Total number of models calculated during structure determination.
   */
  number_of_calculated_models?: number;
  /**
   * Criterion how the models were selected for deposition.
   */
  conformer_selection_criteria?: string;
  /**
   * Representative model from the NMR ensemble, automatically chosen as most similar to all other models.
   */
  medoid_representative_model?: number;
  /**
   * How the models were refined.
   */
  refinement_method?: string;
  /**
   * Criterion how a representative model was selected.
   */
  representative_model_selection_criteria?: string;
}
export interface XrayExperimentDetail {
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method: string;
  /**
   * The crystallographic R factor - null when not available.
   */
  r_factor?: number;
  /**
   * Crystallographic free R factor if available, else null.
   */
  r_free?: number;
  /**
   * Method and method_class together describe the type of experiment used to determine the coordinates in this entry.
   */
  experimental_method_class: string;
  /**
   * Percent completeness of diffraction data.
   */
  completeness?: number;
  /**
   * Refinement software used.
   */
  refinement_software?: string;
  /**
   * Number of structure factors deposited.
   */
  num_reflections?: number;
  /**
   * This is the lower limit of resolution data if available, else null.
   */
  resolution_low?: number;
  /**
   * The higher limit of resolution of crystallographic data as reported by depositors. Null if not available.
   */
  resolution_high?: number;
  /**
   * The higher limit of resolution of crystallographic data as reported by depositors. Null if not available.
   */
  resolution?: number;
  /**
   * Percentage of collected reflections used as the free set for cross-validation.
   */
  r_free_percent_reflections?: number;
  /**
   * Percentage of reflections observed with respect to expected.
   */
  percent_reflections_observed?: number;
  /**
   * Brief description of the method used to choose the refinement-free set of reflections, generally RANDOM.
   */
  r_free_selection_details?: string;
  /**
   * Any particular method, such as molecular replacement, used in structure determination.
   */
  structure_determination_method?: string;
  /**
   * The crystallographic R factor without including the free reflections - null when not available.
   */
  r_work?: number;
  /**
   * The starting model, if any, for this entry, as in e.g. molecular replacement.
   */
  starting_model?: string;
  /**
   * Spacegroup in the Hermann-Mauguin space-group notation.
   */
  spacegroup?: string;
  /**
   * Flag to indicate if experimental data were deposited.
   */
  experiment_data_available?: string;
  /**
   * Phasing method used.
   */
  phasing_method?: string;
  /**
   * Information on cell geometry.
   */
  cell: Cell;
  /**
   * Scientific name of the host organism used in expression of the entity.
   */
  expression_host_scientific_name: ExpressionHostScientificNameItem[];
  /**
   * Information about crystal growth.
   */
  crystal_growth: CrystalGrowthItem[];
  /**
   * Information about diffraction experiments carried out to collect data for this entry.
   */
  diffraction_experiment: DiffractionExperimentItem[];
}
export type AnyExperimentDetail = Array<NMRExperimentDetail | XrayExperimentDetail | ECExperimentDetail | EMExperimentDetail>;

export type NonNMRExperimentDetail = Array<XrayExperimentDetail | ECExperimentDetail | EMExperimentDetail>;

export interface PDBEntryExperiment {
  [key: string]: AnyExperimentDetail;
}
