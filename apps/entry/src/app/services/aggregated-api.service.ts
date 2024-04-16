import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { PDBEntrySummary } from '../data-models/api/entry/summary.model';
import { PDBEntryEntities } from '../data-models/api/entry/molecules.model';
import { NonNMRExperimentDetail, PDBEntryExperiment } from '../data-models/api/entry/experiment.model';
import { PDBEntryCitations } from '../data-models/api/entry/publication.model';

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

type APIModels = {
  summaryData: PDBEntrySummary;
  moleculesData: PDBEntryEntities;
  experimentsData: PDBEntryExperiment;
  publicationsData: PDBEntryCitations;
};

@Injectable({
  providedIn: 'root',
})
export class AggregatedApiService {
  private url = 'https://www.ebi.ac.uk/pdbe/api/pdb'; // URL to web api

  constructor(private http: HttpClient) {}

  fetchEntryPagesData(pdbId: string): Observable<APIModels> {
    const summaryUrl = `${this.url}/entry/summary/${pdbId}`;
    const moleculesUrl = `${this.url}/entry/molecules/${pdbId}`;
    const experimentUrl = `${this.url}/entry/experiment/${pdbId}`;
    const publicationsUrl = `${this.url}/entry/publications/${pdbId}`;

    return forkJoin([
      this.http.get<PDBEntrySummary>(summaryUrl),
      this.http.get<PDBEntryEntities>(moleculesUrl),
      this.http.get<PDBEntryExperiment>(experimentUrl),
      this.http.get<PDBEntryCitations>(publicationsUrl),
    ]).pipe(
      map(([summaryData, moleculesData, experimentsData, publicationsData]) => {
        return {
          summaryData: summaryData,
          moleculesData: moleculesData,
          experimentsData: experimentsData,
          publicationsData: publicationsData,
        };
      })
    );
  }

  processEntryPagesData(pdbId: string, data: APIModels): EntryData {
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
    const title = data.summaryData[pdbId][0].title;
    const organism_scientific_names: string[] = data.moleculesData[pdbId].reduce((allNames: string[], entityDetail) => {
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
    const experimental_method = data.experimentsData[pdbId][0].experimental_method;

    // get resolution if it exists
    let resolution = undefined;
    if (Object.prototype.hasOwnProperty.call(data.experimentsData[pdbId][0], 'resolution')) {
      resolution = (data.experimentsData[pdbId] as NonNMRExperimentDetail)[0].resolution! + '';
    }
    const resolutionValue = resolution;

    // get and format date
    const apiDate = data.summaryData[pdbId][0].release_date;
    const formattedApiDate = `${apiDate.substring(4, 6)}/${apiDate.substring(6)}/${apiDate.substring(0, 4)}`;
    const dateObj = new Date(Date.parse(formattedApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    const releasedData = dateObj;

    // get publication related data
    const publicationTitle = data.publicationsData[pdbId][0].title;
    const publicationOrEntryAuthors = data.publicationsData[pdbId][0].author_list.map((eachAuthor) => eachAuthor.full_name!);
    const publicationJournal = data.publicationsData[pdbId][0].journal_info.pdb_abbreviation!;
    const publicationVolume = data.publicationsData[pdbId][0].journal_info.volume!;
    let pages: string | undefined = data.publicationsData[pdbId][0].journal_info.pages!;
    if (pages === '-') {
      pages = undefined;
    }
    const publicationPage = pages;
    let pubyear: string | undefined = data.publicationsData[pdbId][0].journal_info.year! + '';
    if (pubyear === 'null') {
      pubyear = undefined;
    }
    const publicationYear = pubyear;
    const publicationPMID = data.publicationsData[pdbId][0].pubmed_id!;

    // get related structures
    const emdbEntries = data.summaryData[pdbId][0].related_structures.map((eachRelated) => eachRelated.accession);

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
