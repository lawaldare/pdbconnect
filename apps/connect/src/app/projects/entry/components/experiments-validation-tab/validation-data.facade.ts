import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { KeyValidationStats, ValidationStat } from '../../data-models/key-validation-stats.model';
import { ExperimentDetail } from '../../data-models/experimental-details.model';
import { XRayRefine } from '../../data-models/x-ray-refine.model';
import { ValidationXRayRow, ValidationTablesFacade, ValidationSamplesRow } from './validation-tables.facade';

type ValidationKeysToText = {
  [K in keyof KeyValidationStats]?: string;
};

interface ParsedExperimentalDetails {
  experimental_method: string;
  data_length: number;
  all_experimental_methods?: string[];
  expression_host_scientific_names?: string[];
  xray_em_resolution?: number;
  xray_r_factor?: number;
  xray_r_work?: number;
  xray_r_free?: number;
  xray_beam_source_type?: string;
  nmr_refinement_method?: string;
  nmr_number_of_deposited_models?: string;
  nmr_backbone_rmsd_for_largest_domain?: string;
  nmr_completeness_of_chemical_shift_assignment?: string;
  nmr_spectrometers?: string[];
  em_microscope?: string;
  em_resolution_method?: string;
  em_buffer_name?: string;
  em_buffer_ph?: number;
  em_buffer_details?: string;
  em_vitrification_cryogen?: string;
  em_vitrification_temperature?: number;
  em_vitrification_instrument?: string;
  em_vitrification_humidity?: string;
  em_vitrification_details?: string;
  datasetRows: ValidationXRayRow[];
  refinementRows: ValidationXRayRow[];
  samplesRows: ValidationSamplesRow[];
}

@Injectable({
  providedIn: 'root',
})
export class ValidationDataFacade {
  //   public ligandTypeFilters: WritableSignal<LigandsFilter[]> = signal([]);
  public parsedExperimentalDetails: WritableSignal<ParsedExperimentalDetails[]> = signal([]);
  public readonly tableFacade = inject(ValidationTablesFacade);

  public readonly validationKeysToText: ValidationKeysToText = {
    bonds: 'Bond lengths in protein, DNA, RNA molecules',
    angles: 'Bond angles in protein, DNA, RNA molecules',
    RSRZ: 'Electron density fit in protein, DNA, RNA molecules',
    protein_ramachandran: 'Ramachandran outliers in protein molecules',
    protein_sidechains: 'Sidechain rotamer outliers in protein molecules ',
  };

  processValidationKeys(validationStats: KeyValidationStats | undefined) {
    if (validationStats === undefined) {
      return [];
    }
    const validKeys = Object.keys(this.validationKeysToText);
    return (Object.entries(validationStats) as [keyof KeyValidationStats, ValidationStat][])
      .filter(([validationKey, validationStat]) => validationStat.num_checked > 0 && validKeys.indexOf(validationKey) > -1)
      .map(([validationKey, _validationStat]) => validationKey)
      .sort((a, b) => validKeys.indexOf(a) - validKeys.indexOf(b));
  }

