export interface PDBExperimentRawData {
  data_reference: string;
  metadata_reference: string | null;
  dataset_type: string | null;
  details: string | null;
}

export interface IRRMCExperimentRawData {
  name: string;
  pdb_id: string;
  doi: string;
  number_dataset: number;
  total_size_gb: number;
  thumbnail_url: string | null;
}

export interface SBGRIDExperimentRawData {
  pdbid: string;
  datasets: [
    {
      data_doi: string;
      storage_requirements: string;
      dataset_thumbnail_url: string;
      landing_page: string;
    },
  ];
}

interface BMRBExperimentRawDatum {
  data_type: string;
  data_sets: number;
  urls: string[];
  data_sfcategory?: string;
  size?: number;
  thumbnail_url?: string;
}

export interface BMRBExperimentRawData {
  bmrb_id: string;
  match_types: string[];
  url: string;
  data: BMRBExperimentRawDatum[];
}

export interface EMPIARExperimentRawData {
  name: string;
  doi: string;
  number_dataset: number;
  total_size_gb: number;
  thumbnail_url: string;
  pdb_id: string;
}
