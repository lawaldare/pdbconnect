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
import { PDBEntryExperiment, PDBEntryFiles, PDBEntryURL, PDBEntryFileKey } from '@pdbe-lib/shared-services';
import { environment } from '../../../../environments/environment';

type PDBRedoQualityScores = {
  pdbid: string;
  ddatafit?: {
    zdfree: number;
    'range-lower': number;
    'range-upper': number;
  };
  geometry?: {
    dzscore: number;
    'range-lower': number;
    'range-upper': number;
  };
  'base-pairs'?: {
    drmsz: number;
    'range-lower': number;
    'range-upper': number;
  };
};

type EntryUrl = { name: string; url: string; downloadable: boolean };

type FromAPIOutput = {
  PDBeEntrySummary: PDBEntrySummary;
  PDBeEntryMolecules: PDBEntryEntities;
  PDBeEntryExperiment: PDBEntryExperiment;
  PDBeEntryPublications: PDBEntryCitations;
  PDBEntryFiles: PDBEntryFiles;
  ValidationSummaryQualityScores: ValidationSummaryQualityScores;
  PDBRedoQualityScores: PDBRedoQualityScores;
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
  fileURLs: {
    downloads: EntryUrl[];
    views: EntryUrl[];
  };
  qualityScores: {
    pdb?: {
      geometry: number | undefined;
      modelfit: number | undefined;
    };
    pdbredo?: {
      geometry: number | undefined;
      basepairs?: number | undefined;
      modelfit: number | undefined;
    };
  };
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
      { name: 'PDBEntryFiles', url: `${environment.pdbeApiUrl}pdb/entry/files/${pdbId}` },
      { name: 'ValidationSummaryQualityScores', url: `${environment.pdbeApiUrl}validation/summary_quality_scores/entry/${pdbId}` },
      { name: 'PDBRedoQualityScores', url: `https://pdb-redo.eu/db/${pdbId}/pdbe.json` },
    ];
    return this.dataRetrievalService.fetchUntypedData(dataToRetrieve);
  }

  processPDBRedoQualityScores(data: PDBRedoQualityScores, typeToProcess: 'geometry' | 'modelfit' | 'basepairs') {
    // Taken from: https://github.com/PDBeurope/pdb-redo/blob/master/src/app/index.ts#L55-L86
    // and https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/web-app/js/widgets/validation_summary.js#L204-233
    let dataToProcess:
      | {
          drmsz?: number;
          zdfree?: number;
          dzscore?: number;
          'range-lower': number;
          'range-upper': number;
        }
      | undefined = undefined;
    let score: number | undefined = undefined;
    if (typeToProcess === 'geometry') {
      dataToProcess = data.geometry;
      if (!dataToProcess) {
        return undefined;
      }
      score = dataToProcess.dzscore!;
    } else if (typeToProcess === 'modelfit') {
      dataToProcess = data.ddatafit;
      if (!dataToProcess) {
        return undefined;
      }
      score = dataToProcess.zdfree!;
    }
    // else if (typeToProcess === "basepairs") {
    else {
      dataToProcess = data['base-pairs'];
      if (!dataToProcess) {
        return undefined;
      }
      score = dataToProcess.drmsz;
    }
    if (!score) {
      return undefined;
    }

    const dataRange = dataToProcess['range-upper'] - dataToProcess['range-lower'];
    const dataUnitRange = dataRange / 5;

    let subtractor = 1;
    for (let i = 4; i > 0; i--) {
      if (score > dataToProcess['range-upper'] - dataUnitRange * subtractor) {
        return i;
      }
      subtractor++;
    }
    return 0;
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
     * Huge assembly: 7v08
     * Chimeric fusion protein: 6hr1
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
    let resolution: string | undefined = undefined;
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

    // from api endpoint input array
    let entryDownloadURLs: PDBEntryURL[] = [];
    let entryViewURLs: PDBEntryURL[] = [];

    // to template output array
    let entryDownloadURLsProcessed: EntryUrl[] = [];
    let entryViewURLsProcessed: EntryUrl[] = [];

    // code below mimicks what is done in grails:
    // https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/grails-app/taglib/pdbe/ViewsAndDownloadsMenuTagLib.groovy#L44-84
    const downloadGrailsOrder = ['PDB', 'map', 'assembly', 'molecule', 'SIFTS', 'validation'];
    for (const downloadKey of downloadGrailsOrder) {
      if (Object.prototype.hasOwnProperty.call(data.PDBEntryFiles[pdbId], <PDBEntryFileKey>downloadKey)) {
        entryDownloadURLs.push(...data.PDBEntryFiles[pdbId][<PDBEntryFileKey>downloadKey]!.downloads);
      }
    }
    const viewGrailsOrder = ['PDB', 'assembly', 'molecule', 'SIFTS', 'validation'];
    for (const viewKey of viewGrailsOrder) {
      if (Object.prototype.hasOwnProperty.call(data.PDBEntryFiles[pdbId], <PDBEntryFileKey>viewKey)) {
        entryViewURLs.push(...data.PDBEntryFiles[pdbId][<PDBEntryFileKey>viewKey]!.views);
      }
    }

    // after url list is retrieved we reorder some of it according to usability results from internal survey
    const designOrderForDownload = [
      'Archive mmCIF file',
      'Updated mmCIF file',
      'PDB file',
      'Compatible PDB file bundle (tar.gz)',
      'FASTA (Entry)',
      'Full report (PDF)',
    ];
    entryDownloadURLs = entryDownloadURLs.sort((url1, url2) => {
      const hasFirst = designOrderForDownload.indexOf(url1.label);
      const hasSecond = designOrderForDownload.indexOf(url2.label);
      // if designOrder has both labels, sort according to index
      if (hasFirst > -1 && hasSecond > -1) return hasFirst - hasSecond;
      // else if only one label is in designOrder, make it come first
      else if (hasFirst > -1) return -1;
      else if (hasSecond > -1) return 1;
      // for all other cases, keep ordering as it is
      return 0;
    });
    entryDownloadURLsProcessed = entryDownloadURLs.map((eachUrlObj) => {
      return { name: eachUrlObj.label, url: eachUrlObj.url, downloadable: true };
    });
    const designOrderForView = ['Archive mmCIF file', 'Updated mmCIF file', 'PDB file', 'Compatible PDB file bundle (tar.gz)', 'FASTA (Entry)', 'Full report (PDF)'];
    entryViewURLs = entryViewURLs.sort((url1, url2) => {
      const hasFirst = designOrderForView.indexOf(url1.label);
      const hasSecond = designOrderForView.indexOf(url2.label);
      // if designOrder has both labels, sort according to index
      if (hasFirst > -1 && hasSecond > -1) return hasFirst - hasSecond;
      // else if only one label is in designOrder, make it come first
      else if (hasFirst > -1) return -1;
      else if (hasSecond > -1) return 1;
      // for all other cases, keep ordering as it is
      return 0;
    });
    entryViewURLsProcessed = entryViewURLs.map((eachUrlObj) => {
      return { name: eachUrlObj.label, url: eachUrlObj.url, downloadable: false };
    });

    // process data from our endpoints to a 0-4 integer to plot
    let qualityScores: { geometry: number; modelfit: number } | undefined = undefined;
    if (data.ValidationSummaryQualityScores) {
      qualityScores = {
        geometry: Math.floor(data.ValidationSummaryQualityScores![pdbId].geometry_quality / 100.0 / 0.2),
        modelfit: Math.floor(data.ValidationSummaryQualityScores![pdbId].data_quality / 100.0 / 0.2),
      };
    }

    // process data from pdb redo to a 0-4 integer to plot
    let PDBRedoQualityScores:
      | {
          geometry: number | undefined;
          modelfit: number | undefined;
          basepairs?: number | undefined;
        }
      | undefined;

    if (data.PDBRedoQualityScores) {
      PDBRedoQualityScores = {
        geometry: this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'geometry'),
        modelfit: this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'modelfit'),
      };

      if (data.PDBRedoQualityScores['base-pairs']) PDBRedoQualityScores['basepairs'] = this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'basepairs');
    }

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
      fileURLs: {
        downloads: entryDownloadURLsProcessed,
        views: entryViewURLsProcessed,
      },
      qualityScores: {
        pdb: qualityScores,
        pdbredo: PDBRedoQualityScores,
      },
    };
  }
}