  processExperimentalDetails(experimentalDetails: ExperimentDetail[], xRayRefine: XRayRefine | undefined): ParsedExperimentalDetails[] {
    const result: ParsedExperimentalDetails[] = [];

    const hostOrganismNames = experimentalDetails.filter(
      (detail) =>
        detail.expression_host_scientific_name &&
        detail.expression_host_scientific_name.length > 0 &&
        detail.expression_host_scientific_name[0].scientific_name !== null
    );

    if (experimentalDetails.length > 1) {
      const hybridObj: ParsedExperimentalDetails = {
        experimental_method: 'Hybrid',
        all_experimental_methods: experimentalDetails.map((detail) => detail.experimental_method),
        datasetRows: [],
        refinementRows: [],
        samplesRows: [],
        data_length: 1,
      };

      if (hostOrganismNames.length > 0) {
        hybridObj.expression_host_scientific_names = hostOrganismNames
          .map((detail) => detail.expression_host_scientific_name![0].scientific_name!)
          .filter((name, i, names) => names.indexOf(name) === i);
        hybridObj.data_length += 1;
      }
      result.push(hybridObj);
    }
    for (let i = 0; i < experimentalDetails.length; i++) {
      const experimentalDetail = experimentalDetails[i];
      const parsedObj: ParsedExperimentalDetails = {
        experimental_method: experimentalDetail.experimental_method,
        datasetRows: [],
        refinementRows: [],
        samplesRows: [],
        data_length: 0,
      };
      if (result.length === 0 && hostOrganismNames.length > 0) {
        parsedObj.expression_host_scientific_names = hostOrganismNames
          .map((detail) => detail.expression_host_scientific_name![0].scientific_name!)
          .filter((name, i, names) => names.indexOf(name) === i);
        parsedObj.data_length += 1;
      }
      if (experimentalDetail.resolution) {
        parsedObj.xray_em_resolution = experimentalDetail.resolution ?? undefined;
        parsedObj.data_length += 1;
      }
      if (experimentalDetail.r_factor) {
        parsedObj.xray_r_factor = parseFloat(experimentalDetail.r_factor.toFixed(2)) ?? undefined;
        parsedObj.data_length += 1;
      }
      if (experimentalDetail.r_work) {
        parsedObj.xray_r_work = parseFloat(experimentalDetail.r_work.toFixed(2)) ?? undefined;
        parsedObj.data_length += 1;
      }
      if (experimentalDetail.r_free) {
        parsedObj.xray_r_free = parseFloat(experimentalDetail.r_free.toFixed(2)) ?? undefined;
        parsedObj.data_length += 1;
      }
      if (
        experimentalDetail.diffraction_experiment &&
        experimentalDetail.diffraction_experiment?.length > 0 &&
        experimentalDetail.diffraction_experiment![0].beam_source_type
      ) {
        parsedObj.xray_beam_source_type = experimentalDetail.diffraction_experiment![0].beam_source_type ?? undefined;
      }
      if (experimentalDetail.nmr_ensemble_refinement) {
        let refinementMethod = experimentalDetail.nmr_ensemble_refinement?.refinement_method || undefined;
        refinementMethod = refinementMethod ? refinementMethod : 'Not available';

        parsedObj.nmr_refinement_method = refinementMethod;

        let numberDepositedModels: number | string | undefined = experimentalDetail.nmr_ensemble_refinement?.number_of_deposited_models || undefined;
        numberDepositedModels = numberDepositedModels ? numberDepositedModels + '' : 'Not available';

        parsedObj.nmr_number_of_deposited_models = numberDepositedModels;

        let rmsdLargestDomain: number | string | undefined = experimentalDetail.nmr_ensemble_refinement?.backbone_rmsd_for_largest_domain || undefined;
        rmsdLargestDomain = rmsdLargestDomain ? rmsdLargestDomain + 'Å' : 'Not available';

        parsedObj.nmr_backbone_rmsd_for_largest_domain = rmsdLargestDomain;

        let completenessChemicalShifts: number | string | undefined = experimentalDetail.completeness_of_chemical_shift_assignment || undefined;
        completenessChemicalShifts = completenessChemicalShifts ? completenessChemicalShifts + '%' : 'Not available';

        parsedObj.nmr_completeness_of_chemical_shift_assignment = completenessChemicalShifts;
        parsedObj.data_length += 4;
      }
      if (experimentalDetail.nmr_spectrometer) {
        parsedObj.nmr_spectrometers = experimentalDetail.nmr_spectrometer.map((obj) => {
          let toMerge = [obj.manufacturer, obj.model, obj.field_strength];
          toMerge = toMerge.filter((word) => word !== null);
          return toMerge.join(' ') || 'Not available';
        });
      }
      if (experimentalDetail.specimen_preparation && experimentalDetail.specimen_preparation?.length > 0) {
        if (experimentalDetail.specimen_preparation![0].buffer && experimentalDetail.specimen_preparation![0].buffer.length > 0) {
          parsedObj.em_buffer_name = experimentalDetail.specimen_preparation![0].buffer![0].name || undefined;
          parsedObj.em_buffer_ph = experimentalDetail.specimen_preparation![0].buffer![0].ph || undefined;
          parsedObj.em_buffer_details = experimentalDetail.specimen_preparation![0].buffer![0].details || undefined;
          parsedObj.data_length += 3;
        }
        if (experimentalDetail.specimen_preparation![0].vitrification && experimentalDetail.specimen_preparation![0].vitrification.length > 0) {
          parsedObj.em_vitrification_cryogen = experimentalDetail.specimen_preparation![0].vitrification![0].cryogen || undefined;
          parsedObj.em_vitrification_temperature = experimentalDetail.specimen_preparation![0].vitrification![0].temperature || undefined;
          parsedObj.em_vitrification_instrument = experimentalDetail.specimen_preparation![0].vitrification![0].instrument || undefined;
          parsedObj.em_vitrification_humidity = experimentalDetail.specimen_preparation![0].vitrification![0].humidity || undefined;
          parsedObj.em_vitrification_details = experimentalDetail.specimen_preparation![0].vitrification![0].details || undefined;
          parsedObj.data_length += 5;
        }
      }
      if (experimentalDetail.imaging && experimentalDetail.imaging?.length > 0) {
        parsedObj.em_microscope = experimentalDetail.imaging![0].microscope || undefined;
      }
      if (experimentalDetail.processing && experimentalDetail.processing.reconstruction && experimentalDetail.processing?.reconstruction?.length > 0) {
        parsedObj.em_resolution_method = experimentalDetail.processing.reconstruction![0].resolution_method || undefined;
      }

      if (experimentalDetail.experimental_method === 'X-ray diffraction') {
        const rows = this.generateXRayTablesData(experimentalDetail, xRayRefine);
        parsedObj.datasetRows = rows.dataset;
        parsedObj.refinementRows = rows.refinement;
        parsedObj.data_length += 2;
      } else if (experimentalDetail.experimental_method === 'Solution NMR') {
        const rows = this.generateNMRTablesData(experimentalDetail);
        parsedObj.samplesRows = rows.sample;
        parsedObj.data_length += 1;
      }

      result.push(parsedObj);
    }

    this.parsedExperimentalDetails.set(result);
    return result;
  }

