import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EntryStoreState } from './entry-store.model';
import { EntryActions } from './entry.actions';
import { catchError, combineLatest, filter, forkJoin, map, mergeMap, of, switchMap, take } from 'rxjs';
import { EntryApiService } from '../services/entry-api.service';
import { EntrySelectors } from './entry.selectors';
import { AnyExperimentDetail } from '../data-models/experimental-details.model';
import { CitationDetail } from '../data-models/publication.model';
import { IRRMCExperimentRawData } from '../data-models/experiment-raw-data.model';
import { PvDataApiService } from '../services/entry-pv-nightingale-api.service';
import { EntryUtilService } from '../services/entry-util.service';
import { processFilesData, processResidueOutliersData } from './data-processing/others-processing';
import {
  generateAssembliesCards,
  generateAssembliesTableFilters,
  generateProcessedAssemblies,
  getPreferredAssemblyDatum,
  processPreferredAssemblyData,
} from './data-processing/assembly-processing';
import {
  filterMacromoleculesByPreferredAssembly,
  filterPolymerCoverageByPreferredAssembly,
  generateMacromoleculesCards,
  generateMacromoleculesTableFilters,
  generateProcessedMacromolecules,
  getUniProtMappingsForMacromolecule,
  mapMacromoleculesByPreferredAssembly,
  mapMacromoleculesChainsToEntityId,
  mapPolymerCoverageByPreferredAssembly,
  processMacromoleculesDescriptions,
} from './data-processing/macromolecule-processing';
import {
  filterLigandMonomersByPreferredAssembly,
  filterLigandsByPreferredAssembly,
  filterModificationsByPreferredAssembly,
  generateLigandsAndModsTableFilters,
  generateLigandsCards,
  generateProcessedLigands,
  generateProcessedModifications,
} from './data-processing/ligand-processing';
import { generateDomainsCards, generateDomainsTableFilters, generateProcessedDomains, processDomainsWithMacromolecules } from './data-processing/domain-processing';

