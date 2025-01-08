/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ModifiedResidue } from '../data-models/modified-residues.model';
import { KeyValidationStats } from '../data-models/key-validation-stats.model';
import { XRayRefine } from '../data-models/x-ray-refine.model';
import { CitationDetail } from '../data-models/publication.model';
import { RelatedPublication } from '../data-models/related-publications.model';
import { PfamMappings, CathMappings, ScopMappings, InterProMappings } from '../data-models/domains.model';
import { ComplexDetails } from '../data-models/complex-details.model';
import { AssemblyData } from '../data-models/assembly.model';
import { PisaAssembly } from '../data-models/pisa-assembly.model';
import { CarbohydrateMolecule } from '../data-models/carbohydrate-polymer.model';
import { Molecule } from '../data-models/molecule.model';
import { EntrySummary, ProcessedSummary } from '../data-models/summary.model';
import { UniProtMapping } from '../data-models/uniprot-mapping.model';
import { ProcessedQualityScores, SummaryQualityScores } from '../data-models/summary-quality-scores.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';

@Injectable({
  providedIn: 'root',
})
export class EntryApiService {
  private BASE_API = 'https://www.ebi.ac.uk/pdbe/api/pdb/entry/';
  private MAPPINGS_API = 'https://www.ebi.ac.uk/pdbe/api/mappings/';
  private VALIDATION_API = 'https://www.ebi.ac.uk/pdbe/api/validation/';

  private readonly http = inject(HttpClient);

