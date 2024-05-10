/* tslint:disable */
/* eslint-disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export type PDBEntryFileKey = 'SIFTS' | 'PDB' | 'validation' | 'assembly' | 'molecule' | 'map';

export interface PDBEntryFiles {
  [key: string]: {
    SIFTS?: {
      downloads: PDBEntryURL[];
      views: PDBEntryURL[];
    };
    PDB?: {
      downloads: PDBEntryURL[];
      views: PDBEntryURL[];
    };
    validation?: {
      downloads: PDBEntryURL[];
      views: PDBEntryURL[];
    };
    assembly?: {
      downloads: PDBEntryURL[];
      views: PDBEntryURL[];
    };
    molecule?: {
      downloads: PDBEntryURL[];
      views: PDBEntryURL[];
    };
    map?: {
      downloads: PDBEntryURL[];
      views: PDBEntryURL[];
    };
  };
}

export interface PDBEntryURL {
  /**
   * Brief description of the file.
   */
  label: string;
  /**
   * PDBEntryURL to the file, available on both http and https.
   */
  url: string;
}
