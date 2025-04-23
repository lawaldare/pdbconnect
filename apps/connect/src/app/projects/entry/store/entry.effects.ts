import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EntryStoreState } from './entry-store.model';
import { EntryActions } from './entry.actions';
import { catchError, forkJoin, map, mergeMap, of, switchMap, take } from 'rxjs';
import { EntryApiService } from '../services/entry-api.service';
import { EntrySelectors } from './entry.selectors';
import { AnyExperimentDetail } from '../data-models/experimental-details.model';
import { UniProtMapping } from '../data-models/uniprot-mapping.model';
import { ProteinSummaryStats } from '../data-models/protein-summary-stats.model';
import { BestStructureMapping } from '../data-models/uniport-best-structures.model';
import { BestStructureDict } from '../data-models/uniprot-best-structures.model';
import { MainDataProcessingFacade } from '../pages/main/data-processing.facade';
import { CitationDetail } from '../data-models/publication.model';
import { IRRMCExperimentRawData } from '../data-models/experiment-raw-data.model';

@Injectable()
export class EntryEffects {
  private readonly entryAPIService = inject(EntryApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<EntryStoreState>);
  private dataProcessing = inject(MainDataProcessingFacade);

  getSummaryData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSummaryData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntrySummary(entryId).pipe(
          map((summaryData) => EntryActions.getSummaryDataSuccess({ summaryData })),
          catchError(() => of(EntryActions.getSummaryDataFailure()))
        )
      )
    )
  );

  getInterproMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getInterproMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getInterproMapping(entryId).pipe(
          map((interproMapping) => EntryActions.getInterproMappingSuccess({ interproMapping })),
          catchError(() => of(EntryActions.getInterproMappingFailure()))
        )
      )
    )
  );

  getIsoformsMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getIsoformsMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getIsoformsMapping(entryId).pipe(
          map((isoformsMapping) => EntryActions.getIsoformsMappingSuccess({ isoformsMapping })),
          catchError(() => of(EntryActions.getIsoformsMappingFailure()))
        )
      )
    )
  );

  getGOMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getGOMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getGOMapping(entryId).pipe(
          map((goMapping) => EntryActions.getGOMappingSuccess({ goMapping })),
          catchError(() => of(EntryActions.getGOMappingFailure()))
        )
      )
    )
  );

  getSymmetry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSymmetry),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getSymmetry(entryId).pipe(
          map((symmetry) => EntryActions.getSymmetrySuccess({ symmetry })),
          catchError(() => of(EntryActions.getSymmetryFailure()))
        )
      )
    )
  );

  getECMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getECMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getECMapping(entryId).pipe(
          map((ecMapping) => EntryActions.getECMappingSuccess({ ecMapping })),
          catchError(() => of(EntryActions.getECMappingFailure()))
        )
      )
    )
  );

  getInteractions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getInteractions),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntryInteractions(entryId).pipe(
          map((data) => EntryActions.getInteractionsSuccess({ interactions: data.interactions })),
          catchError(() => of(EntryActions.getInteractionsFailure()))
        )
      )
    )
  );

  getPfamMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPfamMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPfamMapping(entryId).pipe(
          map((pfamMapping) => EntryActions.getPfamMappingSuccess({ pfamMapping })),
          catchError(() => of(EntryActions.getPfamMappingFailure()))
        )
      )
    )
  );

  getSCOP175Mapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getScop175Mapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getSCOP175Mapping(entryId).pipe(
          map((scop175Mapping) => EntryActions.getScop175MappingSuccess({ scop175Mapping })),
          catchError(() => of(EntryActions.getScop175MappingFailure()))
        )
      )
    )
  );

  getModifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getModifications),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getModifications(entryId).pipe(
          map((modifications) => EntryActions.getModificationsSuccess({ modifications })),
          catchError(() => of(EntryActions.getModificationsFailure()))
        )
      )
    )
  );

  getValidationKeyStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getValidationKeyStats),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getValidationKeyStats(entryId).pipe(
          map((validationKeyStats) => EntryActions.getValidationKeyStatsSuccess({ validationKeyStats })),
          catchError(() => of(EntryActions.getValidationKeyStatsFailure()))
        )
      )
    )
  );

  getCathMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getCathMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getCATHMapping(entryId).pipe(
          map((cathMapping) => EntryActions.getCathMappingSuccess({ cathMapping })),
          catchError(() => of(EntryActions.getCathMappingFailure()))
        )
      )
    )
  );

  getSummaryQualityScores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSummaryQualityScores),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getSummaryQualityScores(entryId).pipe(
          map((summaryQualityScores) => EntryActions.getSummaryQualityScoresSuccess({ summaryQualityScores })),
          catchError(() => of(EntryActions.getSummaryQualityScoresFailure()))
        )
      )
    )
  );

  getPDBRedoQualityScores$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPDBRedoQualityScores),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPDBRedoData(entryId).pipe(
          map((pdbRedoQualityScore) => EntryActions.getPDBRedoQualityScoresSuccess({ pdbRedoQualityScore })),
          catchError(() => of(EntryActions.getPDBRedoQualityScoresFailure()))
        )
      )
    )
  );

  getDownloadOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getDownloadOptions),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPDBEntryFiles(entryId).pipe(
          map((data) => {
            const downloadOptions = this.dataProcessing.processFilesData(data).downloads;
            const viewOptions = this.dataProcessing.processFilesData(data).views;
            return EntryActions.getDownloadOptionsSuccess({ data: { downloadOptions, viewOptions } });
          }),
          catchError(() => of(EntryActions.getDownloadOptionsFailure()))
        )
      )
    )
  );

  getEntryMolecules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryMolecules),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntryMolecules(entryId).pipe(
          map((data) => {
            const molecules = data[entryId];

            const macromoleculeSortedTypesArray = [
              'polypeptide(L)',
              'polypeptide(R)',
              'carbohydrate polymer',
              'polyribonucleotide',
              'polydeoxyribonucleotide',
              'polydeoxyribonucleotide/polyribonucleotide hybrid',
            ];

            const macroMolecules = molecules
              .filter((mol) => macromoleculeSortedTypesArray.indexOf(mol.molecule_type) > -1)
              .sort((a, b) => macromoleculeSortedTypesArray.indexOf(a.molecule_type) - macromoleculeSortedTypesArray.indexOf(b.molecule_type));

            const boundLigands = molecules.filter((mol) => mol.molecule_type === 'bound');

            const organismScientificNames: string[] = [];

            for (const entityDetail of molecules) {
              const sources = entityDetail['source'] ?? [];
              for (const eachSource of sources) {
                const organismName = eachSource['organism_scientific_name'] ?? undefined;
                if (organismName && organismScientificNames.indexOf(organismName) === -1) {
                  organismScientificNames.push(organismName);
                }
              }
            }

            const hasRNA = molecules.filter((mol) => mol.molecule_type.includes('polyribonucleotide')).length > 0;
            return EntryActions.getEntryMoleculesSuccess({ data: { macroMolecules, boundLigands, organismScientificNames, hasRNA } });
          }),
          catchError(() => of(EntryActions.getEntryMoleculesFailure()))
        )
      )
    )
  );

  getExperiment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperiment),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperiment(entryId).pipe(
          map((response: any) => {
            const experimentalDetails = response;

            const experimentalMethod = response.length > 1 ? 'Hybrid' : (response[0].experimental_method as string);
            const resolutionValues: Array<number | undefined> = response.map((datum: AnyExperimentDetail) => {
              if ('resolution' in datum && datum['resolution']) return datum['resolution'];
              else return undefined;
            });

            return EntryActions.getExperimentSuccess({ data: { experimentalDetails, resolutionValues, experimentalMethod } });
          }),
          catchError(() => of(EntryActions.getExperimentFailure()))
        )
      )
    )
  );

  getUniprotMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getUniprotMapping),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getUniprotMapping(entryId).pipe(
          mergeMap((uniprotMapping: UniProtMapping) => {
            const uniprotIds = Object.keys(uniprotMapping);
            const bestStructuresObservables = uniprotIds.map((uniprotId) =>
              this.entryAPIService.getBestStructures(uniprotId).pipe(
                map((result) => ({ [uniprotId]: result })) // Wrap each result in an object with uniprotId as key
              )
            );

            const proteinPagesSummaryObservables = uniprotIds.map((uniprotId) =>
              this.entryAPIService.getProteinPagesSummaryStats(uniprotId).pipe(
                map((result) => ({ [uniprotId]: result })) // Wrap each result in an object with uniprotId as key
              )
            );

            // Use forkJoin to wait for all observables to complete
            return forkJoin({
              bestStructures: forkJoin(bestStructuresObservables),
              proteinPagesSummary: forkJoin(proteinPagesSummaryObservables),
            }).pipe(
              map(({ bestStructures, proteinPagesSummary }) => {
                // Combine results into dictionaries
                const bestStructuresMappingsByUniProtIds: { [key: string]: BestStructureMapping[] } = {};
                const uniprotCountsInPDBe: { [key: string]: number } = {};
                const proteinPagesSummaryByUniProtIds: { [key: string]: ProteinSummaryStats } = {};

                // Process bestStructures results
                for (const uniprotDict of bestStructures) {
                  const uniprotId = Object.keys(uniprotDict)[0];
                  const bestStructureDict = uniprotDict[uniprotId] as unknown as BestStructureDict;
                  const uniprotData = bestStructureDict[uniprotId];

                  // Update uniprotCountsInPDBe with counts of unique PDB ids
                  const uniquePDBIds = uniprotData.map((datum) => datum.pdb_id).filter((value, index, array) => array.indexOf(value) === index);
                  uniprotCountsInPDBe[uniprotId] = uniquePDBIds.length;

                  // Update bestStructuresMappingsByUniProtIds with filtered data
                  const uniprotDataFiltered = bestStructureDict[uniprotId].filter((datum) => datum.pdb_id === entryId);
                  bestStructuresMappingsByUniProtIds[uniprotId] = bestStructuresMappingsByUniProtIds[uniprotId] ?? [];
                  bestStructuresMappingsByUniProtIds[uniprotId].push(...uniprotDataFiltered);
                }

                // Process proteinPagesSummary results
                for (const summaryDict of proteinPagesSummary as { [key: string]: ProteinSummaryStats }[]) {
                  const uniprotId = Object.keys(summaryDict)[0];
                  proteinPagesSummaryByUniProtIds[uniprotId] = summaryDict[uniprotId];
                }

                return EntryActions.getUniprotMappingSuccess({
                  data: {
                    uniprotMapping,
                    uniprotCountsInPDBe,
                    bestStructuresMappingsByUniProtIds,
                    proteinPagesSummaryByUniProtIds,
                  },
                });
              }),
              catchError(() => of(EntryActions.getUniprotMappingFailure()))
            );
          })
        )
      )
    )
  );

  getValidationXRayRefine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getValidationXrayRefine),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getValidationXRayRefine(entryId).pipe(
          map((validationXRayRefine) => EntryActions.getValidationXrayRefineSuccess({ validationXRayRefine })),
          catchError(() => of(EntryActions.getValidationXrayRefineFailure()))
        )
      )
    )
  );

  getPrimaryPublication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPrimaryPublication),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPrimaryPublicationAbstract(entryId).pipe(
          map((primaryPublication) => EntryActions.getPrimaryPublicationSuccess({ primaryPublication })),
          catchError(() => {
            EntryActions.getPrimaryPublicationSuccess({ primaryPublication: {} as CitationDetail });
            return of(EntryActions.getPrimaryPublicationFailure());
          })
        )
      )
    )
  );

  getArticleCitingPDBEntry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getArticleCitingPDBEntry),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getArticleCitingPDBEntry(entryId).pipe(
          map((articlesCiting) => EntryActions.getArticleCitingPDBEntrySuccess({ articlesCiting })),
          catchError(() => of(EntryActions.getArticleCitingPDBEntryFailure()))
        )
      )
    )
  );

  getPreferredAssembly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPreferredAssembly),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPreferredAssembly(entryId).pipe(
          map((complexDetails) => EntryActions.getPreferredAssemblySuccess({ complexDetails })),
          catchError(() => {
            EntryActions.getPreferredAssemblySuccess({ complexDetails: [] });
            return of(EntryActions.getPreferredAssemblyFailure());
          })
        )
      )
    )
  );

  getAssemblies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getAssemblies),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getAssembly(entryId).pipe(
          mergeMap((data) => {
            const pisaAssemblyObservables = data
              .sort((a, b) => parseInt(a.assembly_id) - parseInt(b.assembly_id))
              .map((assemblyDatum) => this.entryAPIService.getPisaAssembly(entryId, assemblyDatum.assembly_id));

            return forkJoin(pisaAssemblyObservables).pipe(
              map((pisaAssembly) => {
                const assemblies = data;
                const pisaAssemblies = pisaAssembly;
                return EntryActions.getAssembliesSuccess({ data: { assemblies, pisaAssemblies } });
              }),
              catchError(() => of(EntryActions.getAssembliesFailure()))
            );
          })
        )
      )
    )
  );

  getCarbohydrates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getCarbohydrates),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getCarbohydrates(entryId).pipe(
          map((carbohydrates) => EntryActions.getCarbohydratesSuccess({ carbohydrates })),
          catchError(() => of(EntryActions.getCarbohydratesFailure()))
        )
      )
    )
  );

  getExperimentRawDataBMRB$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentBMRBRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataBMRB(entryId).pipe(
          map((experimentRawDataBMRB) => EntryActions.getExperimentBMRBRawDataSuccess({ experimentRawDataBMRB })),
          catchError(() => of(EntryActions.getExperimentBMRBRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataSBGrid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentSBGridRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataSBGrid(entryId).pipe(
          map((experimentRawDataSBGrid) => EntryActions.getExperimentSBGridRawDataSuccess({ experimentRawDataSBGrid })),
          catchError(() => of(EntryActions.getExperimentSBGridRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataIRRMC$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentIRRMCRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataIRRMC(entryId).pipe(
          map((experimentRawDataIRRMC) => {
            const data = experimentRawDataIRRMC === null ? ({} as IRRMCExperimentRawData) : experimentRawDataIRRMC;
            return EntryActions.getExperimentIRRMCRawDataSuccess({ experimentRawDataIRRMC: data });
          }),
          catchError(() => of(EntryActions.getExperimentIRRMCRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataEMPIAR$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentEMPIARRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataEMPIAR(entryId).pipe(
          map((experimentRawDataEMPIAR) => EntryActions.getExperimentEMPIARRawDataSuccess({ experimentRawDataEMPIAR })),
          catchError(() => of(EntryActions.getExperimentEMPIARRawDataFailure()))
        )
      )
    )
  );

  getExperimentRawDataPDB$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperimentPDBRawData),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getExperimentRawDataPDB(entryId).pipe(
          map((experimentRawDataPDB) => EntryActions.getExperimentPDBRawDataSuccess({ experimentRawDataPDB })),
          catchError(() => of(EntryActions.getExperimentPDBRawDataFailure()))
        )
      )
    )
  );

  getEntryStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryStatus),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntryStatus(entryId).pipe(
          map((entryStatus) => EntryActions.getEntryStatusSuccess({ entryStatus })),
          catchError(() => of(EntryActions.getEntryStatusFailure()))
        )
      )
    )
  );

  getPolymerCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryPolymerCoverage),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getPolymerCoverage(entryId).pipe(
          map((polymerCoverage) => {
            console.log('[Effect] Polymer Coverage Data:', polymerCoverage);
            return EntryActions.getEntryPolymerCoverageSuccess({ polymerCoverage });
          }),
          catchError(() => of(EntryActions.getEntryPolymerCoverageFailure()))
        )
      )
    )
  );

  getLigandMonomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryLigandMonomers),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getLigandMonomers(entryId).pipe(
          map((ligandMonomers) => EntryActions.getEntryLigandMonomersSuccess({ ligandMonomers })),
          catchError(() => of(EntryActions.getEntryLigandMonomersFailure()))
        )
      )
    )
  );
}