  public getEntrySummary(entryId: string): Observable<ProcessedSummary> {
    return this.http.get<Record<string, EntrySummary[]>>(`${this.BASE_API}summary/${entryId}`).pipe(
      map((data) => {
        const datum = data[entryId][0];

        const releaseApiDate = datum.release_date;
        const formattedReleasedApiDate = `${releaseApiDate.substring(4, 6)}/${releaseApiDate.substring(6)}/${releaseApiDate.substring(0, 4)}`;
        const releasedDateObj = new Date(Date.parse(formattedReleasedApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

        const depositionApiDate = datum.deposition_date;
        const formattedDepositedApiDate = `${depositionApiDate.substring(4, 6)}/${depositionApiDate.substring(6)}/${depositionApiDate.substring(0, 4)}`;
        const depositionDateObj = new Date(Date.parse(formattedDepositedApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

        const revisionApiDate = datum.revision_date;
        const formattedRevisionApiDate = `${revisionApiDate.substring(4, 6)}/${revisionApiDate.substring(6)}/${revisionApiDate.substring(0, 4)}`;
        const revisionDateObj = new Date(Date.parse(formattedRevisionApiDate)).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

        return {
          entryTitle: datum.title!,
          entryAuthors: datum.entry_authors!.join(' '),
          depositionDate: depositionDateObj,
          releaseDate: releasedDateObj,
          revisionDate: revisionDateObj,
        };
      })
    );
  }

  public getEntryMolecules(entryId: string): Observable<Record<string, Molecule[]>> {
    return this.http.get<Record<string, Molecule[]>>(`${this.BASE_API}molecules/${entryId}`);
  }

  public getPrimaryPublicationAbstract(entryId: string): Observable<CitationDetail> {
    return this.http.get<Record<string, CitationDetail[]>>(`${this.BASE_API}publications/${entryId}`).pipe(map((data) => data[entryId][0]));
  }

  public getUniprotMapping(entryId: string): Observable<UniProtMapping> {
    return this.http.get<Record<string, Record<string, UniProtMapping>>>(`${this.MAPPINGS_API}uniprot/${entryId}`).pipe(map((data) => data[entryId]['UniProt']));
  }

  public getInterproMapping(entryId: string): Observable<InterProMappings> {
    return this.http.get<Record<string, Record<string, InterProMappings>>>(`${this.MAPPINGS_API}interpro/${entryId}`).pipe(map((data) => data[entryId]['InterPro']));
  }

  public getPfamMapping(entryId: string): Observable<PfamMappings> {
    return this.http.get<Record<string, Record<string, PfamMappings>>>(`${this.MAPPINGS_API}pfam/${entryId}`).pipe(map((data) => data[entryId]['Pfam']));
  }

  public getCATHMapping(entryId: string): Observable<CathMappings> {
    return this.http.get<Record<string, Record<string, CathMappings>>>(`${this.MAPPINGS_API}cath/${entryId}`).pipe(map((data) => data[entryId]['CATH']));
  }

  public getSCOP175Mapping(entryId: string): Observable<ScopMappings> {
    return this.http.get<Record<string, Record<string, ScopMappings>>>(`${this.MAPPINGS_API}scop/${entryId}`).pipe(map((data) => data[entryId]['SCOP']));
  }

  public getModifications(entryId: string): Observable<ModifiedResidue[]> {
    return this.http.get<Record<string, ModifiedResidue[]>>(`${this.BASE_API}modified_AA_or_NA/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getGalleryMolj(moljDescription: string): Observable<any> {
    const BASE_API = 'https://www.ebi.ac.uk/pdbe/static/entry/';
    return this.http.get<any>(`${BASE_API}${moljDescription}.molj`).pipe(map((data) => data.entries));
  }

  public getBestStructures(uniprotId: string): Observable<any[]> {
    return this.http.get<any>(`${this.MAPPINGS_API}best_structures/${uniprotId}`).pipe(
      map((data) => {
        // const uniprotData = data[uniprotId];
        return data;
      })
    );
  }

  public getPDBEntryFiles(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}files/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getArticleCitingPDBEntry(entryId: string): Observable<RelatedPublication> {
    return this.http.get<Record<string, RelatedPublication>>(`${this.BASE_API}related_publications/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getXMLImages(pubmedId: string): Observable<any> {
    return this.http.get<any>(`https://www.ebi.ac.uk/pdbe/static/pubmed-files/${pubmedId}/images`);
  }

  public getModifiedResidues(entryId: string): Observable<Record<string, ModifiedResidue[]>> {
    return this.http.get<Record<string, ModifiedResidue[]>>(`${this.BASE_API}modified_AA_or_NA/${entryId}`);
  }

  public getExperiment(entryId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API}experiment/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getValidationKeyStats(entryId: string): Observable<KeyValidationStats> {
    return this.http.get<Record<string, KeyValidationStats>>(`${this.VALIDATION_API}key_validation_stats/entry/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getValidationXRayRefine(entryId: string): Observable<XRayRefine> {
    return this.http.get<Record<string, XRayRefine>>(`${this.VALIDATION_API}xray_refine_data_stats/entry/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getPreferredAssembly(entryId: string): Observable<ComplexDetails[]> {
    return this.http
      .get<Record<string, ComplexDetails[]>>(`https://www.ebi.ac.uk/pdbe/aggregated-api/complex/details/${entryId}?id_type=pdb_id`)
      .pipe(map((data) => data[entryId]));
  }

  public getAssembly(entryId: string): Observable<AssemblyData[]> {
    return this.http.get<Record<string, AssemblyData[]>>(`${this.BASE_API}assembly/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getPisaAssembly(entryId: string, assemblyId: string): Observable<PisaAssembly> {
    return this.http.get<Record<string, PisaAssembly>>(`https://www.ebi.ac.uk/pdbe/api/pisa/assembly/${entryId}/${assemblyId}`).pipe(map((data) => data[entryId]));
  }

  public getCarbohydrates(entryId: string): Observable<CarbohydrateMolecule[]> {
    return this.http.get<Record<string, CarbohydrateMolecule[]>>(`${this.BASE_API}carbohydrate_polymer/${entryId}`).pipe(map((data) => data[entryId]));
  }

  // Record<string, BestStructure[]>
  public getSummaryQualityScores(entryId: string): Observable<ProcessedQualityScores> {
    return this.http.get<Record<string, SummaryQualityScores>>(`${this.VALIDATION_API}summary_quality_scores/entry/${entryId}`).pipe(
      map((data) => {
        const datum = data[entryId];

        const geometryQuality = datum.geometry_quality ? Math.min(Math.floor(datum.geometry_quality / 20), 4) : undefined;
        const modelFit = datum.data_quality ? Math.min(Math.floor(datum.data_quality / 20), 4) : undefined;

        return {
          geometry: geometryQuality,
          modelfit: modelFit,
        };
      })
    );
  }

  public getPDBRedoData(entryId: string): Observable<any> {
    return this.http.get<any>(`https://pdb-redo.eu/db/${entryId}/pdbe.json`);
  }

  public getProteinPagesSummaryStats(uniprotId: string): Observable<ProteinSummaryStats> {
    return this.http.get<Record<string, ProteinSummaryStats>>(`https://www.ebi.ac.uk/pdbe/graph-api/uniprot/summary_stats/${uniprotId}`).pipe(
      map((data) => {
        return data[uniprotId];
      })
    );
  }

  // for number of PDB entries (ngroups for given uniprot)
  // https://www.ebi.ac.uk/pdbe/search/pdb/select?q=uniprot_accession:P0DTC2&wt=json&group=true&group.field=pdb_id&rows=0&group.ngroups=true

  //
}