  createXRayDatasetRows(experimentalDetail: ExperimentDetail, xrayInfo: XRayRefine | undefined) {
    const datasetRows: ValidationXRayRow[] = [];
    if (experimentalDetail.cell) {
      datasetRows.push({
        metric: 'Cell dimensions',
        value: [
          `${experimentalDetail.cell.a!} Å`,
          `${experimentalDetail.cell.b!} Å`,
          `${experimentalDetail.cell.c!} Å`,
          `${experimentalDetail.cell.alpha!}°`,
          `${experimentalDetail.cell.beta!}°`,
          `${experimentalDetail.cell.gamma!}°`,
        ],
        source: 'Depositor',
      });
    }
    if (xrayInfo !== undefined && xrayInfo.numMillerIndices.value !== null) {
      datasetRows.push({
        metric: 'Number of reflections',
        value: [`${xrayInfo.numMillerIndices.value!}`],
        source: xrayInfo.numMillerIndices.source,
      });
    }
    if (xrayInfo !== undefined) {
      const percFree = xrayInfo['percent-free-reflections'].value || 0;
      if (percFree > 0) {
        datasetRows.push({
          metric: 'Test set size',
          value: [`${percFree}%`],
          source: xrayInfo['percent-free-reflections'].source,
        });
      }
    }
    if (xrayInfo !== undefined && xrayInfo.DataCompleteness.value !== null) {
      datasetRows.push({
        metric: 'Data completeness',
        value: [`${xrayInfo.DataCompleteness.value!}%`],
        source: xrayInfo.DataCompleteness.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.EDS_resolution.value !== null && xrayInfo.EDS_resolution_low.value !== null) {
      datasetRows.push({
        metric: 'EDS resolution',
        value: [`${xrayInfo.EDS_resolution.value!}`, `${xrayInfo.EDS_resolution_low.value!}`],
        source: xrayInfo.EDS_resolution.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.IoverSigma) {
      datasetRows.push({
        metric: '<I/σ(I)>',
        value: [`${xrayInfo.IoverSigma.value!.split('(')[0]}`],
        source: xrayInfo.IoverSigma.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.TwinL && xrayInfo.TwinL2 && xrayInfo.TwinL.value !== null && xrayInfo.TwinL2.value !== null) {
      datasetRows.push({
        metric: 'Twinning statistics',
        value: [`${xrayInfo.TwinL.value!}`, `${xrayInfo.TwinL2.value!}`],
        source: xrayInfo.TwinL.source,
      });
    }
    if (experimentalDetail.spacegroup) {
      datasetRows.push({
        metric: 'Spacegroup',
        value: experimentalDetail.spacegroup.split(' '),
        source: 'Depositor',
      });
    }
    if (xrayInfo !== undefined && xrayInfo.TransNCS.value !== null) {
      datasetRows.push({
        metric: 'Possible (pseudo-) translation',
        value: [`${xrayInfo.TransNCS.value!}`],
        source: xrayInfo.TransNCS.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.WilsonBestimate.value !== null) {
      datasetRows.push({
        metric: 'Wilson B',
        value: [`${xrayInfo.WilsonBestimate.value!}`],
        source: xrayInfo.WilsonBestimate.source,
      });
    }
    return datasetRows;
  }

  createXRayRefinementRows(experimentalDetail: ExperimentDetail, xrayInfo: XRayRefine | undefined) {
    const refinementRows: ValidationXRayRow[] = [];
    if (experimentalDetail.refinement_software) {
      refinementRows.push({
        metric: 'Refinement software',
        value: [`${experimentalDetail.refinement_software}`],
        source: 'Depositor',
      });
    }
    if (xrayInfo !== undefined && xrayInfo.bulk_solvent_b && xrayInfo.bulk_solvent_b.value !== null) {
      refinementRows.push({
        metric: 'Bulk solvent B',
        value: [`${xrayInfo.bulk_solvent_b.value!}`],
        source: xrayInfo.bulk_solvent_b.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.bulk_solvent_k && xrayInfo.bulk_solvent_k.value !== null) {
      refinementRows.push({
        metric: 'Bulk solvent k',
        value: [`${xrayInfo.bulk_solvent_k.value!}`],
        source: xrayInfo.bulk_solvent_k.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.Fo_Fc_correlation && xrayInfo.Fo_Fc_correlation.value !== null) {
      refinementRows.push({
        metric: 'Fo-Fc correlation',
        value: [`${xrayInfo.Fo_Fc_correlation.value!}`],
        source: xrayInfo.Fo_Fc_correlation.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.DCC_R && xrayInfo.DCC_R.value !== null) {
      refinementRows.push({
        metric: 'R value (DCC)',
        value: [`${xrayInfo.DCC_R.value!}`],
        source: xrayInfo.DCC_R.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.DCC_Rfree && xrayInfo.DCC_Rfree.value !== null) {
      refinementRows.push({
        metric: 'R free (DCC)',
        value: [`${xrayInfo.DCC_Rfree.value!}`],
        source: xrayInfo.DCC_Rfree.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.EDS_R && xrayInfo.EDS_R.value !== null) {
      refinementRows.push({
        metric: 'R value (EDS)',
        value: [`${xrayInfo.EDS_R.value!}`],
        source: xrayInfo.EDS_R.source,
      });
    }
    return refinementRows;
  }

  generateXRayTablesData(experimentalDetail: ExperimentDetail, xrayInfo: XRayRefine | undefined) {
    const datasetRows: ValidationXRayRow[] = this.createXRayDatasetRows(experimentalDetail, xrayInfo);
    const refinementRows: ValidationXRayRow[] = this.createXRayRefinementRows(experimentalDetail, xrayInfo);

    return {
      dataset: datasetRows,
      refinement: refinementRows,
    };
  }

  generateNMRTablesData(experimentalDetail: ExperimentDetail) {
    const sampleRows: ValidationSamplesRow[] = [];
    for (const nmrExperiment of experimentalDetail.nmr_experiments!) {
      if (nmrExperiment.solution_id === null || nmrExperiment.sample_contents === null) continue;

      const sampleId = nmrExperiment.solution_id || '';
      const sampleContent = nmrExperiment.sample_contents || '';
      const recordedSpectra = nmrExperiment.conditions_and_spectra[0].spectrum_type[0] || '';
      sampleRows.push({
        sample: sampleId,
        contents: [sampleContent],
        recorded_spectra: recordedSpectra,
      });
    }
    return {
      sample: sampleRows,
    };
  }
}
