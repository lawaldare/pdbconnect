/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface Scores {
  /**
   * Harmonic mean of all absolute validation percentile metrics.
   */
  geometry_quality: number;
  /**
   * Harmonic mean of absolute percentiles related to model geometry.
   */
  data_quality: number;
  /**
   * Harmonic mean of absolute percentiles related to experimental data and its fit to the model.
   */
  overall_quality: number;
  /**
   * Sometimes data quality is absent due to unavailability of experimental data itself. This flag tells whether the data are available.
   */
  experiment_data_available: boolean | string;
}
/**
 * These scores are harmonic means of absolute percentiles of
 *         geometric metrics (e.g. ramachandran, clashscore, sidechains), reflections-based
 *         metrics (Rfree, RSRZ) and both these kinds of metrics taken together.
 *         Wherever a constitutent percentile is 0, the harmonic mean is defined to be 0.
 *         When constituent percentiles are all unavailable, the harmonic mean is null.
 *
 */
export interface ValidationSummaryQualityScores {
  [key: string]: Scores;
}
