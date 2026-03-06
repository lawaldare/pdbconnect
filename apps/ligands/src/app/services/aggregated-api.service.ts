import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhysChemProperties, FunctionalAnnotation, LigandSummary } from '../data-models/description.model';
import { PDBLigandFile } from '../data-models/download.model';
import { Depiction, LigandStructure, LigandStructuresAPIResponse, Substructure } from '../data-models/structure.model';
import { PDBRelatedLigands, RelatedLigand } from '../data-models/related-ligands.model';
import { PDBIntxData, IntxDataUrl } from '../data-models/interaction.model';
import { shareReplay, map } from 'rxjs';
import { environment } from '../../environments/environment';

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
  subcomponent_occurrences: Record<string, number>;
  released: string;
  superseded_by: string | undefined;
  ligandId?: string;
  first_observed_in: string[];
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
  private readonly AggregatedApiUrl = `${environment.baseUrl}pdbe/api/v2/`;
  private readonly StaticFilesApiUrl = `${environment.baseUrl}pdbe/static/files/pdbechem_v2/`;
  private readonly CompoundApiUrl = `${environment.baseUrl}pdbe/api/pdb/compound/`;

  constructor(private http: HttpClient) {}

  getLigandSummary(ligandId: string): Observable<LigandSummary> {
    const descriptionUrl = `${this.AggregatedApiUrl}pdb/compound/summary/${ligandId}`;
    return this.http.get<LigandSummary>(descriptionUrl).pipe(map((data: any) => data[ligandId][0]));
  }

  fetchDownload(ligandId: string): Observable<PDBLigandFile> {
    const downloadUrl = `${this.AggregatedApiUrl}pdb/compound/files/${ligandId}`;
    return this.http.get<PDBLigandFile>(downloadUrl);
  }

  fetchSubstructures(ligandId: string): Observable<Substructure> {
    const substructureUrl = `${this.AggregatedApiUrl}pdb/compound/substructures/${ligandId}`;
    return this.http.get<Substructure>(substructureUrl).pipe(map((data: any) => data[ligandId]));
  }

  fetchSupercomponents(ligandId: string): Observable<string[]> {
    const substructureUrl = `${this.AggregatedApiUrl}pdb/compound/supercomponents/${ligandId}`;
    return this.http.get<string[]>(substructureUrl).pipe(map((data: any) => data[ligandId]));
  }

  getLigandStructures(ligandId: string): Observable<LigandStructure[]> {
    const ligandStructureAPI = `${this.AggregatedApiUrl}compound/uniprot/${ligandId}`;
    return this.http.get<LigandStructuresAPIResponse>(ligandStructureAPI).pipe(map((data) => data[ligandId]));
  }

  fetchDepiction(ligandId: string): Observable<Depiction> {
    const depictionUrl = `${this.StaticFilesApiUrl}${ligandId}/annotation`;
    return this.http.get<Depiction>(depictionUrl).pipe(shareReplay(1));
  }

  getRelatedLigands(ligandId: string): Observable<RelatedLigand> {
    const relatedLigandUrl = `${this.AggregatedApiUrl}compound/similarity/${ligandId}`;
    const relatedLigand = this.http.get<PDBRelatedLigands>(relatedLigandUrl).pipe(
      shareReplay(1),
      map((relatedLigands: PDBRelatedLigands) => {
        return relatedLigands[ligandId][0];
      })
    );
    return relatedLigand;
  }

  fetchBoundEntries(ligandId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const boundEntryURL = `${this.AggregatedApiUrl}pdb/compound/in_pdb`;
    const boundEntries = this.http.post<any>(boundEntryURL, JSON.stringify(ligandId), { headers });
    return boundEntries;
  }

  fetchIntxData(ligandId: string): Observable<IntxDataUrl> {
    const IntxUrl = `${this.AggregatedApiUrl}compound/interaction/${ligandId}`;
    return this.http.get<PDBIntxData>(IntxUrl).pipe(
      map((interactions: PDBIntxData) => ({
        IntxUrl: IntxUrl,
        interactions: interactions,
      })),
      shareReplay(1)
    );
  }

  processDescriptionData(data: LigandSummary): DescriptionData {
    const ligandSummary = data;
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
      subcomponent_occurrences: ligandSummary.subcomponent_occurrences,
      released: ligandSummary.release_status,
      superseded_by: ligandSummary.superseded_by,
      first_observed_in: ligandSummary.first_observed_in,
    };
  }

  processDownloadData(ligandId: string, data: any): downloadData {
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

  public getLatestReleases(): Observable<any> {
    const latestReleaseUrl = `https://www.ebi.ac.uk/pdbe/search/pdb/select?q=q_document_type:latest_chemistry&fl=new_revised_ligand,pdb_id,uniprot_accession,pubmed_id&rows=10000`;
    return this.http.get<any>(latestReleaseUrl);
  }
}
