/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { ModifiedResidue } from '../data-models/modified-residues.model';
import { KeyValidationStats, ModelQualityXray } from '../data-models/key-validation-stats.model';
import { XRayRefine } from '../data-models/x-ray-refine.model';
import { CitationDetail } from '../data-models/publication.model';
import { RelatedPublication } from '../data-models/related-publications.model';
import { PfamMappings, CathMappings, ScopMappings, InterProMappings } from '../data-models/domains.model';
import { ComplexDetails } from '../data-models/complex-details.model';
import { AssemblyData, Symmetry } from '../data-models/assembly.model';
import { PisaAssembly } from '../data-models/pisa-assembly.model';
import { CarbohydrateMolecule } from '../data-models/carbohydrate-polymer.model';
import { Molecule } from '../data-models/molecule.model';
import { EntrySummary, ProcessedSummary } from '../data-models/summary.model';
import { ECMapping, GOMapping, SummaryStats, UniProtMapping } from '../data-models/uniprot-mapping.model';
import { PdbRedoQualityScores, ProcessedQualityScores, SummaryQualityScores } from '../data-models/summary-quality-scores.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import {
  BMRBExperimentRawData,
  EMPIARExperimentRawData,
  IRRMCExperimentRawData,
  PDBExperimentRawData,
  SBGRIDExperimentRawData,
} from '../data-models/experiment-raw-data.model';
import { EntryStatus } from '../data-models/status.model';
import { environment } from '../../../../environments/environment';
import { PolymerCoverageMolecule } from '../data-models/polymer-coverage.model';
import { LigandMonomer } from '../data-models/ligand-monomers.model';
import { ResidueWiseOutliersMolecule } from '../data-models/residuewise-outliers.model';
import { LLMAnnotation } from '../data-models/llm-model';
import { ResidueListed, ResidueListing } from '../data-models/residue-listing.model';
import { LigandSummaryStats } from '../data-models/ligand-summary-stats.model';
import { ComplexSummaryStats } from '../data-models/complex-summary-stats.model';
import { BoundMolecule } from '../data-models/bound-molecule.model';
// import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EntryApiService {
  private BASE_API = `${environment.pdbeBaseUrl}api/v2/pdb/entry/`;
  private MAPPINGS_API = `${environment.pdbeBaseUrl}api/mappings/`;
  private VALIDATION_API = `${environment.pdbeBaseUrl}api/validation/`;
  // private GRAPH_API = `https://www.ebi.ac.uk/pdbe/graph-api/pdb/`;
  private readonly AggregatedApiUrl = `${environment.pdbeBaseUrl}api/v2/`;
  // private readonly router = inject(Router);

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
          assemblies: datum.assemblies,
          relatedStructures: datum.related_structures,
          experimentalMethods: datum.experimental_method,
        };
      }),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as ProcessedSummary);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getEntryMolecules(entryId: string): Observable<Record<string, Molecule[]>> {
    return this.http.get<Record<string, Molecule[]>>(`${this.BASE_API}molecules/${entryId}`);
  }

  public getEntryStatus(entryId: string): Observable<EntryStatus> {
    // for testing on wwwdev
    return this.http.get<Record<string, EntryStatus[]>>(`https://www.ebi.ac.uk/pdbe/api/pdb/entry/status/${entryId}`).pipe(map((data) => data[entryId][0]));

    // return this.http.get<Record<string, EntryStatus[]>>(`${this.BASE_API}status/${entryId}`).pipe(map((data) => data[entryId][0]));

    // return this.http.get<Record<string, EntryStatus[]>>(`${this.BASE_API}status/${entryId}`).pipe(
    //   map((data) => data[entryId][0]),
    //   catchError((error) => {
    //     this.router.navigateByUrl('/error');
    //     return of({ empty: true } as unknown as EntryStatus);
    //   })
    // );
  }

  public getEntryInteractions(entryId: string, chainId: string, residueId: string): Observable<any> {
    // const AggregatedApiUrl2 = `https://www.ebi.ac.uk/pdbe/api/v2/`;
    return (
      this.http
        // for localhost test
        // .get<Record<string, any[]>>(`${AggregatedApiUrl2}pdb/bound_ligand_interactions/${entryId}/${chainId}/${residueId}?preserve_case=true`)
        .get<Record<string, any[]>>(`${this.AggregatedApiUrl}pdb/bound_ligand_interactions/${entryId}/${chainId}/${residueId}?preserve_case=true`)
        .pipe(map((data) => data[entryId][0]))
    );
  }

  public getPrimaryPublicationAbstract(entryId: string): Observable<CitationDetail> {
    return this.http.get<Record<string, CitationDetail[]>>(`${this.BASE_API}publications/${entryId}`).pipe(map((data) => data[entryId][0]));
  }

  public getUniprotMapping(entryId: string): Observable<UniProtMapping> {
    return this.http.get<Record<string, Record<string, UniProtMapping>>>(`${this.MAPPINGS_API}uniprot/${entryId}`).pipe(
      map((data) => data[entryId]['UniProt']),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as UniProtMapping);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getSummaryStats(uniprotId: string): Observable<SummaryStats> {
    return this.http.get<Record<string, SummaryStats>>(`${this.AggregatedApiUrl}uniprot/summary_stats/${uniprotId}`).pipe(map((data) => data[uniprotId]));
  }

  public getLigandSummaryStats(entryId: string): Observable<LigandSummaryStats[]> {
    return this.http.get<Record<string, LigandSummaryStats[]>>(`${this.BASE_API}ligand_summary_stats/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getComplexSummaryStats(entryId: string): Observable<ComplexSummaryStats> {
    return this.http.get<Record<string, ComplexSummaryStats>>(`${this.BASE_API}complex_summary_stats/${entryId}`).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          const stats: ComplexSummaryStats = {};
          stats[`${entryId}_1`] = {
            pdb_complex_id: undefined,
            preferred_assembly: true,
            pdbs: 0,
            ligands: 0,
            subcomplexes: 0,
            supercomplexes: 0,
          };
          return of(stats);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getIsoformsMapping(entryId: string): Observable<UniProtMapping> {
    return this.http.get<Record<string, Record<string, UniProtMapping>>>(`${this.MAPPINGS_API}isoforms/${entryId}`).pipe(map((data) => data[entryId]['UniProt']));
  }

  public getGOMapping(entryId: string): Observable<GOMapping> {
    return this.http.get<Record<string, Record<string, GOMapping>>>(`${this.MAPPINGS_API}go/${entryId}`).pipe(map((data) => data[entryId]['GO']));
  }

  public getECMapping(entryId: string): Observable<ECMapping> {
    return this.http.get<Record<string, Record<string, ECMapping>>>(`${this.MAPPINGS_API}ec/${entryId}`).pipe(map((data) => data[entryId]['EC']));
  }

  public getInterproMapping(entryId: string): Observable<InterProMappings> {
    return this.http.get<Record<string, Record<string, InterProMappings>>>(`${this.MAPPINGS_API}interpro/${entryId}`).pipe(map((data) => data[entryId]['InterPro']));
  }

  public getPfamMapping(entryId: string): Observable<PfamMappings> {
    return this.http.get<Record<string, Record<string, PfamMappings>>>(`${this.MAPPINGS_API}pfam/${entryId}`).pipe(
      map((data) => data[entryId]['Pfam']),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as PfamMappings);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getCATHMapping(entryId: string): Observable<CathMappings> {
    return this.http.get<Record<string, Record<string, CathMappings>>>(`${this.MAPPINGS_API}cath/${entryId}`).pipe(
      map((data) => data[entryId]['CATH']),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as CathMappings);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getSCOP175Mapping(entryId: string): Observable<ScopMappings> {
    return this.http.get<Record<string, Record<string, ScopMappings>>>(`${this.MAPPINGS_API}scop/${entryId}`).pipe(
      map((data) => data[entryId]['SCOP']),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as ScopMappings);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getModifications(entryId: string): Observable<ModifiedResidue[]> {
    return this.http.get<Record<string, ModifiedResidue[]>>(`${this.BASE_API}modified_AA_or_NA/${entryId}`).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as ModifiedResidue[]);
        }
        return throwError(() => error); // rethrow for anything else
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

  public getModelQualityXray(entryId: string): Observable<ModelQualityXray> {
    return this.http.get<Record<string, ModelQualityXray>>(`${this.VALIDATION_API}model_quality_xray/entry/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getValidationXRayRefine(entryId: string): Observable<XRayRefine> {
    return this.http.get<Record<string, XRayRefine>>(`${this.VALIDATION_API}xray_refine_data_stats/entry/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getPreferredAssembly(entryId: string): Observable<ComplexDetails[]> {
    return this.http.get<Record<string, ComplexDetails[]>>(`${this.AggregatedApiUrl}complex/details/${entryId}?id_type=pdb_id`).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as ComplexDetails[]);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getAssembly(entryId: string): Observable<AssemblyData[]> {
    return this.http.get<Record<string, AssemblyData[]>>(`${this.BASE_API}assembly/${entryId}`).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as AssemblyData[]);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getSymmetry(entryId: string): Observable<Symmetry[]> {
    return this.http.get<Record<string, Symmetry[]>>(`${this.AggregatedApiUrl}pdb/symmetry/${entryId}`).pipe(map((data) => data[entryId]));
  }

  public getLLMAnnotations(entryId: string): Observable<LLMAnnotation[]> {
    const annotations: LLMAnnotation[] = [];
    return this.http.get<Record<string, any>>(`${this.AggregatedApiUrl}pdb/entry/llm_annotations/summary/${entryId}`).pipe(
      map((data) => {
        const residueList = data[entryId].data[0].residueList;
        residueList.forEach((residue: any) => {
          annotations.push(...residue.additionalData);
        });
        return annotations;
      })
    );
  }

  public getPisaAssembly(entryId: string, assemblyId: string): Observable<PisaAssembly> {
    return this.http.get<Record<string, PisaAssembly>>(`https://www.ebi.ac.uk/pdbe/api/pisa/assembly/${entryId}/${assemblyId}`).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as PisaAssembly);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getCarbohydrates(entryId: string): Observable<CarbohydrateMolecule[]> {
    return this.http.get<Record<string, CarbohydrateMolecule[]>>(`${this.BASE_API}carbohydrate_polymer/${entryId}`).pipe(
      map((data) => data[entryId]),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as CarbohydrateMolecule[]);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
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

  public getPolymerCoverage(entryId: string): Observable<PolymerCoverageMolecule[]> {
    return this.http.get<Record<string, { molecules: PolymerCoverageMolecule[] }>>(`${this.BASE_API}polymer_coverage/${entryId}`).pipe(
      map((data) => {
        return data[entryId]['molecules'] || [];
      }),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as PolymerCoverageMolecule[]);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getLigandMonomers(entryId: string): Observable<LigandMonomer[]> {
    return this.http.get<Record<string, LigandMonomer[]>>(`${this.BASE_API}ligand_monomers/${entryId}`).pipe(
      map((data) => {
        return data[entryId];
      }),
      catchError((error) => {
        if (error?.status === 404) {
          return of({ empty: true } as unknown as LigandMonomer[]);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getBoundMolecules(entryId: string): Observable<BoundMolecule[]> {
    return this.http.get<Record<string, BoundMolecule[]>>(`${this.BASE_API}bound_molecules/${entryId}`).pipe(
      map((data) => {
        return data[entryId];
      }),
      catchError((error) => {
        if (error?.status === 404) {
          return of([]);
        }
        return throwError(() => error); // rethrow for anything else
      })
    );
  }

  public getResidueWiseOutliers(entryId: string): Observable<ResidueWiseOutliersMolecule[]> {
    return this.http.get<Record<string, { molecules: ResidueWiseOutliersMolecule[] }>>(`${this.VALIDATION_API}residuewise_outlier_summary/entry/${entryId}`).pipe(
      map((data) => {
        return data[entryId]['molecules'] || [];
      })
    );
  }

  public getResiduesForChain(entryId: string, chainId: string): Observable<ResidueListed[]> {
    return this.http.get<Record<string, ResidueListing>>(`${this.BASE_API}residue_listing/${entryId}/chain/${chainId}`).pipe(
      map((data) => {
        return data[entryId]['molecules'][0]['chains'][0]['residues'] || [];
      })
    );
  }

  private processRedoData(score: number, rangeUpper: number, rangeLower: number) {
    const dataRange = rangeUpper - rangeLower;
    const dataUnitRange = dataRange / 5;

    let subtractor = 1;
    for (let i = 4; i > 0; i--) {
      if (score > rangeUpper - dataUnitRange * subtractor) {
        return i;
      }
      subtractor++;
    }
    return 0;
  }

  public getPDBRedoData(entryId: string): Observable<ProcessedQualityScores> {
    return this.http.get<PdbRedoQualityScores>(`https://pdb-redo.eu/db/${entryId}/pdbe.json`).pipe(
      map((data) => {
        const geometryQuality = this.processRedoData(data.geometry.dzscore, data.geometry['range-upper'], data.geometry['range-lower']);
        const modelFit = this.processRedoData(data.ddatafit.zdfree, data.geometry['range-upper'], data.geometry['range-lower']);

        const processed: ProcessedQualityScores = {
          geometry: geometryQuality,
          modelfit: modelFit,
        };
        if (data['base-pairs']) {
          const basePairs = this.processRedoData(data['base-pairs'].drmsz, data.geometry['range-upper'], data.geometry['range-lower']);
          processed.basepairs = basePairs;
        }

        return processed;
      })
    );
  }

  public getExperimentRawDataPDB(entryId: string): Observable<PDBExperimentRawData[]> {
    // Example with data: https://www.ebi.ac.uk/pdbe/api/pdb/entry/related_experiment_data/5o8b
    // Example without data: https://www.ebi.ac.uk/pdbe/api/pdb/entry/related_experiment_data/1trn
    return this.http.get<Record<string, PDBExperimentRawData[]>>(`${this.BASE_API}related_experiment_data/${entryId}`).pipe(
      map((data) => {
        return data[entryId];
      })
    );
  }

  public getExperimentRawDataBMRB(entryId: string): Observable<BMRBExperimentRawData[]> {
    // examples with data:
    // https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/2kpn
    // https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/2m68
    // https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/2knr
    // example without data:
    // https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/1trn
    return this.http.get<BMRBExperimentRawData[]>(`https://api.bmrb.io/v2/search/get_bmrb_data_from_pdb_id/${entryId}`).pipe(
      map((data) => data.filter((datum) => datum.match_types.indexOf('Exact') > -1)),
      switchMap((exactMatchData) => {
        if (exactMatchData.length > 0) {
          return [exactMatchData]; // Emit the data as an observable array
        }
        // Throw an error that results in terminating the observable
        return throwError(() => ({
          status: 400,
          message: 'No data found for the given entry ID',
        }));
      })
    );
  }

  public getExperimentRawDataSBGrid(entryId: string): Observable<SBGRIDExperimentRawData> {
    // example with data:
    // https://data.sbgrid.org/api/pdbe/5tok
    // example without data:
    // https://data.sbgrid.org/api/pdbe/1trn
    return this.http.get<SBGRIDExperimentRawData>(`https://data.sbgrid.org/api/pdbe/${entryId}`).pipe(
      switchMap((data) => {
        if (data.datasets.length > 0) {
          return [data]; // Emit the data as an observable
        }
        // Throw an error if no data is found
        return throwError(() => ({
          status: 400,
          message: 'No data found for the given entry ID',
        }));
      })
    );
  }

  public getExperimentRawDataIRRMC(entryId: string): Observable<IRRMCExperimentRawData> {
    // example with data:
    // https://proteindiffraction.org/api/ebi/4weq/
    // example without data:
    // https://proteindiffraction.org/api/ebi/1trn/
    return this.http.get<IRRMCExperimentRawData>(`https://proteindiffraction.org/api/ebi/${entryId}/`);
  }

  public getExperimentRawDataEMPIAR(entryId: string): Observable<EMPIARExperimentRawData[]> {
    // Obs: this url NEEDS the final "/"
    // example with data:
    // https://www.ebi.ac.uk/empiar/api/pdb_ref/3j7n/
    // example without data:
    // https://www.ebi.ac.uk/empiar/api/pdb_ref/1trn/
    return this.http.get<EMPIARExperimentRawData[]>(`https://www.ebi.ac.uk/empiar/api/pdb_ref/${entryId}/`).pipe(
      switchMap((data) => {
        if (data.length > 0) {
          return [data]; // Emit the data as an observable
        }
        // Throw an error if no data is found
        return throwError(() => ({
          status: 400,
          message: 'No data found for the given entry ID',
        }));
      })
    );
  }
}
