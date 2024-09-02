import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PDBLigandDescription, PhysChemProperties, FunctionalAnnotation } from '../data-models/description.model';
import { PDBLigandFile } from '../data-models/download.model';
import { Depiction, LigandStructure, LigandStructuresAPIResponse, PDBSubstructures } from '../data-models/structure.model';
import { PDBRelatedLigands, RelatedLigand } from '../data-models/related-ligands.model';
import { PDBIntxData, IntxDataUrl } from '../data-models/interaction.model';
import { shareReplay, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DescriptionData {
  name: string;
  synonyms: string;
  formula: string;
  inchi: string;
  inchikey: string;
  smiles: { program: string; version: string; name: string }[];
  properties: PhysChemProperties;
  annotations: FunctionalAnnotation[];
  crossLinks: CrossLink[];
}

export interface downloadData {
  cif: string;
  idealSDF: string;
  modelSDF: string;
  modelCML: string;
}

export interface CrossLink {
  resource: string;
  resource_id: string;
}

export interface Atom {
  atom_name: string;
  pdb_name: string;
  element: string;
  leaving_atom: boolean;
  charge: number;
  stereo: string;
  aromatic: boolean;
  ideal_x: number;
  ideal_y: number;
  ideal_z: number;
}

export interface Bond {
  atom_1: string;
  atom_2: string;
  bond_type: string;
  bond_order: number;
  aromatic: boolean;
  stereo: boolean;
  ideal_length: number;
}

@Injectable({
  providedIn: 'root',
})
export class AggregatedApiService {
  private readonly AggregatedApiUrl = `${environment.pdbeBaseUrl}aggregated-api/`;
  private readonly StaticFilesApiUrl = `${environment.pdbeBaseUrl}static/files/pdbechem_v2/`;
  private readonly CompoundApiUrl = `${environment.pdbeBaseUrl}api/pdb/compound/`;

  constructor(private http: HttpClient) {}

  fetchDescription(ligandId: string): Observable<PDBLigandDescription> {
    const descriptionUrl = `${this.AggregatedApiUrl}/pdb/compound/summary/${ligandId}`;
    return this.http.get<PDBLigandDescription>(descriptionUrl);
  }

  fetchDownload(ligandId: string): Observable<PDBLigandFile> {
    const downloadUrl = `${this.AggregatedApiUrl}/pdb/compound/files/${ligandId}`;
    return this.http.get<PDBLigandFile>(downloadUrl);
  }

  fetchSubstructures(ligandId: string): Observable<PDBSubstructures> {
    const substructureUrl = `${this.AggregatedApiUrl}/compound/substructures/${ligandId}`;
    return this.http.get<PDBSubstructures>(substructureUrl);
  }

  fetchLigandStructures(ligandId: string): Observable<LigandStructure[]> {
    const ligandStructureAPI = `${this.AggregatedApiUrl}/compound/uniprot/${ligandId}`;
    return this.http.get<LigandStructuresAPIResponse>(ligandStructureAPI).pipe(map((data) => data[ligandId]));
  }

  fetchDepiction(ligandId: string): Observable<Depiction> {
    const depictionUrl = `${this.StaticFilesApiUrl}/${ligandId}/annotation`;
    return this.http.get<Depiction>(depictionUrl).pipe(shareReplay(1));
  }

  fetchRelatedLigands(ligandId: string): Observable<RelatedLigand> {
    const relatedLigandUrl = `${this.AggregatedApiUrl}/compound/similarity/${ligandId}`;
    const relatedLigand = this.http.get<PDBRelatedLigands>(relatedLigandUrl).pipe(
      shareReplay(1),
      map((relatedLigands: PDBRelatedLigands) => {
        return relatedLigands[ligandId][0];
      })
    );
    return relatedLigand;
  }

  fetchBoundEntries(ligandId: string): Observable<any> {
    const boundEntryURL = `${this.AggregatedApiUrl}/pdb/compound/in_pdb/${ligandId}`;
    const boundEntries = this.http.get<any>(boundEntryURL);
    return boundEntries;
  }

  fetchIntxData(ligandId: string): Observable<IntxDataUrl> {
    const IntxUrl = `${this.AggregatedApiUrl}/compound/interaction/${ligandId}`;
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
    const ligandCrossLinks = ligandSummary['cross_links'];

    let synonyms;

    if (ligandSummary.synonyms) {
      const synonymSet = new Set<string>(ligandSummary?.synonyms?.map((x) => x.value));
      synonyms = Array.from(synonymSet)
        .sort((x: string, y: string) => x.length - y.length)
        .reduce((x, y) => `${x}, ${y}`);
    } else {
      synonyms = ligandSummary?.name;
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
      crossLinks: ligandCrossLinks,
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

  public getAtoms(ligandId: string): Observable<Atom[]> {
    const atomAPI = `${this.CompoundApiUrl}atoms/${ligandId}`;
    return this.http.get<any>(atomAPI).pipe(map((data) => data[ligandId]));
  }

  public getBonds(ligandId: string): Observable<Bond[]> {
    const bondAPI = `${this.CompoundApiUrl}bonds/${ligandId}`;
    return this.http.get<any>(bondAPI).pipe(map((data) => data[ligandId]));
  }

  // processSubstructures(ligandId: string, data: PDBSubstructures): Substructure {
  //   const ligandSubstructures = data[ligandId][0];
  //   return ligandSubstructures;
  // }
}
