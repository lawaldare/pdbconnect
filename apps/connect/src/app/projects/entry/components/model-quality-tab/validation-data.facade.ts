/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DestroyRef, inject, Injectable } from '@angular/core';
import { ExperimentDetail } from '../../data-models/experimental-details.model';
import { XRayRefine } from '../../data-models/x-ray-refine.model';
import {
  ExperimentalInfoData,
  ExperimentalRawDatum,
  ProcessedExperimentalDetails,
  RValues,
  SampleInfoData,
} from './data-models-and-definitions/processed-experimental-details.model';
import {
  EMRefinementStatsRow,
  EMSpecimenPrepRow,
  EMVitrificationRow,
  ExperimentRawRow,
  NMRSampleRow,
  ValidationInfoRow,
  XRayStatsRow,
} from './data-models-and-definitions/table-rows.model';
import {
  BMRBExperimentRawData,
  EMPIARExperimentRawData,
  IRRMCExperimentRawData,
  PDBExperimentRawData,
  SBGRIDExperimentRawData,
} from '../../data-models/experiment-raw-data.model';
import { EntryStoreState } from '../../store/entry-store.model';
import { Store } from '@ngrx/store';
import { EntrySelectors } from '../../store/entry.selectors';
import { UtilService } from '@pdbc/core';
import { startWith, catchError, of, combineLatest, map, retry, mergeMap, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ValidationDataProcessingFacade {
  private readonly globalStore = inject(Store<EntryStoreState>);
  private readonly util = inject(UtilService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly validationKeysToText: { [key: string]: string } = {
    bonds: 'Bond lengths in protein, DNA, RNA molecules',
    angles: 'Bond angles in protein, DNA, RNA molecules',
    RSRZ: 'Electron density fit in protein, DNA, RNA molecules',
    protein_ramachandran: 'Ramachandran outliers in protein molecules',
    protein_sidechains: 'Sidechain rotamer outliers in protein molecules ',
    rna_pucker: 'RNA nucleotides sugar pucker outliers in RNA molecules',
    rna_suite: 'Non-rotameric outlier suites in RNA molecules',
  };

  public processData(): Observable<ProcessedExperimentalDetails[]> {
    const createSelectorStream = <T>(selector: any, defaultValue: T) =>
      this.globalStore.select(selector).pipe(
        startWith(defaultValue),
        catchError(() => of(defaultValue))
      );

    return combineLatest({
      experimentalDetails: createSelectorStream(EntrySelectors.experimentalDetails, []),
      sourceOrganisms: createSelectorStream(EntrySelectors.organismScientificNames, []),
      hasRna: createSelectorStream(EntrySelectors.hasRNA, []),
      depositionDate: createSelectorStream(EntrySelectors.summaryData, null).pipe(map((data) => data?.depositionDate)),
      releaseDate: createSelectorStream(EntrySelectors.summaryData, null).pipe(map((data) => data?.releaseDate)),
      revisionDate: createSelectorStream(EntrySelectors.summaryData, null).pipe(map((data) => data?.revisionDate)),
      entryTitle: createSelectorStream(EntrySelectors.summaryData, null).pipe(map((data) => data?.entryTitle)),
      validationStats: createSelectorStream(EntrySelectors.validationKeyStats, undefined).pipe(map((data) => (this.util.isNotEmptyObject(data) ? data : undefined))),
      xRayRefine: createSelectorStream(EntrySelectors.validationXRayRefine, undefined).pipe(map((data) => (this.util.isNotEmptyObject(data) ? data : undefined))),
      pdbRedoData: createSelectorStream(EntrySelectors.pdbRedoQualityScores, undefined).pipe(map((data) => (this.util.isNotEmptyObject(data) ? data : undefined))),
      experimentalRawPDB: createSelectorStream(EntrySelectors.experimentRawDataPDB, []),
      experimentalRawBMRB: createSelectorStream(EntrySelectors.experimentRawDataBMRB, undefined),
      experimentRawDataIRRMC: createSelectorStream(EntrySelectors.experimentRawDataIRRMC, undefined).pipe(
        map((data) => (this.util.isNotEmptyObject(data) ? data : undefined))
      ),
      experimentRawDataEMPIAR: createSelectorStream(EntrySelectors.experimentRawDataEMPIAR, []),
      experimentRawDataSBGrid: createSelectorStream(EntrySelectors.experimentRawDataSBGrid, undefined).pipe(
        map((data) => (this.util.isNotEmptyObject(data) ? data : undefined))
      ),
    }).pipe(
      retry({ count: 3, delay: 1000 }),
      mergeMap((data: any) => of(this.processExperimentalValidationData(data))),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  private processExperimentalValidationData(data: any): ProcessedExperimentalDetails[] {
    const result: ProcessedExperimentalDetails[] = [];
    for (let i = 0; i < data.experimentalDetails.length; i++) {
      const experimentalDetail = data.experimentalDetails[i];
      const processed: ProcessedExperimentalDetails = {
        generalInfo: {
          methodName: experimentalDetail.experimental_method,
        },
        timeline: [
          {
            depositionDate: data.depositionDate,
            releaseDate: data.releaseDate,
            revisionDate: data.revisionDate,
          },
        ],
      };

      // parse general information data

      /** All methods */
      if (data.sourceOrganisms.length > 0) processed.generalInfo.sourceOrganisms = data.sourceOrganisms;
      if (data.pdbRedoData) processed.generalInfo.pdbRedoData = data.pdbRedoData;

      /** X-Ray, SAS, EM, others (maybe) */
      if (experimentalDetail.resolution) processed.generalInfo.resolution = `${experimentalDetail.resolution}Å`;

      /** X-Ray, SAS, others (maybe) */
      const rValues: RValues = {};
      if (experimentalDetail.r_work) {
        rValues.rWork = experimentalDetail.r_work.toFixed(2);
      }
      if (experimentalDetail.r_free) {
        rValues.rFree = experimentalDetail.r_free.toFixed(2);
      }
      if (Object.keys(rValues).length > 0) processed.generalInfo.reportedRValues = rValues;

      /** NMR */
      const completenessChemicalShifts = experimentalDetail.completeness_of_chemical_shift_assignment;
      if (completenessChemicalShifts) processed.generalInfo.completenessChemicalShifts = `${completenessChemicalShifts}%`;

      if (experimentalDetail.nmr_ensemble_refinement) {
        const refinementMethod = experimentalDetail.nmr_ensemble_refinement?.refinement_method;
        if (refinementMethod) processed.generalInfo.refinementMethod = `${refinementMethod}`;

        const numberDepositedModels = experimentalDetail.nmr_ensemble_refinement?.number_of_deposited_models;
        if (numberDepositedModels) processed.generalInfo.numberDepositedModels = `${numberDepositedModels}`;

        const rmsdLargestDomain = experimentalDetail.nmr_ensemble_refinement?.backbone_rmsd_for_largest_domain;
        if (rmsdLargestDomain) processed.generalInfo.rmsdLargestDomain = `${rmsdLargestDomain}`;
      }

      // parse validation stats data
      if (data.validationStats) {
        const validationInfo: ValidationInfoRow[] = [];
        for (const [validationKey, validationStat] of Object.entries(data.validationStats)) {
          // if nothing was checked, skip
          const stat = validationStat as { num_checked: number; percent_outliers?: number; num_outliers?: number };
          if (stat.num_checked === 0 || !stat.num_checked) continue;

          const percValue = stat.percent_outliers ? `(${stat.percent_outliers}%)` : '';
          const validationText = this.validationKeysToText[validationKey];

          // RNA exclusive metrics are only pushed if entry contains RNA molecules (hasRna)
          const canPush = validationKey.includes('rna') === false || data.hasRna;
          if (canPush) {
            validationInfo.push({
              metric: validationText,
              description: `${stat.num_outliers} outliers of ${stat.num_checked} ${percValue}`,
            });
          }
        }
        if (validationInfo.length > 0) processed.validationInfo = validationInfo;
      }

      // parse sample stats (sourceOrganisms, expressionSystem, authorDesc)
      const sampleInfoData: SampleInfoData = {};
      if (data.sourceOrganisms.length > 0) sampleInfoData.sourceOrganisms = data.sourceOrganisms;
      if (experimentalDetail.expression_host_scientific_name) {
        const uniqueHostOrganismNames = experimentalDetail.expression_host_scientific_name
          .filter((eachName: any) => eachName.scientific_name !== null && eachName.scientific_name !== undefined)
          .map((eachName: any) => eachName.scientific_name!)
          .filter((name: any, i: any, names: string | any[]) => names.indexOf(name) === i);
        if (uniqueHostOrganismNames.length > 0) sampleInfoData.expressionSystem = uniqueHostOrganismNames;
      }
      sampleInfoData.authorDesc = data.entryTitle;
      if (Object.keys(sampleInfoData).length > 0) {
        processed.sampleInfo = sampleInfoData;
      }

      // parse experimental info data (specific to different methods)
      const experimentalInfoData: ExperimentalInfoData = {};
      if (
        experimentalDetail.experimental_method_class === 'x-ray' ||
        experimentalDetail.experimental_method_class === 'sas' ||
        experimentalDetail.experimental_method_class === 'other'
      ) {
        if (
          experimentalDetail.diffraction_experiment &&
          experimentalDetail.diffraction_experiment?.length > 0 &&
          experimentalDetail.diffraction_experiment![0].beam_source_type
        ) {
          experimentalInfoData.xRayBeamSource = experimentalDetail.diffraction_experiment![0].beam_source_type;
        }
        const datasetRows: XRayStatsRow[] = this.createXRayDatasetRows(experimentalDetail, data.xRayRefine);
        if (datasetRows.length > 0) {
          experimentalInfoData.xRayDatasetStatsRows = datasetRows;
        }
        const refinementRows: XRayStatsRow[] = this.createXRayRefinementRows(experimentalDetail, data.xRayRefine);
        if (refinementRows.length > 0) {
          experimentalInfoData.xRayRefinementStatsRows = refinementRows;
        }
      } else if (experimentalDetail.experimental_method_class === 'nmr') {
        if (experimentalDetail.nmr_spectrometer) {
          const nmrSpectrometers = experimentalDetail.nmr_spectrometer
            .map((obj: { manufacturer: any; model: any; field_strength: any }) => {
              let toMerge = [obj.manufacturer, obj.model, obj.field_strength];
              toMerge = toMerge.filter((word) => word !== null);
              return toMerge.join(' ') || undefined;
            })
            .filter((desc: undefined) => desc !== undefined);
          if (nmrSpectrometers.length > 0) experimentalInfoData.nmrSpectometers = nmrSpectrometers;
        }
        const sampleRows: NMRSampleRow[] = this.createNMRSampleRows(experimentalDetail);
        if (sampleRows.length > 0) {
          experimentalInfoData.nmrSampleRows = sampleRows;
        }
      } else if (experimentalDetail.experimental_method_class === 'em') {
        const emSpecimenRows = this.createEMSpecimenRows(experimentalDetail);
        if (emSpecimenRows.length > 0) {
          experimentalInfoData.emSpecimenRows = emSpecimenRows;
        }

        const emVitrificationRows = this.createEMVitrificationRows(experimentalDetail);
        if (emVitrificationRows.length > 0) {
          experimentalInfoData.emVitrificationRows = emVitrificationRows;
        }

        const emRefinementStatsRows = this.createEMRefinementRows(experimentalDetail);
        if (emRefinementStatsRows.length > 0) {
          experimentalInfoData.emRefinementStatsRows = emRefinementStatsRows;
        }
      }
      if (Object.keys(experimentalInfoData).length > 0) {
        processed.experimentalInfo = experimentalInfoData;
      }

      // parse experimental raw data (see docs in component.ts)
      if (data.experimentalRawPDB.length) {
        processed.experimentalRawData = this.createExperimentRawDataPDB(data.experimentalRawPDB);
      }
      if (data.experimentalRawBMRB.length) {
        processed.experimentalRawData = this.createExperimentRawDataBMRB(data.experimentalRawBMRB);
      }
      if (data.experimentRawDataIRRMC) {
        processed.experimentalRawData = this.createExperimentRawDataIRRMC(data.experimentRawDataIRRMC);
      }
      if (data.experimentRawDataEMPIAR.length) {
        processed.experimentalRawData = this.createExperimentRawDataEMPIAR(data.experimentRawDataEMPIAR);
      }
      if (data.experimentRawDataSBGrid) {
        processed.experimentalRawData = this.createExperimentRawDataSBGrid(data.experimentRawDataSBGrid);
      }
      result.push(processed);
    }
    return result;
  }

  createXRayDatasetRows(experimentalDetail: ExperimentDetail, xrayInfo: XRayRefine | undefined): XRayStatsRow[] {
    const datasetRows: XRayStatsRow[] = [];
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
    if (xrayInfo !== undefined && xrayInfo.numMillerIndices && xrayInfo.numMillerIndices.value !== null) {
      datasetRows.push({
        metric: 'Number of reflections',
        value: [`${xrayInfo.numMillerIndices.value!}`],
        source: xrayInfo.numMillerIndices.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo['percent-free-reflections']) {
      const percFree = xrayInfo['percent-free-reflections'].value || 0;
      if (percFree > 0) {
        datasetRows.push({
          metric: 'Test set size',
          value: [`${percFree}%`],
          source: xrayInfo['percent-free-reflections'].source,
        });
      }
    }
    if (xrayInfo !== undefined && xrayInfo.DataCompleteness && xrayInfo.DataCompleteness.value !== null) {
      datasetRows.push({
        metric: 'Data completeness',
        value: [`${xrayInfo.DataCompleteness.value!}%`],
        source: xrayInfo.DataCompleteness.source,
      });
    }
    if (
      xrayInfo !== undefined &&
      xrayInfo.EDS_resolution &&
      xrayInfo.EDS_resolution.value !== null &&
      xrayInfo.EDS_resolution_low &&
      xrayInfo.EDS_resolution_low.value !== null
    ) {
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
    if (xrayInfo !== undefined && xrayInfo.TransNCS && xrayInfo.TransNCS.value !== null) {
      datasetRows.push({
        metric: 'Possible (pseudo-) translation',
        value: [`${xrayInfo.TransNCS.value!}`],
        source: xrayInfo.TransNCS.source,
      });
    }
    if (xrayInfo !== undefined && xrayInfo.WilsonBestimate && xrayInfo.WilsonBestimate.value !== null) {
      datasetRows.push({
        metric: 'Wilson B',
        value: [`${xrayInfo.WilsonBestimate.value!}`],
        source: xrayInfo.WilsonBestimate.source,
      });
    }
    return datasetRows;
  }

  createXRayRefinementRows(experimentalDetail: ExperimentDetail, xrayInfo: XRayRefine | undefined): XRayStatsRow[] {
    const refinementRows: XRayStatsRow[] = [];
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

  createNMRSampleRows(experimentalDetail: ExperimentDetail): NMRSampleRow[] {
    const sampleRows: NMRSampleRow[] = [];
    for (const nmrExperiment of experimentalDetail.nmr_experiments!) {
      if (nmrExperiment.solution_id === null || nmrExperiment.sample_contents === null) continue;

      const sampleId = nmrExperiment.solution_id || '';
      const sampleContent = nmrExperiment.sample_contents || '';
      const recordedSpectra = nmrExperiment.conditions_and_spectra[0].spectrum_type[0] || '';
      sampleRows.push({
        sample: sampleId,
        contents: [sampleContent],
        recordedSpectra: recordedSpectra,
      });
    }
    return sampleRows;
  }

  createEMSpecimenRows(experimentalDetail: ExperimentDetail): EMSpecimenPrepRow[] {
    const specimenPrepRows: EMSpecimenPrepRow[] = [];
    if (experimentalDetail.specimen_preparation && experimentalDetail.specimen_preparation?.length > 0) {
      const bufferList = experimentalDetail.specimen_preparation![0].buffer;
      if (bufferList && bufferList.length > 0) {
        for (const buffer of bufferList) {
          const bufferName = buffer.name || '-';
          const pH = buffer.ph || '-';
          const details = buffer.details || '-';

          specimenPrepRows.push({
            bufferName: bufferName,
            ph: `${pH}`,
            details: details,
          });
        }
      }
    }
    return specimenPrepRows;
  }

  createEMVitrificationRows(experimentalDetail: ExperimentDetail): EMVitrificationRow[] {
    const vitrificationRows: EMVitrificationRow[] = [];
    if (experimentalDetail.specimen_preparation && experimentalDetail.specimen_preparation?.length > 0) {
      const vitrificationList = experimentalDetail.specimen_preparation![0].vitrification;
      if (vitrificationList && vitrificationList.length > 0) {
        for (const vitrification of vitrificationList) {
          const cryogen = vitrification.cryogen || '-';
          const temperature = vitrification.temperature || '-';
          const instrument = vitrification.instrument || '-';
          const humidity = vitrification.humidity || '-';
          const details = vitrification.details || '-';

          vitrificationRows.push({
            cryogen: cryogen,
            temperature: `${temperature}`,
            instrument: instrument,
            humidity: humidity,
            details: details,
          });
        }
      }
    }
    return vitrificationRows;
  }

  createEMRefinementRows(experimentalDetail: ExperimentDetail): EMRefinementStatsRow[] {
    const refinementStatsRows: EMRefinementStatsRow[] = [];
    const resolution = experimentalDetail.resolution ? `${experimentalDetail.resolution}Å` : '-';
    refinementStatsRows.push({
      solutionMethod: experimentalDetail.experimental_method,
      resolution: resolution,
    });
    return refinementStatsRows;
  }

  // converts size in bytes to gb
  sizeInGB(bytes: number) {
    return (bytes / 1024 / 1024 / 1024).toPrecision(2);
  }

  createExperimentRawDataPDB(experimentRawDataPDB: PDBExperimentRawData[]): ExperimentalRawDatum[] {
    const rawData: ExperimentalRawDatum[] = [];
    for (const eachDatum of experimentRawDataPDB) {
      const accession = eachDatum.data_reference;
      const rawDatum: ExperimentalRawDatum = {
        resourceName: 'Item',
        tableData: [],
      };
      const tableData: ExperimentRawRow[] = [];
      let datasets = '';
      if (eachDatum.dataset_type) {
        datasets += `Type: ${eachDatum.dataset_type}\n`;
      }
      if (eachDatum.details) {
        datasets += `Details: ${eachDatum.details}`;
      }
      tableData.push({
        resource: 'Others',
        accession: accession,
        datasets: datasets.length === 0 ? '-' : datasets,
        totalSize: '-',
        link: `https://dx.doi.org/${accession}`,
      });
      rawDatum.tableData = tableData;
      rawData.push(rawDatum);
    }
    return rawData;
  }

  createExperimentRawDataBMRB(experimentRawDataBMRB: BMRBExperimentRawData[]): ExperimentalRawDatum[] {
    // unsure whether there can be multiple Exact hit bmrb accessions mapped to a PDB entry but would not be impressed. so we iterate
    const rawData: ExperimentalRawDatum[] = [];
    for (const experimentRaw of experimentRawDataBMRB) {
      const bmrbAccession = experimentRaw.bmrb_id;
      const rawDatum: ExperimentalRawDatum = {
        resourceName: 'BMRB',
        tableData: [],
      };

      const extraLinkGroups: {
        name: string;
        links: string[];
      }[] = [];
      const timeDomainLinks: string[] = [];
      let imgName: string | undefined;

      const tableData: ExperimentRawRow[] = [];
      for (const datum of experimentRaw.data) {
        // Time domain data is pushed to be shown inside table
        if (datum.data_type === 'Time domain data') {
          const size = datum.size ? this.sizeInGB(datum.size!) + 'Gb' : '-';
          tableData.push({
            resource: 'BMRB',
            accession: bmrbAccession,
            datasets: `${datum.data_sets}`,
            totalSize: size,
          });
          imgName = datum.thumbnail_url;
          timeDomainLinks.push(...datum.urls);
        }
        // All remainder data is pushed to extra links
        else {
          // we check whether a given data type is already in extra links ...
          const indexOfName = extraLinkGroups.map((extraLink) => extraLink.name).indexOf(datum.data_type);
          if (indexOfName === -1) {
            // ... before creating a new extra link for each data type
            extraLinkGroups.push({
              name: datum.data_type,
              links: datum.urls,
            });
          } else {
            // ... or adding links to an existing extra link
            extraLinkGroups[indexOfName].links.push(...datum.urls);
          }
        }
      }

      // some cases like (https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/2m68)
      // have no Time domain data, so we add an empty column to table containing only bmrbAccession
      if (bmrbAccession && tableData.length === 0) {
        tableData.push({
          resource: 'BMRB',
          accession: bmrbAccession,
          datasets: '-',
          totalSize: '-',
        });
      }
      rawDatum.tableData = tableData;
      if (imgName) rawDatum.imgName = imgName;
      if (timeDomainLinks.length > 0) rawDatum.timeDomainLinks = timeDomainLinks;
      if (extraLinkGroups.length > 0) rawDatum.extraLinkGroups = extraLinkGroups;
      rawData.push(rawDatum);
    }
    return rawData;
  }

  createExperimentRawDataIRRMC(experimentRawDataIRRMC: IRRMCExperimentRawData): ExperimentalRawDatum[] {
    const rawData: ExperimentalRawDatum[] = [];
    const rawDatum: ExperimentalRawDatum = {
      resourceName: 'IRRMC',
      tableData: [],
    };
    // data seems flat and one to many accession to pdb entries
    const tableData: ExperimentRawRow[] = [];
    tableData.push({
      resource: 'IRRMC',
      accession: experimentRawDataIRRMC.name,
      datasets: `${experimentRawDataIRRMC.number_dataset}`,
      totalSize: experimentRawDataIRRMC.total_size_gb + 'Gb',
    });
    let imgName = experimentRawDataIRRMC.thumbnail_url || undefined;
    if (imgName && !imgName.includes('https')) imgName = `https://${imgName}`;
    if (imgName) rawDatum.imgName = imgName;
    rawDatum.tableData = tableData;

    rawData.push(rawDatum);
    return rawData;
  }

  createExperimentRawDataEMPIAR(experimentRawDataEMPIAR: EMPIARExperimentRawData[]): ExperimentalRawDatum[] {
    const rawData: ExperimentalRawDatum[] = [];
    for (const experimentRaw of experimentRawDataEMPIAR) {
      const rawDatum: ExperimentalRawDatum = {
        resourceName: 'EMPIAR',
        tableData: [],
      };
      const tableData: ExperimentRawRow[] = [];
      tableData.push({
        resource: 'EMPIAR',
        accession: experimentRaw.name,
        datasets: `${experimentRaw.number_dataset}`,
        totalSize: experimentRaw.total_size_gb + 'Gb',
      });
      const imgName = experimentRaw.thumbnail_url || undefined;
      if (imgName) rawDatum.imgName = imgName;
      rawDatum.tableData = tableData;
      rawData.push(rawDatum);
    }
    return rawData;
  }

  createExperimentRawDataSBGrid(experimentRawDataSBGrid: SBGRIDExperimentRawData): ExperimentalRawDatum[] {
    const rawData: ExperimentalRawDatum[] = [];
    if (experimentRawDataSBGrid) {
      for (const experimentRaw of experimentRawDataSBGrid.datasets) {
        const rawDatum: ExperimentalRawDatum = {
          resourceName: 'SBGrid',
          tableData: [],
        };
        const tableData: ExperimentRawRow[] = [];
        tableData.push({
          resource: 'SBGrid',
          accession: experimentRaw.data_doi.split('/')[2],
          datasets: `1`,
          totalSize: experimentRaw.storage_requirements + 'b',
        });
        const imgName = experimentRaw.dataset_thumbnail_url || undefined;
        if (imgName) rawDatum.imgName = imgName;
        rawDatum.tableData = tableData;
        rawData.push(rawDatum);
      }
      return rawData;
    } else {
      return rawData;
    }
  }
}
