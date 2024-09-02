import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DataRetrievalService,
  NonNMRExperimentDetail,
  NonNMRorEMExperimentDetail,
  PDBEntrySummary,
  PDBEntryCitations,
  ValidationSummaryQualityScores,
  PDBEntryEntities,
  PDBComplexRoot,
  PDBCompoundSummary,
  PDBEntryModifiedAAorNA,
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

/**
 * https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/grails-app/controllers/pdb/PdbController.groovy
 * https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/grails-app/services/pdb/PdbapiService.groovy
 * https://gitlab.ebi.ac.uk/pdbe/webapps/karakoram/-/blob/master/grails-app/conf/Config.groovy
 */

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
  organismScientificNames: string[];
  experimentalMethod: string;
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

type FromAPIOutputAltOne = {
  PDBeEntrySummary: PDBEntrySummary;
  PDBeEntryMolecules: PDBEntryEntities;
  PDBeEntryExperiment: PDBEntryExperiment;
  PDBeEntryPublications: PDBEntryCitations;
  PDBEntryFiles: PDBEntryFiles;
  ValidationSummaryQualityScores: ValidationSummaryQualityScores;
  PDBRedoQualityScores: PDBRedoQualityScores;
  PDBComplexData: PDBComplexRoot;
  PDBEntryModifiedAAorNA: PDBEntryModifiedAAorNA;
};

export type EntryDataAltOne = {
  title: string;
  organismScientificNames: string[];
  experimentalMethod: string;
  resolutionValue: string | undefined;
  rWorkValue: string | undefined;
  rFreeValue: string | undefined;
  releasedData: string;
  publicationTitle: string;
  publicationOrEntryAuthors: string[];
  publicationJournal: string;
  publicationVolume: string | undefined;
  publicationPage: string | undefined;
  publicationYear: string | undefined;
  publicationPMID: string | undefined;
  publicationDOI: string | undefined;
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
  complexId?: string;
  complexName?: string;
  polymericEntitiesList: string[];
  smallMoleculesList: { text: string; nested: boolean }[];
};

@Injectable({
  providedIn: 'root',
})
export class EntryApiService {
  constructor(private dataRetrievalService: DataRetrievalService) {}

  fetchEntryPagesData(pdbId: string): Observable<FromAPIOutput> {
    const dataToRetrieve = [
      { name: 'PDBeEntrySummary', url: `${environment.pdbeBaseUrl}pdb/entry/summary/${pdbId}` },
      { name: 'PDBeEntryMolecules', url: `${environment.pdbeBaseUrl}pdb/entry/molecules/${pdbId}` },
      { name: 'PDBeEntryExperiment', url: `${environment.pdbeBaseUrl}pdb/entry/experiment/${pdbId}` },
      { name: 'PDBeEntryPublications', url: `${environment.pdbeBaseUrl}pdb/entry/publications/${pdbId}` },
      { name: 'PDBEntryFiles', url: `${environment.pdbeBaseUrl}pdb/entry/files/${pdbId}` },
      { name: 'ValidationSummaryQualityScores', url: `${environment.pdbeBaseUrl}validation/summary_quality_scores/entry/${pdbId}` },
      { name: 'PDBRedoQualityScores', url: `https://pdb-redo.eu/db/${pdbId}/pdbe.json` },
    ];
    return this.dataRetrievalService.fetchUntypedData(dataToRetrieve);
  }

  fetchEntryPagesAltOneData(pdbId: string): Observable<FromAPIOutputAltOne> {
    const dataToRetrieve = [
      { name: 'PDBeEntrySummary', url: `${environment.pdbeBaseUrl}pdb/entry/summary/${pdbId}` },
      { name: 'PDBeEntryMolecules', url: `${environment.pdbeBaseUrl}pdb/entry/molecules/${pdbId}` },
      { name: 'PDBeEntryExperiment', url: `${environment.pdbeBaseUrl}pdb/entry/experiment/${pdbId}` },
      { name: 'PDBeEntryPublications', url: `${environment.pdbeBaseUrl}pdb/entry/publications/${pdbId}` },
      { name: 'PDBEntryFiles', url: `${environment.pdbeBaseUrl}pdb/entry/files/${pdbId}` },
      { name: 'ValidationSummaryQualityScores', url: `${environment.pdbeBaseUrl}validation/summary_quality_scores/entry/${pdbId}` },
      { name: 'PDBRedoQualityScores', url: `https://pdb-redo.eu/db/${pdbId}/pdbe.json` },
      { name: 'PDBComplexData', url: `${environment.pdbeBaseUrl}aggregated-api/complex/details/${pdbId}?id_type=pdb_id` },
      { name: 'PDBEntryModifiedAAorNA', url: `${environment.pdbeBaseUrl}pdb/entry/modified_AA_or_NA/${pdbId}` },
      // GET /pdb/entry/cofactor/{pdb_id} ???
    ];
    return this.dataRetrievalService.fetchUntypedData(dataToRetrieve);
  }

