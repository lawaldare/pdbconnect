import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { PDBLigandDescription, PhysChemProperties } from '../data-models/description.model';
import { PDBLigandFile } from '../data-models/download.model';

export type LigandData = {
  description: descriptionData;
  download: downloadData;
};

export type descriptionData = {
  name: string;
  synonyms: string;
  formula: string;
  inchi: string;
  inchikey: string;
  smiles: string;
  properties: PhysChemProperties;
};

export interface downloadData {
  cif: string;
  idealSDF: string;
  modelSDF: string;
  modelCML: string;
}

type APIModels = {
  descriptionData: PDBLigandDescription;
  ligandFile: PDBLigandFile;
};

@Injectable({
  providedIn: 'root',
})
export class AggregatedApiService {
  private url = 'https://www.ebi.ac.uk/pdbe/aggregated-api'; // URL to web api

  constructor(private http: HttpClient) {}

  fetchLigandPagesData(ligandId: string): Observable<APIModels> {
    const descriptionUrl = `${this.url}/compound/summary/${ligandId}`;
    const downloadUrl = `${this.url}/pdb/compound/files/${ligandId}`;

    return forkJoin([this.http.get<PDBLigandDescription>(descriptionUrl), this.http.get<PDBLigandFile>(downloadUrl)]).pipe(
      map(([descriptionData, ligandFile]) => {
        return {
          descriptionData: descriptionData,
          ligandFile: ligandFile,
        };
      })
    );
  }

  processDescriptionData(ligandId: string, data: PDBLigandDescription): descriptionData {
    const ligandSummary = data[ligandId][0];
    const ligandProperties = ligandSummary['phys_chem_properties'];

    let synonyms;

    if (ligandSummary.synonyms.length !== 0) {
      const synonymSet = new Set<string>(ligandSummary.synonyms.map((x) => x.value));
      synonyms = Array.from(synonymSet)
        .sort((x: string, y: string) => x.length - y.length)
        .reduce((x, y) => `${x}, ${y}`);
    } else {
      synonyms = ligandSummary.name;
    }

    return {
      name: ligandSummary.name,
      synonyms: synonyms,
      formula: ligandSummary.formula,
      inchi: ligandSummary.inchi,
      inchikey: ligandSummary.inchi_key,
      smiles: ligandSummary.smiles,
      properties: ligandProperties,
    };
  }

  processDownloadData(ligandId: string, data: PDBLigandFile): downloadData {
    const downloadFile = data[ligandId]['ligand']['downloads'];
    let idealSDFUrl = '';
    let modelSDFUrl = '';
    let cifUrl = '';
    let cmlUrl = '';
    for (let i = 0, l = downloadFile.length; i < l; i++) {
      if (downloadFile[i].label === 'Ideal (mmol)') {
        idealSDFUrl = downloadFile[i].url;
      } else if (downloadFile[i].label === 'Representative (mmol)') {
        modelSDFUrl = downloadFile[i].url;
      } else if (downloadFile[i].label === 'CIF dictionary') {
        cifUrl = downloadFile[i].url;
      } else if (downloadFile[i].label === 'ChemML') {
        cmlUrl = downloadFile[i].url;
      }
    }
    return {
      cif: cifUrl,
      idealSDF: idealSDFUrl,
      modelSDF: modelSDFUrl,
      modelCML: cmlUrl,
    };
  }

  processLigandPagesData(ligandId: string, data: APIModels): LigandData {
    const description = this.processDescriptionData(ligandId, data.descriptionData);
    const download = this.processDownloadData(ligandId, data.ligandFile);

    return {
      description: description,
      download: download,
    };
  }
}
