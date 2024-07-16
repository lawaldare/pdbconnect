import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PDBLigandDescription, PhysChemProperties, FunctionalAnnotation } from '../data-models/description.model';
import { PDBLigandFile } from '../data-models/download.model';
import { PDBSubstructures, Substructure, Depiction } from '../data-models/structure.model';
import { PDBRelatedLigands, BoundEntries, RelatedLigand } from '../data-models/related-ligands.model';
import { PDBIntxData, IntxDataUrl } from '../data-models/interaction.model';
import { shareReplay, map } from 'rxjs';

export interface DescriptionData {
  name: string;
  synonyms: string;
  formula: string;
  inchi: string;
  inchikey: string;
  smiles: string;
  properties: PhysChemProperties;
  annotations: FunctionalAnnotation[];
}

export interface downloadData {
  cif: string;
  idealSDF: string;
  modelSDF: string;
  modelCML: string;
}

@Injectable({
  providedIn: 'root',
})
export class AggregatedApiService {
  private api_url = 'https://wwwdev.ebi.ac.uk/pdbe/aggregated-api'; // URL to web api
  private static_url = 'https://www.ebi.ac.uk/pdbe/static/files/pdbechem_v2'; //URL to static ligand files

  constructor(private http: HttpClient) {}

  fetchDescription(ligandId: string): Observable<PDBLigandDescription> {
    const descriptionUrl = `${this.api_url}/compound/summary/${ligandId}`;
    return this.http.get<PDBLigandDescription>(descriptionUrl);
  }

  fetchDownload(ligandId: string): Observable<PDBLigandFile> {
    const downloadUrl = `${this.api_url}/pdb/compound/files/${ligandId}`;
    return this.http.get<PDBLigandFile>(downloadUrl);
  }

  fetchSubstructures(ligandId: string): Observable<PDBSubstructures> {
    const substructureUrl = `${this.api_url}/compound/substructures/${ligandId}`;
    return this.http.get<PDBSubstructures>(substructureUrl);
  }

  fetchDepiction(ligandId: string): Observable<Depiction> {
    const depictionUrl = `${this.static_url}/${ligandId}/annotation`;
    return this.http.get<Depiction>(depictionUrl).pipe(shareReplay(1));
  }

  fetchRelatedLigands(ligandId: string): Observable<RelatedLigand> {
    const relatedLigandUrl = `${this.api_url}/compound/similarity/${ligandId}`;
    const relatedLigand = this.http.get<PDBRelatedLigands>(relatedLigandUrl).pipe(
      shareReplay(1),
      map((relatedLigands: PDBRelatedLigands) => {
        return relatedLigands[ligandId][0];
      })
    );
    return relatedLigand;
  }

  fetchBoundEntries(ligandId: string): Observable<string[]> {
    const boundEntryURL = `${this.api_url}/pdb/compound/in_pdb/${ligandId}`;
    const boundEntries = this.http.get<BoundEntries>(boundEntryURL).pipe(
      shareReplay(1),
      map((boundEntries: BoundEntries) => {
        return boundEntries[ligandId];
      })
    );
    return boundEntries;
  }

  fetchIntxData(ligandId: string): Observable<IntxDataUrl> {
    const IntxUrl = `${this.api_url}/compound/interaction/${ligandId}`;
    return this.http.get<PDBIntxData>(IntxUrl).pipe(
      map((interactions: PDBIntxData) => ({
        IntxUrl: IntxUrl,
        interactions: interactions,
      })),
      shareReplay(1)
    );
  }

  processDescriptionData(ligandId: string, data: PDBLigandDescription): DescriptionData {
    const ligandSummary = data[ligandId][0];
    const ligandProperties = ligandSummary['phys_chem_properties'];
    const ligandAnnotations = ligandSummary['functional_annotations'];

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
      annotations: ligandAnnotations,
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

  processSubstructures(ligandId: string, data: PDBSubstructures): Substructure {
    const ligandSubstructures = data[ligandId][0];
    return ligandSubstructures;
  }
}