  fetchLigandSummariesForEntry(chemCompIds: string[]): Observable<{ [key: string]: PDBCompoundSummary }> {
    const dataToRetrieve = chemCompIds.map((chemCompId) => {
      return { name: chemCompId, url: `${environment.pdbeBaseUrl}api/pdb/compound/summary/${chemCompId}` };
    });
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

    const organismScientificNames: string[] = data.PDBeEntryMolecules![pdbId].reduce((allNames: string[], entityDetail) => {
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

    const experimentalMethod = data.PDBeEntryExperiment![pdbId][0].experimental_method;

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
      organismScientificNames: organismScientificNames,
      experimentalMethod: experimentalMethod,
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

  processEntryPagesAltOneData(pdbId: string, data: FromAPIOutputAltOne): EntryDataAltOne {
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
     * NMR structure: 2azv
     * Carbohydrate structure: 3irj
     * Protein and DNA/RNA hybrid structure: 2q2u
     * DNA/RNA hybrid structure: 3c7r
     * D-protein: 3tjw
     * NMR RNA structure: 2pcv
     * Protein DNA structure: 3rnu
     * Has cofactor annotation: 5hht
     *
     */
    // Processing logic here

    // retrieve title, organisms, method

    // parsing of entry title to display in main > summary
    const title = data.PDBeEntrySummary![pdbId][0].title;
    // end of parsing of entry title

    // parsing of entry organisms to display in main > summary
    const organismScientificNames: string[] = data.PDBeEntryMolecules![pdbId].reduce((allNames: string[], entityDetail) => {
      if (Object.prototype.hasOwnProperty.call(entityDetail, 'source')) {
        for (const eachSource of entityDetail.source!) {
          if (!Object.prototype.hasOwnProperty.call(eachSource, 'organism_scientific_name')) {
            continue;
          }
          if (!eachSource.organism_scientific_name) continue;
          if (allNames.indexOf(eachSource.organism_scientific_name) === -1) {
            allNames.push(eachSource.organism_scientific_name);
          }
        }
      }
      return allNames;
    }, []);
    // end of parsing of entry organisms

    // parsing of entry experimental method to display in main > summary
    const experimentalMethod = data.PDBeEntryExperiment![pdbId][0].experimental_method;
    // end of parsing of entry experimental method

    // parsing of entry resolution (if exists) to display in main right panel below molstar
    let resolution: number | null | string | undefined = undefined;
    if (Object.prototype.hasOwnProperty.call(data.PDBeEntryExperiment![pdbId][0], 'resolution')) {
      resolution = (data.PDBeEntryExperiment![pdbId] as NonNMRExperimentDetail)[0].resolution;
      if (resolution) resolution = resolution + '';
      else resolution = undefined;
    }
    const resolutionValue = resolution;
    // end of parsing entry resolution

    // parsing of entry R work (if exists) to display in main right panel below molstar
    let rWork: number | null | string | undefined = undefined;
    if (Object.prototype.hasOwnProperty.call(data.PDBeEntryExperiment![pdbId][0], 'r_work')) {
      rWork = (data.PDBeEntryExperiment![pdbId] as NonNMRorEMExperimentDetail)[0].r_work;
      if (rWork) rWork = rWork + '';
      else rWork = undefined;
    }
    const rWorkValue = rWork;
    // end of parsing entry R work

    // parsing of entry R free (if exists) to display in main right panel below molstar
    let rFree: number | null | string | undefined = undefined;
    if (Object.prototype.hasOwnProperty.call(data.PDBeEntryExperiment![pdbId][0], 'r_free')) {
      rFree = (data.PDBeEntryExperiment![pdbId] as NonNMRorEMExperimentDetail)[0].r_free;
      if (rFree) rFree = rFree + '';
      else rFree = undefined;
    }
    const rFreeValue = rFree;
    // end of parsing entry R free

    // parsing of entry released date to display in main > summary
    const apiDate = data.PDBeEntrySummary![pdbId][0].release_date;
    const formattedApiDate = `${apiDate.substring(4, 6)}/${apiDate.substring(6)}/${apiDate.substring(0, 4)}`;
    const dateObj = new Date(Date.parse(formattedApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
    const releasedData = dateObj;
    // end of parsing entry released date

    // parsing of entry publication related data to display in main > summary
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
    const publicationDOI = data.PDBeEntryPublications![pdbId][0].doi!;
    // end of parsing entry publication related data

    // get related structures
    const emdbEntries = data.PDBeEntrySummary![pdbId][0].related_structures.map((eachRelated) => eachRelated.accession);
    // end of parsing related structures

    // parsing of entry available files, displayed in main > dropdown links

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
    // end of entry files parsing

    // parsing of entry quality scores, displayed in main > right panel below molstar
    let qualityScores: { geometry: number; modelfit: number } | undefined = undefined;
    if (data.ValidationSummaryQualityScores) {
      // process data from our endpoints to a 0-4 integer to plot
      qualityScores = {
        geometry: Math.floor(data.ValidationSummaryQualityScores![pdbId].geometry_quality / 100.0 / 0.2),
        modelfit: Math.floor(data.ValidationSummaryQualityScores![pdbId].data_quality / 100.0 / 0.2),
      };
    }
    // end of entry quality scores parsing

    // parsing of pdb redo scores, displayed in main > right panel below molstar
    let PDBRedoQualityScores:
      | {
          geometry: number | undefined;
          modelfit: number | undefined;
          basepairs?: number | undefined;
        }
      | undefined;
    if (data.PDBRedoQualityScores) {
      // process data from pdb redo to a 0-4 integer to plot
      PDBRedoQualityScores = {
        geometry: this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'geometry'),
        modelfit: this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'modelfit'),
      };

      if (data.PDBRedoQualityScores['base-pairs']) PDBRedoQualityScores['basepairs'] = this.processPDBRedoQualityScores(data.PDBRedoQualityScores, 'basepairs');
    }
    // end of entry pdb redo scores parsing

    // parsing of complex name and id, displayed in main > summary
    const complexId = data.PDBComplexData ? data.PDBComplexData![pdbId][0].pdb_complex_id : undefined;
    const complexName = data.PDBComplexData ? data.PDBComplexData![pdbId][0].name : undefined;
    // end of entry complex name and id parsing

    // parsing of polymeric entities and small molecules counts, displayed in main > summary
    const polymericEntitiesList: string[] = [];
    const smallMoleculesList: { text: string; nested: boolean }[] = [];
    const entityCounts: { [key: string]: number } = {};
    const chemCompIdList: string[] = [];
    for (const entity of data.PDBeEntryMolecules![pdbId]) {
      /**
       * Entities are counted by molecular type
       */
      if (!Object.prototype.hasOwnProperty.call(entityCounts, entity.molecule_type)) {
        entityCounts[entity.molecule_type] = 0;
      }
      entityCounts[entity.molecule_type] += 1;

      /**
       * Unique ligand chem comp IDs are retrieved (ex: STI)
       */
      let validChemCompIds: string[] = [];
      if (entity.chem_comp_ids) {
        validChemCompIds = entity.chem_comp_ids.filter((chemCompId) => chemCompId);
      }
      if (entity.molecule_type === 'bound' && entity.chem_comp_ids) {
        chemCompIdList.push(...validChemCompIds);
      }
    }

    /**
     * Counts for moleculer type are converted to text
     */
    for (const [moleculeType, moleculeCount] of Object.entries(entityCounts)) {
      if (moleculeType === 'polypeptide(L)') {
        const definition = moleculeCount > 1 ? 'L-proteins' : 'L-protein';
        polymericEntitiesList.push(`${moleculeCount} distinct ${definition}`);
      } else if (moleculeType === 'polypeptide(D)') {
        const definition = moleculeCount > 1 ? 'D-proteins' : 'D-protein';
        polymericEntitiesList.push(`${moleculeCount} distinct ${definition}`);
      } else if (moleculeType === 'polyribonucleotide') {
        const definition = moleculeCount > 1 ? 'RNA molecules' : 'RNA molecule';
        polymericEntitiesList.push(`${moleculeCount} distinct ${definition}`);
      } else if (moleculeType === 'polydeoxyribonucleotide') {
        const definition = moleculeCount > 1 ? 'DNA molecules' : 'DNA molecule';
        polymericEntitiesList.push(`${moleculeCount} distinct ${definition}`);
      } else if (moleculeType === 'polydeoxyribonucleotide/polyribonucleotide hybrid') {
        const definition = moleculeCount > 1 ? 'DNA/RNA hybrid molecules' : 'DNA/RNA hybrid molecule';
        polymericEntitiesList.push(`${moleculeCount} distinct ${definition}`);
      } else if (moleculeType === 'carbohydrate polymer') {
        const definition = moleculeCount > 1 ? 'carbohydrate polymers' : 'carbohydrate polymer';
        polymericEntitiesList.push(`${moleculeCount} distinct ${definition}`);
      } else if (moleculeType === 'bound') {
        const definition = moleculeCount > 1 ? 'ligands' : 'ligand';
        smallMoleculesList.push({ text: `${moleculeCount} unique bound ${definition}`, nested: false });
      }
    }

    let modifiedDefinition = 'modified residue';
    if (data.PDBEntryModifiedAAorNA) {
      const uniqueModifications = data.PDBEntryModifiedAAorNA[pdbId]
        .map((eachModification) => {
          return eachModification.chem_comp_id;
        })
        .filter((value, index, array) => {
          return array.indexOf(value) === index;
        });
      if (uniqueModifications.length > 1) modifiedDefinition = 'modified residues';
      smallMoleculesList.push({ text: `${uniqueModifications.length} unique ${modifiedDefinition}`, nested: false });
    }

    // /**
    //  * Data for each unique ligand (chem comp id is retrieved)
    //  */
    // const ligandSummariesForEntry = await firstValueFrom(this.fetchLigandSummariesForEntry(chemCompIdList));
    // for (const chemCompId of chemCompIdList) {
    //   const chemCompIdData = ligandSummariesForEntry[chemCompId][chemCompId];
    //   if (chemCompIdData.length > 0) {
    //     const chemCompIdDatum = chemCompIdData[0];
    //     /**
    //      * This data is parsed in order to retrieve functional annotations
    //      */
    //     for (const funcAnnotation of chemCompIdDatum.functional_annotations) {
    //       /**
    //        * Finally counts for each functional annotation categories are done
    //        * (drug molecules, cofactor like, reactant like)
    //        */
    //     }
    //   }
    // }
    // end of entry polymeric entities and small molecules parsing

    // console.log("chemCompIdList")
    // console.log(chemCompIdList)
    // console.log("ligandSummariesForEntry")
    // if (chemCompIdList) console.log(ligandSummariesForEntry[chemCompIdList[0]][chemCompIdList[0]][0])
    //   if (chemCompIdList) console.log(ligandSummariesForEntry[chemCompIdList[0]][chemCompIdList[0]][0].functional_annotations)

    return {
      title: title,
      organismScientificNames: organismScientificNames,
      experimentalMethod: experimentalMethod,
      resolutionValue: resolutionValue,
      rWorkValue: rWorkValue,
      rFreeValue: rFreeValue,
      releasedData: releasedData,
      publicationTitle: publicationTitle,
      publicationOrEntryAuthors: publicationOrEntryAuthors,
      publicationJournal: publicationJournal,
      publicationVolume: publicationVolume,
      publicationPage: publicationPage,
      publicationYear: publicationYear,
      publicationPMID: publicationPMID,
      publicationDOI: publicationDOI,
      emdbEntries: emdbEntries,
      fileURLs: {
        downloads: entryDownloadURLsProcessed,
        views: entryViewURLsProcessed,
      },
      qualityScores: {
        pdb: qualityScores,
        pdbredo: PDBRedoQualityScores,
      },
      complexId: complexId,
      complexName: complexName,
      polymericEntitiesList: polymericEntitiesList,
      smallMoleculesList: smallMoleculesList,
    };
  }
}
