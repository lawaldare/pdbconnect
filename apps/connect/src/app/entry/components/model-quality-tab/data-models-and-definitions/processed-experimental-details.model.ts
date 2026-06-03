import { ProcessedQualityScores } from '../../../data-models/summary-quality-scores.model';
import { EMRefinementStatsRow, EMSpecimenPrepRow, EMVitrificationRow, ExperimentRawRow, NMRSampleRow, ValidationInfoRow, XRayStatsRow } from './table-rows.model';

export interface ProcessedExperimentalDetails {
  generalInfo: {
    methodName: string;
    resolution?: string;
    sourceOrganismsWithStrains?: { name: string; strain?: string }[];
    pdbRedoData?: ProcessedQualityScores;
    reportedRValues?: RValues;
    refinementMethod?: string;
    numberDepositedModels?: string;
    rmsdLargestDomain?: string;
    completenessChemicalShifts?: string;
  };
  validationInfo?: ValidationInfoRow[];
  sampleInfo?: SampleInfoData;
  experimentalInfo?: ExperimentalInfoData;
  experimentalRawData?: ExperimentalRawDatum[];
  timeline: {
    depositionDate: string;
    releaseDate: string;
    revisionDate: string;
  }[];
}

export interface RValues {
  rWork?: string;
  rFree?: string;
}

export interface ValidationValue {
  value: string;
  max: string;
}

export type ValidationKeys = keyof ValidationData;

export interface ValidationData {
  bonds?: ValidationValue;
  angles?: ValidationValue;
  protein_ramachandran?: ValidationValue;
  protein_sidechains?: ValidationValue;
  RSRZ?: ValidationValue;
  rna_pucker?: ValidationValue; //https://pmc.ncbi.nlm.nih.gov/articles/PMC4610813/
  rna_suite?: ValidationValue; //https://pmc.ncbi.nlm.nih.gov/articles/PMC4610813/
}

export interface SampleInfoData {
  sourceOrganismsWithStrains?: { name: string; strain?: string }[];
  expressionSystem?: string[];
  authorDesc?: string;
}

export interface ExperimentalInfoData {
  xRayBeamSource?: string;
  xRayDatasetStatsRows?: XRayStatsRow[];
  xRayRefinementStatsRows?: XRayStatsRow[];
  emRefinementStatsRows?: EMRefinementStatsRow[];
  emSpecimenRows?: EMSpecimenPrepRow[];
  emVitrificationRows?: EMVitrificationRow[];
  nmrSpectometers?: string[];
  nmrSampleRows?: NMRSampleRow[];
}

// export interface ExperimentalRawData {
//   resourceName: string;
//   tablesData: Array<ExperimentRawRow[]>;
//   additionalData?: {
//     timeDomainLinks: string[];
//     extraLinks: {
//       name: string;
//       links: string[];
//     }[];
//   }
// };
export interface ExperimentalRawDatum {
  resourceName: string;
  tableData: ExperimentRawRow[];
  imgName?: string;
  timeDomainLinks?: string[];
  extraLinkGroups?: {
    name: string;
    links: string[];
  }[];
}
