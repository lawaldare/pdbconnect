import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DataRetrievalService,
  NonNMRExperimentDetail,
  PDBEntrySummary,
  PDBEntryCitations,
  ValidationSummaryQualityScores,
  PDBEntryEntities,
} from '@pdbe-lib/shared-services';
import { PDBEntryExperiment } from '@pdbe-lib/shared-services';
import { environment } from '../../../../environments/environment';

type FromAPIOutput = {
  PDBeEntrySummary: PDBEntrySummary;
  PDBeEntryMolecules: PDBEntryEntities;
  PDBeEntryExperiment: PDBEntryExperiment;
  PDBeEntryPublications: PDBEntryCitations;
  ValidationSummaryQualityScores: ValidationSummaryQualityScores;
};

export type EntryData = {
  title: string;
  organism_scientific_names: string[];
  experimental_method: string;
  resolutionValue: string | undefined;
  releasedData: string;
  publicationTitle: string;
  publicationOrEntryAuthors: string[];
  publicationJournal: string;
  publicationVolume: string | undefined;
  publicationPage: string | undefined;
  publicationYear: string | undefined;
  publicationPMID: string | undefined;
  emdbEntries: string[];
};

@Injectable({
  providedIn: 'root',
})
export class EntryApiService {
  constructor(private dataRetrievalService: DataRetrievalService) {}

  fetchEntryPagesData(pdbId: string): Observable<FromAPIOutput> {
    const dataToRetrieve = [
      { name: 'PDBeEntrySummary', url: `${environment.pdbeApiUrl}pdb/entry/summary/${pdbId}` },
      { name: 'PDBeEntryMolecules', url: `${environment.pdbeApiUrl}pdb/entry/molecules/${pdbId}` },
      { name: 'PDBeEntryExperiment', url: `${environment.pdbeApiUrl}pdb/entry/experiment/${pdbId}` },
      { name: 'PDBeEntryPublications', url: `${environment.pdbeApiUrl}pdb/entry/publications/${pdbId}` },
      { name: 'ValidationSummaryQualityScores', url: `${environment.pdbeApiUrl}validation/summary_quality_scores/entry/${pdbId}` },
    ];
    return this.dataRetrievalService.fetchUntypedData(dataToRetrieve);
  }

  processEntryPagesData(pdbId: string, data: FromAPIOutput): EntryData {
    /**
     * Varied examples:
     *
     * Entry without relatedStructure: 1cbs, 1trn
     * Entry with multiple relatedStructure: 6uaj
     * Entry with partial publication data: 3eok, 3ovu
     * Entry with multiple source organisms: 6vw1, 2kh2
     * Entry with 3 lines of author names: 1g03
     *
     */
    // Processing logic here

    // retrieve title, organisms, method
    const title = data.PDBeEntrySummary![pdbId][0].title;

    const organism_scientific_names: string[] = data.PDBeEntryMolecules![pdbId].reduce((allNames: string[], entityDetail) => {
      if (Object.prototype.hasOwnProperty.call(entityDetail, 'source')) {
        for (const eachSource of entityDetail.source!) {
          if (!Object.prototype.hasOwnProperty.call(eachSource, 'organism_scientific_name')) {
            continue;
          }
          if (allNames.indexOf(eachSource.organism_scientific_name!) === -1) {
            allNames.push(eachSource.organism_scientific_name!);
          }
        }
      }
      return allNames;
    }, []);

    const experimental_method = data.PDBeEntryExperiment![pdbId][0].experimental_method;

    // get resolution if it exists
    let resolution = undefined;
    if (Object.prototype.hasOwnProperty.call(data.PDBeEntryExperiment![pdbId][0], 'resolution')) {
      resolution = (data.PDBeEntryExperiment![pdbId] as NonNMRExperimentDetail)[0].resolution! + '';
    }
    const resolutionValue = resolution;

    // get and format date
    const apiDate = data.PDBeEntrySummary![pdbId][0].release_date;
    const formattedApiDate = `${apiDate.substring(4, 6)}/${apiDate.substring(6)}/${apiDate.substring(0, 4)}`;
    const dateObj = new Date(Date.parse(formattedApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    const releasedData = dateObj;

    // get publication related data
    const publicationTitle = data.PDBeEntryPublications![pdbId][0].title;

    const publicationOrEntryAuthors = data.PDBeEntryPublications![pdbId][0].author_list.map((eachAuthor) => eachAuthor.full_name!);

    const publicationJournal = data.PDBeEntryPublications![pdbId][0].journal_info.pdb_abbreviation!;

    const publicationVolume = data.PDBeEntryPublications![pdbId][0].journal_info.volume!;

    let pages: string | undefined = data.PDBeEntryPublications![pdbId][0].journal_info.pages!;
    if (pages === '-') {
      pages = undefined;
    }
    const publicationPage = pages;

    let pubyear: string | undefined = data.PDBeEntryPublications![pdbId][0].journal_info.year! + '';
    if (pubyear === 'null') {
      pubyear = undefined;
    }
    const publicationYear = pubyear;

    const publicationPMID = data.PDBeEntryPublications![pdbId][0].pubmed_id!;

    // get related structures
    const emdbEntries = data.PDBeEntrySummary![pdbId][0].related_structures.map((eachRelated) => eachRelated.accession);

    return {
      title: title,
      organism_scientific_names: organism_scientific_names,
      experimental_method: experimental_method,
      resolutionValue: resolutionValue,
      releasedData: releasedData,
      publicationTitle: publicationTitle,
      publicationOrEntryAuthors: publicationOrEntryAuthors,
      publicationJournal: publicationJournal,
      publicationVolume: publicationVolume,
      publicationPage: publicationPage,
      publicationYear: publicationYear,
      publicationPMID: publicationPMID,
      emdbEntries: emdbEntries,
    };
  }
}