@Injectable()
export class EntryEffects {
  private readonly entryAPIService = inject(EntryApiService);
  private readonly protvistaAPIService = inject(PvDataApiService);
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store<EntryStoreState>);
  private readonly entryUtilService = inject(EntryUtilService);

  getSummaryData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getSummaryData),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.summaryData).pipe(take(1))])),
      mergeMap(([entryId, cached]) => {
        if (cached) {
          return of(EntryActions.getSummaryDataSuccess({ summaryData: cached }));
        }
        return this.entryAPIService.getEntrySummary(entryId).pipe(
          map((summaryData) => EntryActions.getSummaryDataSuccess({ summaryData })),
          catchError(() => of(EntryActions.getSummaryDataFailure()))
        );
      })
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

  getLLMAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getLLMAnnotations),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getLLMAnnotations(entryId).pipe(
          map((llmAnnotations) => EntryActions.getLLMAnnotationsSuccess({ llmAnnotations })),
          catchError(() => of(EntryActions.getLLMAnnotationsFailure()))
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
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.symmetry).pipe(take(1))])),
      mergeMap(([entryId, cachedSymmetry]) => {
        if (cachedSymmetry !== undefined) {
          return of(EntryActions.getSymmetrySuccess({ symmetry: cachedSymmetry }));
        }
        return this.entryAPIService.getSymmetry(entryId).pipe(
          map((symmetry) => EntryActions.getSymmetrySuccess({ symmetry })),
          catchError(() => of(EntryActions.getSymmetryFailure()))
        );
      })
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
      switchMap((action) =>
        this.store.select(EntrySelectors.interactions).pipe(
          // select entire interactions object
          take(1),
          map((interactions) => {
            const cached = interactions?.[action.chainId]?.[action.residueId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getInteractionsSuccess({
              chainId: action.chainId,
              residueId: action.residueId,
              interactions: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.entryAPIService.getEntryInteractions(entryId, action.chainId, action.residueId).pipe(
              map((data) =>
                EntryActions.getInteractionsSuccess({
                  chainId: action.chainId,
                  residueId: action.residueId,
                  interactions: data,
                })
              ),
              catchError(() => of(EntryActions.getInteractionsFailure()))
            )
          )
        );
      })
    )
  );

  getResidueListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getResidueListing),
      switchMap((action) => {
        return forkJoin([of(action), this.store.select(EntrySelectors.entryId).pipe(take(1))]);
      }),
      mergeMap(([action, entryId]) =>
        this.entryAPIService.getResiduesForChain(entryId, action.chainId).pipe(
          map((data) => EntryActions.getResidueListingSuccess({ residueListing: data })),
          catchError(() => of(EntryActions.getResidueListingFailure()))
        )
      )
    )
  );

  getPfamMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getPfamMapping),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.pfamMapping).pipe(take(1))])),
      mergeMap(([entryId, cachedPfamMappings]) => {
        if (cachedPfamMappings !== undefined) {
          return of(EntryActions.getPfamMappingSuccess({ pfamMapping: cachedPfamMappings }));
        }
        return this.entryAPIService.getPfamMapping(entryId).pipe(
          map((pfamMapping) => EntryActions.getPfamMappingSuccess({ pfamMapping })),
          catchError(() => of(EntryActions.getPfamMappingFailure()))
        );
      })
    )
  );

  getSCOP175Mapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getScop175Mapping),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.scop175Mapping).pipe(take(1))])),
      mergeMap(([entryId, cachedScop175]) => {
        if (cachedScop175 !== undefined) {
          return of(EntryActions.getScop175MappingSuccess({ scop175Mapping: cachedScop175 }));
        }
        return this.entryAPIService.getSCOP175Mapping(entryId).pipe(
          map((scop175Mapping) => EntryActions.getScop175MappingSuccess({ scop175Mapping })),
          catchError(() => of(EntryActions.getScop175MappingFailure()))
        );
      })
    )
  );

  getModifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getModifications),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.modifications).pipe(take(1))])),
      mergeMap(([entryId, cachedModifications]) => {
        if (cachedModifications !== undefined) {
          return of(EntryActions.getModificationsSuccess({ modifications: cachedModifications }));
        }
        return this.entryAPIService.getModifications(entryId).pipe(
          map((modifications) => EntryActions.getModificationsSuccess({ modifications })),
          catchError(() => of(EntryActions.getModificationsFailure()))
        );
      })
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

  getModelQualityXray$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getModelQualityXray),
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getModelQualityXray(entryId).pipe(
          map((modelQualityXray) => EntryActions.getModelQualityXraySuccess({ modelQualityXray })),
          catchError(() => of(EntryActions.getModelQualityXrayFailure()))
        )
      )
    )
  );

  getCathMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getCathMapping),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.cathMapping).pipe(take(1))])),
      mergeMap(([entryId, cachedCathMapping]) => {
        if (cachedCathMapping !== undefined) {
          return of(EntryActions.getCathMappingSuccess({ cathMapping: cachedCathMapping }));
        }
        return this.entryAPIService.getCATHMapping(entryId).pipe(
          map((cathMapping) => EntryActions.getCathMappingSuccess({ cathMapping })),
          catchError(() => of(EntryActions.getCathMappingFailure()))
        );
      })
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
            const processedFiles = processFilesData(data);
            const downloadOptions = processedFiles.downloads;
            const viewOptions = processedFiles.views;
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
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.entryId).pipe(take(1)),
          this.store.select(EntrySelectors.macroMolecules).pipe(take(1)),
          this.store.select(EntrySelectors.boundLigands).pipe(take(1)),
          this.store.select(EntrySelectors.organismScientificNames).pipe(take(1)),
          this.store.select(EntrySelectors.hasRNA).pipe(take(1)),
          this.store.select(EntrySelectors.macromolsDescriptions).pipe(take(1)),
          this.store.select(EntrySelectors.macromolsChainsToEntityIds).pipe(take(1)),
        ])
      ),
      mergeMap(([entryId, cachedMacromols, cachedBLigands, cachedOrgNames, cachedHasRna, cachedMacromolsDesc, cachedChainsToEntityIds]) => {
        if (
          cachedMacromols !== undefined &&
          cachedBLigands !== undefined &&
          cachedOrgNames !== undefined &&
          cachedHasRna !== undefined &&
          cachedMacromolsDesc !== undefined &&
          cachedChainsToEntityIds !== undefined
        ) {
          return of(
            EntryActions.getEntryMoleculesSuccess({
              data: {
                macroMolecules: cachedMacromols,
                boundLigands: cachedBLigands,
                organismScientificNames: cachedOrgNames,
                hasRNA: cachedHasRna,
                macromolsDescriptions: cachedMacromolsDesc,
                macromolsChainsToEntityIds: cachedChainsToEntityIds,
              },
            })
          );
        }
        return this.entryAPIService.getEntryMolecules(entryId).pipe(
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
            const macromolsDescriptions = processMacromoleculesDescriptions(macroMolecules);
            const macromolsChainsToEntityIds = mapMacromoleculesChainsToEntityId(macroMolecules);

            return EntryActions.getEntryMoleculesSuccess({
              data: {
                macroMolecules,
                boundLigands,
                organismScientificNames,
                hasRNA,
                macromolsDescriptions,
                macromolsChainsToEntityIds,
              },
            });
          }),
          catchError(() => of(EntryActions.getEntryMoleculesFailure()))
        );
      })
    )
  );

  getExperiment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getExperiment),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.entryId).pipe(take(1)),
          this.store.select(EntrySelectors.experimentalDetails).pipe(take(1)),
          this.store.select(EntrySelectors.resolutionValues).pipe(take(1)),
          this.store.select(EntrySelectors.experimentalMethod).pipe(take(1)),
        ])
      ),
      mergeMap(([entryId, cachedExperiment, cachedResnValues, cachedExptalMethod]) => {
        if (cachedExperiment !== undefined && cachedResnValues !== undefined && cachedExptalMethod !== undefined) {
          return of(
            EntryActions.getExperimentSuccess({
              data: {
                experimentalDetails: cachedExperiment,
                resolutionValues: cachedResnValues,
                experimentalMethod: cachedExptalMethod,
              },
            })
          );
        }
        return this.entryAPIService.getExperiment(entryId).pipe(
          map((response: AnyExperimentDetail[]) => {
            const experimentalDetails = response;

            const experimentalMethod = response.length > 1 ? 'Hybrid' : (response[0].experimental_method as string);
            const resolutionValues: Array<number | undefined> = response.map((datum: AnyExperimentDetail) => {
              if ('resolution' in datum && datum['resolution']) return datum['resolution'];
              else return undefined;
            });

            return EntryActions.getExperimentSuccess({
              data: { experimentalDetails, resolutionValues, experimentalMethod },
            });
          }),
          catchError(() => of(EntryActions.getExperimentFailure()))
        );
      })
    )
  );

  getUniProtMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getUniprotMapping),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.uniprotMapping).pipe(take(1))])),
      mergeMap(([entryId, cachedMapping]) => {
        if (cachedMapping !== undefined) {
          return of(EntryActions.getUniprotMappingSuccess({ uniprotMapping: cachedMapping }));
        }
        return this.entryAPIService.getUniprotMapping(entryId).pipe(
          map((uniprotMapping) => EntryActions.getUniprotMappingSuccess({ uniprotMapping })),
          catchError(() => of(EntryActions.getUniprotMappingFailure()))
        );
      })
    )
  );

  getLigandSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getLigandSummary),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.ligandPagesSummary).pipe(take(1))])),
      mergeMap(([entryId, cachedLigSummary]) => {
        if (cachedLigSummary !== undefined) {
          return of(EntryActions.getLigandSummarySuccess({ ligandPagesSummary: cachedLigSummary }));
        }
        return this.entryAPIService.getLigandSummaryStats(entryId).pipe(
          map((ligandPagesSummary) => EntryActions.getLigandSummarySuccess({ ligandPagesSummary })),
          catchError(() => of(EntryActions.getLigandSummaryFailure()))
        );
      })
    )
  );

  getComplexSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getComplexSummary),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.complexPagesSummary).pipe(take(1))])),
      mergeMap(([entryId, cachedCompSummary]) => {
        if (cachedCompSummary !== undefined) {
          return of(EntryActions.getComplexSummarySuccess({ complexPagesSummary: cachedCompSummary }));
        }
        return this.entryAPIService.getComplexSummaryStats(entryId).pipe(
          map((complexPagesSummary) => EntryActions.getComplexSummarySuccess({ complexPagesSummary })),
          catchError(() => of(EntryActions.getComplexSummaryFailure()))
        );
      })
    )
  );

  getUniProtSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getUniprotSummary),
      switchMap((action) =>
        this.store.select(EntrySelectors.proteinPagesSummaryByUniProtIds).pipe(
          // select entire interactions object
          take(1),
          map((data) => {
            const cached = data?.[action.uniprotId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getUniprotSummarySuccess({
              uniprotId: action.uniprotId,
              unpSummaryData: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.entryAPIService.getSummaryStats(action.uniprotId).pipe(
          map((unpSummaryData) => EntryActions.getUniprotSummarySuccess({ uniprotId: action.uniprotId, unpSummaryData })),
          catchError(() => of(EntryActions.getUniprotSummaryFailure()))
        );
      })
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
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.complexDetails).pipe(take(1))])),
      mergeMap(([entryId, cached]) => {
        if (cached) {
          return of(EntryActions.getPreferredAssemblySuccess({ complexDetails: cached }));
        }
        return this.entryAPIService.getPreferredAssembly(entryId).pipe(
          map((complexDetails) => EntryActions.getPreferredAssemblySuccess({ complexDetails })),
          catchError(() => {
            EntryActions.getPreferredAssemblySuccess({ complexDetails: [] });
            return of(EntryActions.getPreferredAssemblyFailure());
          })
        );
      })
    )
  );

  getAssemblies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getAssemblies),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.entryId).pipe(take(1)),
          this.store.select(EntrySelectors.assemblies).pipe(take(1)),
          this.store.select(EntrySelectors.pisaAssemblies).pipe(take(1)),
        ])
      ),
      mergeMap(([entryId, cachedAssemblies, cachedPisaAssemblies]) => {
        if (cachedAssemblies && cachedPisaAssemblies) {
          return of(
            EntryActions.getAssembliesSuccess({
              data: {
                assemblies: cachedAssemblies,
                pisaAssemblies: cachedPisaAssemblies,
              },
            })
          );
        }
        return this.entryAPIService.getAssembly(entryId).pipe(
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
        );
      })
    )
  );

  getCarbohydrates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getCarbohydrates),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.carbohydrates).pipe(take(1))])),
      mergeMap(([entryId, cachedCarbs]) => {
        if (cachedCarbs !== undefined) {
          return of(EntryActions.getCarbohydratesSuccess({ carbohydrates: cachedCarbs }));
        }
        return this.entryAPIService.getCarbohydrates(entryId).pipe(
          map((carbohydrates) => EntryActions.getCarbohydratesSuccess({ carbohydrates })),
          catchError(() => of(EntryActions.getCarbohydratesFailure()))
        );
      })
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
      switchMap(() => this.store.select(EntrySelectors.entryId).pipe(filter(Boolean), take(1))),
      mergeMap((entryId: string) =>
        this.entryAPIService.getEntryStatus(entryId).pipe(
          map((entryStatus) => EntryActions.getEntryStatusSuccess({ entryStatus })),
          catchError((error) => {
            console.error('Error fetching entry status:', error);
            this.entryUtilService.setError(error.status);
            this.entryUtilService.setPageView('ERROR');
            return of(EntryActions.getEntryStatusFailure());
          })
        )
      )
    )
  );

  getPolymerCoverage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryPolymerCoverage),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.polymerCoverage).pipe(take(1))])),
      mergeMap(([entryId, cachedPolCoverage]) => {
        if (cachedPolCoverage !== undefined) {
          return of(EntryActions.getEntryPolymerCoverageSuccess({ polymerCoverage: cachedPolCoverage }));
        }
        return this.entryAPIService.getPolymerCoverage(entryId).pipe(
          map((polymerCoverage) => EntryActions.getEntryPolymerCoverageSuccess({ polymerCoverage })),
          catchError(() => of(EntryActions.getEntryPolymerCoverageFailure()))
        );
      })
    )
  );

  getLigandMonomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryLigandMonomers),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.ligandMonomers).pipe(take(1))])),
      mergeMap(([entryId, cachedLigMonomers]) => {
        if (cachedLigMonomers !== undefined) {
          return of(EntryActions.getEntryLigandMonomersSuccess({ ligandMonomers: cachedLigMonomers }));
        }
        return this.entryAPIService.getLigandMonomers(entryId).pipe(
          map((ligandMonomers) => EntryActions.getEntryLigandMonomersSuccess({ ligandMonomers })),
          catchError(() => of(EntryActions.getEntryLigandMonomersFailure()))
        );
      })
    )
  );

  getBoundMolecules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getBoundMolecules),
      switchMap(() => combineLatest([this.store.select(EntrySelectors.entryId).pipe(take(1)), this.store.select(EntrySelectors.boundMolecules).pipe(take(1))])),
      mergeMap(([entryId, cachedBndMolecules]) => {
        if (cachedBndMolecules !== undefined) {
          return of(EntryActions.getBoundMoleculesSuccess({ boundMolecules: cachedBndMolecules }));
        }
        return this.entryAPIService.getBoundMolecules(entryId).pipe(
          map((boundMolecules) => EntryActions.getBoundMoleculesSuccess({ boundMolecules })),
          catchError(() => of(EntryActions.getBoundMoleculesFailure()))
        );
      })
    )
  );

  getResidueWiseOutliers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryResidueWiseOutliers),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.entryId).pipe(take(1)),
          this.store.select(EntrySelectors.residueWiseOutliers).pipe(take(1)),
          this.store.select(EntrySelectors.outliersByModelId).pipe(take(1)),
        ])
      ),
      mergeMap(([entryId, cachedResidueWise, cachedOutliers]) => {
        if (cachedResidueWise !== undefined && cachedOutliers !== undefined) {
          return of(
            EntryActions.getEntryResidueWiseOutliersSuccess({
              data: {
                residueWiseOutliers: cachedResidueWise,
                outliersByModelId: cachedOutliers,
              },
            })
          );
        }
        return this.entryAPIService.getResidueWiseOutliers(entryId).pipe(
          map((residueWiseOutliers) => {
            const outliersByModelId = processResidueOutliersData(residueWiseOutliers);
            return EntryActions.getEntryResidueWiseOutliersSuccess({ data: { residueWiseOutliers, outliersByModelId } });
          }),
          catchError(() => of(EntryActions.getEntryResidueWiseOutliersFailure()))
        );
      })
    )
  );

  getProcAssembliesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcAssembliesFilters),
      switchMap(() =>
        combineLatest([this.store.select(EntrySelectors.summaryData), this.store.select(EntrySelectors.assemblies)]).pipe(
          filter(([summaryData, assemblies]) => summaryData !== undefined && assemblies !== undefined)
          // take(1)
        )
      ),
      map(([summaryData, assemblies]) => {
        if (assemblies === undefined || summaryData === undefined) throw 'missing data to process assemblies';
        const procAssembliesFilters = generateAssembliesTableFilters(summaryData, assemblies);
        return EntryActions.getProcAssembliesFiltersSuccess({ procAssembliesFilters });
      }),
      catchError(() => of(EntryActions.getProcAssembliesFiltersFailure()))
    )
  );

  getProcAssembliesCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcAssembliesCards),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.complexDetails),
          this.store.select(EntrySelectors.assemblies),
        ]).pipe(
          filter(([summaryData, complexDetails, assemblies]) => summaryData !== undefined && complexDetails !== undefined && assemblies !== undefined)
          // take(1)
        )
      ),
      map(([summaryData, complexDetails, assemblies]) => {
        if (assemblies === undefined || complexDetails === undefined || summaryData === undefined) throw 'missing data to process assemblies';
        const procAssembliesCards = generateAssembliesCards(assemblies, complexDetails, summaryData);
        return EntryActions.getProcAssembliesCardsSuccess({ procAssembliesCards });
      }),
      catchError(() => of(EntryActions.getProcAssembliesCardsFailure()))
    )
  );

  getProcessedAssemblies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedAssemblies),
      switchMap(
        () =>
          combineLatest([
            this.store.select(EntrySelectors.assemblies),
            this.store.select(EntrySelectors.pisaAssemblies),
            this.store.select(EntrySelectors.summaryData),
            this.store.select(EntrySelectors.complexDetails),
          ]).pipe(
            filter(
              ([assemblies, pisaAssemblies, summaryData, complexDetails]) =>
                assemblies !== undefined && pisaAssemblies !== undefined && summaryData !== undefined && complexDetails !== undefined
            ),
            take(1)
          ) // take a snapshot
      ),
      map(([assemblies, pisaAssemblies, summaryData, complexDetails]) => {
        if (assemblies === undefined || complexDetails === undefined || summaryData === undefined || pisaAssemblies === undefined)
          throw 'missing data to process assemblies';
        const processedAssemblies = generateProcessedAssemblies(assemblies, complexDetails, summaryData, pisaAssemblies);
        return EntryActions.getProcessedAssembliesSuccess({ processedAssemblies });
      }),
      catchError(() => of(EntryActions.getProcessedAssembliesFailure()))
    )
  );

  getProcMacromoleculesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcMacromoleculesFilters),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.macroMolecules),
        ]).pipe(
          filter(([summaryData, assemblies]) => summaryData !== undefined && assemblies !== undefined)
          // take(1)
        )
      ),
      map(([summaryData, assemblies, macromolecules]) => {
        if (assemblies === undefined || summaryData === undefined || macromolecules === undefined) throw 'missing data to process macromolecules';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblies);
        const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const procMacromoleculesFilters = generateMacromoleculesTableFilters(macromoleculesWithPrefAssembly);
        return EntryActions.getProcMacromoleculesFiltersSuccess({ procMacromoleculesFilters });
      }),
      catchError(() => of(EntryActions.getProcMacromoleculesFiltersFailure()))
    )
  );

  getProcMacromoleculesCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcMacromoleculesCards),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.macroMolecules),
        ]).pipe(
          filter(([summaryData, assemblies, macromolecules]) => summaryData !== undefined && assemblies !== undefined && macromolecules !== undefined)
          // take(1)
        )
      ),
      map(([summaryData, assemblies, macromolecules]) => {
        if (summaryData === undefined || assemblies === undefined || macromolecules === undefined) throw 'missing data to process macromolecules';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblies);
        const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const procMacromoleculesCards = generateMacromoleculesCards(macromoleculesWithPrefAssembly);
        return EntryActions.getProcMacromoleculesCardsSuccess({ procMacromoleculesCards });
      }),
      catchError(() => of(EntryActions.getProcMacromoleculesCardsFailure()))
    )
  );

  getProcessedMacromolecules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedMacromolecules),
      switchMap(
        () =>
          combineLatest([
            this.store.select(EntrySelectors.summaryData),
            this.store.select(EntrySelectors.assemblies),
            this.store.select(EntrySelectors.macroMolecules),
            this.store.select(EntrySelectors.carbohydrates),
          ]).pipe(
            filter(
              ([summaryData, assemblyData, macromolecules, carbohydrates]) =>
                summaryData !== undefined && assemblyData !== undefined && macromolecules !== undefined && carbohydrates !== undefined
            ),
            take(1)
          ) // take a snapshot
      ),
      map(([summaryData, assemblyData, macromolecules, carbohydrates]) => {
        if (summaryData === undefined || assemblyData === undefined || macromolecules === undefined || carbohydrates === undefined)
          throw 'missing data to process macromolecules';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const processedMacromolecules = generateProcessedMacromolecules(macromoleculesWithPrefAssembly, carbohydrates);
        return EntryActions.getProcessedMacromoleculesSuccess({ processedMacromolecules });
      }),
      catchError(() => of(EntryActions.getProcessedMacromoleculesFailure()))
    )
  );

  getProcLigandsFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcLigandsFilters),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.boundLigands),
          this.store.select(EntrySelectors.boundMolecules),
          this.store.select(EntrySelectors.ligandMonomers),
          this.store.select(EntrySelectors.modifications),
        ]).pipe(
          filter(
            ([summaryData, assemblyData, ligands, boundMolecules, ligandMonomers, modifications]) =>
              summaryData !== undefined &&
              assemblyData !== undefined &&
              ligands !== undefined &&
              boundMolecules !== undefined &&
              ligandMonomers !== undefined &&
              modifications !== undefined
          )
          // take(1)
        )
      ),
      map(([summaryData, assemblyData, ligands, boundMolecules, ligandMonomers, modifications]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          ligands === undefined ||
          boundMolecules === undefined ||
          ligandMonomers === undefined ||
          modifications === undefined
        )
          throw 'missing data to process ligands';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const ligandsForPrefAssembly = filterLigandsByPreferredAssembly(ligands, preferredAssembly);
        const ligandMonomersForPrefAssembly = filterLigandMonomersByPreferredAssembly(ligandMonomers, boundMolecules, preferredAssembly);
        const modificationsForPrefAssembly = filterModificationsByPreferredAssembly(modifications, preferredAssembly);
        const procLigandsFilters = generateLigandsAndModsTableFilters(ligandsForPrefAssembly, ligandMonomersForPrefAssembly, modificationsForPrefAssembly);
        return EntryActions.getProcLigandsFiltersSuccess({ procLigandsFilters });
      }),
      catchError(() => of(EntryActions.getProcLigandsFiltersFailure()))
    )
  );

  getProcLigandsCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcLigandsCards),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.boundLigands),
          this.store.select(EntrySelectors.boundMolecules),
          this.store.select(EntrySelectors.ligandMonomers),
          this.store.select(EntrySelectors.modifications),
        ]).pipe(
          filter(
            ([summaryData, assemblyData, ligands, boundMolecules, ligandMonomers, modifications]) =>
              summaryData !== undefined &&
              assemblyData !== undefined &&
              ligands !== undefined &&
              boundMolecules !== undefined &&
              ligandMonomers !== undefined &&
              modifications !== undefined
          )
          // take(1)
        )
      ),
      map(([summaryData, assemblyData, ligands, boundMolecules, ligandMonomers, modifications]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          ligands === undefined ||
          boundMolecules === undefined ||
          ligandMonomers === undefined ||
          modifications === undefined
        )
          throw 'missing data to process ligands';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const ligandsForPrefAssembly = filterLigandsByPreferredAssembly(ligands, preferredAssembly);
        const ligandMonomersForPrefAssembly = filterLigandMonomersByPreferredAssembly(ligandMonomers, boundMolecules, preferredAssembly);
        const modificationsForPrefAssembly = filterModificationsByPreferredAssembly(modifications, preferredAssembly);
        const procLigandsCards = generateLigandsCards(ligandsForPrefAssembly, ligandMonomersForPrefAssembly, modificationsForPrefAssembly);
        return EntryActions.getProcLigandsCardsSuccess({ procLigandsCards });
      }),
      catchError(() => of(EntryActions.getProcLigandsCardsFailure()))
    )
  );

  getProcessedLigands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedLigands),
      switchMap(
        () =>
          combineLatest([
            this.store.select(EntrySelectors.summaryData),
            this.store.select(EntrySelectors.assemblies),
            this.store.select(EntrySelectors.boundLigands),
            this.store.select(EntrySelectors.boundMolecules),
            this.store.select(EntrySelectors.ligandMonomers),
            this.store.select(EntrySelectors.modifications),
          ]).pipe(
            filter(
              ([summaryData, assemblyData, ligands, boundMolecules, ligandMonomers, modifications]) =>
                summaryData !== undefined &&
                assemblyData !== undefined &&
                ligands !== undefined &&
                boundMolecules !== undefined &&
                ligandMonomers !== undefined &&
                modifications !== undefined
            ),
            take(1)
          ) // take a snapshot
      ),
      map(([summaryData, assemblyData, ligands, boundMolecules, ligandMonomers, modifications]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          ligands === undefined ||
          boundMolecules === undefined ||
          ligandMonomers === undefined ||
          modifications === undefined
        )
          throw 'missing data to process ligands';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const ligandsForPrefAssembly = filterLigandsByPreferredAssembly(ligands, preferredAssembly);
        const ligandMonomersForPrefAssembly = filterLigandMonomersByPreferredAssembly(ligandMonomers, boundMolecules, preferredAssembly);
        const processedLigandsOnly = generateProcessedLigands(ligandsForPrefAssembly, ligandMonomersForPrefAssembly);
        const modificationsForPrefAssembly = filterModificationsByPreferredAssembly(modifications, preferredAssembly);
        const processedModifications = generateProcessedModifications(modificationsForPrefAssembly);
        const processedLigands = [...processedLigandsOnly, ...processedModifications];
        return EntryActions.getProcessedLigandsSuccess({ processedLigands });
      }),
      catchError(() => of(EntryActions.getProcessedLigandsFailure()))
    )
  );

  getProcDomainsFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcDomainsFilters),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.polymerCoverage),
          this.store.select(EntrySelectors.cathMapping),
          this.store.select(EntrySelectors.scop175Mapping),
          this.store.select(EntrySelectors.pfamMapping),
        ]).pipe(
          filter(
            ([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings]) =>
              summaryData !== undefined &&
              assemblyData !== undefined &&
              polymerCoverage !== undefined &&
              cathMappings !== undefined &&
              scopMappings !== undefined &&
              pfamMappings !== undefined
          )
          // take(1)
        )
      ),
      map(([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          polymerCoverage === undefined ||
          cathMappings === undefined ||
          scopMappings === undefined ||
          pfamMappings === undefined
        )
          throw 'missing data to process Domains';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const polymerCoverageWithPrefAssembly = mapPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        const procDomainsFilters = generateDomainsTableFilters(cathMappings, scopMappings, pfamMappings, polymerCoverageWithPrefAssembly);
        return EntryActions.getProcDomainsFiltersSuccess({ procDomainsFilters });
      }),
      catchError(() => of(EntryActions.getProcDomainsFiltersFailure()))
    )
  );

  getProcDomainsCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcDomainsCards),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.polymerCoverage),
          this.store.select(EntrySelectors.cathMapping),
          this.store.select(EntrySelectors.scop175Mapping),
          this.store.select(EntrySelectors.pfamMapping),
        ]).pipe(
          filter(
            ([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings]) =>
              summaryData !== undefined &&
              assemblyData !== undefined &&
              polymerCoverage !== undefined &&
              cathMappings !== undefined &&
              scopMappings !== undefined &&
              pfamMappings !== undefined
          )
          // take(1)
        )
      ),
      map(([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          polymerCoverage === undefined ||
          cathMappings === undefined ||
          scopMappings === undefined ||
          pfamMappings === undefined
        )
          throw 'missing data to process Domains';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const polymerCoverageWithPrefAssembly = mapPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        const procDomainsCards = generateDomainsCards(cathMappings, scopMappings, pfamMappings, polymerCoverageWithPrefAssembly);
        return EntryActions.getProcDomainsCardsSuccess({ procDomainsCards });
      }),
      catchError(() => of(EntryActions.getProcDomainsCardsFailure()))
    )
  );

  getProcessedDomains$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedDomains),
      switchMap(
        () =>
          combineLatest([
            this.store.select(EntrySelectors.summaryData),
            this.store.select(EntrySelectors.assemblies),
            this.store.select(EntrySelectors.polymerCoverage),
            this.store.select(EntrySelectors.cathMapping),
            this.store.select(EntrySelectors.scop175Mapping),
            this.store.select(EntrySelectors.pfamMapping),
            this.store.select(EntrySelectors.macroMolecules),
          ]).pipe(
            filter(
              ([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings, macromolecules]) =>
                summaryData !== undefined &&
                assemblyData !== undefined &&
                polymerCoverage !== undefined &&
                cathMappings !== undefined &&
                scopMappings !== undefined &&
                pfamMappings !== undefined &&
                macromolecules !== undefined
            ),
            take(1)
          ) // take a snapshot
      ),
      map(([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings, macromolecules]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          polymerCoverage === undefined ||
          cathMappings === undefined ||
          scopMappings === undefined ||
          pfamMappings === undefined ||
          macromolecules === undefined
        )
          throw 'missing data to process Domains';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        // const macromoleculesForPrefAssembly = filterMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const polymerCoverageWithPrefAssembly = mapPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        const processedDomains = generateProcessedDomains(cathMappings, scopMappings, pfamMappings, polymerCoverageWithPrefAssembly, macromoleculesWithPrefAssembly);
        return EntryActions.getProcessedDomainsSuccess({ processedDomains });
      }),
      catchError(() => of(EntryActions.getProcessedDomainsFailure()))
    )
  );

  getProcLLMCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcLLMCards),
      switchMap(() =>
        combineLatest([
          this.store.select(EntrySelectors.summaryData),
          this.store.select(EntrySelectors.assemblies),
          this.store.select(EntrySelectors.macroMolecules),
          this.store.select(EntrySelectors.uniprotMapping),
          this.store.select(EntrySelectors.llmAnnotations),
          this.store.select(EntrySelectors.polymerCoverage),
        ]).pipe(
          filter(
            ([summaryData, assemblyData, macromolecules, uniprotMappings, llmAnnotations, polymerCoverage]) =>
              summaryData !== undefined &&
              assemblyData !== undefined &&
              macromolecules !== undefined &&
              uniprotMappings !== undefined &&
              llmAnnotations !== undefined &&
              polymerCoverage !== undefined
          )
          // take(1)
        )
      ),
      map(([summaryData, assemblyData, macromolecules, uniprotMappings, llmAnnotations, polymerCoverage]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          macromolecules === undefined ||
          uniprotMappings === undefined ||
          llmAnnotations === undefined ||
          polymerCoverage === undefined
        )
          throw 'missing data to process LLM';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        if ((<any>uniprotMappings).empty === true) uniprotMappings = {};

        const primaryCitationYes = llmAnnotations.filter((a: any) => a.primaryCitation === 'Y');
        const llmUniProtIds = new Set(primaryCitationYes?.map((a: any) => a.uniprotAccession));
        const chainIds = new Set(primaryCitationYes?.map((a: any) => a.pdbChain));
        const macromoleculesForPrefAssembly = filterMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const polymerCoverageForPrefAssembly = filterPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        const filteredMacromolecules = macromoleculesForPrefAssembly.filter((macromolecule) => {
          const uniprotData = getUniProtMappingsForMacromolecule(macromolecule, uniprotMappings, polymerCoverageForPrefAssembly);
          const macromoleculeUniProts = uniprotData.uniprotAccsForMacromolecule;
          const hasUniProtInCommon = macromoleculeUniProts.some((unp) => llmUniProtIds.has(unp));
          const hasChainsInCommon = macromolecule.in_chains.some((ch) => chainIds.has(ch));
          return hasUniProtInCommon && hasChainsInCommon;
        });
        const procLLMCards = generateMacromoleculesCards(filteredMacromolecules);
        return EntryActions.getProcLLMCardsSuccess({ procLLMCards });
      }),
      catchError(() => of(EntryActions.getProcLLMCardsFailure()))
    )
  );

  getProcessedMacromolsForLLM$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedMacromolsForLLM),
      switchMap(
        () =>
          combineLatest([
            this.store.select(EntrySelectors.summaryData),
            this.store.select(EntrySelectors.assemblies),
            this.store.select(EntrySelectors.macroMolecules),
            this.store.select(EntrySelectors.carbohydrates),
            this.store.select(EntrySelectors.uniprotMapping),
            this.store.select(EntrySelectors.llmAnnotations),
            this.store.select(EntrySelectors.polymerCoverage),
          ]).pipe(
            filter(
              ([summaryData, assemblyData, macromolecules, carbohydrates, uniprotMappings, llmAnnotations, polymerCoverage]) =>
                summaryData !== undefined &&
                assemblyData !== undefined &&
                macromolecules !== undefined &&
                carbohydrates !== undefined &&
                uniprotMappings !== undefined &&
                llmAnnotations !== undefined &&
                polymerCoverage !== undefined
            ),
            take(1)
          ) // take a snapshot
      ),
      map(([summaryData, assemblyData, macromolecules, carbohydrates, uniprotMappings, llmAnnotations, polymerCoverage]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          macromolecules === undefined ||
          carbohydrates === undefined ||
          uniprotMappings === undefined ||
          llmAnnotations === undefined ||
          polymerCoverage === undefined
        )
          throw 'missing data to process LLM macromolecules';
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);

        const primaryCitationYes = llmAnnotations.filter((a: any) => a.primaryCitation === 'Y');
        const llmUniProtIds = new Set(primaryCitationYes?.map((a: any) => a.uniprotAccession));
        const chainIds = new Set(primaryCitationYes?.map((a: any) => a.pdbChain));
        const macromoleculesForPrefAssembly = filterMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const polymerCoverageForPrefAssembly = filterPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        const filteredMacromolecules = macromoleculesForPrefAssembly.filter((macromolecule) => {
          const uniprotData = getUniProtMappingsForMacromolecule(macromolecule, uniprotMappings, polymerCoverageForPrefAssembly);
          const macromoleculeUniProts = uniprotData.uniprotAccsForMacromolecule;
          const hasUniProtInCommon = macromoleculeUniProts.some((unp) => llmUniProtIds.has(unp));
          const hasChainsInCommon = macromolecule.in_chains.some((ch) => chainIds.has(ch));
          return hasUniProtInCommon && hasChainsInCommon;
        });
        const processedMacromoleculesForLLM = generateProcessedMacromolecules(filteredMacromolecules, carbohydrates);
        return EntryActions.getProcessedMacromolsForLLMSuccess({ processedMacromoleculesForLLM });
      }),
      catchError(() => of(EntryActions.getProcessedMacromolsForLLMFailure()))
    )
  );

  getProcessedDomainsWithMacromols$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedDomainsWithMacromols),
      switchMap(
        () =>
          combineLatest([
            this.store.select(EntrySelectors.summaryData),
            this.store.select(EntrySelectors.assemblies),
            this.store.select(EntrySelectors.polymerCoverage),
            this.store.select(EntrySelectors.cathMapping),
            this.store.select(EntrySelectors.scop175Mapping),
            this.store.select(EntrySelectors.pfamMapping),
            this.store.select(EntrySelectors.macroMolecules),
            this.store.select(EntrySelectors.carbohydrates),
          ]).pipe(
            filter(
              ([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings, macromolecules, carbohydrates]) =>
                summaryData !== undefined &&
                assemblyData !== undefined &&
                polymerCoverage !== undefined &&
                cathMappings !== undefined &&
                scopMappings !== undefined &&
                pfamMappings !== undefined &&
                macromolecules !== undefined &&
                carbohydrates !== undefined
            ),
            take(1)
          ) // take a snapshot
      ),
      map(([summaryData, assemblyData, polymerCoverage, cathMappings, scopMappings, pfamMappings, macromolecules, carbohydrates]) => {
        if (
          summaryData === undefined ||
          assemblyData === undefined ||
          polymerCoverage === undefined ||
          cathMappings === undefined ||
          scopMappings === undefined ||
          pfamMappings === undefined ||
          macromolecules === undefined ||
          carbohydrates === undefined
        )
          throw 'missing data to process DomainsWithMacromols';
        // TODO
        const preferredAssembly = getPreferredAssemblyDatum(summaryData, assemblyData);
        const macromoleculesWithPrefAssembly = mapMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        const polymerCoverageWithPrefAssembly = mapPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        const processedMacromolecules = generateProcessedMacromolecules(macromoleculesWithPrefAssembly, carbohydrates);
        const processedDomains = generateProcessedDomains(cathMappings, scopMappings, pfamMappings, polymerCoverageWithPrefAssembly, macromoleculesWithPrefAssembly);
        const processedDomainsWithMacromols = processDomainsWithMacromolecules(processedMacromolecules, processedDomains);

        // const polymerCoverageForPrefAssembly = filterPolymerCoverageByPreferredAssembly(polymerCoverage, preferredAssembly);
        // const macromoleculesForPrefAssembly = filterMacromoleculesByPreferredAssembly(macromolecules, preferredAssembly);
        // const processedMacromolecules = generateProcessedMacromolecules(macromoleculesForPrefAssembly, carbohydrates);
        // const processedDomains = generateProcessedDomains(cathMappings, scopMappings, pfamMappings, polymerCoverageForPrefAssembly, macromoleculesForPrefAssembly);
        // const processedDomainsWithMacromols = processDomainsWithMacromolecules(processedMacromolecules, processedDomains);
        return EntryActions.getProcessedDomainsWithMacromolsSuccess({ processedDomainsWithMacromols });
      }),
      catchError(() => of(EntryActions.getProcessedDomainsWithMacromolsFailure()))
    )
  );

  getProcessedPrefAssembly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getProcessedPrefAssembly),
      switchMap(
        () =>
          combineLatest([this.store.select(EntrySelectors.summaryData), this.store.select(EntrySelectors.complexDetails)]).pipe(
            filter(([summaryData, complexDetails]) => summaryData !== undefined && complexDetails !== undefined),
            take(1)
          ) // take a snapshot
      ),
      map(([summaryData, complexDetails]) => {
        if (summaryData === undefined || complexDetails === undefined) throw 'missing data to process assemblies';
        const processedPrefAssembly = processPreferredAssemblyData(summaryData, complexDetails);
        return EntryActions.getProcessedPrefAssemblySuccess({ processedPrefAssembly });
      }),
      catchError(() => of(EntryActions.getProcessedPrefAssemblyFailure()))
    )
  );

  getEntryProtvistaUniprotMapping$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaUniprotMapping),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvUniprot).pipe(
          // select entire interactions object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaUniprotMappingSuccess({
              entityId: action.entityId,
              entityPvUniprot: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityUniprotMappingTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaUniprotMappingSuccess({
                  entityId: action.entityId,
                  entityPvUniprot: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaUniprotMappingFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaChains$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaChains),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvChains).pipe(
          // select entire interactions object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaChainsSuccess({
              entityId: action.entityId,
              entityPvChains: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityChainsTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaChainsSuccess({
                  entityId: action.entityId,
                  entityPvChains: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaChainsFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaDomains$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaDomains),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvDomains).pipe(
          // select entire interactions object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaDomainsSuccess({
              entityId: action.entityId,
              entityPvDomains: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityDomainsTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaDomainsSuccess({
                  entityId: action.entityId,
                  entityPvDomains: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaDomainsFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaRfam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaRfam),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvRfam).pipe(
          // select entire interactions object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaRfamSuccess({
              entityId: action.entityId,
              entityPvRfam: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityRfamTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaRfamSuccess({
                  entityId: action.entityId,
                  entityPvRfam: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaRfamFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaSecondaryStructure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaSecondaryStructure),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvSecondaryStructure).pipe(
          // select entire interactions object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaSecondaryStructureSuccess({
              entityId: action.entityId,
              entityPvSecondaryStructure: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntitySecondaryStructureTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaSecondaryStructureSuccess({
                  entityId: action.entityId,
                  entityPvSecondaryStructure: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaSecondaryStructureFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaBindingSites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaBindingSites),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvBindingSites).pipe(
          // select entire object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaBindingSitesSuccess({
              entityId: action.entityId,
              entityPvBindingSites: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityBindingSitesTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaBindingSitesSuccess({
                  entityId: action.entityId,
                  entityPvBindingSites: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaBindingSitesFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaInterfaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaInterfaces),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvInterfaces).pipe(
          // select entire object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaInterfacesSuccess({
              entityId: action.entityId,
              entityPvInterfaces: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityInterfacesTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaInterfacesSuccess({
                  entityId: action.entityId,
                  entityPvInterfaces: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaInterfacesFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaAnnotations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaAnnotations),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvAnnotations).pipe(
          // select entire object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaAnnotationsSuccess({
              entityId: action.entityId,
              entityPvAnnotations: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeEntityAnnotationsTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaAnnotationsSuccess({
                  entityId: action.entityId,
                  entityPvAnnotations: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaAnnotationsFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaConservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaConservation),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvConservation).pipe(
          // select entire object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaConservationSuccess({
              entityId: action.entityId,
              entityPvConservation: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeConservationTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaConservationSuccess({
                  entityId: action.entityId,
                  entityPvConservation: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaConservationFailure()))
            )
          )
        );
      })
    )
  );

  getEntryProtvistaVariation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntryActions.getEntryProtvistaVariation),
      switchMap((action) =>
        this.store.select(EntrySelectors.entityPvVariation).pipe(
          // select entire object
          take(1),
          map((trackData) => {
            const cached = trackData?.[action.entityId];
            return { action, cached };
          })
        )
      ),
      mergeMap(({ cached, action }) => {
        if (cached) {
          // Return success action with cached value
          return of(
            EntryActions.getEntryProtvistaVariationSuccess({
              entityId: action.entityId,
              entityPvVariation: cached,
            })
          );
        }

        // Otherwise, fetch from API
        return this.store.select(EntrySelectors.entryId).pipe(
          take(1),
          switchMap((entryId) =>
            this.protvistaAPIService.getPdbeVariationTrackData(entryId, action.entityId).pipe(
              map((data) =>
                EntryActions.getEntryProtvistaVariationSuccess({
                  entityId: action.entityId,
                  entityPvVariation: data,
                })
              ),
              catchError(() => of(EntryActions.getEntryProtvistaVariationFailure()))
            )
          )
        );
      })
    )
  );
}
